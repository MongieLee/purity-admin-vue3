import {defineStore} from "pinia";
import {getToken} from "@/utils/token.js";

const STORE_MENUS_KEY = "permission_menus";

/**
 * 获取权限菜单
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
        setMenus(data) {
            this.menus = data;
        },
        clearStoreMenus() {
            window.localStorage.removeItem(STORE_MENUS_KEY);
            this.setMenus(null);
        },
        setPermissions(data) {
            this.permissions = data;
        }
    }
})
export default useMenuStore;
