<template>
  <div>
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      @search="onSearch"
      @cancel="$router.push('/home')"
      @input="handleSuggestion"
    />
    <!-- 搜索建议 -->
    <van-cell-group v-show="suggestionList.length">
      <van-cell
        v-for="item in suggestionList"
        :key="item"
        icon="search"
        @click="onSearch(item)"
      >
        <div slot="title" v-html="highlight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <van-cell-group v-show="!suggestionList.length">
      <van-cell title="历史纪录">
        <van-icon
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          v-show="!showClose"
          @click="showClose = true"
        />
        <div v-show="showClose">
          <span @click="handelDeleteAll">全部删除</span>&nbsp;
          <span @click="showClose = false">完成</span>
        </div>
      </van-cell>

      <!-- 搜索记录列表 -->
      <van-cell
        v-for="(item, index) in histories"
        :key="item"
        :title="item"
        @click="onSearch(item)"
      >
        <van-icon
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          v-show="showClose"
          @click="handelDelete(index)"
        />
      </van-cell>
    </van-cell-group>
  </div>
</template>

<script>
// 导入联想建议
import { suggestion } from '@/api/search.js'
// 导入lodash使用防抖函数和节流函数
import _ from 'lodash'
export default {
  name: 'search',
  data () {
    return {
      value: '',
      // 定义一个接收联想词
      suggestionList: [],
      // 定义控制关闭按钮的显示与隐藏
      showClose: false,
      // 用于接收记录信息,如果有登入则同时从本地存储中获取
      histories: JSON.parse(window.localStorage.getItem('history')) || []
    }
  },
  methods: {
    // 用户回车会触发该事件
    onSearch (value) {
      // 判断此时用户是否有点击搜索建议的值，如果没有则直接将input的值传进来
      value = value || this.value
      //   判断此时的记录信息列表中是否有此时用户需要搜索的内容,没有则将此次需要搜索的内容添加到历史纪录中
      if (!this.histories.includes(value)) {
        this.histories.push(value)
        // 同时将此次的搜索记录添加到本地存储
        window.localStorage.setItem('history', JSON.stringify(this.histories))
      }
      this.$router.push({
        name: 'search-result',
        params: {
          q: value
        }
      })
    },
    // 获取输入框的联想建议
    // 使用防抖函数对用户输入的值所触发的input事件进行处理,使用防抖函数返回的是一个函数
    handleSuggestion: _.debounce(async function () {
      if (this.value.trim() === '') {
        this.suggestionList = []
        return
      }
      try {
        const data = await suggestion(this.value)
        this.suggestionList = data.options
      } catch (err) {
        this.$toast.fail(err)
      }
    }, 500),
    // 删除搜索记录列表中的某一项
    handelDelete (index) {
      this.histories.splice(index, 1)
      window.localStorage.setItem('history', JSON.stringify(this.histories))
    },
    // 删除全部的历史纪录
    handelDeleteAll () {
      this.histories = []
      window.localStorage.setItem('history', JSON.stringify(this.histories))
    },
    // 搜索关键字高亮显示
    highlight (item) {
      return item.replace(
        this.value,
        `<span style="color: red">${this.value}</span>`
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>
