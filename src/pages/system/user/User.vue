<script setup name="role">
import {computed, onMounted, reactive, ref} from "vue";
import {SettingOutlined, SyncOutlined, ColumnHeightOutlined} from "@ant-design/icons-vue";
import MenuService from "../../../services/menu/menu.js";
import RoleService from "../../../services/role/role.js";
import {message} from "ant-design-vue";
import UserService from "../../../services/user/user.js";
import DepartmentService from "../../../services/department/department.js";
import useDeptTree from "../../../hooks/useDeptTree.js";

const {data, err, loading} = useDeptTree();
console.log(data)
console.log(err)
console.log(loading)

const searchForm = reactive({
  username: undefined,
  status: undefined,
  deptId: undefined
})
const emptyRecord = () => ({
  name: undefined,
  nickname: undefined,
  status: true,
  password: undefined,
  confirmPassword: undefined,
  deptId: undefined,
  roleId: undefined
})

const paginationInfo = reactive({
  page: 1,
  pageSize: 10,
  total: 0
});

const tableList = reactive({data: []});

onMounted(async () => {
  getDeptTree();
  getTableData();
  getRoleData();
})

const roleData = reactive({
  data: []
})

const getRoleData = () => {
  RoleService.getAllRole().then(res => {
    console.log(res)
    roleData.data = res;
    // roleData.data = [...Array(25)].map((_, i) => ({ value: (i + 10).toString(36) + (i + 1) }));
  })
}

const getTableData = async () => {
  tableLoading.value = true;
  const {total, records} = await UserService.getList({
    page: paginationInfo.page,
    pageSize: paginationInfo.pageSize,
    ...searchForm
  });
  tableList.data = records;
  paginationInfo.total = total;
  tableLoading.value = false;
}
// await getTree()
console.log(3333)

const formRef = ref(null);

const submitForm = () => {
  formRef.value.validate().then(async (values) => {
    values.roleIds = [values.roleId];
    const data = {...values, permissionRoles: currentEditRecord.value.permissionRoles}
    tableLoading.value = true
    const isUpdate = Boolean(currentEditRecord.value.id);
    try {
      if (isUpdate) {
        await UserService.update({...currentEditRecord.value, ...data})
      } else {
        await UserService.create(data);
      }
      message.success(isUpdate ? "????????????" : "????????????");
      modalVisible.value = false;
      getTableData();
    } catch (e) {
      tableLoading.value = false;
    }
  })
}

const treeData = ref([]);

const getDeptTree = async () => {
  const data = await DepartmentService.getDepartmentTree()
  treeData.value = data;
}

const columns = [
  {
    title: '??????',
    dataIndex: 'username',
    key: 'username',
    width: 220
  },
  {
    title: '??????',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 160
  },
  {
    title: '??????',
    dataIndex: 'status',
    key: 'status',
    width: 120
  },
  {
    title: '????????????',
    dataIndex: 'deptName',
    key: 'deptName',
  },
  {
    title: '????????????',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '????????????',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 180
  },
  {
    title: '??????',
    key: 'action',
    width: 120
  }
];

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
  currentEditRecord.value = JSON.parse(JSON.stringify(record));
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
  username: [{required: true, message: "?????????????????????"}],
  nickname: [{required: true, message: "???????????????"}],
  password: [{required: true, message: "???????????????"}],
  confirmPassword: [{
    required: true,
    validator: (rule, value) => {
      if (value === undefined || value === '') {
        return Promise.reject("?????????????????????");
      } else if (value !== currentEditRecord.value.password) {
        return Promise.reject("??????????????????????????????");
      }
      return Promise.resolve();
    }
  }],
  deptId: [{required: true, message: "?????????????????????"}],
  roleId: [{required: true, message: "?????????????????????"}],
}

const delRecord = async ({id, username}) => {
  tableLoading.value = true;
  try {
    await UserService.delete(id);
    message.success(`?????????${username}?????????`);
    await getTableData();
  } finally {
    tableLoading.value = false;
  }
}

const fff = (selectedKeys, e) => {
  searchForm.deptId = selectedKeys[0]
  getTableData();
}
</script>

<template>
  <div>
    <a-card :body-style="{'display':'flex'}">
      <div style="width: 300px;border-right: 1px solid #eee;margin-right: 12px">
        <a-tree @select="fff" :tree-data="treeData" :field-names="{title:'name',key:'id'}">
        </a-tree>
      </div>
      <div style="flex: 1">
        <a-card>
          <a-form @finish="search" :model="searchForm" layout="inline">
            <a-form-item label="????????????">
              <a-input v-model:value="searchForm.username" name="deptName" placeholder="?????????"/>
            </a-form-item>
            <a-form-item name="status" label="????????????">
              <a-select style="width:200px" v-model:value="searchForm.status" allow-clear placeholder="?????????">
                <a-select-option :value="true">??????</a-select-option>
                <a-select-option :value="false">??????</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item>
              <div class="search-btns">
                <a-button @click="resetSearchForm">??????</a-button>
                <a-button html-type="submit" :loading="tableLoading" type="primary">??????</a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-card>
        <a-card>
          <div style="display: flex;justify-content: space-between;align-items: center;padding: 0 0 16px">
            <div>????????????</div>
            <div style="display: flex;align-items: center" class="table-extension">
              <a-button type="primary" @click="addRecord">????????????</a-button>
              <a-tooltip title="??????">
                <sync-outlined @click="getTableData" :disable="tableLoading" style="font-size: 16px"/>
              </a-tooltip>
              <a-tooltip title="??????">
                <a-dropdown :trigger="['click']">
                  <column-height-outlined style="font-size: 16px"/>
                  <template #overlay>
                    <a-menu @click="changeSize">
                      <a-menu-item key="default">
                        <a>??????</a>
                      </a-menu-item>
                      <a-menu-item key="middle">
                        <a>??????</a>
                      </a-menu-item>
                      <a-menu-item key="small">
                        <a>??????</a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-tooltip>
              <a-tooltip title="?????????">
                <a-dropdown destroy-on-close v-model:visible="xxx" :trigger="['click']">
                  <setting-outlined style="font-size: 16px"/>
                  <template #overlay>
                    <div
                        style="margin-top: 10px;display: flex;justify-content: flex-start;flex-direction: column;background: white;box-shadow: 0 0 2px 1px  rgba(0,0,0,.2);padding: 8px;border-radius: 4px">
                      <div
                          style="width:160px;padding-bottom: 6px;border-bottom: 1px solid #dcd8d8;display: flex;justify-content: space-between">
                        <a-checkbox v-model:checked="isAllChecked" @change="allColumnChange">?????????</a-checkbox>
                        <a @click="ressetColumns">??????</a></div>
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
                <template v-if="record.username !== 'superadmin'">
                  <span>
                    <a @click="editRecord(record)">??????</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm :title="`??????????????????${record.username}??????`" ok-text="??????" cancel-text="??????"
                                  @confirm="delRecord(record)">
                      <a class="ant-dropdown-link">??????</a>
                    </a-popconfirm>
                  </span>
                </template>
              </template>
              <template v-if="column.key === 'status'">
                <a-tag v-if="record.status" color="green">??????</a-tag>
                <a-tag v-else color="red">??????</a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-card>
    <a-drawer @close="cancelModal" width="600" :title="`${currentEditRecord?.id?'??????':'??????'}??????`"
              v-model:visible="modalVisible">
      <div>
        <a-form ref="formRef" :model="currentEditRecord" layout="horizontal" :wrapper-col="{ span:14 }"
                :label-col="{ span:6 }" :rules="formRules">
          <a-form-item label="????????????" name="username">
            <a-input v-model:value="currentEditRecord.username"/>
          </a-form-item>
          <a-form-item label="??????" name="nickname">
            <a-input v-model:value="currentEditRecord.nickname"/>
          </a-form-item>
          <template v-if="!Boolean(currentEditRecord.id)">
            <a-form-item label="??????" name="password">
              <a-input type="password" v-model:value="currentEditRecord.password"/>
            </a-form-item>
            <a-form-item label="????????????" name="confirmPassword">
              <a-input type="password" v-model:value="currentEditRecord.confirmPassword"/>
            </a-form-item>
          </template>
          <a-form-item label="??????" name="status">
            <a-radio-group v-model:value="currentEditRecord.status">
              <a-radio :value="true">??????</a-radio>
              <a-radio :value="false">??????</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="deptId" label="????????????">
            <a-tree-select v-model:value="currentEditRecord.deptId" :tree-data="treeData" allow-clear
                           placeholder="?????????????????????" show-search
                           :field-names="{children: 'children',label: 'name',value: 'id'}"/>
          </a-form-item>
          <a-form-item name="roleId" label="????????????">
            <a-select v-model:value="currentEditRecord.roleId" :options="roleData.data"
                      :field-names="	{ label: 'name', value: 'id', options: 'options' }" allow-clear
                      placeholder="?????????????????????" show-search/>
          </a-form-item>
        </a-form>
      </div>
      <template #footer>
        <div style="text-align: right">
          <a-button @click="cancelModal">??????</a-button>
          <a-button @click="submitForm" type="primary" :loading="tableLoading" style="margin-left: 1em">??????</a-button>
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
