<script setup>
const props = defineProps({
  menu: {
    type: Object,
    required: true
  }
});

console.log(props.menu)
</script>

<template>
  <template v-if="menu.children">
    <a-sub-menu :key="menu.name">
      <template #icon>
        <MailOutlined/>
      </template>
      <template #title>系统管理</template>
      <template v-for="child in menu.children">
        <router-menu :menu="child"/>
      </template>
    </a-sub-menu>
  </template>
  <template v-else>
    <a-menu-item :key="menu.name">
      <template #icon>
        <PieChartOutlined/>
      </template>
      <span>{{ menu.meta.title }}</span>
    </a-menu-item>
  </template>
</template>

<style>
</style>
