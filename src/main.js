import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import Antd from "ant-design-vue";
import "animate.css";
import "ant-design-vue/dist/antd.css";
import {createPinia} from "pinia";
import "nprogress/nprogress.css"

const F11Code = 122;
/**
 * 禁止F11作用
 */
window.document.addEventListener("keydown", (evt) => {
  if (evt.keyCode === F11Code) {
    evt.preventDefault();
  }
})


const app = createApp(App);
app.use(router)
  .use(Antd)
  .use(createPinia())
  .mount('#app')
