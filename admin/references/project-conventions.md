# 项目规范

## 项目信息

- **项目名称**：WEB端原型框架
- **技术栈**：Vue 3 + TypeScript + Ant Design Vue 4.x + Vite
- **端口**：3800

## 目录结构

```
src/
  api/          # API 接口定义（TypeScript）
  views/        # 页面组件，按模块分目录
    Dashboard/  # 工作台
    Equipment/  # 设备管理（Archive/Category/Vendor）
    Basic/      # 基础设置（InspectionPoint/InspectionRoute）
    Inspection/ # 巡检管理（Plan/Task/Checklist）
    Rectification/ # 整改管理（Workorder/Statistics）
    Organization/  # 组织管理（Department/User/Position）
    Permission/    # 权限管理（Menu/Role）
  layouts/      # 布局组件
  components/   # 公共组件（PageContainer 等）
  router/       # 路由（modules/ 下按模块拆分）
mock/           # Mock 数据（vite-plugin-mock）
```

## 路由规范

- 模块化路由：`src/router/modules/` 下每个模块一个文件
- 在 `src/router/index.ts` 中 import 并展开到 children
- 路由路径与菜单 key 保持一致

## 导航规范

- 侧边栏菜单配置在 `src/layouts/components/AppSidebar/menuItems.ts`
- 新增路由只需在此文件维护，无需修改其他文件

## 布局规范

### 滚动条
- 滚动条放在 `a-layout`（内容区外层），不放在 `a-layout-content` 或页面组件内
- `a-layout-content` 只设 `margin: 16px`，不设 `overflow` 和 `height`
- 页面组件不设 `overflow: auto`，滚动条贴浏览器边缘

### 水平滚动
- 内容区 `a-layout` 加 `overflow-x: hidden` 防止横向滚动条

### 图表容器（echarts）
- 不能用 `height: 100%`，父容器无明确像素高度时解析为 0
- 正确做法一：给容器设固定像素高度（如 `height: 220px`）
- 正确做法二：用 `ResizeObserver` 监听容器，有实际高度时再 init 和 resize
- 不要在图表容器外套 `a-spin`，会多一层 div 导致 `height: 100%` 失效

### 图表卡片撑满高度
- 卡片加 `display: flex; flex-direction: column`
- 用 `:deep(.ant-card-body)` 设 `flex: 1; min-height: 0; display: flex; flex-direction: column`
- 图表容器设 `flex: 1; min-height: 160px`

## 代码风格

- 使用 `<script setup lang="ts">` 组合式 API
- 组件顶部注释说明用途
- 功能块之间加注释分隔
- 样式写在 `<style scoped>` 中
