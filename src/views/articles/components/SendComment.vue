<template>
  <div class="add-comment">
    <div class="input-wrap">
      <input v-model="content" type="text" placeholder="请输入你的评论" />
    </div>
    <div class="more-wrap">
      <van-icon v-if="artId" name="star-o"></van-icon>
      <van-button @click="handleSend" :disabled="content.length === 0" size="small">发布</van-button>
    </div>
  </div>
</template>

<script>
// 导入对文章添加评论的方法
import { sendComment } from '@/api/comment.js'
export default {
  name: 'SendComment',
  props: ['id', 'artId'],
  data () {
    return {
      // 定义输入的内容
      content: ''
    }
  },
  methods: {
    async handleSend () {
      // 判断用户是否登入
      if (!this.$checkLogin) {
        return
      }
      try {
        const data = await sendComment({
          target: this.id,
          content: this.content,
          artId: this.artId
        })
        // 使用兄弟组件传值将获取到的值传给commentList组件
        this.content = ''
        this.$toast.success('添加评论成功')
      } catch (err) {
        this.$toast.fail('添加评论失败' + err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.add-comment {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  padding: 20px;
  border-top: 2px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .input-wrap {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 20px;
    height: 60px;
    display: flex;
    align-items: center;
    width: 50%;
    input {
      border: none;
      color: #999;
      font-size: 30px;
    }
  }
  .more-wrap {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-evenly;
  }
}
</style>
