import {defineStore} from "pinia";
import AuthService from "../services/auth/auth.js";
import router from "../router/index.js";
import {Modal} from "ant-design-vue";
import {clearAuthToken} from "../utils/token.js";
import {resetDynamicRoutes} from "@/router/guards";
import useMenuStore from "@/store/useMenuStore";

const useAuthStore = defineStore("auth", {
    state: () => ({
      authInfo: {}
    }),
    actions: {
      updateAuth(payload) {
        console.log(payload)
      },
      async fetchUserInfo() {
        const authInfo = await AuthService.getUserInfo();
        this.authInfo = authInfo;
      },
      async logout() {
        Modal.confirm({
          title: "温馨提示",
          content: "是否确认退出系统",
          okText: "确定",
          cancelText: "取消",
          async onOk() {
            clearAuthToken();
            const menuStore = useMenuStore()
            resetDynamicRoutes(menuStore.menus)
            menuStore.clearStoreMenus();
            await router.push("/login");
          }
        })
        console.log(router)
      }
    }
  }
)
export default useAuthStore;
