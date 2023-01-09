import {createRouter, createWebHashHistory} from "vue-router";
import baseConfig from "./baseConfig.js";
import guards from "./guards.js";

export const broadName = "首页";

const asyncRoutes = [

]

export const routes = [
  {
    path: "/",
    name: "layout",
    meta: {
      title: "首页",
    },
    component: () => import("@/layout/MainLayout.vue"),
    redirect: "/dashboard",
    children:[
      {
        path: '/:pathMatch(.*)*',
        name: "notFound",
        component: () => import("pages/notFound/NotFound.vue")
      }
    ]
    // children: [
    //   {
    //     meta: {
    //       title: broadName,
    //     },
    //     path: "board",
    //     name: "board",
    //     component: () => import("pages/board/Board.vue")
    //   },
    //   {
    //     meta: {
    //       title: "系统管理",
    //     },
    //     path: "system",
    //     component: () => import("@/components/emptyRouterView/EmptyRouterView.vue"),
    //     children: [
    //       {
    //         meta: {
    //           title: "用户管理",
    //         },
    //         path: "user",
    //         name: "user",
    //         component: () => import("@/pages/system/user/User.vue"),
    //       },
    //       {
    //         meta: {
    //           title: "角色管理",
    //         },
    //         path: "role",
    //         name: "role",
    //         component: () => import("@/pages/system/role/Role.vue"),
    //       },
    //       {
    //         meta: {
    //           title: "菜单管理",
    //         },
    //         path: "menu",
    //         name: "menu",
    //         component: () => import("@/pages/system/menu/Menu.vue"),
    //       },
    //       {
    //         meta: {
    //           title: "部门管理",
    //         },
    //         path: "department",
    //         name: "department",
    //         component: () => import("@/pages/system/department/Department.vue"),
    //       },
    //       {
    //         meta: {
    //           title: "修改密码",
    //         },
    //         path: "changePassword",
    //         name: "changePassword",
    //         component: () => import("@/pages/system/changePassword/ChangePassword.vue"),
    //       },
    //     ]
    //   },
    // ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...baseConfig.routes, ...routes]
})

guards.beforeEach.forEach((guard) => {
  router.beforeEach(guard);
})

guards.afterEach.forEach((guard) => {
  router.afterEach(guard);
})

export default router;
