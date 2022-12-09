import {onMounted, reactive, ref, toRef} from 'vue';
import DepartmentService from "../services/department/department.js";

const useTreeData = () => {
  const state = reactive({
    data: [],
    loading: false,
    err: null
  });

  console.log("hooks setup执行")
  onMounted(() => {
    console.log('hooks onmounted执行')
  })
  console.log(`toRef(state)`);
  console.log(toRef(state));
  return {...toRef(state)};
}

export default useTreeData;
