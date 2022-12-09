/**
 * 注册权限检查指令
 * @param vm Vue实例
 */
function registerDirectives(vm) {
  vm.directive("ck-permission", {
    mounted(el, binding) {
      console.log(el);
      console.log(binding)
      // const {value} = binding;
      // const originDisplay = el.style.display
      // el.classList.add('permission-hidden')
      // setTimeout(() => {
      //   if (store.state.auth.permissionCollection.includes(value)) {
      //     // el.remove();
      //     el.classList.remove('permission-hidden')
      //   }
      // }, 100);
    }
  })
}

export {registerDirectives}
