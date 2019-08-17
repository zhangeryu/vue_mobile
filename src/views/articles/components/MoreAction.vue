<template>
<!-- 用户点赞或不喜欢功能 -->
<div class="more-action">
    <van-button
      @click="handleLike"
      :icon="isLike ? 'like' : 'like-o'"
      round
      :loading="likeLoading"
      type="default"
    >{{isLike ? '取消': ''}}点赞</van-button>

    <van-button
      @click="handleDisLike"
      :icon="disLike ? 'clear' : 'close'"
      round
      :loading="disLikeLoading"
      type="default"
    >{{disLike ? '取消' : ''}}不喜欢</van-button>
  </div>
</template>

<script>
import { likeArticles, unLikeArticles, disLikesArticle, unDislikesArticle } from '@/api/articles.js'
export default {
  name: 'MoreAction',
  // 子组件接收父组件传过的article属性
  props: ['article'],
  data () {
    return {
      // 点赞
      likeLoading: false,
      // 不喜欢
      disLikeLoading: false
    }
  },
  computed: {
    // 用户对文章的态度, -1: 无态度，0-不喜欢，1-点赞
    // 判断当前的状态是否是点赞
    isLike () {
      return this.article.attitude === 1
    },
    // 判断是否不喜欢
    disLike () {
      return this.article.attitude === 0
    }
  },
  methods: {
    // 对文章点赞
    async handleLike () {
      // 判断用户是否登入
      if (!this.$checkLogin) {
        return
      }
      this.likeLoading = true
      try {
        if (this.isLike) {
          await unLikeArticles(this.article.art_id)
          this.article.attitude = -1
        } else {
          await likeArticles(this.article.art_id)
          this.article.attitude = 1
        }
      } catch (err) {
        this.$toast.fail('操作失败' + err)
      }
      this.likeLoading = false
    },
    // 对文章不喜欢
    async handleDisLike () {
      if (!this.$checkLogin) {
        return
      }
      this.disLikeLoading = true
      try {
        if (this.disLike) {
          await unDislikesArticle(this.article.art_id)
          this.article.attitude = -1
        } else {
          await disLikesArticle(this.article.art_id)
          this.article.attitude = 0
        }
      } catch (err) {
        this.$toast.fail('操作失败' + err)
      }
      this.disLikeLoading = false
    }
  }
  // created () {
  //   console.log(this.article)
  // }
}
</script>
<style lang="less" scoped>
.more-action {
  padding: 20px;
  display: flex;
  justify-content: space-around;
}
</style>
