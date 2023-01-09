import {onMounted, reactive, ref, toRef, toRefs} from 'vue';
import DepartmentService from "../services/department/department.js";
import {clearChildren} from "@/utils";

/**
 * 获取部门树
 * @returns {{data: ToRef<UnwrapNestedRefs<{data: *[], err: null, loading: boolean}>["data"]>, err: ToRef<UnwrapNestedRefs<{data: *[], err: null, loading: boolean}>["err"]>, loading: ToRef<UnwrapNestedRefs<{data: *[], err: null, loading: boolean}>["loading"]>}}
 */
const useTreeData = () => {
  const state = reactive({
    data: [],
    loading: false,
    err: null
  });

  onMounted(() => {
    state.loading = true;
    DepartmentService.getDepartmentTree().then((value) => {
      state.data = clearChildren(value);
    })
      .catch(err => {
        state.err = err;
      }).finally(() => {
      console.log(state)
      state.loading = false;
    })
  })
  return {...toRefs(state)};
}

export default useTreeData;
