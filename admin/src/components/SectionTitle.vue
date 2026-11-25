<template>
  <div class="section-title">
    <div class="title-content">
      <span class="arrow">▶</span>
      <span class="text">{{ title }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
// 数字大屏小标题组件
defineProps<{
  title: string
}>()
</script>

<style scoped>
.section-title {
  width: 380px;
  height: 40px;
  background-image: url('@/assets/dp-img/title/xiao-title.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.title-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow {
  color: #fff;
  font-size: 12px;
  opacity: 0.9;
}

.text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1px;
}
</style>
