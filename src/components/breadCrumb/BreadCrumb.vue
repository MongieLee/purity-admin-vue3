<script setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const routeInfo = useRoute();

const breadList = computed(() => routeInfo.matched.slice(1))
</script>

<template>
  <a-breadcrumb>
    <a-breadcrumb-item v-for="route in breadList" :key="route.path">
      {{ route?.meta?.title ?? "not configured" }}
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<style>
</style>
