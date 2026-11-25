import { createApp } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/reset.css'
import '@/assets/styles/reset.scss'
import '@/assets/styles/antd-override.scss'
import '@/assets/styles/sidebar.scss'
import '@/assets/styles/global.scss'

// Mock 开关：通过 .env 文件的 VITE_USE_MOCK 控制
import './mock/setup'

import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(Antd)
app.use(router)
app.mount('#app')
