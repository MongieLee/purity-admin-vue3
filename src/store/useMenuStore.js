import {defineStore} from "pinia";
import MenuService from "@/services/menu/menu.js";
import {getToken} from "@/utils/token.js";
import router from "@/router/index.js";

const menuTypeEnum = {
  carte: "C",
  button: "F",
  menu: "M"
}

const asyncConfigMap = {
  "index": () => import("@/pages/board/Board.vue")
}


function routeC(path) {
  return (resolve) => require([path], resolve)
}

const STORE_MENUS_KEY = "permission_menus";

/**
 * 获取权限菜单
 * @returns {*|null}
 */
const getInitMenus = () => {
  let result = null;
  try {
    result = JSON.parse(getToken("permission_menus"))
  } catch {
    return result;
  }
  return result;
}


const useMenuStore = defineStore("menu", {
    state: () => ({
      menus: getInitMenus()
    }),
    actions: {
      setMenus(data) {
        this.menus = data;
      },
      clearStoreMenus() {
        window.localStorage.removeItem("STORE_MENUS_KEY");
        this.setMenus(null);
      }
    }
  }
)
export default useMenuStore;
