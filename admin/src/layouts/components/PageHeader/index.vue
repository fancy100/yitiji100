<template>
  <div class="page-header">
    <div class="header-left">
      <a-button type="text" @click="toggleCollapsed" class="fold-btn">
        <template #icon>
          <MenuFoldOutlined v-if="!collapsed" />
          <MenuUnfoldOutlined v-else />
        </template>
      </a-button>
      <a-breadcrumb :style="{ marginLeft: '12px' }">
        <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
          {{ item.title }}
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="header-right">
      <div
        v-for="tab in tabs"
        :key="tab.path"
        :class="['tab-item', { 'tab-item-active': activeTab === tab.path }]"
        @click="handleTabClick(tab.path)"
      >
        <span class="tab-title">{{ tab.title }}</span>
        <CloseOutlined v-if="tabs.length > 1" class="tab-close" @click.stop="handleTabClose(tab.path)" />
      </div>

      <!-- 全屏切换按钮 -->
      <a-button
        type="text"
        class="fullscreen-btn"
        :title="isFullscreen ? '退出全屏' : '全屏'"
        @click="toggleFullscreen"
      >
        <template #icon>
          <FullscreenExitOutlined v-if="isFullscreen" />
          <FullscreenOutlined v-else />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue'
import type { Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { MenuFoldOutlined, MenuUnfoldOutlined, CloseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons-vue'
import { menuItems } from '@/layouts/components/AppSidebar/menuItems'

// 注入全屏状态和切换方法
const isFullscreen = inject<Ref<boolean>>('isFullscreen', ref(false))
const toggleFullscreen = inject<() => void>('toggleFullscreen', () => {})

interface Tab {
  path: string
  title: string
}

const route = useRoute()
const router = useRouter()

const emit = defineEmits(['update:collapsed'])
const props = defineProps<{
  collapsed: boolean
}>()

const tabs = ref<Tab[]>([{ path: '/dashboard', title: '仪表盘' }])

const activeTab = ref(route.path)

// 从 menuItems 动态推断当前路径的父级菜单名，无需手动维护映射表
// 新增路由只需在 menuItems.ts 中维护，面包屑自动生效
const getParentLabel = (path: string): string => {
  for (const item of menuItems) {
    if (item.children?.some((c: any) => c.key === path)) {
      return item.label
    }
  }
  return ''
}

// 面包屑：有父级时显示"父级 / 当前页"
const breadcrumbs = computed(() => {
  const path = route.path
  const title = route.meta?.title as string
  if (!title) return []
  const parent = getParentLabel(path)
  if (parent) return [{ title: parent }, { title }]
  return [{ title }]
})

const toggleCollapsed = () => {
  emit('update:collapsed', !props.collapsed)
}

const handleTabClick = (path: string) => {
  activeTab.value = path
  router.push(path)
}

const handleTabClose = (path: string) => {
  const index = tabs.value.findIndex((tab) => tab.path === path)
  if (index > -1) {
    tabs.value.splice(index, 1)
    if (activeTab.value === path && tabs.value.length > 0) {
      const nextTab = tabs.value[index] || tabs.value[index - 1]
      if (nextTab) {
        handleTabClick(nextTab.path)
      }
    }
  }
}

watch(
  () => route.path,
  (path) => {
    activeTab.value = path
    const title = route.meta?.title as string
    if (title && !tabs.value.find((tab) => tab.path === path)) {
      tabs.value.push({ path, title })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 36px;
  background: transparent;
}

.header-left {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0;
}

.fold-btn {
  padding: 4px 4px;
  height: 28px;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 6px;
  padding: 0 4px;
}

.header-right::-webkit-scrollbar {
  height: 0;
}

/* 单个 tab 项 */
.tab-item {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  font-size: 13px;
  color: #595959;
  background: transparent;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

/* hover：浅灰背景 + 边框 */
.tab-item:hover {
  background: #f5f5f5;
  border-color: #e8e8e8;
  color: #262626;
}

/* 激活态：主色填充 */
.tab-item-active {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}

.tab-item-active:hover {
  background: #1677ff;
  border-color: #1677ff;
  color: #fff;
}

/* 关闭按钮：默认不占位，hover/激活时展开 */
.tab-close {
  font-size: 10px;
  color: transparent;
  max-width: 0;
  overflow: hidden;
  margin-left: 0;
  line-height: 1;
  flex-shrink: 0;
  transition:
    max-width 0.2s ease,
    margin-left 0.2s ease,
    color 0.15s;
}

/* hover 时展开，深色（仅非激活态） */
.tab-item:not(.tab-item-active):hover .tab-close {
  max-width: 14px;
  margin-left: 4px;
  color: #595959;
}

/* 激活态始终展开，白色 */
.tab-item-active .tab-close {
  max-width: 14px;
  margin-left: 4px;
  color: #fff;
}

.tab-item-active .tab-close:hover {
  color: rgba(255, 255, 255, 0.7);
}
/* 全屏按钮 */
.fullscreen-btn {
  margin-left: auto;
  flex-shrink: 0;
  color: #8c8c8c;
}

.fullscreen-btn:hover {
  color: #262626;
  background: #f5f5f5;
}
</style>
