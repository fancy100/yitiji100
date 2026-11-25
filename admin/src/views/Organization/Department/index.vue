<template>
  <PageContainer>
    <!-- 筛选卡片 -->
    <a-card class="filter-card">
      <a-space>
        <a-input
          v-model:value="filterForm.name"
          placeholder="部门名称"
          allow-clear
          style="width: 200px"
        />
        <a-select
          v-model:value="filterForm.status"
          placeholder="部门状态"
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
          <a-button type="primary" @click="handleAdd()">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
          <a-button @click="toggleExpand">
            {{ isExpanded ? '折叠全部' : '展开全部' }}
          </a-button>
        </a-space>
        <div></div>
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
        :scroll="{ x: 1000, y: 'auto' }"
        :row-expandable="(record) => !!record.children && record.children.length > 0"
        size="middle"
      >
        <template #bodyCell="{ column, record }">
          <!-- 部门类型标签 -->
          <template v-if="column.key === 'type'">
            <a-tag v-if="record.type === 'company'" color="blue">省公司</a-tag>
            <a-tag v-else-if="record.type === 'factory'" color="green">分厂</a-tag>
            <a-tag v-else color="default">部门</a-tag>
          </template>

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
              <a-button type="link" size="small" @click="handleAdd(record.id)">新增</a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定要删除该部门吗？"
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
        <!-- 上级部门 -->
        <a-form-item label="上级部门" name="parentId">
          <a-tree-select
            v-model:value="form.parentId"
            :tree-data="departmentTreeOptions"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级部门（不选则为顶级）"
            allow-clear
            tree-default-expand-all
            style="width: 100%"
          />
        </a-form-item>

        <!-- 部门名称 -->
        <a-form-item label="部门名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入部门名称" />
        </a-form-item>

        <!-- 部门类型 -->
        <a-form-item label="部门类型" name="type">
          <a-select v-model:value="form.type" placeholder="请选择部门类型">
            <a-select-option value="company">省公司</a-select-option>
            <a-select-option value="factory">分厂</a-select-option>
            <a-select-option value="department">部门</a-select-option>
          </a-select>
        </a-form-item>

        <!-- 负责人 -->
        <a-form-item label="负责人">
          <a-select
            v-model:value="form.leaderId"
            placeholder="请选择负责人"
            allow-clear
            style="width: 100%"
          >
            <a-select-option v-for="leader in leaderOptions" :key="leader.id" :value="leader.id">
              {{ leader.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 联系电话 -->
        <a-form-item label="联系电话">
          <a-input v-model:value="form.phone" placeholder="请输入联系电话" />
        </a-form-item>

        <!-- 排序 -->
        <a-form-item label="排序">
          <a-input-number
            v-model:value="form.sort"
            :min="0"
            placeholder="0"
            style="width: 100%"
          />
          <div style="color: #999; font-size: 12px; margin-top: 4px">
            默认为0，数值越小越排前
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons-vue'
import PageContainer from '@/components/PageContainer'
import {
  getDepartmentList,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  updateDepartmentStatus,
  getLeaderList,
  type DepartmentItem,
  type DepartmentForm,
  type LeaderOption
} from '@/api/department'

// 表格列定义
const columns = [
  { title: '部门名称', dataIndex: 'name', key: 'name', width: 280 },
  { title: '部门类型', dataIndex: 'type', key: 'type', width: 100 },
  { title: '负责人', dataIndex: 'leaderName', key: 'leaderName', width: 150 },
  { title: '排序', dataIndex: 'sort', key: 'sort', width: 100, align: 'center' as const },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 110, align: 'center' as const },
  { title: '操作', key: 'action', width: 200 }
]

// 筛选
const filterForm = reactive({ name: '', status: undefined as number | undefined })

// 表格数据
const loading = ref(false)
const tableData = ref<DepartmentItem[]>([])
const isExpanded = ref(true)
const tableKey = ref(0)

// 负责人选项
const leaderOptions = ref<LeaderOption[]>([])

// 筛选后的数据
const filteredData = computed(() => {
  if (!filterForm.name && filterForm.status === undefined) return tableData.value
  const filterTree = (list: DepartmentItem[]): DepartmentItem[] => {
    return list
      .map(item => ({ ...item, children: item.children ? filterTree(item.children) : [] }))
      .filter(item => {
        const nameMatch = !filterForm.name || item.name.includes(filterForm.name)
        const statusMatch = filterForm.status === undefined || item.status === filterForm.status
        return (nameMatch && statusMatch) || (item.children && item.children.length > 0)
      })
  }
  return filterTree(tableData.value)
})

// 上级部门树选项
const departmentTreeOptions = computed(() => {
  return tableData.value
})

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref()

const defaultForm = (): DepartmentForm => ({
  name: '',
  type: 'department',
  leaderId: null,
  phone: '',
  sort: 0,
  status: 1,
  parentId: null
})

const form = reactive<DepartmentForm>(defaultForm())

const formRules = {
  parentId: [{ required: true, message: '请选择上级部门' }],
  name: [{ required: true, message: '请输入部门名称', trigger: 'blur' }]
}

// 获取列表
const cleanChildren = (list: DepartmentItem[]): DepartmentItem[] => {
  return list.map(item => {
    const children = item.children && item.children.length > 0
      ? cleanChildren(item.children)
      : undefined
    return { ...item, children }
  })
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getDepartmentList()
    if (res.data.code === 200) {
      tableData.value = cleanChildren(res.data.data)
    }
  } catch {
    message.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// 获取负责人列表
const fetchLeaders = async () => {
  try {
    const res = await getLeaderList()
    if (res.data.code === 200) {
      leaderOptions.value = res.data.data
    }
  } catch {
    message.error('获取负责人列表失败')
  }
}

const handleSearch = () => {
  tableKey.value++
}

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  tableKey.value++
}

const handleAdd = (parentId?: number) => {
  dialogTitle.value = '新增'
  Object.assign(form, defaultForm())
  if (parentId !== undefined) form.parentId = parentId
  dialogVisible.value = true
}

const handleEdit = (record: DepartmentItem) => {
  dialogTitle.value = '编辑'
  Object.assign(form, {
    id: record.id,
    name: record.name,
    type: record.type || 'department',
    leaderId: record.leaderId,
    phone: record.phone,
    sort: record.sort,
    status: record.status,
    parentId: record.parentId
  })
  dialogVisible.value = true
}

const handleDelete = async (record: DepartmentItem) => {
  try {
    const res = await deleteDepartment(record.id)
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

const handleStatusChange = async (record: DepartmentItem, val: boolean) => {
  const status = val ? 1 : 0
  try {
    const res = await updateDepartmentStatus(record.id, status)
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
      ? await updateDepartment(data as DepartmentForm & { id: number })
      : await addDepartment(data)
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

onMounted(() => {
  fetchList()
  fetchLeaders()
})
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
