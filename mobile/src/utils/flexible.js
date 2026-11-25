/**
 * rem 适配：根据屏幕宽度动态设置根字体大小
 * 设计稿基准 375px，1rem = 37.5px
 */
(function () {
  function setRem() {
    const docEl = document.documentElement
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    docEl.style.fontSize = Math.min(clientWidth / 375, 2) * 37.5 + 'px'
  }
  setRem()
  window.addEventListener('resize', setRem)
})()
