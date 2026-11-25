<template>
  <PageContainer>
    <!-- 筛选卡片 -->
    <a-card class="filter-card">
      <a-space>
        <a-input v-model:value="filterForm.title" placeholder="菜单名称" allow-clear style="width: 200px" />
        <a-select v-model:value="filterForm.status" placeholder="菜单状态" allow-clear style="width: 140px">
          <a-select-option :value="1">启用</a-select-option>
          <a-select-option :value="0">禁用</a-select-option>
        </a-select>
        <a-button type="primary" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          搜索
        </a-button>
        <a-button @click="handleReset">重置</a-button>
      </a-space>
    </a-card>

    <!-- 数据卡片 -->
    <a-card class="table-card">
      <!-- 操作栏 -->
      <div class="action-bar">
        <a-space>
          <a-button type="primary" @click="handleAdd()">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
          <a-button @click="toggleExpand">
            {{ isExpanded ? '折叠全部' : '展开全部' }}
          </a-button>
        </a-space>
      </div>

      <!-- 树形表格 -->
      <a-table
        :columns="columns"
        :data-source="filteredData"
        :loading="loading"
        :pagination="false"
        row-key="id"
        :default-expand-all-rows="isExpanded"
        :key="tableKey"
        :scroll="{ x: 1300 }"
        :row-expandable="(record) => !!record.children && record.children.length > 0"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <!-- 菜单类型 -->
          <template v-if="column.key === 'type'">
            <a-tag v-if="record.type === 'directory'" color="orange">目录</a-tag>
            <a-tag v-else-if="record.type === 'menu'" color="green">菜单</a-tag>
            <a-tag v-else-if="record.type === 'button'" color="default">按钮</a-tag>
          </template>

          <!-- 显示状态 -->
          <template v-else-if="column.key === 'visible'">
            <a-tag :color="record.visible === 1 ? 'green' : 'default'">
              {{ record.visible === 1 ? '显示' : '隐藏' }}
            </a-tag>
          </template>

          <!-- 启用状态 -->
          <template v-else-if="column.key === 'status'">
            <a-switch :checked="record.status === 1" @change="(val: boolean) => handleStatusChange(record, val)" />
          </template>

          <!-- 操作列 -->
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a-button v-if="record.type !== 'button'" type="link" size="small" @click="handleAdd(record.id)"
                >新增</a-button
              >
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定要删除该菜单吗？"
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
      width="600px"
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
        <!-- 菜单类型 -->
        <a-form-item label="菜单类型" name="type">
          <a-radio-group v-model:value="form.type">
            <a-radio value="directory">目录</a-radio>
            <a-radio value="menu">菜单</a-radio>
            <a-radio value="button">按钮</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 上级菜单 -->
        <a-form-item label="上级菜单">
          <a-tree-select
            v-model:value="form.parentId"
            :tree-data="menuTreeOptions"
            :field-names="{ label: 'title', value: 'id', children: 'children' }"
            placeholder="请选择上级菜单（不选则为顶级）"
            allow-clear
            tree-default-expand-all
            style="width: 100%"
          />
        </a-form-item>

        <!-- 菜单名称 -->
        <a-form-item label="菜单名称" name="title">
          <a-input v-model:value="form.title" placeholder="请输入菜单名称" />
        </a-form-item>

        <!-- 图标（目录/菜单才有） -->
        <a-form-item v-if="form.type !== 'button'" label="图标">
          <a-input v-model:value="form.icon" placeholder="图标组件名，如 DashboardOutlined" />
        </a-form-item>

        <!-- 路由地址（目录/菜单才有） -->
        <a-form-item v-if="form.type !== 'button'" label="路由地址" name="path">
          <a-input v-model:value="form.path" placeholder="如 /permission/menu" />
        </a-form-item>

        <!-- 组件路径（菜单才有） -->
        <a-form-item v-if="form.type === 'menu'" label="组件路径">
          <a-input v-model:value="form.component" placeholder="如 Permission/Menu/index" />
        </a-form-item>

        <!-- 权限标识 -->
        <a-form-item label="权限标识">
          <a-input v-model:value="form.permission" placeholder="如 permission:menu:list" />
        </a-form-item>

        <!-- 排序 -->
        <a-form-item label="排序">
          <a-input-number v-model:value="form.sort" :min="0" :max="9999" style="width: 100%" />
        </a-form-item>

        <!-- 显示状态（目录/菜单才有） -->
        <a-form-item v-if="form.type !== 'button'" label="显示状态">
          <a-radio-group v-model:value="form.visible">
            <a-radio :value="1">显示</a-radio>
            <a-radio :value="0">隐藏</a-radio>
          </a-radio-group>
        </a-form-item>

        <!-- 启用状态 -->
        <a-form-item label="启用状态">
          <a-radio-group v-model:value="form.status">
            <a-radio :value="1">启用</a-radio>
            <a-radio :value="0">禁用</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import PageContainer from '@/components/PageContainer'
import {
  getMenuList,
  addMenu,
  updateMenu,
  deleteMenu,
  updateMenuStatus,
  type MenuItem,
  type MenuForm
} from '@/api/menu'

// 表格列定义
const columns = [
  { title: '菜单名称', dataIndex: 'title', key: 'title', width: 220 },
  { title: '类型', dataIndex: 'type', key: 'type', width: 90, align: 'center' as const },
  { title: '图标', dataIndex: 'icon', key: 'icon', width: 160 },
  { title: '路由地址', dataIndex: 'path', key: 'path', width: 200 },
  { title: '权限标识', dataIndex: 'permission', key: 'permission', width: 220 },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 80, align: 'center' as const },
  { title: '显示', dataIndex: 'visible', key: 'visible', width: 90, align: 'center' as const },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110, align: 'center' as const },
  { title: '操作', key: 'action', width: 160, fixed: 'right' as const }
]

// 筛选
const filterForm = reactive({ title: '', status: undefined as number | undefined })

// 表格数据
const loading = ref(false)
const tableData = ref<MenuItem[]>([])
const isExpanded = ref(true)
const tableKey = ref(0)

// 筛选后的数据（前端过滤）
const filteredData = computed(() => {
  if (!filterForm.title && filterForm.status === undefined) return tableData.value
  const filterTree = (list: MenuItem[]): MenuItem[] => {
    return list
      .map((item) => ({ ...item, children: item.children ? filterTree(item.children) : [] }))
      .filter((item) => {
        const titleMatch = !filterForm.title || item.title.includes(filterForm.title)
        const statusMatch = filterForm.status === undefined || item.status === filterForm.status
        return (titleMatch && statusMatch) || (item.children && item.children.length > 0)
      })
  }
  return filterTree(tableData.value)
})

// 上级菜单树选项（过滤掉按钮类型）
const menuTreeOptions = computed(() => {
  const filterButtons = (list: MenuItem[]): MenuItem[] => {
    return list
      .filter((item) => item.type !== 'button')
      .map((item) => ({
        ...item,
        children: item.children ? filterButtons(item.children) : []
      }))
  }
  return filterButtons(tableData.value)
})

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref()

const defaultForm = (): MenuForm => ({
  title: '',
  type: 'menu',
  icon: '',
  path: '',
  component: '',
  permission: '',
  sort: 0,
  visible: 1,
  status: 1,
  parentId: null
})

const form = reactive<MenuForm>(defaultForm())

const formRules = {
  type: [{ required: true, message: '请选择菜单类型' }],
  title: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由地址', trigger: 'blur' }]
}

// 获取列表
const cleanChildren = (list: MenuItem[]): MenuItem[] => {
  return list.map((item) => {
    const children = item.children && item.children.length > 0 ? cleanChildren(item.children) : undefined
    return { ...item, children }
  })
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getMenuList()
    if (res.data.code === 200) {
      tableData.value = cleanChildren(res.data.data)
    }
  } catch {
    message.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  tableKey.value++
}

const handleReset = () => {
  filterForm.title = ''
  filterForm.status = undefined
  tableKey.value++
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  tableKey.value++
}

const handleAdd = (parentId?: number) => {
  dialogTitle.value = '新增菜单'
  Object.assign(form, defaultForm())
  if (parentId !== undefined) form.parentId = parentId
  dialogVisible.value = true
}

const handleEdit = (record: MenuItem) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(form, {
    id: record.id,
    title: record.title,
    type: record.type,
    icon: record.icon,
    path: record.path,
    component: record.component,
    permission: record.permission,
    sort: record.sort,
    visible: record.visible,
    status: record.status,
    parentId: record.parentId
  })
  dialogVisible.value = true
}

const handleDelete = async (record: MenuItem) => {
  try {
    const res = await deleteMenu(record.id)
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

const handleStatusChange = async (record: MenuItem, val: boolean) => {
  const status = val ? 1 : 0
  try {
    const res = await updateMenuStatus(record.id, status)
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
    const res = data.id ? await updateMenu(data as MenuForm & { id: number }) : await addMenu(data)
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
  margin-bottom: 12px;
}
</style>
