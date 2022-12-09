<script setup>
import * as Icons from "@ant-design/icons-vue";
import {VueElement,createVNode} from "vue";
console.log(Icons)
for (let iconsKey in Icons) {
  console.log(Icons[iconsKey] instanceof VueElement)
}
</script>

<template>
  <div>Icons</div>
</template>

<style>
</style>
