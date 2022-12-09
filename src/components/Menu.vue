<script setup>
import {PieChartOutlined, DesktopOutlined, MailOutlined} from "@ant-design/icons-vue";
import {ref, reactive, toRefs, onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import RouterMenu from "../components/RouterMenu.vue"
import {routes} from "../router"


const router = useRouter();
const linkRef = new RegExp(/^http(s)?\/\/:\w+/);


defineProps({
  collapsed: {
    type: Boolean,
    required: true
  }
})

onMounted(() => {
  console.log("menu mounted")
})

const state = reactive({
  collapsed: false,
  selectedKeys: [],
  openKeys: [],
})

const menuOnClick = ({item, key, keyPath}) => {
  console.log(item)
  console.log(keyPath)
  if (linkRef.test(key)) {
    window.open(key);
  } else {
    console.log("路由跳转地址：", keyPath.join(""))
    router.push(keyPath.join(""));
  }
  // router.push({name: name});
}

const route = useRoute();
watch(route, (nextPath, prePath) => {
  console.log("-----------------")
  console.log("开始处理展开的菜单")
  console.log(nextPath);
  console.log(nextPath.path)
  console.log(nextPath.matched)
  console.log(nextPath.matched[nextPath.matched.length - 1].path.split("/"))
  const paths = nextPath.matched[nextPath.matched.length - 1].path.split("/").filter(i => Boolean(i)).map(i => ("/" + i))
  state.selectedKeys = paths
  state.openKeys = paths.slice(0, -1)
  paths.map(i => {
    if (i) {

    }
  })
  // console.log(nextPath.matched[nextPath.matched.length].path.split("/"))
  // state.selectedKeys = []
  console.log("-----------------")

  // const index = nextPath.matched.findIndex(i => i.path === nextPath.path);
  // state.openKeys = nextPath.matched.slice(0, index).reduce((pre, next) => {
  //   console.log(pre)
  //   console.log(next)
  //   if (next.path) {
  //     pre.push(next.path)
  //   }
  // }, [])
  // console.log(index)
  // state.openKeys = nextPath.matched.slice(0, index)
}, {
  immediate: true
})
</script>

<template>
  <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="dark"
          :inline-collapsed="state.collapsed" @click="menuOnClick">
    <a-menu-item key="/board">
      <template #icon>
        <PieChartOutlined/>
      </template>
      <span>首页</span>
    </a-menu-item>
    <a-sub-menu key="/system">
      <template #icon>
        <MailOutlined/>
      </template>
      <template #title>系统管理</template>
      <a-menu-item key="/user">用户管理</a-menu-item>
      <a-menu-item key="/role">角色管理</a-menu-item>
      <a-menu-item key="/menu">菜单管理</a-menu-item>
      <a-menu-item key="/department">部门管理</a-menu-item>
      <a-menu-item key="/changePassword">修改密码</a-menu-item>
    </a-sub-menu>
<!--    <template v-for="i in routes[0].children">-->
<!--      <router-menu :menu="i"/>-->
<!--    </template>-->
    <!--    <router-menu :menus="routes[0]"></router-menu>-->
  </a-menu>
</template>

<style>
</style>
