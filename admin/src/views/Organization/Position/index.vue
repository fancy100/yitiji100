<template>
  <PageContainer>
    <!-- 筛选卡片 -->
    <a-card class="filter-card">
      <a-space>
        <a-input v-model:value="filterForm.name" placeholder="岗位名称" allow-clear style="width: 200px" />
        <a-button type="primary" @click="handleSearch">
          <template #icon><SearchOutlined /></template>
          搜索
        </a-button>
      </a-space>
    </a-card>

    <!-- 数据卡片 -->
    <a-card class="table-card">
      <div class="action-bar">
        <a-space>
          <a-button type="primary" @click="handleAdd">
            <template #icon><PlusOutlined /></template>
            新增
          </a-button>
        </a-space>
        <div></div>
      </div>

      <a-table
        :columns="columns"
        :data-source="tableData"
        :loading="loading"
        :pagination="pagination"
        row-key="id"
        @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleEdit(record)">编辑</a-button>
              <a-popconfirm
                title="确定要删除该岗位吗？"
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
        <a-form-item label="岗位名称" name="name">
          <a-input v-model:value="form.name" placeholder="请输入岗位名称，最多50字" :maxlength="50" />
        </a-form-item>
        <a-form-item label="岗位描述">
          <a-textarea v-model:value="form.description" placeholder="请输入岗位职责描述，最多200字" :maxlength="200" :rows="4" />
        </a-form-item>
      </a-form>
    </a-modal>
  </PageContainer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue'
import PageContainer from '@/components/PageContainer'
import { getPositionList, addPosition, updatePosition, deletePosition, type PositionItem, type PositionForm } from '@/api/position'

const columns = [
  { title: '岗位名称', dataIndex: 'name', key: 'name', width: 200 },
  { title: '岗位描述', dataIndex: 'description', key: 'description' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 120, fixed: 'right' as const }
]

const filterForm = reactive({ name: '' })
const loading = ref(false)
const tableData = ref<PositionItem[]>([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条`
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const submitLoading = ref(false)
const formRef = ref()

const defaultForm = (): PositionForm => ({ name: '', description: '' })
const form = reactive<PositionForm>(defaultForm())

const formRules = {
  name: [{ required: true, message: '请输入岗位名称', trigger: 'blur' }]
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await getPositionList({ page: pagination.current, pageSize: pagination.pageSize, name: filterForm.name })
    if (res.data.code === 200) {
      tableData.value = res.data.data.list
      pagination.total = res.data.data.total
    }
  } catch {
    message.error('获取岗位列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => { pagination.current = 1; fetchList() }
const handleTableChange = (pag: any) => { pagination.current = pag.current; pagination.pageSize = pag.pageSize; fetchList() }

const handleAdd = () => {
  dialogTitle.value = '新增岗位'
  Object.assign(form, defaultForm())
  dialogVisible.value = true
}

const handleEdit = (record: PositionItem) => {
  dialogTitle.value = '编辑岗位'
  Object.assign(form, { id: record.id, name: record.name, description: record.description })
  dialogVisible.value = true
}

const handleDelete = async (record: PositionItem) => {
  try {
    const res = await deletePosition(record.id)
    if (res.data.code === 200) { message.success('删除成功'); fetchList() }
    else message.error(res.data.message || '删除失败')
  } catch { message.error('删除失败') }
}

const handleSubmit = async () => {
  try { await formRef.value?.validate() } catch { return }
  submitLoading.value = true
  try {
    const data = { ...form }
    const res = data.id ? await updatePosition(data as PositionForm & { id: number }) : await addPosition(data)
    if (res.data.code === 200) {
      message.success(data.id ? '更新成功' : '新增成功')
      dialogVisible.value = false
      fetchList()
    } else message.error(res.data.message || '操作失败')
  } catch { message.error('操作失败') }
  finally { submitLoading.value = false }
}

const resetForm = () => { formRef.value?.resetFields(); Object.assign(form, defaultForm()) }

onMounted(fetchList)
</script>

<style scoped>
.filter-card { margin-bottom: 16px; border-radius: 8px; }
.table-card { border-radius: 8px; }
.action-bar { display: flex; justify-content: space-between; margin-bottom: 12px; }
</style>
