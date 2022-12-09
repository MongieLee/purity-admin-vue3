import {defineStore} from "pinia";
import {broadName} from "../router/index.js";
import {__cache_tabs_key__} from "../utils/token.js";

const defaultActiveKey = '/board';

const cache_tabs_key = 'cache_tabs';

/**
 * 加载默认tabs
 * @returns {[{closable: boolean, label: string, loading: boolean, key: string},{closable: boolean, label: string, loading: boolean, key: string}]|any}
 */
const getCacheTabs = () => {
  const defaultTabs = [
    {
      label: broadName,
      key: defaultActiveKey,
      loading: false,
      closable: false
    },
    {
      label: "aaa组件",
      key: "/aaa",
      loading: false,
      closable: true
    },
  ];
  const tabs = window.localStorage.getItem(__cache_tabs_key__);
  try {
    if (tabs) {
      return JSON.parse(tabs);
    }
    return defaultTabs
  } catch {
    window.localStorage.removeItem(__cache_tabs_key__);
    return defaultTabs
  }
}


/**
 * 缓存tabs信息
 * @param tabs
 */
const cacheTabs = (tabs) => {
  localStorage.setItem(cache_tabs_key, JSON.stringify(tabs));
};

const useTabsStore = defineStore("tabs", {
    state: () => ({
      activeKey: defaultActiveKey,
      editableTabs: getCacheTabs()
    }),
    actions: {
      refreshTab(payload) {
        console.log(payload)
      },
      addTab(tabItem) {
        // 内存添加
        this.editableTabs.push(tabItem);
        // 缓存更新
        cacheTabs(this.editableTabs)
      },
      removeTab(tabItem) {
        const index = this.editableTabs.findIndex(i => i.key === tabItem.key);
        if (index !== -1) {
          this.editableTabs.splice(index, 1);
          cacheTabs(this.editableTabs);
        }
      },
      updateActiveKey(key) {
        this.activeKey = key;
      },
      batchRemoveTab(startIndex, deleteCount) {
        this.editableTabs.splice(startIndex, deleteCount);
        cacheTabs(this.editableTabs);
      }
    }
  }
)
export default useTabsStore;
