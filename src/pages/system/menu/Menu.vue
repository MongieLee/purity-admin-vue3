<script setup name="sysmenu">
import {computed, onMounted, reactive, ref} from "vue";
import {SettingOutlined, SyncOutlined, ColumnHeightOutlined} from "@ant-design/icons-vue";
import MenuService from "../../../services/menu/menu.js";
import AllIcon from "@/components/AllIcon.vue";
import {Form, message} from "ant-design-vue";

const searchForm = reactive({
  deptName: undefined,
  state: undefined
})

const menuTree = ref([]);

onMounted(() => {
  getTree()
})

const getTree = async () => {
  tableLoading.value = true;
  const tree = await MenuService.getMenuTree()
  clearChildren(tree);
  menuTree.value = tree;
  tableLoading.value = false;
}

function clearChildren(tree = []) {
  return tree.map(i => {
    if (!i.children.length) {
      Reflect.deleteProperty(i, 'children');
    } else {
      clearChildren(i.children)
    }
    return i;
  })
}

const getEmptyRecord = () => reactive({
  id: undefined, // id
  name: undefined, // 菜单名称
  parentId: undefined, // 父级id
  sequence: undefined, // 排序
  state: 1, // 是否禁用
  visible: 1, // 是否显示
  path: undefined, // 路由
  isLink: 0, // 是否外链
  menuType: "M", // 菜单类型
  compPath: undefined, // 组件地址
  permission: undefined, // 权限标识
  remake: undefined, // 备注
})
const columns = [
  {
    title: '菜单名称',
    dataIndex: 'name',
    key: 'name',
    width: 220
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'age',
    width: 80
  },
  {
    title: '类型',
    dataIndex: 'menuType',
    key: 'age',
    width: 80,
    customRender({text, record, index, column}) {
      switch (text) {
        case "M":
          return "目录";
        case "C":
          return "菜单";
        case "F":
          return "按钮";
        default:
          return "-";
      }
    }
  },
  {
    title: '路由',
    dataIndex: 'path',
    key: 'path',
  },
  {
    title: '是否外链',
    dataIndex: 'isLink',
    key: 'isLink',
    customRender({text, record, index, column}) {
      return text ? "是" : "否";
    },
    width: 120,
    align: "center"
  },
  {
    title: '权限标识',
    dataIndex: 'permission',
    key: 'age',
    width: 120
  },
  {
    title: '排序',
    dataIndex: 'sequence',
    key: 'sequence',
    width: 80,
    align: "center"
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 80
  },
  {
    title: '创建时间',
    key: 'createdAt',
    dataIndex: 'createdAt',
    width: 180
  },
  {
    title: '备注',
    key: 'remake',
    dataIndex: 'remake',
  },
  {
    title: '操作',
    key: 'action',
    width: 120
  }
];
const data = [
  {
    id: 8908901,
    parentId: null,
    name: '研发部',
    age: 1,
    state: 1,
    tags: '1980-06-03 13:22:55',
    remake: "金翅扑街鸟",
    children: [
      {
        id: 453534,
        parentId: 8908901,
        name: '研发一组',
        age: 1,
        state: 1,
        tags: '1980-06-03 13:22:55',
        remake: "金翅扑街鸟"
      },
      {
        id: 1231212312313,
        parentId: 8908901,
        name: '研发二组',
        age: 2,
        state: 1,
        tags: '1980-06-03 13:22:55',
        remake: "金翅扑街鸟"
      },
    ]
  },
  {
    id: 44,
    parentId: null,
    name: '开发部',
    age: 2,
    state: 0,
    tags: '1980-06-03 13:22:55',
    remake: "金翅扑街鸟"
  },
  {
    id: 123123,
    parentId: null,
    name: '人事部',
    age: 3,
    state: 0,
    tags: '1980-06-03 13:22:55',
    remake: "金翅扑街鸟"
  }
];

const resetSearchForm = () => {
  for (let searchFormKey in searchForm) {
    searchForm[searchFormKey] = undefined;
  }
}

const tableLoading = ref(false);

const search = async (values) => {
  if (tableLoading.value) return
  console.log(values)
  tableLoading.value = true;
  setTimeout(() => {
    tableLoading.value = false;
  }, 2000)
}

const modalVisible = ref(false);
const currentEditRecord = ref(getEmptyRecord());
const editRecord = (record) => {
  modalVisible.value = true;
  console.log(record)
  currentEditRecord.value = record;
}

const cancelModal = () => {
  modalVisible.value = false;
}

const customSize = ref('default');
const changeSize = ({key}) => {
  customSize.value = key;
}
const xxx = ref(false);

const cloneColumns = reactive(columns.map(i => {
  i.checked = true;
  return i;
}));

const allColumnChange = (evt) => {
  console.log(evt.target.checked);
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

const resetColumns = () => {
  cloneColumns.forEach(i => i.checked = true)
}
const isAllChecked = computed({
  get: () => cloneColumns.every(i => i.checked),
  set(value) {
    cloneColumns.forEach(i => i.checked = value);
  }
});
console.log(columnConfiguration);

const pageChange = (pagination, filters, sorter, {currentDataSource}) => {
  console.log(pagination);
}

const addRecord = () => {
  modalVisible.value = true;
  currentEditRecord.value = getEmptyRecord();
}
const modalForm = ref(null);
const onFinish = (values) => {
  console.log(values);
  console.log('get ref value:')
  console.log(modalForm.value)
  modalForm.value.validate().then(async (values) => {
    console.log("表单内容：");
    console.log(values);
    console.log("当前选择行：");
    console.log(currentEditRecord);
    try {
      tableLoading.value = true;
      const isUpdate = Boolean(currentEditRecord.value.id);
      console.log('isUpdate')
      console.log(isUpdate)
      const data = {...currentEditRecord.value, ...values};
      if (isUpdate) {
        await MenuService.updateMenu(data.id, data)
      } else {
        await MenuService.createMenu(data)
      }
      message.success(`${isUpdate ? "更新" : "新增"}菜单成功`);
      await getTree();
    } finally {
      modalVisible.value = false;
      tableLoading.value = false
    }
  })
}

const formRules = {
  name: [{required: true, trigger: 'change', message: "请输入菜单名称"}],
  sequence: [{required: true, trigger: 'change', message: "请输入排序"}],
  isLink: [{required: true, trigger: 'change', message: "请选择是否为外链"}],
  path: [{required: true, trigger: 'change', message: "请输入路由地址"}],
  visible: [{required: true, trigger: 'change', message: "请选择显示状态"}],
  state: [{required: true, trigger: 'change', message: "请选择菜单状态"}],
  // checkPass: [{validator: validatePass2, trigger: 'change'}],
  // age: [{validator: checkAge, trigger: 'change'}],
};

const delRecord = async ({id, name}) => {
  tableLoading.value = true;
  try {
    await MenuService.deleteMenu(id);
    message.success(`删除【${name}】成功`);
    await getTree();
  } finally {
    tableLoading.value = false;
  }
}

// const {} = useForm()
</script>

<template>
  <div>
    <a-card>
      <!--      <AllIcon/>-->
      <a-form @finish="search" :model="searchForm" layout="inline">
        <a-form-item label="菜单名称">
          <a-input v-model:value="searchForm.deptName" name="deptName" placeholder="可输入"/>
        </a-form-item>
        <a-form-item name="state" label="状态">
          <a-select v-model:value="searchForm.state" placeholder="可选择">
            <a-select-option :value="1">正常</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <div class="search-btns">
            <a-button icon="" @click="resetSearchForm">重置</a-button>
            <a-button html-type="submit" :loading="tableLoading" type="primary">查询</a-button>
          </div>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card>
      <div style="display: flex;justify-content: space-between;align-items: center;padding: 0 0 16px">
        <div>菜单列表</div>
        <div style="display: flex;align-items: center" class="table-extension">
          <a-button type="primary" @click="addRecord">新增菜单</a-button>
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
                    <a @click="resetColumns">重置</a></div>
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
      <a-table :size="customSize" row-key="id" :loading="tableLoading"
               :columns="columnConfiguration"
               :data-source="menuTree" @change="pageChange"
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
            <a-tag v-if="record.state" :color="'green'">正常</a-tag>
            <a-tag v-else :color="'red'">禁用</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal mask-closable @ok="onFinish" width="40%" @cancel="cancelModal" cancel-text="取消" ok-text="确认"
             :visible="modalVisible" :confirm-loading="tableLoading"
             :title="`${currentEditRecord?.id?'编辑':'新增'}菜单`">
      <a-form ref="modalForm" @finish="onFinish" :model="currentEditRecord" layout="horizontal"
              :labelCol="{style:{width:'100px'}}" :rules="formRules">
        <a-row>
          <a-col :span="24">
            <a-form-item name="name" label="菜单名称">
              <a-input v-model:value="currentEditRecord.name"/>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item name="menuType" label="菜单类型" required>
              <!--          菜单类型 取值范围M(目录Menu),C(菜单Carte),F(功能按钮Function)-->
              <a-radio-group v-model:value="currentEditRecord.menuType">
                <a-radio value="M">目录</a-radio>
                <a-radio value="C">菜单</a-radio>
                <a-radio value="F">按钮</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item name="parentId" label="上级菜单">
              <a-tree-select v-model:value="currentEditRecord.parentId" show-search tree-default-expand-all
                             :tree-data="menuTree" allow-clear
                             :fieldNames="{children:'children',label:'name',value:'id'}"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="sequence" label="排序" required>
              <a-input-number v-model:value="currentEditRecord.sequence" style="width: 100%"/>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item name="permission" label="权限标识">
              <a-input-number v-model:value="currentEditRecord.permission" style="width: 100%"/>
            </a-form-item>
          </a-col>

          <template v-if="currentEditRecord.menuType !== 'F'">
            <a-col :span="12">
              <a-form-item name="isLink" label="是否外链" required>
                <a-radio-group v-model:value="currentEditRecord.isLink">
                  <a-radio :value="1">是</a-radio>
                  <a-radio :value="0">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="path" label="路由地址" required>
                <template #extra>
                  <div>如果为外链地址请填写完整格式(^http(s)?//:w+)</div>
                </template>
                <a-input v-model:value="currentEditRecord.path"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="compPath" label="组件地址" required>
                <a-input v-model:value="currentEditRecord.compPath"/>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="visible" label="显示状态" required>
                <template #extra>
                  <div>是否出现在菜单栏，不影响地址访问</div>
                </template>
                <a-radio-group v-model:value="currentEditRecord.visible">
                  <a-radio :value="1">显示</a-radio>
                  <a-radio :value="0">隐藏</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item name="state" label="菜单状态" required>
                <template #extra>
                  <div>是否出现在菜单栏及能否地址访问</div>
                </template>
                <a-radio-group v-model:value="currentEditRecord.state">
                  <a-radio :value="1">正常</a-radio>
                  <a-radio :value="0">停用</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </template>
          <a-col :span="24">
            <a-form-item name="remark" label="备注">
              <a-textarea style="width: 100%" v-model:value="currentEditRecord.remake"/>
            </a-form-item>
          </a-col>
        </a-row>
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
