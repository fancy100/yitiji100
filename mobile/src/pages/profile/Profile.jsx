/**
 * Profile - 我的
 * 个人信息展示、功能菜单、退出登录
 * 使用 antd-mobile List 组件构建菜单，原生 state 控制退出确认弹窗
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { List, Toast } from 'antd-mobile'
import {
  UserOutline,
  LockOutline,
  InformationCircleOutline,
  RightOutline,
  PhonebookOutline,
  SetOutline,
} from 'antd-mobile-icons'
import { useUser } from '@/store/userStore'
import { getUserProfile } from '@/api/user'
import styles from './Profile.module.css'

export default function Profile() {
  const navigate = useNavigate()
  const { userName, userId, logout } = useUser()
  const [profile, setProfile]         = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  // 加载个人信息
  useEffect(() => {
    getUserProfile().then(res => {
      if (res.code === 200) setProfile(res.data)
    }).catch(() => {})
  }, [])

  // 退出登录确认
  const handleLogoutConfirm = () => {
    setShowConfirm(false)
    logout()
    Toast.show({ content: '已退出登录', icon: 'success' })
    navigate('/login', { replace: true })
  }

  const displayName = profile?.userName || userName || '用户'
  const initial     = displayName.charAt(0)

  return (
    <div className={styles.page}>

      {/* ── 顶部用户信息 Header ── */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>{initial}</div>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{displayName}</div>
            <div className={styles.workNo}>工号：{profile?.workNo || userId || '-'}</div>
          </div>
          {/* 编辑按钮 */}
          <button className={styles.editBtn} style={{ cursor: 'pointer' }}>
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            编辑
          </button>
        </div>

        {/* 三列统计 */}
        <div className={styles.statsRow}>
          {[
            { label: '所属部门', value: profile?.department || '-' },
            { label: '岗位',     value: profile?.position   || '-' },
            { label: '账号状态', value: profile?.status     || '正常' },
          ].map((s) => (
            <div key={s.label} className={styles.statItem}>
              <div className={styles.statValue}>{s.value}</div>
              <div className={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 功能菜单（antd-mobile List） ── */}
      <div className={styles.section}>
        <List className={styles.menuList}>
          <List.Item
            prefix={<div className={styles.menuIcon} style={{ background: '#EBF3FF', color: '#1677FF' }}><UserOutline fontSize={18} /></div>}
            arrow
            clickable
            description="查看和编辑个人信息"
          >
            个人资料
          </List.Item>
          <List.Item
            prefix={<div className={styles.menuIcon} style={{ background: '#F0EDFF', color: '#7B61FF' }}><LockOutline fontSize={18} /></div>}
            arrow
            clickable
            description="定期更换密码保障安全"
          >
            修改密码
          </List.Item>
          <List.Item
            prefix={<div className={styles.menuIcon} style={{ background: '#F0F9FF', color: '#0EA5E9' }}><PhonebookOutline fontSize={18} /></div>}
            arrow
            clickable
            description="联系管理员或技术支持"
          >
            联系我们
          </List.Item>
          <List.Item
            prefix={<div className={styles.menuIcon} style={{ background: '#F0FDF4', color: '#00B42A' }}><InformationCircleOutline fontSize={18} /></div>}
            arrow
            clickable
            description="版本 1.0.0 · 移动端原型框架"
          >
            关于应用
          </List.Item>
        </List>
      </div>

      {/* ── 系统设置 ── */}
      <div className={styles.section}>
        <List className={styles.menuList}>
          <List.Item
            prefix={<div className={styles.menuIcon} style={{ background: '#FFF7ED', color: '#FF7D00' }}><SetOutline fontSize={18} /></div>}
            arrow
            clickable
            description="通知、隐私、显示设置"
          >
            系统设置
          </List.Item>
        </List>
      </div>

      {/* ── 退出登录 ── */}
      <div className={styles.logoutWrap}>
        <button
          className={styles.logoutBtn}
          onClick={() => setShowConfirm(true)}
          style={{ cursor: 'pointer' }}
        >
          退出登录
        </button>
      </div>

      {/* ── 版本号 ── */}
      <div className={styles.versionText}>移动端原型框架 v1.0.0</div>

      {/* ── 退出确认弹窗（原生实现，兼容 React 18） ── */}
      {showConfirm && (
        <div className={styles.mask} onClick={() => setShowConfirm(false)}>
          <div className={styles.dialog} onClick={e => e.stopPropagation()}>
            <div className={styles.dialogTitle}>退出登录</div>
            <div className={styles.dialogContent}>确定要退出登录吗？</div>
            <div className={styles.dialogActions}>
              <button className={styles.dialogCancel} onClick={() => setShowConfirm(false)}>
                取消
              </button>
              <button className={styles.dialogConfirm} onClick={handleLogoutConfirm}>
                退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
