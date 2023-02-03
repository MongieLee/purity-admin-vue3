import Nprogress from "nprogress";
import {clearAuthToken, inspectTokenValidity} from "../utils/token.js";
import {message} from "ant-design-vue";
import useMenuStore from "@/store/useMenuStore"
import MenuService from "@/services/menu/menu";
import router from "@/router/index";
import {asyncConfigMap} from "@/router/baseConfig";

Nprogress.inc(0.1);
Nprogress.configure({minimum: 0.6});

const startNprogress = (to, from) => {
  if (!Nprogress.isStarted()) {
    Nprogress.start();
  }
}

const endNprogress = () => {
  setTimeout(() => {
    Nprogress.done();
  }, 200)
}

/**
 * 菜单类型枚举
 * @type {{button: string, carte: string, menu: string}}
 */
export const menuTypeEnum = {
  carte: "C", // 菜单
  button: "F", // 按钮
  menu: "M" // 菜单组
}

/**
 * 动态添加路由表
 * @param routes
 * @param parentName
 */
const addDynamicComp = (routes, parentName = "layout") => {
  routes.map(route => {
    if (route.menuType === menuTypeEnum.carte) {
      router.addRoute(parentName, {
        meta: {title: route.name}, path: route.path, name: route.compName, component: asyncConfigMap[route.compName]
      })
    } else if (route.menuType === menuTypeEnum.menu) {
      router.addRoute(parentName, {
        meta: {title: route.name},
        path: route.path,
        name: route.compName,
        component: asyncConfigMap[route.compName] || asyncConfigMap.wrapper
      })
    }
    if (route.children.length) {
      addDynamicComp(route.children, route.compName)
    }
  })
}

/**
 * 重置路由表
 * @param routes
 */
export const resetDynamicRoutes = (routes = []) => {
  routes instanceof Array && routes.map(i => {
    router.removeRoute(i.compName);
    if (i.children.length) {
      resetDynamicRoutes(i.children);
    }
  })
}

/**
 * 路由白名单，无需校验
 */
const whiteList = ["/login"]

function findBtnPermissions(menus) {
  const result = [];
  getBtn(menus, result);
  return result;
}

function getBtn(list, result) {
  list.map(i => {
    if (i.menuType === menuTypeEnum.button) {
      result.push(i.permission);
    }
    if (i.children.length) {
      getBtn(i.children, result);
    }
  })
}

/**
 * 路由鉴权守卫
 */
const loginGuard = async (to, from, next) => {
  if (!whiteList.includes(to.path) && !inspectTokenValidity()) {
    message.warning("登录凭证已过期，请重新登录");
    clearAuthToken();
    next({
      path: "/login", query: {
        redirect: encodeURIComponent(to.fullPath)
      }
    });
  } else {
    if (whiteList.includes(to.path)) {
      return next();
    }
    const menuStore = useMenuStore();
    if (!menuStore.$state.menus) {
      const menus = await MenuService.getMenuTreeOfSelf();
      menuStore.setPermissions(findBtnPermissions(menus));
      menuStore.setMenus(menus);
      addDynamicComp(menus);
      return next(to.path);
    }
    next();
  }
}

export default {
  beforeEach: [startNprogress, loginGuard], afterEach: [endNprogress]
}
