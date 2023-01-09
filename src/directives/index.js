import useMenuStore from "@/store/useMenuStore";

/**
 * 检查当前用户是否拥有对应指令所标记按钮颗粒度的权限
 * @param el
 * @param binding
 */
function checkPermission(el, binding) {
  const {value} = binding
  console.log(value)
  if (value instanceof Array) {
    // const hasPermission = useMenuStore().permissions
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
      // const {value} = binding;
      // const originDisplay = el.style.display
      // el.classList.add('permission-hidden')
      // setTimeout(() => {
      //   if (store.state.auth.permissionCollection.includes(value)) {
      //     // el.remove();
      //     el.classList.remove('permission-hidden')
      //   }
      // }, 100);
    },
    // updated(el, binding) {
    //   checkPermission(el, binding);
    // }
  })
}

export {registerDirectives}
