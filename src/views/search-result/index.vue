<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar title="搜索结果" fixed left-text="返回" left-arrow @click-left="$router.back()"></van-nav-bar>
    <!-- 搜索到文章的列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in articleList" :key="index" :title="item.title">
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
          </p>
          <!-- 点赞相关操作 -->
          <van-grid :column-num="3">
            <van-grid-item text="评论" />
            <van-grid-item text="点赞" />
            <van-grid-item text="转发" />
          </van-grid>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
// 导入获取搜索结果文章的数据
import { getSearchArticles } from '@/api/search.js'
export default {
  name: 'searchResult',
  props: ['q'],
  data () {
    return {
      // 获取文章的数据信息
      articleList: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 10,
      // 定义页数
      pageCount: 0
    }
  },
  methods: {
    async onLoad () {
      // 异步更新数据
      await this.$sleep(500)
      try {
        const data = await getSearchArticles({
          page: this.page,
          perPage: this.perPage,
          q: this.q
        })
        console.log(data)
        this.articleList.push(...data.results)
        this.loading = false
        // 获取数据结果的总页数
        this.pageCount = Math.ceil(data.total_count / this.perPage)
        if (this.page >= this.pageCount) {
          this.finished = true
        }
        this.page++
      } catch (err) {
        this.$toast.fail('加载失败' + err)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.van-list {
  margin-top: 92px;
}
</style>
