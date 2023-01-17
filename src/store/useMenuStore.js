import {defineStore} from "pinia";
import {getToken, removeToken, setToken} from "@/utils/token.js";

const STORE_MENUS_KEY = "permission_menus";

/**
 * 获取初始化权限菜单权限菜单
 * @returns {*|null}
 */
const getInitMenus = () => {
    let result = null;
    try {
        result = JSON.parse(getToken(STORE_MENUS_KEY))
    } catch {
        return result;
    }
    return result;
}

const useMenuStore = defineStore("menu", {
    state: () => ({
        menus: getInitMenus(),
        permissions: []
    }),
    actions: {
        /**
         * 设置菜单数据
         * @param data
         */
        setMenus(data) {
            setToken(STORE_MENUS_KEY,data);
            this.menus = data;
        },
        /**
         * 清除菜单数据
         */
        clearStoreMenus() {
            removeToken(STORE_MENUS_KEY);
            this.setMenus(null);
        },
        /**
         * 设置菜单按钮权限集合
         * @param data
         */
        setPermissions(data) {
            this.permissions = data;
        }
    }
})
export default useMenuStore;
