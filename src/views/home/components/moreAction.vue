<template>
  <div>
    <van-dialog :value="value" @input="$emit('input', $event)" :show-confirm-button="false" closeOnClickOverlay>
      <!-- 弹出层 -- 1 点击home组件中的x号弹出 -->
      <van-cell-group v-show="!isReportShow">
        <van-cell title="不感兴趣" icon="failure" @click="handle('dislike')" />
        <van-cell title="反馈垃圾内容" icon="warning-o" is-link @click="isReportShow=true" />
        <van-cell title="拉黑作者" icon="delete" @click="handle('blacklist')"/>
      </van-cell-group>
      <!-- 弹出层 -- 2 点击反馈垃圾内容时弹出-->
      <van-cell-group v-show="isReportShow">
        <van-cell icon="arrow-left" @click="isReportShow=false"/>
        <van-cell v-for="item in list" :key="item.type" :title="item.title" @click="handle('report',item.type)"/>
      </van-cell-group>
    </van-dialog>
  </div>
</template>

<script>
// 导入不感兴趣文章的方法
import { dislikeArticle, reportArticle } from '@/api/articles.js'
//  导入拉黑作者的方法
import { blackAuth } from '@/api/user.js'
export default {
  name: 'moreAction',
  props: ['value', 'currentArticle'],
  data () {
    return {
      // 定义一个举报文章的列表
      /**
       * 举报类型： 0-其他问题，1-标题夸张，2-低俗色情，3-错别字多，4-旧闻重复，5-广告软文，6-内容不实，7-涉嫌违法犯罪，8-侵权'
       */
      list: [
        { title: '标题夸张', type: 1 },
        { title: '低俗色情', type: 2 },
        { title: '错别字多', type: 3 },
        { title: '旧闻重复', type: 4 },
        { title: '广告软文', type: 5 },
        { title: '内容不实', type: 6 },
        { title: '涉嫌违法范围', type: 7 },
        { title: '侵权', type: 8 },
        { title: '其他问题', type: 0 }
      ],
      // 控制反馈垃圾内容的显示与隐藏
      isReportShow: false
    }
  },
  methods: {
    //   将点击事件封装成一个公共的函数，根据判断当前的type属性发送请求
    handle (type, reportType) {
      switch (type) {
        case 'dislike':
          this.dislike()
          break
        case 'blacklist':
          this.blacklist()
          break
        case 'report':
          this.report(reportType)
          break
      }
    },
    // 不感兴趣的文章
    async dislike () {
      try {
        // 根据点击选中的文章获取文章id
        // console.log(this.currentArticle)
        const id = this.currentArticle.art_id
        // console.log(id)
        //  发送请求并提示操作成功
        await dislikeArticle(id)
        this.$toast.success('操作成功')
        // 通过在子组件中使用$emit触发事件，并将事件处理结果通知到父组件
        this.$emit('handleSuccess')
      } catch (err) {
        this.$toast.fail('操作失败' + err)
      }
    },
    // 拉黑作者
    async blacklist () {
      try {
        const id = this.currentArticle.aut_id
        await blackAuth(id)
        this.$toast.success('操作成功')
        this.$emit('blackListSuccess')
      } catch (err) {
        this.$toast.fail('操作失败' + err)
      }
    },
    // 举报文章
    async report (reportType) {
      try {
        const id = this.currentArticle.art_id
        await reportArticle({ id: id, type: reportType })
        this.$toast.success('操作成功')
        // 操作成功后通知父组件将弹出层隐藏
        this.$emit('input', false)
      } catch (err) {
        this.$toast.fail('操作失败' + err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
