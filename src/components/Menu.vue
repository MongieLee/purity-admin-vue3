<script setup>
import {reactive, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import useMenuStore from "@/store/useMenuStore.js";

const router = useRouter();
const linkRef = new RegExp(/^http(s)?\/\/:\w+/);
const menuStore = useMenuStore();

defineProps({
  collapsed: {
    type: Boolean,
    required: true
  }
})

const state = reactive({
  collapsed: false,
  selectedKeys: [],
  openKeys: [],
})

const menuOnClick = ({item, key, keyPath}) => {
  if (linkRef.test(key)) {
    window.open(key);
  } else {
    router.push(key);
  }
}

const route = useRoute();
watch(route, (nextPath, prePath) => {
  const paths = nextPath.matched[nextPath.matched.length - 1].path.split("/").filter(Boolean).map(i => ("/" + i))
  state.selectedKeys = [nextPath.path]
  state.openKeys = paths.slice(0, -1)
}, {
  immediate: true
})
</script>

<template>
  <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
          :inline-collapsed="state.collapsed" @click="menuOnClick">
    <!--    <a-menu-item key="/board">-->
    <!--      <template #icon>-->
    <!--        <PieChartOutlined/>-->
    <!--      </template>-->
    <!--      <span>首页</span>-->
    <!--    </a-menu-item>-->
    <!--    <a-sub-menu key="/system">-->
    <!--      <template #icon>-->
    <!--        <MailOutlined/>-->
    <!--      </template>-->
    <!--      <template #title>系统管理</template>-->
    <!--      <a-menu-item key="/user">用户管理</a-menu-item>-->
    <!--      <a-menu-item key="/role">角色管理</a-menu-item>-->
    <!--      <a-menu-item key="/menu">菜单管理</a-menu-item>-->
    <!--      <a-menu-item key="/department">部门管理</a-menu-item>-->
    <!--      <a-menu-item key="/changePassword">修改密码</a-menu-item>-->
    <!--    </a-sub-menu>-->
    <template v-for="menu in menuStore.menus || []">
      <a-menu-item v-if="menu.state && menu.visible && menu.children.length === 0" :key="menu.path">
        {{ menu.name }}
      </a-menu-item>
      <a-sub-menu v-else-if="menu.state && menu.visible && menu.children.length > 0" :key="menu.path">
        <template #title>{{ menu.name }}</template>
        <template v-for="child in menu.children">
          <a-menu-item v-if="child.state && menu.visible" :key="child.path">
            {{ child.name }}
          </a-menu-item>
        </template>
      </a-sub-menu>
    </template>
  </a-menu>
</template>

<style>
</style>
