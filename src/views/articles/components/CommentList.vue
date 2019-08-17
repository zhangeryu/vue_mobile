<template>
  <div>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in commentList" :key="item.com_id.toString()" :title="item.aut_name">
        <!-- 头像区域 -->
        <div slot="icon">
          <img class="avatar" :src="item.aut_photo" alt />
        </div>
        <!-- 右边按钮 -->
        <div slot="default">
          <van-button type="default" icon="star-o" size="mini">赞</van-button>
        </div>
        <!-- 评论内容 -->
        <div slot="label">
          <p>{{item.content}}</p>
            <span>{{item.pubdate | format}}</span>&nbsp;<span @click="handleReplyComment(item)">回复 ( {{item.reply_count}} )</span>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 导入获取文章评论
import { getComments } from '@/api/comment.js'
export default {
  name: 'CommentList',
  props: ['isArticle', 'id'],
  data () {
    return {
      commentList: [],
      loading: false,
      finished: false,
      //  获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
      offset: null
    }
  },

  methods: {
    async onLoad () {
      try {
        const data = await getComments({
          isArticle: this.isArticle,
          // 由于文章id传过来会是很大的数字，会在响应拦截器中默认转换成字符串对象，所以需要将大数字进行转成字符串
          source: this.id.toString(),
          offset: this.offset
        })
        // console.log(data)
        this.commentList.push(...data.results)
        // 本次返回结果的最后一个评论id，作为请求下一页数据的offset参数
        this.offset = data.last_id
        this.loading = false
        // 判断返回数据的长度是否为0，为0代表数据加载完了，将控制加载数据完毕的属性设置为false
        if (data.results.length === 0) {
          this.finished = true
        }
      } catch (err) {
        this.$toast.fail('获取评论失败' + err)
      }
    },
    handleReplyComment (item) {
      // 点击文章评论的回复将当前文章评论的信息存储到vuex状态管理
      // 点击文章评论控制评论回复的显示，并且将当前评论的文章对象保存到vuex仓库
      this.$store.commit('setShowReplyComment', true)
      this.$store.commit('setCurrentComment', item)
    }
  }
}
</script>
<style lang="less" scoped>
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 100%;
  margin-right: 10px;
}
.van-list {
  margin-bottom: 124px;
}
</style>
