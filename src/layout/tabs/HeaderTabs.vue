<script setup>
import useTabsStore from "@/store/useTabsStore.js";
import {
  CloseOutlined,
  LoadingOutlined,
  SyncOutlined,
  VerticalLeftOutlined,
  VerticalRightOutlined,
  LockOutlined, UnlockOutlined
} from "@ant-design/icons-vue";
import {useRoute, useRouter} from "vue-router";
import {reactive, ref, watch} from "vue";
import ContentMenu from "../../components/contentMenu/ContentMenu.vue";
import {message} from "ant-design-vue";
import useSettingStore from "../../store/useSettingStore.js";

const emit = defineEmits(["refreshTab"])
const tabsStore = useTabsStore()

const settingStore = useSettingStore();
const isFullScreen = ref(false);
const route = useRoute();

watch(route, (nextPath, prePath) => {
  if (nextPath.path !== "/login") {
    tabsStore.updateActiveKey(nextPath.path);
    const exist = Boolean(tabsStore.editableTabs.find(i => i.key == nextPath.path));
    if (!exist) {
      tabsStore.addTab({
        label: nextPath.meta.title || "未定义",
        key: nextPath.path,
        loading: false,
        closable: true
      })
    }
  }
}, {
  immediate: true
})

const onRefresh = (tab) => {
  if (tab.loading) return;
  emit("refreshTab", tab);
}

const router = useRouter();

const clickTabItem = (pathKey) => {
  router.push(pathKey)
}

const contentMenuList = reactive([
  {text: '关闭左侧', key: 'closeLeft', icon: VerticalRightOutlined},
  {text: '关闭右侧', key: 'closeRight', icon: VerticalLeftOutlined},
  {text: '关闭其他', key: 'closeOther', icon: CloseOutlined}
  // { text: '刷新页面', key: 'refresh', icon: 'sync' }
])
const contentMenuVisible = ref(false);
const selectHandlers = {
  closeLeft(index, pageKey) {
    if (index <= 1) {
      // 无法关闭默认锁定的面板页，已经当前tab为第二项时，便没有可以关闭的标签
      message.warning("左侧已没有可以关闭的标签！")
    } else {
      const deleteCount = index - 1;
      tabsStore.batchRemoveTab(1, deleteCount);
      if (!tabsStore.editableTabs.some(i => i.key === route.path)) {
        router.push(pageKey)
      }
    }
  },
  closeRight(index, pageKey) {
    if (index === tabsStore.editableTabs.length - 1) {
      message.warning("右侧已没有可以关闭的标签！")
    } else {
      const deleteCount = tabsStore.editableTabs.length - index - 1;
      tabsStore.batchRemoveTab(index + 1, deleteCount);
      if (!tabsStore.editableTabs.some(i => i.key === route.path)) {
        router.push(pageKey)
      }
    }
  },
  closeOther(index, pageKey) {
    if (index <= 1) {
      // 无法关闭默认锁定的面板页，已经当前tab为第二项时，便没有可以关闭的标签
      message.warning("左侧已没有可以关闭的标签！")
    } else {
      this.closeRight(index, pageKey);
      this.closeLeft(index, pageKey);
    }
  }
}
const onContentMenuSelect = (evtName, pageKey) => {
  const index = tabsStore.editableTabs.findIndex(i => i.key === pageKey);
  selectHandlers[evtName] && selectHandlers[evtName](index, pageKey);
}

const onContextMenu = (pagekey, evt) => {
  if (pagekey) {
    evt.preventDefault();
    // 处理事件对象，后续在window上的监听就可以获取到_pageKey
    evt._pageKey = pagekey;
    contentMenuVisible.value = true;
  }
}

const dianjile = (pageKey) => {
  const index = tabsStore.editableTabs.findIndex(i => i.key === pageKey);
  router.push(tabsStore.editableTabs[index - 1].key);
  tabsStore.batchRemoveTab(index, 1);
}
</script>


<template>
  <content-menu :item-list="contentMenuList" v-model:visible="contentMenuVisible" @select="onContentMenuSelect"/>
  <a-tabs :tab-bar-style="{margin:0}" size="small" type="editable-card" hide-add @tabClick="clickTabItem"
          v-model:active-key="tabsStore.activeKey" @edit="dianjile">
    <!--    <template #rightExtra>-->
    <!--      123-->
    <!--    </template>-->
    <!--    <a-tab-pane v-for="tab in tabsStore.editableTabs" :key="tab.key" :closable="tab.closable">-->
    <!--    <a-tab-pane v-for="tab in tabsStore.editableTabs" :key="tab.key" :closable="tab.closable">-->
    <!--    <a-tab-pane v-for="tab in tabsStore.editableTabs" :key="tab.key" :closable="false">-->
    <a-tab-pane v-for="tab in tabsStore.editableTabs" :key="tab.key" :closable="tab.closable">
      <template #tab>
        <div @contextmenu="(evt) => onContextMenu(tab.key,evt)">
          <div style="display: inline-block" @click.stop="onRefresh(tab)">
            <sync-outlined v-if="route.path === tab.key && !tab.loading" style="margin-right: 4px"/>
            <loading-outlined v-if="tab.loading" style="margin-right: 4px"/>
          </div>
          {{ tab.label }}
        </div>
      </template>
    </a-tab-pane>
  </a-tabs>
</template>

<style scoped lang="less">
:deep(.ant-tabs-tab-remove) {
  padding: 0;
}

:deep(.ant-tabs-dropdown-menu-title-content) {
  border: 1px solid red;
}


</style>
<style>
:deep(.ant-tabs-dropdown-menu-item) {
  border: 1px solid red !important;
}
</style>
