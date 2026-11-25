<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="login-box">
        <div class="login-left">
          <div class="brand">
            <SafetyOutlined class="brand-icon" />
            <h1>WEB端原型框架</h1>
            <p>快速生成管理后台原型</p>
          </div>
        </div>
        <div class="login-right">
          <div class="form-wrapper">
            <h2 style="margin: 0 0 8px 0">登录</h2>
            <p class="form-desc">WEB端原型框架</p>
            <a-form :model="form" @finish="handleLogin">
              <a-form-item name="username" :rules="[{ required: true, message: '请输入用户名' }]">
                <a-input v-model:value="form.username" placeholder="用户名" size="large">
                  <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input>
              </a-form-item>
              <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="form.password" placeholder="密码" size="large">
                  <template #prefix><LockOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
                </a-input-password>
              </a-form-item>
              <a-form-item>
                <a-checkbox v-model:checked="remember">记住密码</a-checkbox>
              </a-form-item>
              <a-form-item style="margin-bottom: 0">
                <a-button type="primary" html-type="submit" :loading="loading" block size="large"> 登 录 </a-button>
              </a-form-item>
            </a-form>
            <a-alert message="默认账号：admin / 123456" type="info" show-icon style="margin-top: 20px" />
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">© 2026 WEB端原型框架 版权所有</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons-vue'
import { login } from '@/api/auth'

const router = useRouter()
const form = ref({ username: 'admin', password: '123456' })
const loading = ref(false)
const remember = ref(false)

const handleLogin = async () => {
  loading.value = true
  try {
    const { data } = await login(form.value)
    if (data.code === 200) {
      localStorage.setItem('token', data.data.token)
      localStorage.setItem('username', data.data.username)
      message.success('登录成功')
      router.push('/')
    } else {
      message.error(data.message)
    }
  } catch (error) {
    message.error('登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  padding: 20px;
  position: relative;
}

.login-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.login-box {
  display: flex;
  width: 100%;
  max-width: 700px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.login-left {
  flex: 1;
  background: #1890ff;
  padding: 40px 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand {
  text-align: center;
  color: white;
}

.brand-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
}

.brand h1 {
  font-size: 32px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: white;
  font-family:
    Sora,
    Noto Sans SC,
    sans-serif;
}

.brand p {
  font-size: 14px;
  margin: 0;
  opacity: 0.95;
}

.login-right {
  flex: 1;
  padding: 40px 35px;
  display: flex;
  align-items: center;
}

.form-wrapper {
  width: 100%;
}

.form-wrapper h2 {
  font-size: 22px;
  font-weight: 500;
  color: #262626;
}

.form-desc {
  font-size: 13px;
  color: #8c8c8c;
  margin: 0 0 24px 0;
}

.copyright {
  text-align: center;
  color: #8c8c8c;
  font-size: 14px;
  padding: 20px;
}

@media (max-width: 768px) {
  .login-box {
    flex-direction: column;
    max-width: 400px;
  }

  .login-left {
    padding: 40px 30px;
  }

  .login-right {
    padding: 40px 30px;
  }
}
</style>
