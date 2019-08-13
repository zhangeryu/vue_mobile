<template>
<div>
    <van-popup :value="value" @input="$emit('input', $event)" position="top" :style="{ height: '80%' }">
        别看了，吊毛！！！
    </van-popup>
</div>
</template>

<script>

export default {
  name: 'homeChannel',
  props: ['value'],
  data () {
    return {

    }
  }
}
</script>
<style lang="less" scoped>

</style>
