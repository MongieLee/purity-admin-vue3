<template>
  <a-config-provider :locale="locale">
    <router-view/>
  </a-config-provider>
  <!--  <div>123</div>-->
  <!--  <Test />-->
  <!--  <MultiRoot page="123" style="font-size: 20px;color: yellow" />-->
  <!--  <button class="aaa" @click="cancelBBB">canel bbb</button>-->
  <!--  <Child :id="id"></Child>-->
  <!--  <TestSlot :array="list">-->

  <!--    &lt;!&ndash; <template v-slot:[name]="{ data }">-->
  <!--      {{ data }}-->
  <!--      <div>123</div>-->
  <!--    </template>-->
  <!--    <div>456</div>-->
  <!--    <template #right>-->
  <!--      <div>789</div>-->
  <!--    </template> &ndash;&gt;-->
  <!--    <template v-slot="data">-->
  <!--      {{ data }}-->
  <!--    </template>-->
  <!--  </TestSlot>-->
  <!--  <component :is="key">123</component>-->
  <!--  <a-button @click="change">change</a-button>-->
</template>

<script>
import {computed} from "vue"
import Test from "@/components/Test.vue";
import TestSlot from "@/components/TestSlot.vue";
import MultiRoot from "@/components/MultiRoot.vue";
import Child from "@/components/Child.vue";
import mitt from "@/mitt"
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');
const fn = (info) => {
  console.log("第二个事件", info);
};

export default {
  name: 'App',
  components: {
    Test, TestSlot, MultiRoot, Child
  },
  created() {
    mitt.on("diyige", (info) => {
      console.log("diyige", info);
    })
    mitt.on("dierge", fn)
    setTimeout(() => {
      this.id = Math.random() * 100
    }, 2000)
  },
  provide() {
    return {
      babageinide: "babgeinide",
      listLeng: computed(() => this.list.length)
    }
  },
  data() {
    return {
      id: "123", locale: zhCN,
      name: "left",
      list: [1, 2, 3],
      key: "a-button"
    }
  },
  mounted() {
    setTimeout(() => {
      this.list = [1, 2]
    }, 2000)
  },
  methods: {
    change() {
      if (this.key === "a-button") {
        this.key = "a-checkbox"
      } else {
        this.key = "a-button"
      }
    },
    cancelBBB() {
      mitt.off("dierge", fn);
    },
    aaa() {
      console.log('====================================');
      console.log('run');
      console.log('====================================');
    },
    myLog(name) {
      console.log(name);
    }
  }
}
</script>

<style>
/*#app {*/
/*  font-family: Avenir, Helvetica, Arial, sans-serif;*/
/*  -webkit-font-smoothing: antialiased;*/
/*  -moz-osx-font-smoothing: grayscale;*/
/*  text-align: center;*/
/*  color: #2c3e50;*/
/*  margin-top: 60px;*/
/*}*/
</style>
