<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar fixed>
      <div slot="title" @click="$router.push({name: 'search'})">首页-搜索</div>
    </van-nav-bar>
    <!-- 下拉更新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh" :success-text="successText">
      <!-- 频道--滑动导航栏 -->
      <van-tabs color="#3e9df8" title-active-color="#3e9df8" v-model="activeIndex">
        <!-- 频道右侧图标 -->
        <div slot="nav-right">
          <van-icon name="wap-nav" class="wap-nav" @click="showChannel=true" />
        </div>
        <van-tab v-for="item in channeList" :title="item.name" :key="item.id">
          <!-- 列表区域 -->
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <!-- 文章显示区域  item.articles里的item代表的是当前的频道-->
            <van-cell
              v-for="(item,index) in item.articles"
              :key="index"
              :title="item.title"
              @click="$router.push({name: 'articles', params: {id: item.art_id}})"
            >
              <!-- 使用vant组件中单元格的插槽属性label自定义内容 -->
              <div slot="label">
                <!-- 使用模板标签判断当前图片的type值来渲染图片数量 -->
                <template v-if="item.cover.type">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item v-for="(img, index) in item.cover.images" :key="index">
                      <van-image lazy-load :src="img" />
                    </van-grid-item>
                  </van-grid>
                </template>
                <p>
                  <span>{{item.aut_name}}</span>&nbsp;
                  <span>{{item.comm_count}}评论</span>&nbsp;
                  <span>{{item.pubdate | format }}</span>
                  <!-- 关闭按钮  此时的item就是文章数据-->
                  <van-icon name="close" class="close" @click.stop="handleShowDialog(item)" />
                </p>
              </div>
            </van-cell>
          </van-list>
        </van-tab>
      </van-tabs>
    </van-pull-refresh>
    <!-- 弹出层 -->
    <!-- v-model="showDialog" 是双向数据绑定，语法糖解析为 v-bind:value="showDialog" @input="showDialog=$event"-->
    <!-- 父组件通过在子组件中的props属性要将当前点击的文章对象传递给子组件 -->
    <more-action
      v-model="showDialog"
      :currentArticle="currentArticle"
      @handleSuccess="handleSuccess"
      @blackListSuccess="blackListSuccess"
    ></more-action>
    <home-channel
      v-model="showChannel"
      :channeList="channeList"
      :activeIndex="activeIndex"
      @handleMychannel="handleMychannel"
    ></home-channel>
  </div>
</template>

<script>
// 导入获取频道的列表的方法
import { getChanneList } from '@/api/channels.js'
// 导入获取文章数据的方法
import { getArticles } from '@/api/articles.js'
// 导入弹出层组件
import moreAction from '@/views/home/components/moreAction.vue'
import homeChannel from '@/views/home/components/HomeChannel.vue'
export default {
  name: 'home',
  components: {
    moreAction,
    homeChannel
  },
  data () {
    return {
      // 文章列表数据
      list: [],
      // 控制页面加载状态
      loading: false,
      finished: false,
      // 控制下拉刷新
      isLoading: false,
      // 定义一个获取频道列表的参数
      channeList: [],
      // 定义被选中的频道状态
      activeIndex: 0,
      // 控制弹出层显示与隐藏
      showDialog: false,
      // 记录当前点击x文章对象
      currentArticle: {},
      // 控制顶部弹出层显示与隐藏
      showChannel: false,
      // 下拉刷新成功提示内容
      successText: ''
    }
  },
  created () {
    //  在页面渲染数据的时候触发获取频道列表方法
    this.loadChanneList()
  },

  methods: {
    //   在页面渲染数据的时候触发获取频道列表方法
    async loadChanneList () {
      // 1. 判断用户是否登录，如果用户登录，直接获取数据
      if (this.$store.state.user) {
        const res = await getChanneList()
        // console.log(res)
        this.channeList = res.channels
        // console.log(this.channeList[0])
      } else {
        // 2. 如果用户没有登录，从本地缓存中获取数据
        // 由于从本地获取的字符串格式的数据，而将数据保存到频道里面是以对象格式存储
        this.channeList = JSON.parse(window.localStorage.getItem('user')) || []
        // 3. 如果本地缓存没有数据，发送请求获取数据，存储到本地存储中
        if (this.channeList.length === 0) {
          const res = await getChanneList()
          //   console.log(res)
          this.channeList = res.channels
          //   此时需要将返回的频道数据信息以字符串形式保存在本地
          window.localStorage.setItem(
            'channels',
            JSON.stringify(this.channeList)
          )
        }
      }
      // 当频道列表数据渲染时，动态的给每一个频道列表添加articles属性，以便每个频道对应文章数据信息
      this.channeList.forEach(item => {
        // 循环遍历每个频道动态添加属性，此时不能直接给频道对象添加属性，因为直接添加的属性不是响应式的，所以需要使用$set方法添加
        // 这样的数据信息就是响应式的  $set(target, 添加的属性名称, 保存的格式)
        this.$set(item, 'articles', [])
        // this.articles = []  这种方式添加的属性不会生成
        // 根据频道动态添加对应的记录时间戳的属性
        item.timestamp = Date.now()
      })
    },

    //  手指向上滑动触发事件 == 加载文章列表数据
    async onLoad () {
      // 使用延时让页面加载数据时避免手指滑动加载过多数据
      await this.$sleep(1000)
      // 在加载文章数据时获取当前选中的频道和对应的id,同时动态的给每一个频道添加articles属性
      const currentChannel = this.channeList[this.activeIndex]
      const id = currentChannel.id
      // console.log(currentChannel)
      // 根据获取的id和时间戳发送请求获取文章数据
      const res = await getArticles({
        channelId: id,
        timestamp: currentChannel.timestamp
      })
      // console.log(res)
      currentChannel.articles.push(...res.results)
      // // 当文章获取后将最后一次获取文章的时间戳记录到data数据的时间戳属性中以备下次调用数据时直接可以获取到时间戳信息
      currentChannel.timestamp = res.pre_timestamp
      // // 数据加载后将控制状态设置为false
      this.loading = false
      if (res.results.length === 0) {
        this.finished = true
      }
    },
    // 通过点击当前的文章记录到currentArticle对象上
    handleShowDialog (article) {
      // 将弹出层设置为true显示
      this.showDialog = true
      this.currentArticle = article
    },
    // 在父组件中调用子组件触发的事件并处理相应的程序
    handleSuccess () {
      // 将弹出层隐藏
      this.showDialog = false
      // 找到当前选中的频道获取对应的所有文章数据
      const currentChannel = this.channeList[this.activeIndex]

      const articles = currentChannel.articles
      // console.log(articles)
      // 使用findIndex方法根据文章id来获取方法的返回值
      const index = articles.findIndex(item => {
        return item.art_id === this.currentArticle.art_id
      })
      // console.log(index)
      articles.splice(index, 1)
    },
    // 拉黑作者成功
    blackListSuccess () {
      this.showDialog = false
      const currentChannel = this.channeList[this.activeIndex]
      const articles = currentChannel.articles
      // console.log(articles)
      articles.map((item, index) => {
        // console.log(index)
        if (item.aut_id === this.currentArticle.aut_id) {
          return articles.splice(index, 1)
        }
      })
    },
    // 非编辑状态下隐藏弹出层
    handleMychannel (index) {
      this.showChannel = false
      this.activeIndex = index
    },
    // 下拉刷新时会触发该事件
    async onRefresh () {
      // 在加载文章数据时获取当前选中的频道和对应的id,同时动态的给每一个频道添加articles属性
      const currentChannel = this.channeList[this.activeIndex]
      const id = currentChannel.id
      // console.log(currentChannel)
      // 根据获取的id和时间戳发送请求获取文章数据
      const res = await getArticles({
        channelId: id,
        timestamp: Date.now()
      })
      currentChannel.articles.unshift(...res.results)
      this.isLoading = false
      this.successText = `${res.results.length}条数据更新成功`
    }
  }
}
</script>
<style lang='less' scoped>
.van-pull-refresh {
  margin-bottom: 100px;
  margin-top: 92px;
}
.close {
  float: right;
  font-size: 36px;
}
.wap-nav {
  position: fixed;
  right: 0;
  line-height: 88px;
  opacity: 0.7;
  font-size: 40px;
  margin-right: 20px;
}
</style>
