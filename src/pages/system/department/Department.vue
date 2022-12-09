<script setup name="department">
import {computed, onMounted, reactive, ref} from "vue";
import {SettingOutlined, SyncOutlined, ColumnHeightOutlined} from "@ant-design/icons-vue";
import DepartmentService from "../../../services/department/department.js";
import {clearChildren} from "../../../utils/index.js";
import {message} from "ant-design-vue";
import Department from "../../../services/department/department.js";
import RoleService from "../../../services/role/role.js";


const emptyRecord = () => ({
  name: undefined,
  parentId: undefined,
  sequence: undefined,
  principal: undefined,
  phoneNumber: undefined,
  state: true
});
const columns = [
  {
    title: '部门名称',
    dataIndex: 'name',
    key: 'name',
    width: 220
  },
  {
    title: '排序',
    dataIndex: 'sequence',
    key: 'sequence',
    width: 80
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 80
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal',
  },

  {
    title: '联系电话', dataIndex: 'phoneNumber',
    key: 'principal',
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 180
  },
  {
    title: '操作',
    key: 'action',
    width: 120
  }
];
const data = reactive({list: []})

const getTree = async () => {
  tableLoading.value = true;
  const tree = await DepartmentService.getDepartmentTree();
  data.list = clearChildren(tree);
  tableLoading.value = false;
}

onMounted(() => {
  getTree();
})
const tableLoading = ref(false);

const search = async () => {
  getTree();
}

const modalVisible = ref(false);
const currentEditRecord = ref(null);
const editRecord = (record) => {
  modalVisible.value = true;
  console.log(record)
  currentEditRecord.value = record;
}

const cancelModal = () => {
  modalVisible.value = false;
}

const customSize = ref('default')
const changeSize = ({key}) => {
  customSize.value = key;
}
const xxx = ref(false);

const cloneColumns = reactive(columns.map(i => {
  i.checked = true;
  return i;
}));

const allColumnChange = (evt) => {
  console.log(evt.target.checked)
  cloneColumns.map(i => {
    i.checked = evt.target.checked;
    return i;
  });
  console.log(cloneColumns)
}
console.log(cloneColumns)
const columnConfiguration = computed(() => {
  return cloneColumns.filter((i) => {
    return i.key === "action" ? true : i.checked
  })
});

const ressetColumns = () => {
  cloneColumns.forEach(i => i.checked = true)
}
const isAllChecked = computed({
  get: () => cloneColumns.every(i => i.checked),
  set(value) {
    cloneColumns.forEach(i => i.checked = value);
  }
});
console.log(columnConfiguration)

const pageChange = (pagination, filters, sorter, {currentDataSource}) => {
  console.log(pagination);
}

const addRecord = () => {
  currentEditRecord.value = emptyRecord();
  modalVisible.value = true;
}

const formColumns = {
  name: [{required: true, message: "请输入部门名称"}],
  sequence: [{required: true, message: "请输入排序号"}],
  principal: [{required: true, message: "请输入部门负责人"}],
}

const formRef = ref(null);
const submitForm = () => {
  formRef.value.validate().then(async (values) => {
    console.log("表单获取的值")
    console.log(values)
    tableLoading.value = true;
    const isUpdate = Boolean(currentEditRecord.value.id);
    if (isUpdate) {
      await DepartmentService.updateDepartment({...currentEditRecord.value, ...values,})
    } else {
      await DepartmentService.createDepartment(values);
    }
    message.success(isUpdate ? "更新成功" : "新增成功");
    getTree();
    modalVisible.value = false;
  })
}

const delRecord = async ({id, name}) => {
  tableLoading.value = true;
  try {
    await DepartmentService.deleteDepartment(id);
    message.success(`删除【${name}】成功`);
    await getTree();
  } finally {
    tableLoading.value = false;
  }
}

</script>

<template>
  <div>
    <a-card>
      <div style="display: flex;justify-content: space-between;align-items: center;padding: 0 0 16px">
        <div>部门列表</div>
        <div style="display: flex;align-items: center" class="table-extension">
          <a-button type="primary" @click="addRecord">新增部门</a-button>
          <a-tooltip title="刷新">
            <sync-outlined @click="search" :disable="tableLoading" style="font-size: 16px"/>
          </a-tooltip>
          <a-tooltip title="密度">
            <a-dropdown :trigger="['click']">
              <column-height-outlined style="font-size: 16px"/>
              <template #overlay>
                <a-menu @click="changeSize">
                  <a-menu-item key="default">
                    <a>宽松</a>
                  </a-menu-item>
                  <a-menu-item key="middle">
                    <a>中等</a>
                  </a-menu-item>
                  <a-menu-item key="small">
                    <a>紧密</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-tooltip>
          <a-tooltip title="列设置">
            <a-dropdown v-model:visible="xxx" :trigger="['click']">
              <setting-outlined style="font-size: 16px"/>
              <template #overlay>
                <div
                    style="margin-top: 10px;display: flex;justify-content: flex-start;flex-direction: column;background: white;box-shadow: 0 0 2px 1px  rgba(0,0,0,.2);padding: 8px;border-radius: 4px">
                  <div
                      style="width:160px;padding-bottom: 6px;border-bottom: 1px solid #dcd8d8;display: flex;justify-content: space-between">
                    <a-checkbox v-model:checked="isAllChecked" @change="allColumnChange">列展示</a-checkbox>
                    <a @click="ressetColumns">重置</a></div>
                  <template v-for="item in cloneColumns">
                    <a-checkbox v-if="item.key !== 'action'" style="margin-left: 0" :key="item.key"
                                v-model:checked="item.checked">
                      <span>{{ item.title }}</span>
                    </a-checkbox>
                  </template>
                </div>
              </template>
            </a-dropdown>
          </a-tooltip>
        </div>
      </div>
      <a-table :size="customSize" row-key="id" bordered :loading="tableLoading" :columns="columnConfiguration"
               :data-source="data.list" @change="pageChange"
               :pagination="{hideOnSinglePage:true}">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            {{ record.name }}
          </template>
          <template v-else-if="column.key === 'action'">
                  <span>
                    <a @click="editRecord(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm :title="`确定要删除${record.name}吗`" ok-text="确定" cancel-text="取消"
                                  @confirm="delRecord(record)">
                      <a class="ant-dropdown-link">删除</a>
                    </a-popconfirm>
                  </span>
          </template>
          <template v-if="column.key === 'state'">
            <a-tag v-if="record.state" :color="'green'">启用</a-tag>
            <a-tag v-else :color="'red'">禁用</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal :confirmLoading="tableLoading" @cancel="cancelModal" cancel-text="取消" ok-text="确认" :visible="modalVisible"
             :title="`${currentEditRecord?.id?'编辑':'新增'}部门`" @ok="submitForm">
      <a-form ref="formRef" :model="currentEditRecord" layout="horizontal" :wrapper-col="{ span:14 }"
              :label-col="{ span:6 }"
              :rules="formColumns">
        <a-form-item name="name" label="部门名称">
          <a-input v-model:value="currentEditRecord.name" autocomplete="off"/>
        </a-form-item>
        <a-form-item label="上级部门" name="parentId">
          <a-tree-select v-model:value="currentEditRecord.parentId" show-search
                         :tree-data="data.list" allow-clear
                         :fieldNames="{children:'children',label:'name',value:'id'}"/>
        </a-form-item>
        <a-form-item name="sequence" label="排序">
          <a-input-number v-model:value="currentEditRecord.sequence" style="width: 100%"/>
        </a-form-item>

        <a-form-item name="principal" label="负责人">
          <a-input v-model:value="currentEditRecord.principal"/>
        </a-form-item>
        <a-form-item name="phoneNumber" label="联系号码">
          <a-input v-model:value="currentEditRecord.phoneNumber"/>
        </a-form-item>
        <a-form-item name="state" label="状态">
          <a-radio-group v-model:value="currentEditRecord.state">
            <a-radio :value="true">启用</a-radio>
            <a-radio :value="false">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style lang="less" scoped>
.ant-card {
  &:not(:first-child) {
    margin-top: 1em;
  }
}

.table-extension {
  & > *:not(:first-child) {
    margin-left: 12px;
  }

  & > *[disable=true] {
    cursor: not-allowed;
  }
}
</style>
