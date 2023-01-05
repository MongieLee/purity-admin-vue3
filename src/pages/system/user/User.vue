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
      message.success(isUpdate ? "更新成功" : "新建成功");
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
    title: '账号',
    dataIndex: 'username',
    key: 'username',
    width: 220
  },
  {
    title: '昵称',
    dataIndex: 'nickname',
    key: 'nickname',
    width: 160
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 120
  },
  {
    title: '所属部门',
    dataIndex: 'deptName',
    key: 'deptName',
  },
  {
    title: '所属角色',
    dataIndex: 'roleName',
    key: 'roleName',
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
  username: [{required: true, message: "请输入用户账号"}],
  nickname: [{required: true, message: "请输入昵称"}],
  password: [{required: true, message: "请输入密码"}],
  confirmPassword: [{
    required: true,
    validator: (rule, value) => {
      if (value === undefined || value === '') {
        return Promise.reject("请输入确认密码");
      } else if (value !== currentEditRecord.value.password) {
        return Promise.reject("两次输入的密码不一致");
      }
      return Promise.resolve();
    }
  }],
  deptId: [{required: true, message: "请选择所属部门"}],
  roleId: [{required: true, message: "请选择所属角色"}],
}

const delRecord = async ({id, username}) => {
  tableLoading.value = true;
  try {
    await UserService.delete(id);
    message.success(`删除【${username}】成功`);
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
            <a-form-item label="用户名称">
              <a-input v-model:value="searchForm.username" name="deptName" placeholder="可输入"/>
            </a-form-item>
            <a-form-item name="status" label="用户状态">
              <a-select style="width:200px" v-model:value="searchForm.status" allow-clear placeholder="可选择">
                <a-select-option :value="true">启用</a-select-option>
                <a-select-option :value="false">禁用</a-select-option>
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
            <div>用户列表</div>
            <div style="display: flex;align-items: center" class="table-extension">
              <a-button type="primary" @click="addRecord">新增用户</a-button>
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
                <template v-if="record.username !== 'superadmin'">
                  <span>
                    <a @click="editRecord(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a-popconfirm :title="`确定要删除【${record.username}】吗`" ok-text="确定" cancel-text="取消"
                                  @confirm="delRecord(record)">
                      <a class="ant-dropdown-link">删除</a>
                    </a-popconfirm>
                  </span>
                </template>
              </template>
              <template v-if="column.key === 'status'">
                <a-tag v-if="record.status" color="green">启用</a-tag>
                <a-tag v-else color="red">禁用</a-tag>
              </template>
            </template>
          </a-table>
        </a-card>
      </div>
    </a-card>
    <a-drawer @close="cancelModal" width="600" :title="`${currentEditRecord?.id?'编辑':'新增'}用户`"
              v-model:visible="modalVisible">
      <div>
        <a-form ref="formRef" :model="currentEditRecord" layout="horizontal" :wrapper-col="{ span:14 }"
                :label-col="{ span:6 }" :rules="formRules">
          <a-form-item label="用户账号" name="username">
            <a-input v-model:value="currentEditRecord.username"/>
          </a-form-item>
          <a-form-item label="昵称" name="nickname">
            <a-input v-model:value="currentEditRecord.nickname"/>
          </a-form-item>
          <template v-if="!Boolean(currentEditRecord.id)">
            <a-form-item label="密码" name="password">
              <a-input type="password" v-model:value="currentEditRecord.password"/>
            </a-form-item>
            <a-form-item label="确认密码" name="confirmPassword">
              <a-input type="password" v-model:value="currentEditRecord.confirmPassword"/>
            </a-form-item>
          </template>
          <a-form-item label="状态" name="status">
            <a-radio-group v-model:value="currentEditRecord.status">
              <a-radio :value="true">启用</a-radio>
              <a-radio :value="false">禁用</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item name="deptId" label="所属部门">
            <a-tree-select v-model:value="currentEditRecord.deptId" :tree-data="treeData" allow-clear
                           placeholder="请选择所属部门" show-search
                           :field-names="{children: 'children',label: 'name',value: 'id'}"/>
          </a-form-item>
          <a-form-item name="roleId" label="角色身份">
            <a-select v-model:value="currentEditRecord.roleId" :options="roleData.data"
                      :field-names="	{ label: 'name', value: 'id', options: 'options' }" allow-clear
                      placeholder="请选择角色身份" show-search/>
          </a-form-item>
        </a-form>
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
