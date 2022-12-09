<script setup>
import {ref} from "vue";
import Menu from "@/components/Menu.vue";
import BreadCrumb from "@/components/breadCrumb/BreadCrumb.vue";
import Footer from "@/layout/Footer.vue";
import HeaderTabs from "./tabs/HeaderTabs.vue";
import {
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PoweroffOutlined,
  UserOutlined,
  DownOutlined, FullscreenOutlined,
  FullscreenExitOutlined, LockOutlined, UnlockOutlined
} from "@ant-design/icons-vue";
import DefaultAvatar from "@/assets/default-avatar.png";
import {clearAuthToken} from "../utils/token.js";
import {useRouter} from "vue-router";
import useAuthStore from "@/store/useAuthStore.js";
import {exitFullScreen, isFullScreen, openFullScreen} from "../utils/fullScreen.js";
import {Modal} from "ant-design-vue";
import useSettingStore from "../store/useSettingStore.js";

const isFullScreenSelf = ref(false);
const collapsed = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
}

/**
 * 实际刷新很快,加1s为做效果
 * @param tabObj
 */
const refreshPage = (tabObj) => {
  tabObj.loading = true;
  pageRefresh.value = true;
  setTimeout(() => {
    pageRefresh.value = false;
    tabObj.loading = false;
  }, 1000)
}
authStore.fetchUserInfo();
const settingStore = useSettingStore()
const fixedTabs = ref(false);
const pageRefresh = ref(false);

const changeFullScreenState = () => {
  isFullScreenSelf.value = !isFullScreenSelf.value;
  if (isFullScreenSelf.value) {
    openFullScreen();
  } else {
    exitFullScreen();
  }
}

const visible = ref(false);
</script>

<template>
  <a-layout class="components-layout-demo-custom-trigger">
    <a-layout-sider style="box-shadow: 2px 0 3px 2px rgba(0,0,0,0.25);height: 100vh;overflow: auto"
                    :collapsed="collapsed" :trigger="null"
                    :collapsible="true" :width="256">
      <div class="logo">
        <router-link to="/">
          <img width="32" src="@/assets/logo.png" alt="logo"/>
          <!-- <img width="32" src="@/assets/img/logo.png" /> -->
          <h1>后台管理系统</h1>
        </router-link>
      </div>
      <Menu :collapsed="collapsed"/>
      <!--      <MenuTree :collapsed="collapsed"/>-->
    </a-layout-sider>
    <a-layout>
      <a-layout-header v-show="!fixedTabs"
                       style="box-shadow: 0 2px 8px rgba(0,0,0,0.25); background: #fff;display: flex;justify-content: space-between;padding: 0 1rem;">
        <div style="display: inline-flex;align-items: center;padding-left: 16px">
          <!--          <a-icon style="line-height: 0" class="trigger" :type="collapsed ? 'menu-unfold' : 'menu-fold'"-->
          <!--                  @click="() => (collapsed = !collapsed)"/>-->
          <div class="trigger" @click="collapsed = !collapsed">
            <menu-unfold-outlined v-if="collapsed"/>
            <menu-fold-outlined v-else/>
          </div>
          <bread-crumb/>
        </div>
        <a-drawer
            v-model:visible="visible"
            class="custom-class"
            style="color: red"
            title="项目配置"
            placement="right"
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </a-drawer>
        <div class="right-box">
          <a-tooltip placement="bottom">
            <template #title>
              <span>{{ isFullScreenSelf ? "退出" : "进入" }}全屏</span>
            </template>
            <div class="header-avatar" style="display: inline-block" @click="changeFullScreenState">
              <fullscreen-exit-outlined v-if="isFullScreenSelf"/>
              <fullscreen-outlined v-else/>
            </div>
          </a-tooltip>
          <a-dropdown>
            <div class="header-avatar">
              <a-avatar class="avatar" size="large" shape="circle" icon="user"
                        :src="authStore.authInfo?.avatar || DefaultAvatar"/>
              <span>{{ authStore.authInfo?.nickname || '王德发' }}</span>
            </div>
            <template #overlay>
              <a-menu class="avatar-menu">
                <a-menu-item>
                  <div class="menu-item">
                    <user-outlined/>
                    <span>个人中心</span>
                  </div>
                </a-menu-item>
                <a-menu-item @click="logout">
                  <div class="menu-item">
                    <poweroff-outlined/>
                    <span>退出登录</span>
                  </div>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
          <a-tooltip placement="bottom">
            <template #title>
              <span>项目配置</span>
            </template>
            <div class="header-avatar" @click="visible=true">
              <setting-outlined/>
            </div>
          </a-tooltip>
        </div>
      </a-layout-header>
      <a-layout-content style="padding: 12px 24px;display: flex;flex-direction: column;overflow: auto">
        <header-tabs @refreshTab="refreshPage"/>
        <main style="position: relative;">
          <router-view #="{ Component }" v-if="!pageRefresh">
            <transition enter-active-class="animate__animated animate__fadeInLeft page-toggle-enter-active"
                        leave-active-class="animate__animated animate__fadeOutRight page-toggle-leave-active">
              <component :is="Component"/>
            </transition>
          </router-view>
          <div v-else
               style="height: 400px;position: absolute;width: 100%;display: flex;justify-content: center;align-items: center;">
            <span><a-spin size="large" tip="刷新中..."/></span>
          </div>
        </main>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<style scoped lang="less">
.components-layout-demo-custom-trigger {
  height: 100vh;
  overflow: hidden;
  min-width: 100vw;
}

.components-layout-demo-custom-trigger .trigger {
  font-size: 18px;
  line-height: 64px;
  padding-right: 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.components-layout-demo-custom-trigger .trigger:hover {
  color: #1890ff;
}


.components-layout-demo-custom-trigger .logo-and-title {
  height: 6.4rem;
  padding-left: 2.4rem;
  //background: #053434;
  color: white;
  display: flex;
  align-items: center;

  .system-name {
    flex: 1;
    font-size: 2rem;
    color: #fff;
    margin-left: 1.2rem;
  }
}

.logo {
  height: 64px;
  //position: relative;
  line-height: 64px;
  padding-left: 24px;
  transition: all .3s;
  overflow: hidden;

  h1 {
    font-size: 20px;
    margin: 0 0 0 12px;
    display: inline-block;
    vertical-align: middle;
    color: white;
  }

  img {
    width: 32px;
    vertical-align: middle;
  }
}

.avatar-menu {

}

.menu-item {
  display: flex;
  //justify-content: space-between;
  align-items: center;

  span {
    margin-right: 8px;
  }
}

.header-avatar {
  padding: 0 8px;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    background-color: rgba(0, 0, 0, 0.025);
  }

  .avatar {
    margin-right: 1rem;
    margin-left: 1rem;
  }
}

.page-toggle-enter-active {
  position: absolute;
  width: 100%;
  height: 100%;
}

.page-toggle-leave-active {
  position: absolute;
  width: 100%;
  height: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.right-box {
  display: flex;

  & > * {
  }
}
</style>
<!--<style>-->
<!--.page-toggle-enter-active {-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->

<!--.page-toggle-leave-active {-->
<!--  position: absolute;-->
<!--  width: 100%;-->
<!--  height: 100%;-->
<!--}-->
<!--</style>-->
