<script setup>
import {computed, onBeforeUnmount, onMounted, reactive} from "vue";

defineProps({
  visible: {
    type: Boolean,
    required: true
  },
  itemList: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(["update:visible", "select"]);
const state = reactive({
  top: 0,
  left: 0,
  target: null,
  cacheKey: null
})

onMounted(() => {
  window.addEventListener('click', closeMenu);
  window.addEventListener('contextmenu', setPosition);
});

onBeforeUnmount(() => {
  window.removeEventListener('click', closeMenu);
  window.removeEventListener('contextmenu', setPosition);
})

const position = computed(() => ({left: state.left + 'px', top: state.top + 'px'}));

const closeMenu = () => {
  // 外部使用visible.sync来同步
  emit("update:visible", false);
  state.cacheKey = null;
}
// 处理菜单的点击事件，组件会传入带点击菜单的key对象为参数{key:"xxx",...rest}
const handleClick = ({key}) => {
  // 触发select事件，让外部的使用者能够监听点击菜单
  // 传入key以及被右键的菜单
  emit('select', key, state.cacheKey);
  closeMenu();
}
// 菜单右键事件
const setPosition = ({clientY, clientX, target, _pageKey}) => {
  console.log("setPosition什么时候触发")
  // 获取并设置鼠标的x坐标和y坐标和被右键的dom
  state.top = clientY;
  state.left = clientX;
  state.target = target;
  state.cacheKey = _pageKey;
}
</script>
<template>
  <a-menu class="content-menu" v-show="visible" @click="handleClick" :style="position" :selectedKeys="[]">
    <a-menu-item :key="item.key" v-for="item in itemList">
      <component v-if="item.icon" :is="item.icon"/>
      <span>{{ item.text }}</span>
    </a-menu-item>
  </a-menu>
</template>

<style lang="less" scoped>
.content-menu {
  border-radius: 4px;
  position: fixed;
  left: 100px;
  top: 200px;
  box-shadow: -4px 2px 16px 1px rgba(0, 0, 0, .15) !important;
  z-index: 1000;

  .ant-menu-item {
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
