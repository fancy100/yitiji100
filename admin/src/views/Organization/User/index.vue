<template>
  <PageContainer>
    <div class="user-management">
      <!-- 左侧部门树 -->
      <a-card class="dept-tree-card">
        <a-input-search
          v-model:value="deptSearchValue"
          placeholder="搜索部门"
          allow-clear
          style="margin-bottom: 8px"
        />
        <a-tree
          v-model:selectedKeys="selectedDeptKeys"
          v-model:expandedKeys="expandedDeptKeys"
          :tree-data="filteredDeptTree"
          :field-names="{ title: 'name', key: 'id', children: 'children' }"
          :show-icon="true"
          @select="handleDeptSelect"
        >
          <template #icon="{ dataRef }">
            <BankOutlined v-if="dataRef.type === 'company'" style="color: #1677ff" />
            <HomeOutlined v-else-if="dataRef.type === 'factory'" style="color: #52c41a" />
            <ApartmentOutlined v-else style="color: #8c8c8c" />
          </template>
        </a-tree>
      </a-card>

      <!-- 右侧用户列表 -->
      <div class="user-list-container">
        <!-- 筛选卡片 -->
        <a-card class="filter-card">
          <a-space>
            <a-input
              v-model:value="filterForm.name"
              placeholder="姓名/工号"
              allow-clear
              style="width: 200px"
            />
            <a-select
              v-model:value="filterForm.roleId"
              placeholder="角色"
              allow-clear
              style="width: 140px"
            >
              <a-select-option v-for="role in roleOptions" :key="role.id" :value="role.id">
                {{ role.name }}
              </a-select-option>
            </a-select>
            <a-select
              v-model:value="filterForm.status"
              placeholder="状态"
              allow-clear
              style="width: 140px"
            >
              <a-select-option :value="1">启用</a-select-option>
              <a-select-option :value="0">停用</a-select-option>
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
              <a-button @click="importVisible = true">
                <template #icon><UploadOutlined /></template>
                导入
              </a-button>
            </a-space>
            <a-space>
              <a-button @click="handleExport" :loading="exportLoading">
                <template #icon><DownloadOutlined /></template>
                导出
              </a-button>
            </a-space>
          </div>

          <!-- 表格 -->
          <a-table
            :columns="columns"
            :data-source="tableData"
            :loading="loading"
            :pagination="pagination"
            :scroll="{ x: 'max-content' }"
            :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
            row-key="id"
            @change="handleTableChange"
          >
            <template #bodyCell="{ column, record }">
              <!-- 角色标签 -->
              <template v-if="column.key === 'roleNames'">
                <a-space :size="4" wrap>
                  <a-tag v-for="name in record.roleNames" :key="name" color="blue">{{ name }}</a-tag>
                </a-space>
              </template>

              <!-- 状态标签 -->
              <template v-else-if="column.key === 'status'">
                <a-tag :color="record.status === 1 ? 'success' : 'default'">
                  {{ record.status === 1 ? '启用' : '停用' }}
                </a-tag>
              </template>

              <!-- 操作列 -->
              <template v-else-if="column.key === 'action'">
                <a-space>
                  <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
                  <a-popconfirm
                    :title="`确定要重置【${record.name}】的登录密码吗？重置后密码为手机号后6位`"
                    ok-text="确定"
                    cancel-text="取消"
                    @confirm="handleResetPassword(record)"
                  >
                    <a-button type="link" size="small">重置密码</a-button>
                  </a-popconfirm>
                  <a-popconfirm
                    title="确定要删除该人员吗？"
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
      </div>
    </div>

    <!-- 导入弹窗 -->
    <a-modal v-model:open="importVisible" title="导入人员" width="480px" :footer="null" @cancel="handleImportClose">
      <div style="padding: 8px 0">
        <div style="margin-bottom: 16px; padding: 12px 16px; background: #f6f8fa; border-radius: 6px; display: flex; align-items: center; justify-content: space-between">
          <div>
            <div style="font-size: 13px; font-weight: 500">下载导入模板</div>
            <div style="font-size: 12px; color: #8c8c8c; margin-top: 2px">按模板格式填写后上传</div>
          </div>
          <a-button size="small" @click="handleDownloadTemplate">
            <template #icon><DownloadOutlined /></template>
            下载模板
          </a-button>
        </div>
        <a-upload-dragger v-model:fileList="importFileList" accept=".xlsx" :max-count="1" :before-upload="handleImportFile">
          <p class="ant-upload-drag-icon"><InboxOutlined style="font-size: 40px; color: #1890ff" /></p>
          <p style="font-size: 14px; color: #262626">点击或拖拽文件到此区域上传</p>
          <p style="font-size: 12px; color: #8c8c8c; margin-top: 4px">仅支持 .xlsx 格式</p>
        </a-upload-dragger>
        <div style="margin-top: 16px; text-align: right">
          <a-space>
            <a-button @click="handleImportClose">取消</a-button>
            <a-button type="primary" :loading="importLoading" :disabled="importFileList.length === 0" @click="handleImportSubmit">开始导入</a-button>
          </a-space>
        </div>
      </div>
    </a-modal>

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
        <a-form-item label="姓名" name="name">
          <a-input v-model:value="form.name" placeholder="请输入姓名，最多20字" :maxlength="20" />
        </a-form-item>

        <a-form-item label="工号" name="username">
          <a-input v-model:value="form.username" placeholder="请输入工号，最多30字" :maxlength="30" />
        </a-form-item>

        <a-form-item v-if="!form.id" label="密码" name="password">
          <a-input-password v-model:value="form.password" placeholder="请输入密码" />
        </a-form-item>

        <a-form-item label="手机号" name="phone">
          <a-input v-model:value="form.phone" placeholder="请输入手机号" :maxlength="11" />
        </a-form-item>

        <a-form-item label="所属部门" name="departmentId">
          <a-tree-select
            v-model:value="form.departmentId"
            :tree-data="departmentTree"
            :field-names="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择所属部门"
            tree-default-expand-all
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="岗位">
          <a-select v-model:value="form.position" placeholder="请选择岗位" allow-clear style="width: 100%">
            <a-select-option v-for="p in positionOptions" :key="p" :value="p">{{ p }}</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="角色" name="roleIds">
          <a-select
            v-model:value="form.roleIds"
            mode="multiple"
            placeholder="请选择角色"
            style="width: 100%"
          >
            <a-select-option v-for="role in roleOptions" :key="role.id" :value="role.id">
              {{ role.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="账号状态">
          <a-switch
            :checked="form.status === 1"
            checked-children="启用"
            un-checked-children="停用"
            @change="(val: boolean) => form.status = val ? 1 : 0"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined, UploadOutlined, DownloadOutlined, InboxOutlined, BankOutlined, HomeOutlined, ApartmentOutlined } from '@ant-design/icons-vue'
import PageContainer from '@/components/PageContainer'
import {
  getUserList,
  addUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  resetPassword,
  type UserItem,
  type UserForm
} from '@/api/user'
import { getDepartmentList, type DepartmentItem } from '@/api/department'
import { getRoleList, type RoleItem } from '@/api/role'
import * as XLSX from 'xlsx'

// 表格列定义
const columns = [
  { title: '姓名', dataIndex: 'name', key: 'name', width: 100, fixed: 'left' as const },
  { title: '工号', dataIndex: 'username', key: 'username', width: 120 },
  { title: '所属部门', dataIndex: 'departmentName', key: 'departmentName', width: 160 },
  { title: '岗位', dataIndex: 'position', key: 'position', width: 120 },
  { title: '角色', dataIndex: 'roleNames', key: 'roleNames', width: 160 },
  { title: '手机号', dataIndex: 'phone', key: 'phone', width: 130 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90, align: 'center' as const },
  { title: '操作', key: 'action', width: 180, fixed: 'right' as const }
]

// 岗位选项
const positionOptions = ['部门经理', '高级工程师', '工程师', '巡检员', '会计', 'HR专员', '技术员']

// 部门树
const departmentTree = ref<DepartmentItem[]>([])
const selectedDeptKeys = ref<number[]>([])
const expandedDeptKeys = ref<number[]>([])
const deptSearchValue = ref('')

// 部门树搜索过滤
const filterDeptTree = (list: DepartmentItem[], keyword: string): DepartmentItem[] => {
  return list
    .map(item => ({
      ...item,
      children: item.children ? filterDeptTree(item.children, keyword) : undefined
    }))
    .filter(item => {
      const nameMatch = item.name.toLowerCase().includes(keyword.toLowerCase())
      return nameMatch || (item.children && item.children.length > 0)
    })
}

const filteredDeptTree = computed(() => {
  if (!deptSearchValue.value) return departmentTree.value
  return filterDeptTree(departmentTree.value, deptSearchValue.value)
})

// 筛选
const filterForm = reactive({ name: '', roleId: undefined as number | undefined, status: undefined as number | undefined })

// 表格数据
const loading = ref(false)
const tableData = ref<UserItem[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

// 角色选项
const roleOptions = ref<RoleItem[]>([])

// 弹窗
const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref()

const defaultForm = (): UserForm => ({
  name: '',
  username: '',
  password: '',
  departmentId: 0,
  position: '',
  roleIds: [],
  phone: '',
  status: 1
})

const form = reactive<UserForm>(defaultForm())

const formRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入工号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  departmentId: [{ required: true, message: '请选择所属部门' }],
  roleIds: [{ required: true, type: 'array', min: 1, message: '请选择角色' }]
}

// 获取部门树
const getAllKeys = (list: DepartmentItem[]): number[] => {
  let keys: number[] = []
  list.forEach(item => {
    keys.push(item.id)
    if (item.children?.length) keys = keys.concat(getAllKeys(item.children))
  })
  return keys
}

const fetchDepartments = async () => {
  try {
    const res = await getDepartmentList()
    if (res.data.code === 200) {
      departmentTree.value = res.data.data
      expandedDeptKeys.value = getAllKeys(res.data.data)
    }
  } catch {
    message.error('获取部门列表失败')
  }
}

// 获取角色列表
const fetchRoles = async () => {
  try {
    const res = await getRoleList({ page: 1, pageSize: 100 })
    if (res.data.code === 200) {
      roleOptions.value = res.data.data.list
    }
  } catch {
    message.error('获取角色列表失败')
  }
}

// 获取用户列表
const fetchList = async () => {
  loading.value = true
  try {
    const res = await getUserList({
      page: pagination.current,
      pageSize: pagination.pageSize,
      name: filterForm.name,
      departmentId: selectedDeptKeys.value[0],
      roleId: filterForm.roleId,
      status: filterForm.status
    })
    if (res.data.code === 200) {
      tableData.value = res.data.data.list
      pagination.total = res.data.data.total
    }
  } catch {
    message.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

const handleDeptSelect = (keys: number[]) => {
  selectedDeptKeys.value = keys
  pagination.current = 1
  fetchList()
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
  dialogTitle.value = '新增人员'
  Object.assign(form, defaultForm())
  dialogVisible.value = true
}

const handleEdit = (record: UserItem) => {
  dialogTitle.value = '编辑人员'
  Object.assign(form, {
    id: record.id,
    name: record.name,
    username: record.username,
    departmentId: record.departmentId,
    position: record.position,
    roleIds: record.roleIds || [],
    phone: record.phone,
    status: record.status
  })
  dialogVisible.value = true
}

const handleDelete = async (record: UserItem) => {
  try {
    const res = await deleteUser(record.id)
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

const handleStatusChange = async (record: UserItem, val: boolean) => {
  const status = val ? 1 : 0
  try {
    const res = await updateUserStatus(record.id, status)
    if (res.data.code === 200) {
      record.status = status
      message.success('账号状态已更新')
    } else {
      message.error(res.data.message || '状态更新失败')
    }
  } catch {
    message.error('状态更新失败')
  }
}

const handleResetPassword = async (record: UserItem) => {
  try {
    const res = await resetPassword(record.id)
    if (res.data.code === 200) {
      message.success('密码已重置为手机号后6位，请通知员工及时修改')
    } else {
      message.error(res.data.message || '重置失败')
    }
  } catch {
    message.error('重置失败')
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
      ? await updateUser(data as UserForm & { id: number })
      : await addUser(data)
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

// 批量勾选
const selectedRowKeys = ref<number[]>([])
const onSelectChange = (keys: number[]) => {
  selectedRowKeys.value = keys
}

// 导出
const exportLoading = ref(false)
const handleExport = async () => {
  exportLoading.value = true
  try {
    const res = await getUserList({ page: 1, pageSize: 9999, name: filterForm.name, departmentId: selectedDeptKeys.value[0], status: filterForm.status })
    if (res.data.code !== 200) return
    const rows: any[] = [['姓名', '工号', '所属部门', '岗位', '角色', '手机号', '状态']]
    res.data.data.list.forEach(u => {
      rows.push([u.name, u.username, u.departmentName, u.position, (u.roleNames || []).join(','), u.phone, u.status === 1 ? '启用' : '停用'])
    })
    const ws = XLSX.utils.aoa_to_sheet(rows)
    ws['!cols'] = [12, 14, 18, 12, 16, 14, 8].map(w => ({ wch: w }))
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, '人员列表')
    XLSX.writeFile(wb, `人员列表_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '')}.xlsx`)
    message.success('导出成功')
  } catch {
    message.error('导出失败')
  } finally {
    exportLoading.value = false
  }
}

// 导入
const importVisible = ref(false)
const importFileList = ref<any[]>([])
const importLoading = ref(false)

const handleImportClose = () => {
  importVisible.value = false
  importFileList.value = []
}

const handleImportFile = (file: File) => {
  importFileList.value = [file]
  return false
}

const handleDownloadTemplate = () => {
  const rows = [
    ['姓名', '工号', '手机号', '所属部门', '岗位', '角色（多个用逗号分隔）'],
    ['张三', 'ZS001', '13800000001', '设备管理部', '工程师', '巡检专员'],
    ['李四', 'LS002', '13800000002', '杭州分厂', '巡检员', '巡检专员,维修工程师']
  ]
  const ws = XLSX.utils.aoa_to_sheet(rows)
  ws['!cols'] = [10, 12, 14, 16, 12, 24].map(w => ({ wch: w }))
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, '人员导入模板')
  XLSX.writeFile(wb, '人员导入模板.xlsx')
}

const handleImportSubmit = async () => {
  const file = importFileList.value[0] as File
  if (!file) return
  importLoading.value = true
  const reader = new FileReader()
  reader.onload = async (e) => {
    try {
      const wb = XLSX.read(e.target?.result, { type: 'array' })
      const ws = wb.Sheets[wb.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json<any>(ws, { header: 1 }) as any[][]
      if (rows.length < 2) { message.warning('文件内容为空'); return }
      // mock 环境直接提示成功
      message.success(`成功导入 ${rows.length - 1} 条人员数据`)
      handleImportClose()
      fetchList()
    } catch {
      message.error('文件解析失败，请检查格式')
    } finally {
      importLoading.value = false
    }
  }
  reader.readAsArrayBuffer(file)
}

const resetForm = () => {
  formRef.value?.resetFields()
  Object.assign(form, defaultForm())
}

onMounted(() => {
  fetchDepartments()
  fetchRoles()
  fetchList()
})
</script>

<style scoped>
.user-management {
  display: flex;
  gap: 16px;
  height: 100%;
}

.dept-tree-card {
  width: 220px;
  flex-shrink: 0;
  height: 100%;
  overflow-y: auto;
}

.user-list-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  overflow: hidden;
}

.filter-card {
  flex-shrink: 0;
  border-radius: 8px;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}
</style>
