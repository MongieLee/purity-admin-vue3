<script setup>
import { inject, ref, reactive } from "vue";
defineProps(["page"]);
const ref2 = ref("a");
const obj = reactive({ name: 123 });
console.log('====================================');
console.log(ref2);
console.log('====================================');
// const proMessage = inject("proMessage");
</script>

<template>
  <div>
    第一个根节点:{{ page }}
  </div>
  <div>
    第二个根节点
  </div>
  <div>
    第三个根节点
  </div>
</template>

<style scoped lang="less">
div {
  margin: 12px;
  border: 1px solid red;
}
</style>
