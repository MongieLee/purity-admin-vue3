<script setup>

import {reactive, ref} from "vue";

const searchForm = reactive({
  deptName: undefined,
  state: undefined
})
const columns = [
  {
    title: '部门名称',
    dataIndex: 'name',
    key: 'name',
    width: 220
  },
  {
    title: '排序',
    dataIndex: 'age',
    key: 'age',
    width: 80
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    width: 80
  },
  {
    title: '创建时间',
    key: 'tags',
    dataIndex: 'tags',
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
const currentEditRecord = ref(null);
const editRecord = (record) => {
  modalVisible.value = true;
  console.log(record)
  currentEditRecord.value = record;
}

const cancelModal = () => {
  modalVisible.value = false;
}
</script>

<template>
  <div>
    <a-card>
      <a-form @finish="search" :model="searchForm" layout="inline">
        <a-form-item label="部门名称">
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
      <a-table row-key="id" bordered :loading="tableLoading" :columns="columns" :data-source="data"
               :pagination="{hideOnSinglePage:true}">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a>{{ record.name }}</a>
          </template>
          <template v-else-if="column.key === 'action'">
                  <span>
                    <a @click="editRecord(record)">编辑</a>
                    <a-divider type="vertical"/>
                    <a class="ant-dropdown-link">删除</a>
                  </span>
          </template>
          <template v-if="column.key === 'state'">
            <a-tag v-if="record.state" :color="'green'">启用</a-tag>
            <a-tag v-else :color="'red'">禁用</a-tag>
          </template>
        </template>
      </a-table>
    </a-card>
    <a-modal @cancel="cancelModal" cancel-text="取消" ok-text="确认" :visible="modalVisible" :title="'编辑部门'">
      <a-form :model="currentEditRecord" layout="horizontal" :wrapper-col="{ span:14 }" :label-col="{ span:6 }">
        <a-form-item label="部门名称" required>
          <a-input v-model:value="currentEditRecord.name"/>
        </a-form-item>
        <a-form-item label="上级部门" required>
          <a-tree-select v-model:value="currentEditRecord.parentId" show-search tree-default-expand-all
                         :tree-data="data" allow-clear
                         :fieldNames="{children:'children',label:'name',value:'id'}"/>
        </a-form-item>
        <a-form-item label="排序" required>
          <a-input-number v-model:value="currentEditRecord.age" style="width: 100%"/>
        </a-form-item>
        <a-form-item label="状态" required>
          <a-radio-group v-model:value="currentEditRecord.state">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="备注">
          <a-textarea v-model:value="currentEditRecord.remake"/>
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

.search-btns {
  & > *:not(:first-child) {
    margin-left: 8px;
  }
}
</style>
