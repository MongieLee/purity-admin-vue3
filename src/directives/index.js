import useMenuStore from "@/store/useMenuStore";

/**
 * 检查当前用户是否拥有对应指令所标记按钮颗粒度的权限
 * @param el
 * @param binding
 */
function checkPermission(el, binding) {
  const {value} = binding
  if (value instanceof Array) {
    const {permissions} = useMenuStore();
    const hasPermission = value.some(item => permissions.includes(item));
    if (!hasPermission) {
      el.remove();
    }
  } else {
    throw new Error("v-permission需要传入鉴权规则数组")
  }
}

/**
 * 注册权限检查指令
 * @param vm Vue实例
 */
function registerDirectives(app) {
  app.directive("permission", {
    mounted(el, binding) {
      checkPermission(el, binding);
    },
    // updated(el, binding) {
    //   checkPermission(el, binding);
    // }
  })
}

export {registerDirectives}
