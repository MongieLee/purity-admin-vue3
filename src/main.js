import {createApp} from 'vue'
import './style.css'
import "@/theme/style/main.less"
import App from './App.vue'
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import {registerDirectives} from "./directives/index.js";
import router from "./router/index.js";
import "animate.css";
import {createPinia} from "pinia";
import "nprogress/nprogress.css";

const F11Code = 122;

window.document.addEventListener("keydown", evt => {
  if (evt.keyCode === F11Code) {
    evt.preventDefault();
  }
});

const app = createApp(App);
app.use(Antd).use(router).use(createPinia()).mount('#app')
registerDirectives(app);
