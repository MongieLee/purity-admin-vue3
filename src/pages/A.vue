<script setup>
import {onMounted, ref, reactive} from "vue";

const bol = ref(false)
const str = ref("sdjklfjskld")
const num = ref(1)
const nameObj = reactive({
  name: "limengjie"
})

onMounted(() => {
  bol.value = true
  nameObj.name = "zhangjunhui"
})

const fn = () => {
  bol.value // true
  nameObj.name // zhangjunhui
}
</script>

<template>
  <div>
    <div>{{ nameObj.name }}</div>
    <div>{{ bol }}</div>
  </div>
</template>

<style>
</style>
