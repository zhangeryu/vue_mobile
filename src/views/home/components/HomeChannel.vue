<template>
  <div>
    <van-popup
      :value="value"
      @input="$emit('input', $event)"
      position="bottom"
      :style="{ height: '90%' }"
    >
      <!-- 我的频道 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">我的频道</span>
            <span class="desc">点击进入频道</span>
          </div>
          <div>
            <van-button type="danger" plain size="mini" v-show="!showClose" @click="showClose = true">编辑</van-button>
            <van-button type="primary" plain size="mini" v-show="showClose" @click="showClose = false">完成</van-button>
          </div>
        </div>
        <!-- 频道列表 -->
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item v-for="(item, index) in channeList" :key="item.id" @click="handleMychannel(index)">
            <span class="text" :class="{active: index===activeIndex && !showClose}">{{item.name}}</span>
            <van-icon class="close-icon" name="close" v-show="showClose && index !==0" />
          </van-grid-item>
        </van-grid>
      </div>
      <!-- 频道列表推荐 -->
      <div class="channel">
        <div class="channel-head">
          <div>
            <span class="title">频道推荐</span>
            <span class="desc">点击添加频道</span>
          </div>
        </div>
        <!-- 全部频道 -->
        <van-grid class="channel-content" :gutter="10" clickable>
          <van-grid-item v-for="item in recommendChannels" :key="item.id" @click="handelRecommend(item)">
            <div class="info">
              <span class="text">{{item.name}}</span>
            </div>
          </van-grid-item>
        </van-grid>
      </div>
    </van-popup>
  </div>
</template>

<script>
// 导入获取所有的频道
import { getAllchannels, deleteUserChannel, addUserChannel, updateUserChannel } from '@/api/channels.js'
export default {
  name: 'homeChannel',
  props: ['value', 'channeList', 'activeIndex'],
  // 使用计算属性来循环我的频道列表和全部频道，去除掉相同的频道
  computed: {
    recommendChannels () {
      const ids = this.channeList.map((item) => {
        return item.id
      })
      return this.allChanneList.filter((item) => {
        return !ids.includes(item.id)
      })
    }
  },
  data () {
    return {
      // 控制显示隐藏x号图标
      showClose: false,
      // 定义接收所有的频道
      allChanneList: []
    }
  },
  methods: {
    // 点击我的列表将index传给父组件
    async handleMychannel (index) {
      // 先判断一下当前的状态是否是编辑状态或者是非编辑状态
      // 1、非编辑状态 -- 将当前点击的状态通过$emit事件传给父组件
      if (!this.showClose) {
        this.$emit('handleMychannel', index)
        return
      }
      // 2、编辑模式下 -- 将当前频道的id获取并发送请求删除对应的频道
      const id = this.channeList[index].id
      this.channeList.splice(index, 1)
      // 删除对应id 的频道必须要先判断用户是否是登入状态，同时在本地数据中更新对应的频道信息
      if (this.$store.state.user) {
        try {
          await deleteUserChannel(id)
        } catch (err) {
          return this.$toast(err)
        }
        return
      }
      window.localStorage.setItem('channels', JSON.stringify(this.channeList))
    },
    // 点击所有频道中的某一个频道将它添加到频道列表中
    async handelRecommend (item) {
      // 将当前选中的频道添加到频道列表中
      this.channeList.push(item)
      // console.log(this.channeList)
      // 判断此时是否是登入状态,是登入状态就向接口发请求
      if (this.$store.state.user) {
        // 由于接口需要传入频道的id和频道的索引值，而且channels参数为一个数组
        // 先将频道列表复制一份再展开，然后再遍历频道列表,如果不复制一份，当点击添加会删除我的频道里面已有的频道数据
        let newChanneList = [...this.channeList]
        // console.log(channeList)
        const channels = newChanneList.splice(1).map((item, index) => {
          return { id: item.id, seq: index + 1 }
        })
        // console.log(channels)
        try {
          await addUserChannel(channels)
        } catch (err) {
          // console.log(channels)
          await updateUserChannel(channels)
        }
        return
      }
      window.localStorage.setItem('channels', JSON.stringify(this.channeList))
      // console.log(this.channeList)
    },
    // 获取所有的频道
    async loadAllchanneList () {
      const res = await getAllchannels()
      this.allChanneList = res.channels
    }
  },
  created () {
    this.loadAllchanneList()
  }
}
</script>
<style lang="less" scoped>
.channel {
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 30px;
      margin-right: 5px;
    }
    .desc {
      font-size: 12px;
    }
  }
  .channel-content {
    .text {
      font-size: 16px;
    }
    .active {
      color: red;
    }
    .close-icon {
      font-size: 20px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}
</style>
