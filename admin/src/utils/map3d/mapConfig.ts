const Depth = 6

export const mapConfig = {
  // 地图挤出厚度
  mapDepth: Depth,
  // 地图透明度
  mapTransparent: true,
  mapOpacity: 0.9,
  // 地图颜色
  mapColor: '#1a3a5c', // 地图原本颜色（深蓝色）
  mapHoverColor: '#5eb3f6', // 地图hover颜色（亮蓝色）
  // 地图人数渐变（深蓝到浅蓝渐变）
  mapColorGradient: ['#5eb3f6', '#4a9de5', '#3681c9', '#2a5a8f'],
  // 地图侧面渐变
  mapSideColor1: '#4a9de5',
  mapSideColor2: '#2a5a8f',
  // 上面的line
  topLineColor: 0x41c0fb,
  topLineWidth: 3,
  topLineZIndex: Depth + 0.5,
  // label 2d高度
  label2dZIndex: Depth + 2,
  // spot
  spotZIndex: Depth + 0.2
}
