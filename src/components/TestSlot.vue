<script setup>
defineProps({
  array: {
    type: Array,
    default: () => ([])
  }
})

const name = "lemon"
</script>
<template>
  <div>array:{{ array }}</div>
  <div style="display:flex;">
    <!-- <div>左边
      <slot :data="name" name="left">
        <div>没有传入我就会显示</div>
      </slot>
    </div>
    <div>中间<slot name="default"></slot>
    </div>
    <div>右边<slot name="right"></slot>
    </div> -->
    <hr />
    <div v-for="(item, index) in array" :key="index">
      <slot :item="item" :index="index"></slot>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>