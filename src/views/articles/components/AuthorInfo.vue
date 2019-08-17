<template>
<!-- 作者信息 -->
<div class="auth-info">
    <div class="base-info">
      <img class="avatar" :src="article.aut_photo" alt="">
      <div>
        <p>{{article.aut_name}}</p>
        <p>{{article.pubdate | format}}</p>
      </div>
    </div>
    <div>
      <!-- 判断此时用户是否有关注，如果返回的是false，证明没有关注，此时的按钮的状态为danger，反之则默认样式按钮 -->
      <van-button
      @click="handelFollow"
        :type="article.is_followed ? 'default': 'danger'"
        :loading="false"
      >{{article.is_followed ? '已': ''}}关注</van-button>
    </div>
  </div>
</template>

<script>
// 导入取消关注和关注用户的方法
import { following, unFollowing } from '@/api/user.js'
export default {
  name: 'AuthorInfo',
  props: ['article'],
  data () {
    return {}
  },
  methods: {
    async handelFollow () {
      // 点击关注或者是取消关注都要先判断用户是否登入
      if (!this.$checkLogin()) {
        return
      }
      // 确认已经登入过，此时点击关注的状态发送请求
      try {
        // 先判断用户此时的状态是关注状态还是未关注状态
        if (this.article.is_followed) {
          // 此时用户是关注状态，点击按钮则是不关注，发送取消关注请求
          await unFollowing(this.article.aut_id)
          this.article.is_followed = false
          // console.log(this.$route)
        } else {
          await following(this.article.aut_id)
          this.article.is_followed = true
        }
      } catch (err) {
        this.$toast.fail('操作失败' + err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.auth-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 26px;
  .base-info {
    display: flex;
    align-items: center;
  }
  .avatar {
    margin-right: 10px;
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
}
</style>
