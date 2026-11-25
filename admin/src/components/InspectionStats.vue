<template>
  <div class="inspection-stats">
    <!-- 任务统计图表 -->
    <div class="chart-container">
      <div ref="taskChartRef" class="chart"></div>
    </div>

    <!-- 完成率趋势图 -->
    <div class="chart-container">
      <div class="chart-header">
        <span class="chart-title">完成率趋势</span>
        <div class="time-range">
          <span
            :class="{ active: timeRange === '7days' }"
            @click="switchTimeRange('7days')"
          >近7天</span>
          <span
            :class="{ active: timeRange === '30days' }"
            @click="switchTimeRange('30days')"
          >近30天</span>
        </div>
      </div>
      <div ref="trendChartRef" class="chart"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 巡检统计组件
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { ECharts } from 'echarts'

// 图表实例
let taskChart: ECharts | null = null
let trendChart: ECharts | null = null

// 图表容器引用
const taskChartRef = ref<HTMLElement>()
const trendChartRef = ref<HTMLElement>()

// 时间范围
const timeRange = ref<'7days' | '30days'>('7days')

// 模拟数据
const taskData = {
  total: 45,
  completed: 32,
  ongoing: 8,
  pending: 3,
  timeout: 2
}

const trendData7days = {
  dates: ['04-19', '04-20', '04-21', '04-22', '04-23', '04-24', '04-25'],
  rates: [85, 88, 92, 87, 90, 93, 89]
}

const trendData30days = {
  dates: ['03-26', '03-29', '04-01', '04-04', '04-07', '04-10', '04-13', '04-16', '04-19', '04-22', '04-25'],
  rates: [82, 85, 87, 84, 88, 86, 90, 89, 91, 88, 89]
}

// 初始化任务统计图表
const initTaskChart = () => {
  if (!taskChartRef.value) return

  taskChart = echarts.init(taskChartRef.value)

  const option = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4fc3f7',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      }
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [
      {
        name: '任务统计',
        type: 'pie',
        radius: ['40%', '65%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.5)',
          borderWidth: 2
        },
        label: {
          show: true,
          position: 'center',
          formatter: () => {
            return `{total|${taskData.total}}\n{label|今日任务总数}`
          },
          rich: {
            total: {
              fontSize: 32,
              fontWeight: 600,
              color: '#fff',
              lineHeight: 40,
              fontFamily: 'DIN, Arial'
            },
            label: {
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 20
            }
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: taskData.completed, name: '已完成', itemStyle: { color: '#4caf50' } },
          { value: taskData.ongoing, name: '进行中', itemStyle: { color: '#2196f3' } },
          { value: taskData.pending, name: '未开始', itemStyle: { color: '#9e9e9e' } },
          { value: taskData.timeout, name: '超时', itemStyle: { color: '#f44336' } }
        ]
      }
    ]
  }

  taskChart.setOption(option)
}

// 初始化趋势图表
const initTrendChart = () => {
  if (!trendChartRef.value) return

  trendChart = echarts.init(trendChartRef.value)
  updateTrendChart()
}

// 更新趋势图表
const updateTrendChart = () => {
  if (!trendChart) return

  const data = timeRange.value === '7days' ? trendData7days : trendData30days

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#4fc3f7',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      formatter: (params: any) => {
        const param = params[0]
        return `${param.name}<br/>${param.marker}完成率: ${param.value}%`
      }
    },
    grid: {
      left: '10%',
      right: '5%',
      top: '15%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.dates,
      axisLine: {
        lineStyle: {
          color: 'rgba(79, 195, 247, 0.3)'
        }
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {
        show: false
      },
      axisLabel: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 11,
        formatter: '{value}%'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(79, 195, 247, 0.1)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        name: '完成率',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: '#4fc3f7',
          width: 2
        },
        itemStyle: {
          color: '#4fc3f7',
          borderColor: '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(79, 195, 247, 0.3)' },
              { offset: 1, color: 'rgba(79, 195, 247, 0.05)' }
            ]
          }
        },
        data: data.rates
      }
    ]
  }

  trendChart.setOption(option)
}

// 切换时间范围
const switchTimeRange = (range: '7days' | '30days') => {
  timeRange.value = range
  updateTrendChart()
}

// 窗口大小变化时重新调整图表
const handleResize = () => {
  taskChart?.resize()
  trendChart?.resize()
}

// 定时刷新数据（每30秒）
let refreshTimer: number | null = null

onMounted(async () => {
  await nextTick()
  initTaskChart()
  initTrendChart()

  window.addEventListener('resize', handleResize)

  // 模拟数据刷新
  refreshTimer = window.setInterval(() => {
    // 这里可以调用API获取最新数据并更新图表
  }, 30000)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)

  if (refreshTimer) {
    clearInterval(refreshTimer)
  }

  taskChart?.dispose()
  trendChart?.dispose()
})
</script>

<style scoped>
.inspection-stats {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.chart-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15px;
  min-height: 0;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chart-title {
  font-size: 14px;
  color: #fff;
}

.time-range {
  display: flex;
  gap: 10px;
}

.time-range span {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 3px;
  transition: all 0.3s;
}

.time-range span:hover {
  color: #fff;
  background: rgba(79, 195, 247, 0.2);
}

.time-range span.active {
  color: #4fc3f7;
  background: rgba(79, 195, 247, 0.2);
}

.chart {
  flex: 1;
  min-height: 0;
}
</style>
