<template>
<div>
     <!-- 头部导航 -->
    <van-nav-bar
      title="文章详情"
      left-text="返回"
      fixed
      @click-left="$router.back()"
    />
    <!-- 需要对文章进行判断，判断是否有文章数据信息，有则渲染，不添加该判断会报错 -->
    <div class="article" v-if="article">
      <!-- 文章标题 -->
      <h2 class="article-title">{{article.title}}</h2>
      <!-- 作者信息 -->
      <author-info :article="article"></author-info>
      <!-- 文章内容 -->
      <div class="article-content" v-html="article.content"></div>
      <!-- 点赞和取消 -->
      <more-action :article="article"></more-action>
      <!-- 评论列表  因为此时是获取文章的评论，通过props属性将文章的id和type的值传给子组件-->
      <comment-list :isArticle="true" :id="id"></comment-list>
      <!-- 发布文章评论 因为是对文章的评论，只需要将文章的id传给子组件就可以，art_id是对评论的回复则需要传 -->
      <send-comment :id="id"></send-comment>
      <!-- 评论回复 -->
      <reply-comment :id="id"></reply-comment>
    </div>
</div>
</template>

<script>
// 导入作者信息的组件
import AuthorInfo from './components/AuthorInfo.vue'
// 导入更多操作的组件
import MoreAction from './components/MoreAction.vue'
// 导入评论列表组件
import CommentList from './components/CommentList.vue'
// 导入发布文章评论的组件
import SendComment from './components/SendComment.vue'
// 导入评论回复的组件
import ReplyComment from './components/ReplyComment.vue'
// 导入获取搜索文章的信息
import { getSearchArticle } from '@/api/articles.js'
export default {
  name: 'articles',
  components: {
    AuthorInfo,
    MoreAction,
    CommentList,
    SendComment,
    ReplyComment
  },
  data () {
    return {
      // 定义一个接收搜索文章信息的参数
      article: null
    }
  },
  // 文章的id
  props: ['id'],
  created () {
    this.loadArticle()
  },
  methods: {
    async loadArticle () {
      try {
        const data = await getSearchArticle(this.id)
        // console.log(data)
        this.article = data
      } catch (err) {
        this.$toast.fail('加载失败' + err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.article {
  // 当内容超出容器的宽度，强制换行
  word-break: break-all;
  word-wrap: break-word;
  white-space: pre-wrap;
  margin-top: 92px;
  padding: 0px 20px;
  margin-bottom: 124px;
  .article-title {
    font-size: 40px;
    font-weight: bold;
  }
  .article-content {
    font-size: 26px;
  }
  .article-content /deep/ code, .article-content /deep/ pre {
    overflow: scroll;
    margin: 0px 2px;
    padding: .5em;
    font-size: 14px;
    color: rgb(131,148,150);
    line-height: 18px;
    font-family: Consolas, Inconsolata, Courier, monospace;
    display: block;
    word-spacing: 0px;
    letter-spacing: 0px;
    background: rgb(0,43,54);
  }
}
</style>
