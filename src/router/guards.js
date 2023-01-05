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

const menuTypeEnum = {
  carte: "C",
  button: "F",
  menu: "M"
}

const addDynamicComp = (routes, parentName = "layout") => {
  routes.map(route => {
    if (route.menuType === menuTypeEnum.carte) {
      router.addRoute(parentName, {
        meta: {title: route.name},
        path: route.path,
        name: route.compPath,
        component: asyncConfigMap[route.compPath]
      })
    } else if (route.menuType === menuTypeEnum.menu) {
      router.addRoute(parentName, {
        meta: {title: route.name},
        path: route.path,
        name: route.compPath,
        component: asyncConfigMap[route.compPath] || asyncConfigMap.wrapper
      })
    }
    if (route.children.length) {
      addDynamicComp(route.children, route.compPath)
    }
  })
  console.log(router.getRoutes())
}

export const resetDynamicRoutes = (routes = []) => {
  routes instanceof Array && routes.map(i => {
    router.removeRoute(i.compPath);
    if (i.children.length) {
      resetDynamicRoutes(i.children);
    }
  })
}

/**
 * 路由白名单，无需校验
 */
const whiteList = ["/login"]

/**
 * 路由鉴权守卫
 */
const loginGuard = async (to, from, next) => {
  if (!whiteList.includes(to.path) && !inspectTokenValidity()) {
    message.warning("登录凭证已过期，请重新登录");
    clearAuthToken();
    next({
      path: "/login",
      query: {
        redirect: encodeURIComponent(to.fullPath)
      }
    });
  } else {
    if (whiteList.includes(to.path)) {
      return next();
    }
    const menuStore = useMenuStore();
    if (!menuStore.$state.menus) {
      const menus = await MenuService.getMenuTreeOfSelf()
      menuStore.setMenus(menus);
      addDynamicComp(menus);
      return next(to.path);
    }
    next();
  }
}


export default {
  beforeEach: [startNprogress, loginGuard],
  afterEach: [endNprogress]
}
