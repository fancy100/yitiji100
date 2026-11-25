<template>
  <div class="device-status">
    <!-- 设备总数 -->
    <div class="status-item">
      <div class="status-bg">
        <img src="@/assets/dp-img/sbjk/dz1.svg" alt="" />
      </div>
      <div class="status-content">
        <div class="status-number">{{ deviceStats.total }}</div>
        <div class="status-label">设备总数</div>
      </div>
    </div>

    <!-- 离线设备数 -->
    <div class="status-item">
      <div class="status-bg">
        <img src="@/assets/dp-img/sbjk/dz1.svg" alt="" />
      </div>
      <div class="status-content">
        <div class="status-number">{{ deviceStats.offline }}</div>
        <div class="status-label">离线设备数</div>
      </div>
    </div>

    <!-- 告警设备数 -->
    <div class="status-item">
      <div class="status-bg">
        <img src="@/assets/dp-img/sbjk/dz1.svg" alt="" />
      </div>
      <div class="status-content">
        <div class="status-number">{{ deviceStats.alarm }}</div>
        <div class="status-label">告警设备数</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 设备状态监控组件
import { ref, onMounted, onUnmounted } from 'vue'

// 设备统计数据
const deviceStats = ref({
  total: 0,
  offline: 0,
  alarm: 0
})

// 模拟数据（后续对接真实API）
const mockData = {
  total: 156,
  offline: 8,
  alarm: 3
}

// 数字滚动动画
const animateNumber = (target: number, key: 'total' | 'offline' | 'alarm') => {
  const duration = 1500
  const start = 0
  const startTime = Date.now()

  const update = () => {
    const now = Date.now()
    const progress = Math.min((now - startTime) / duration, 1)
    const current = Math.floor(start + (target - start) * progress)
    deviceStats.value[key] = current

    if (progress < 1) {
      requestAnimationFrame(update)
    }
  }

  update()
}

// 获取设备统计数据
const fetchDeviceStats = () => {
  // 模拟API调用
  setTimeout(() => {
    animateNumber(mockData.total, 'total')
    animateNumber(mockData.offline, 'offline')
    animateNumber(mockData.alarm, 'alarm')
  }, 300)
}

// 定时刷新数据（每30秒）
let refreshTimer: number | null = null

onMounted(() => {
  fetchDeviceStats()
  refreshTimer = window.setInterval(fetchDeviceStats, 30000)
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style scoped>
.device-status {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.status-item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 160px;
}

.status-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.status-bg img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.status-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.status-number {
  font-size: 36px;
  font-weight: 600;
  color: #fff;
  line-height: 1;
  margin-bottom: 2px;
  margin-top: -30px;
  font-family: 'DIN', 'Arial', sans-serif;
}

.status-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 1px;
}
</style>
