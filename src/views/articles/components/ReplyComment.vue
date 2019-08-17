<template>
  <div>
    <van-popup
      v-if="$store.state.currentComment"
      :value="$store.state.showReplyComment"
      position="bottom"
      :style="{ height: '80%' }"
      @click-overlay="$store.commit('setShowReplyComment', false)"
    >
      <!-- 导航头部 -->
      <van-nav-bar :title="$store.state.currentComment.reply_count +'条评论'" />
      <!-- 作者信息 -->
      <van-cell>
        <!-- 作者名称 -->
        <div slot="title">{{$store.state.currentComment.aut_name}}楼主</div>
        <!-- 作者头像 -->
        <div slot="icon">
          <img class="avatar" :src="$store.state.currentComment.aut_photo" alt />
        </div>
        <!-- 右边的按钮 -->
        <div slot="default">
          <van-button type="default" icon="star-o" size="mini">赞</van-button>
        </div>
        <!-- 评论内容 -->
        <div slot="label">
          <p>{{$store.state.currentComment.content}}</p>
          <span>{{$store.state.currentComment.pubdate | format}}</span>&nbsp;<span>回复({{$store.state.currentComment.reply_count}})</span>
        </div>
      </van-cell>
      <!-- 评论列表 -->
      <p class="replys">全部回复</p>
      <comment-list :isArticle="false" :id="$store.state.currentComment.com_id.toString()"></comment-list>
      <!-- 发表评论 -->
      <send-comment :id="$store.state.currentComment.com_id.toString()" :artId="id"></send-comment>
    </van-popup>
  </div>
</template>

<script>
import CommentList from './CommentList.vue'
import SendComment from './SendComment.vue'
export default {
  name: 'ReplyComment',
  props: ['id'],
  components: {
    CommentList,
    SendComment
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
.replys {
  margin-top: 20px;
  font-size: 32px;
  margin-left: 40px;
  font-weight: 700;
}
</style>
