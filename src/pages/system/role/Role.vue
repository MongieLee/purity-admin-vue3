<script setup name="role">
import {computed, onMounted, reactive, ref} from "vue";
import {SettingOutlined, SyncOutlined, ColumnHeightOutlined} from "@ant-design/icons-vue";
import MenuService from "../../../services/menu/menu.js";
import RoleService from "../../../services/role/role.js";
import {message} from "ant-design-vue";

const searchForm = reactive({
  deptName: undefined,
  state: undefined
})
console.log('父组件')
const emptyRecord = () => ({
  name: undefined,
  parentId: undefined,
  sort: undefined,
  state: true,
  remake: undefined,
  permissionRoles: []
})

const paginationInfo = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const tableList = reactive({data: []});

onMounted(async () => {
  getTree();
  getTableData();
})

const getTableData = async () => {
  tableLoading.value = true;
  const {total, records} = await RoleService.getRolesByPage({
    page: paginationInfo.page,
    pageSize: paginationInfo.pageSize
  });
  tableList.data = records;
  paginationInfo.total = total;
  tableLoading.value = false;
}
// await getTree()
console.log(3333)

const formRef = ref(null);

const submitForm = () => {
  console.log(formRef.value)
  formRef.value.validate().then(async (values) => {
    console.log(values)
    console.log(currentEditRecord.value.permissionRoles)
    const data = {...values, permissionRoles: currentEditRecord.value.permissionRoles}
    tableLoading.value = true
    const isUpdate = Boolean(currentEditRecord.value.id);
    try {
      if (isUpdate) {
        await RoleService.updateRole({...currentEditRecord.value, ...data})
      } else {
        await RoleService.createRole(data);
      }
      message.success(isUpdate ? "更新成功" : "新建成功");
      modalVisible.value = false;
      getTableData();
    } catch (e) {
      tableLoading.value = false;
    }
  })
  console.log(currentEditRecord)
}

const treeData = ref([]);

const getTree = async () => {
  const data = await MenuService.getMenuTree()
  treeData.value = data;
}

const columns = [
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
    width: 220
  },
  {
    title: '角色标记',
    dataIndex: 'code',
    key: 'code',
    width: 160
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 120
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 180
  },
  {
    title: '描述',
    key: 'description',
    dataIndex: 'description',
  },
  {
    title: '操作',
    key: 'action',
    width: 120
  }
];
// const data = [
//   {
//     id: 8908901,
//     parentId: null,
//     name: '研发部',
//     tag: "admin",
//     sort: 1,
//     state: true,
//     created_at: '1980-06-03 13:22:55',
//     remake: "金翅扑街鸟",
//     permissions: []
//   },
//   {
//     id: 44,
//     parentId: null,
//     name: '开发部',
//     tag: "development",
//     sort: 2,
//     state: false,
//     created_at: '1980-06-03 13:22:55',
//     remake: "金翅扑街鸟",
//     permissions: []
//
//   },
//   {
//     id: 123123,
//     parentId: null,
//     tag: "normal",
//     name: '人事部',
//     sort: 3,
//     state: true,
//     created_at: '1980-06-03 13:22:55',
//     remake: "金翅扑街鸟",
//     permissions: []
//   }
// ];

const resetSearchForm = () => {
  for (let searchFormKey in searchForm) {
    searchForm[searchFormKey] = undefined;
  }
}

const tableLoading = ref(false);

const search = async (values) => {
  getTableData();
}

const modalVisible = ref(false);
const currentEditRecord = ref(null);
const editRecord = (record) => {
  modalVisible.value = true;
  console.log(record)
  currentEditRecord.value = record;
};

const cancelModal = () => {
  currentEditRecord.value = emptyRecord();
  modalVisible.value = false;
};

const customSize = ref('default')
const changeSize = ({key}) => {
  customSize.value = key;
};
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
}
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

const pageChange = ({current, pageSize, total}, filters, sorter, {currentDataSource}) => {
  paginationInfo.page = current;
  paginationInfo.pageSize = pageSize;
  getTableData();
}

const addRecord = () => {
  modalVisible.value = true;
  currentEditRecord.value = emptyRecord();
}

const stateChange = (value, e) => {
  tableLoading.value = true;
  setTimeout(() => {
    tableLoading.value = false;
  }, 1000)
}

const formRules = {
  name: [{required: true, message: "请输入角色名称"}],
  code: [{required: true, message: "请输入角色标记"}],
}

const delRecord = async ({id, name}) => {
  tableLoading.value = true;
  try {
    await RoleService.deleteRole(id);
    message.success(`删除【${name}】成功`);
    await getTableData();
  } finally {
    tableLoading.value = false;
  }
}

</script>

<template>
  <div>
    <a-card>
      <a-form @finish="search" :model="searchForm" layout="inline">
        <a-form-item label="角色名称">
          <a-input v-model:value="searchForm.deptName" name="deptName" placeholder="可输入"/>
        </a-form-item>
        <a-form-item name="state" label="启用状态">
          <a-select v-model:value="searchForm.state" placeholder="可选择">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <div class="search-btns">
            <a-button @click="resetSearchForm">重置</a-button>
            <a-button html-type="submit" :loading="tableLoading" type="primary">查询</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card>
      <div style="display: flex;justify-content: space-between;align-items: center;padding: 0 0 16px">
        <div>角色列表</div>
        <div style="display: flex;align-items: center" class="table-extension">
          <a-button type="primary" @click="addRecord">新增角色</a-button>
          <a-tooltip title="刷新">
            <sync-outlined @click="getTableData" :disable="tableLoading" style="font-size: 16px"/>
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
            <a-dropdown destroy-on-close v-model:visible="xxx" :trigger="['click']">
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
               :data-source="tableList.data" @change="pageChange"
               :pagination="{hideOnSinglePage:true,total:paginationInfo.total}">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <template v-if="record.code !== 'super_admin'">
                  <span>
                    <a @click="editRecord(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm :title="`确定要删除${record.name}吗`" ok-text="确定" cancel-text="取消"
                                  @confirm="delRecord(record)">
                      <a class="ant-dropdown-link">删除</a>
                    </a-popconfirm>
                  </span>
            </template>
          </template>
          <template v-if="column.key === 'state'">
            <!--            <a-switch @change="stateChange(record,$event)" v-model:checked="record.state">-->
            <!--              <template #checkedChildren>启用</template>-->
            <!--              <template #unCheckedChildren>禁用</template>-->
            <!--            </a-switch>-->
            <a-tag v-if="record.state" color="green">启用</a-tag>
            <a-tag v-else color="red">禁用</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-drawer @close="cancelModal" width="600" :title="`${currentEditRecord?.id?'编辑':'新增'}角色`"
              v-model:visible="modalVisible">
      <div>
        <a-form ref="formRef" :model="currentEditRecord" layout="horizontal" :wrapper-col="{ span:14 }"
                :label-col="{ span:6 }" :rules="formRules">
          <a-form-item label="角色名称" name="name">
            <a-input v-model:value="currentEditRecord.name"/>
          </a-form-item>
          <a-form-item label="角色标记" name="code">
            <a-input v-model:value="currentEditRecord.code"/>
          </a-form-item>
          <a-form-item label="状态" name="state">
            <a-radio-group v-model:value="currentEditRecord.state">
              <a-radio :value="true">启用</a-radio>
              <a-radio :value="false">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="remake" label="备注">
            <a-textarea v-model:value="currentEditRecord.remake"/>
          </a-form-item>
        </a-form>
        <a-divider/>
        <div>菜单及按钮权限分配</div>
        <a-tree :selectable="false" :tree-data="treeData" v-model:checked-keys="currentEditRecord.permissionRoles"
                default-expand-all checkable
                :field-names="{children:'children',title:'name',key:'id'}"/>
      </div>
      <template #footer>
        <div style="text-align: right">
          <a-button @click="cancelModal">取消</a-button>
          <a-button @click="submitForm" type="primary" :loading="tableLoading" style="margin-left: 1em">确认</a-button>
        </div>
      </template>
    </a-drawer>
  </div>
</template>

<style lang="less" scoped>
.ant-card {
  &:not(:first-child) {
    margin-top: 1em;
  }
}

.search-btns {
  & > *:not(:first-child) {
    margin-left: 8px;
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
