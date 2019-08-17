<template>
  <div id="app">
    <!-- 使用keep-alive将组件进行缓存，实现路由跳转不会重新刷新页面数据 -->
    <!-- include - 字符串或正则表达式。只有名称匹配的组件会被缓存。
         exclude - 字符串或正则表达式。任何名称匹配的组件都不会被缓存。
         max - 数字。最多可以缓存多少组件实例。-->
    <keep-alive exclude="articles">
      <router-view />
    </keep-alive>
  </div>
</template>

<style lang="less">
</style>
