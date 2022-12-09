<script setup>
import mitt from "@/mitt"
function test() {
  console.log("test click");
  mitt.emit("diyige", { a: 123 })
}
const bbb = () => {
  console.log("bbb click");
  mitt.emit("dierge", { a: 123 })
}
</script>

<template>
  <button class="aaa" @click="test">aaa</button>
  <button class="aaa" @click="bbb">bbb</button>
  <button class="aaa" @click="mitt.all.clear">canel ALL</button>
</template>

<style scoped lang="less">
.aaa {
  color: red;
}
</style>