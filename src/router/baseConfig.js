/**
 * 配置不需要权限即可访问的前端路由
 */
const routersConfig = {
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('pages/login/Login.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: "notFound",
      component: () => import("pages/notFound/NotFound.vue")
    }
    // {
    //   path: '/403',
    //   name: '403',
    //   component: () => import('pages/exception/403.vue')
    // },
    // {
    //   path: '*',
    //   name: '404',
    //   component: () => import('pages/exception/404.vue')
    // },
    // {
    //   path: '/500',
    //   name: '500',
    //   component: () => import('pages/exception/500.vue')
    // },
    // {
    //   path: '/',
    //   name: 'Home',
    //   redirect: '/dashboard',
    //   component: () => import('pages/HomePage.vue'),
    //   children: [
    //     {
    //       path: 'dashboard',
    //       name: 'Dashboard',
    //       mate: {
    //         icon: 'plus',
    //         showMenu: true
    //       },
    //       component: () => import('pages/dashboard')
    //     },
    //     {
    //       path: 'about',
    //       name: 'About',
    //       component: () => import('pages/exception/403')
    //     }
    //   ]
    // }
  ]
};

export const asyncConfigMap = {
  "wrapper": () => import("@/components/emptyRouterView/EmptyRouterView.vue"),
  "board": () => import("@/pages/board/Board.vue"),
  "menu": () => import("@/pages/system/menu/Menu.vue"),
  "user": () => import("@/pages/system/user/User.vue"),
  "role": () => import("@/pages/system/role/Role.vue"),
  "department": () => import("@/pages/system/department/Department.vue"),
  "changePassword": () => import("@/pages/system/changePassword/ChangePassword.vue"),
}

export default routersConfig;
