<template>
  <div class="app-header">
    <div class="header-left">
      <h1 class="logo">WEB端原型框架</h1>
    </div>
    <div class="header-right">
      <a-space :size="16">
        <a-button type="text" @click="$emit('openSettings')">
          <template #icon><SettingOutlined /></template>
        </a-button>
        <a-dropdown>
          <a-space style="cursor: pointer">
            <UserOutlined />
            <span>{{ username }}</span>
          </a-space>
          <template #overlay>
            <a-menu>
              <a-menu-item @click="handleLogout">
                <LogoutOutlined />
                <span>退出登录</span>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { logout } from '@/api/auth'

defineEmits(['openSettings'])

const router = useRouter()
const username = ref(localStorage.getItem('username') || 'Admin')

const handleLogout = async () => {
  try {
    await logout()
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    message.success('退出成功')
    router.push('/login')
  } catch (error) {
    message.error('退出失败')
  }
}
</script>

<style scoped>
.app-header {
  height: 55px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  background: #1677ff;
  border-bottom: none;
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  font-family:
    Sora,
    Noto Sans SC,
    sans-serif;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.85);
}

.header-right :deep(.ant-btn-text) {
  color: rgba(255, 255, 255, 0.85);
}

.header-right :deep(.ant-btn-text:hover) {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

.header-right :deep(.anticon),
.header-right :deep(span) {
  color: rgba(255, 255, 255, 0.85);
}
</style>
