<template>
  <PageContainer>
    <!-- 筛选卡片 -->
    <a-card class="filter-card">
      <a-space>
        <a-input
          v-model:value="filterForm.name"
          placeholder="输入角色编码、部门名称搜索"
          allow-clear
          style="width: 240px"
        />
        <a-select
          v-model:value="filterForm.status"
          placeholder="请选择"
          allow-clear
          style="width: 140px"
        >
          <a-select-option :value="1">启用</a-select-option>
          <a-select-option :value="0">禁用</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          搜索
        </a-button>
      </a-space>
    </a-card>

    <!-- 数据卡片 -->
    <a-card class="table-card">
      <!-- 操作栏 -->
      <div class="action-bar">
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
        </a-space>
        <div></div>
      </div>

      <!-- 表格 -->
      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        :scroll="{ x: 1100 }"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <!-- 状态 -->
          <template v-if="column.key === 'status'">
            <a-switch
              :checked="record.status === 1"
              @change="(val: boolean) => handleStatusChange(record, val)"
            />
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-button type="link" size="small" @click="handleAssignMenu(record)">分配权限</a-button>
              <a-popconfirm
                title="确定要删除该角色吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>删除</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 新增/编辑弹窗 -->
    <a-modal
      v-model:open="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :confirm-loading="submitLoading"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="formRules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 17 }"
        style="margin-top: 16px"
      >
        <a-form-item label="名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入角色名称" />
        </a-form-item>

        <a-form-item label="备注">
          <a-textarea
            v-model:value="form.description"
            placeholder="请填写备注"
            :rows="4"
          />
        </a-form-item>

        <a-form-item label="排序">
          <a-input-number
            v-model:value="form.sort"
            :min="0"
            placeholder="0"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 4px">
            输入0-n，数值越小越靠前
          </div>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 分配权限弹窗 -->
    <a-modal
      v-model:open="menuDialogVisible"
      title="分配权限"
      width="500px"
      :confirm-loading="menuSubmitLoading"
      @ok="handleMenuSubmit"
      @cancel="menuDialogVisible = false"
    >
      <div style="margin-bottom: 12px">
        <a-space>
          <a-checkbox v-model:checked="menuExpandAll" @change="handleExpandChange">
            {{ menuExpandAll ? '折叠' : '展开' }}
          </a-checkbox>
          <a-checkbox v-model:checked="menuCheckAll" @change="handleCheckAllChange">
            {{ menuCheckAll ? '不全选' : '全选' }}
          </a-checkbox>
        </a-space>
      </div>
      <a-tree
        v-model:checkedKeys="checkedMenuKeys"
        v-model:expandedKeys="expandedMenuKeys"
        :tree-data="menuTreeData"
        :field-names="{ title: 'title', key: 'id', children: 'children' }"
        checkable
        :selectable="false"
      />
    </a-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import PageContainer from '@/components/PageContainer'
import {
  getRoleList,
  addRole,
  updateRole,
  deleteRole,
  updateRoleStatus,
  assignMenu,
  type RoleItem,
  type RoleForm
} from '@/api/role'
import { getMenuList, type MenuItem } from '@/api/menu'

// 表格列定义
const columns = [
  { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
  { title: '名称', dataIndex: 'name', key: 'name', width: 150 },
  { title: '备注', dataIndex: 'description', key: 'description', width: 200 },
  { title: '授权人数', dataIndex: 'userCount', key: 'userCount', width: 90, align: 'center' as const },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 70, align: 'center' as const },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90, align: 'center' as const },
  { title: '操作', key: 'action', width: 200, fixed: 'right' as const }
]

// 筛选
const filterForm = reactive({ name: '', status: undefined as number | undefined })

// 表格数据
const loading = ref(false)
const tableData = ref<RoleItem[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref()

const defaultForm = (): RoleForm => ({
  name: '',
  description: '',
  sort: 0,
  status: 1
})

const form = reactive<RoleForm>(defaultForm())

const formRules = {
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}

// 分配权限
const menuDialogVisible = ref(false)
const menuSubmitLoading = ref(false)
const currentRoleId = ref<number>(0)
const checkedMenuKeys = ref<number[]>([])
const expandedMenuKeys = ref<number[]>([])
const menuExpandAll = ref(false)
const menuCheckAll = ref(false)
const menuTreeData = ref<MenuItem[]>([])

// 获取列表
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getRoleList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      name: filterForm.name,
      status: filterForm.status
    })
    if (res.data.code === 200) {
      tableData.value = res.data.data.list
      pagination.total = res.data.data.total
    }
  } catch {
    message.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.current = 1
  fetchList()
}

const handleTableChange = (pag: any) => {
  pagination.current = pag.current
  pagination.pageSize = pag.pageSize
  fetchList()
}

const handleAdd = () => {
  dialogTitle.value = '新增角色'
  Object.assign(form, defaultForm())
  dialogVisible.value = true
}

const handleEdit = (record: RoleItem) => {
  dialogTitle.value = '编辑角色'
  Object.assign(form, {
    id: record.id,
    name: record.name,
    description: record.description,
    sort: record.sort,
    status: record.status
  })
  dialogVisible.value = true
}

const handleDelete = async (record: RoleItem) => {
  try {
    const res = await deleteRole(record.id)
    if (res.data.code === 200) {
      message.success('删除成功')
      fetchList()
    } else {
      message.error(res.data.message || '删除失败')
    }
  } catch {
    message.error('删除失败')
  }
}

const handleStatusChange = async (record: RoleItem, val: boolean) => {
  const status = val ? 1 : 0
  try {
    const res = await updateRoleStatus(record.id, status)
    if (res.data.code === 200) {
      record.status = status
      message.success('状态更新成功')
    } else {
      message.error(res.data.message || '状态更新失败')
    }
  } catch {
    message.error('状态更新失败')
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
  } catch {
    return
  }
  submitLoading.value = true
  try {
    const data = { ...form }
    const res = data.id
      ? await updateRole(data as RoleForm & { id: number })
      : await addRole(data)
    if (res.data.code === 200) {
      message.success(data.id ? '更新成功' : '新增成功')
      dialogVisible.value = false
      fetchList()
    } else {
      message.error(res.data.message || '操作失败')
    }
  } catch {
    message.error('操作失败')
  } finally {
    submitLoading.value = false
  }
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, defaultForm())
}

// 分配权限
const handleAssignMenu = async (record: RoleItem) => {
  currentRoleId.value = record.id
  checkedMenuKeys.value = record.menuIds || []
  menuDialogVisible.value = true

  // 获取菜单树
  try {
    const res = await getMenuList()
    if (res.data.code === 200) {
      menuTreeData.value = res.data.data
    }
  } catch {
    message.error('获取菜单列表失败')
  }
}

const handleExpandChange = () => {
  if (menuExpandAll.value) {
    expandedMenuKeys.value = []
  } else {
    const getAllKeys = (list: MenuItem[]): number[] => {
      let keys: number[] = []
      list.forEach(item => {
        keys.push(item.id)
        if (item.children && item.children.length > 0) {
          keys = keys.concat(getAllKeys(item.children))
        }
      })
      return keys
    }
    expandedMenuKeys.value = getAllKeys(menuTreeData.value)
  }
}

const handleCheckAllChange = () => {
  if (menuCheckAll.value) {
    checkedMenuKeys.value = []
  } else {
    const getAllKeys = (list: MenuItem[]): number[] => {
      let keys: number[] = []
      list.forEach(item => {
        keys.push(item.id)
        if (item.children && item.children.length > 0) {
          keys = keys.concat(getAllKeys(item.children))
        }
      })
      return keys
    }
    checkedMenuKeys.value = getAllKeys(menuTreeData.value)
  }
}

const handleMenuSubmit = async () => {
  menuSubmitLoading.value = true
  try {
    const res = await assignMenu(currentRoleId.value, checkedMenuKeys.value as number[])
    if (res.data.code === 200) {
      message.success('权限分配成功')
      menuDialogVisible.value = false
      fetchList()
    } else {
      message.error(res.data.message || '权限分配失败')
    }
  } catch {
    message.error('权限分配失败')
  } finally {
    menuSubmitLoading.value = false
  }
}

onMounted(fetchList)
</script>

<style scoped>
.filter-card {
  margin-bottom: 16px;
  border-radius: 8px;
}

.table-card {
  border-radius: 8px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>
