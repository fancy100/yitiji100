<template>
  <div class="screen-header">
    <!-- 背景图片 -->
    <img src="@/assets/dp-img/title/top.png" class="header-bg" alt="" />

    <!-- 左侧天气 -->
    <div class="weather">
      <span class="location">{{ weather.location }}</span>
      <span class="temperature">{{ weather.temperature }}</span>
    </div>

    <!-- 中间标题 -->
    <div class="title">
      <h1>{{ title }}</h1>
    </div>

    <!-- 右侧时间 -->
    <div class="datetime">
      <span class="date">{{ currentDate }}</span>
      <span class="time">{{ currentTime }}</span>
      <span class="weekday">{{ currentWeekday }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 数字大屏顶部标题组件
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  title: string
}>()

// 天气信息
const weather = ref({
  location: '多云 山东 济南',
  temperature: '3.8°C'
})

// 时间信息
const currentDate = ref('')
const currentTime = ref('')
const currentWeekday = ref('')

let timer: number | null = null

// 更新时间
const updateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

  currentDate.value = `${year}-${month}-${day}`
  currentTime.value = `${hours}:${minutes}:${seconds}`
  currentWeekday.value = weekdays[now.getDay()]
}

onMounted(() => {
  updateTime()
  timer = window.setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.screen-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30px 40px 0;
  position: relative;
}

.header-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
  z-index: 0;
  pointer-events: none;
}

.weather {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 14px;
  position: relative;
  z-index: 1;
  margin-top: -10px;
}

.location {
  opacity: 0.9;
}

.temperature {
  font-weight: 600;
}

.title {
  position: absolute;
  left: 50%;
  top: 8px;
  transform: translateX(-50%);
  z-index: 1;
}

.title h1 {
  color: #fff;
  font-size: 26px;
  font-weight: 500;
  letter-spacing: 2px;
  margin: 0;
  white-space: nowrap;
}

.datetime {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  font-size: 14px;
  position: relative;
  z-index: 1;
  margin-top: -10px;
}

.date {
  opacity: 0.9;
}

.time {
  font-weight: 600;
  font-size: 16px;
}

.weekday {
  opacity: 0.9;
}
</style>
