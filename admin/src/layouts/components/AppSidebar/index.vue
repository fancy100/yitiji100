<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    :width="200"
    :style="{ background: '#fff' }"
    :trigger="null"
  >
    <a-menu
      v-model:selectedKeys="selectedKeys"
      v-model:openKeys="openKeys"
      theme="light"
      mode="inline"
      :items="menuItems"
      @click="handleMenuClick"
    />
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { menuItems } from './menuItems'

const route = useRoute()
const router = useRouter()

const collapsed = defineModel<boolean>('collapsed', { default: false })
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

watch(() => route.path, (path) => {
  selectedKeys.value = [path]
  // 展开当前路径对应的父菜单
  const parts = path.split('/').filter(Boolean)
  if (parts.length > 1) {
    openKeys.value = [parts[0]]
  }
}, { immediate: true })

const handleMenuClick = ({ key }: { key: string }) => {
  if (key.startsWith('/')) {
    // 查找菜单项配置
    const findMenuItem = (items: any[], targetKey: string): any => {
      for (const item of items) {
        if (item.key === targetKey) return item
        if (item.children) {
          const found = findMenuItem(item.children, targetKey)
          if (found) return found
        }
      }
      return null
    }

    const menuItem = findMenuItem(menuItems, key)

    // 如果配置了 target="_blank"，在新窗口打开
    if (menuItem?.target === '_blank') {
      window.open(key, '_blank')
    } else {
      router.push(key)
    }
  }
}
</script>

<style scoped>
:deep(.ant-layout-sider-trigger) {
  background: #fff;
  color: rgba(0, 0, 0, 0.65);
  border-top: 1px solid #f0f0f0;
}
</style>
