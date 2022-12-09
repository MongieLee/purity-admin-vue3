<script setup>
import optionsConfig from "@/config";
</script>

<template>
  <div class="footer-wrapper">Copyright © 1970-{{ new Date().getFullYear() }} {{ optionsConfig.companyName }}</div>
</template>

<style scoped lang="less">
.footer-wrapper {
  display: flex;
  justify-content: center;
}
</style>
