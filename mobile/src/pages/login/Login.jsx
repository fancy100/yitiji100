/**
 * Login - 登录页
 * 移动端原型框架移动端登录
 * 账号 + 密码登录，深色渐变背景 + 毛玻璃卡片风格
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { useUser } from '@/store/userStore'
import styles from './Login.module.css'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useUser()
  const [account, setAccount]   = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!account.trim())  { Toast.show({ content: '请输入账号', icon: 'fail' }); return }
    if (!password.trim()) { Toast.show({ content: '请输入密码', icon: 'fail' }); return }

    setLoading(true)
    try {
      const res = await login(account.trim(), password)
      if (res.code === 200) {
        Toast.show({ content: '登录成功', icon: 'success' })
        navigate('/home', { replace: true })
      } else {
        Toast.show({ content: res.message || '账号或密码错误', icon: 'fail' })
      }
    } catch {
      Toast.show({ content: '登录失败，请重试', icon: 'fail' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      {/* 背景装饰 */}
      <div className={styles.bgOrb1} />
      <div className={styles.bgOrb2} />

      {/* Logo 区域 */}
      <div className={styles.header}>
        <div className={styles.logoWrap}>
          {/* 盾牌 + 对勾图标 */}
          <svg viewBox="0 0 48 48" fill="none" width="40" height="40">
            <path
              d="M24 4L8 11v12c0 10.5 7 20.3 16 23 9-2.7 16-12.5 16-23V11L24 4z"
              fill="rgba(255,255,255,0.9)"
            />
            <path
              d="M17 24l5 5 9-9"
              stroke="#1677FF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className={styles.title}>移动端原型框架</h1>
        <p className={styles.subtitle}>快速构建移动端应用原型</p>
      </div>

      {/* 登录卡片 */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>账号登录</h2>
          <p className={styles.cardDesc}>请使用您的工号和密码登录</p>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          {/* 账号 */}
          <div className={styles.fieldWrap}>
            <label className={styles.label}>账号</label>
            <div className={styles.inputWrap}>
              <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <input
                className={styles.input}
                type="text"
                placeholder="请输入工号或账号"
                value={account}
                onChange={e => setAccount(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          {/* 密码 */}
          <div className={styles.fieldWrap}>
            <label className={styles.label}>密码</label>
            <div className={styles.inputWrap}>
              <svg className={styles.inputIcon} viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                className={styles.input}
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* 登录按钮 */}
          <button
            type="submit"
            className={styles.submitBtn}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingWrap}>
                <span className={styles.spinner} />
                登录中...
              </span>
            ) : '登 录'}
          </button>
        </form>
      </div>

      {/* 底部安全提示 */}
      <div className={styles.footer}>
        <span className={styles.footerDot} />
        安全登录 · 数据加密传输
      </div>
    </div>
  )
}
