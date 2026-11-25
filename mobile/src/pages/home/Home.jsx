/**
 * Home - 首页（功能开发中）
 */
import styles from './Home.module.css'

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.placeholder}>
        <svg viewBox="0 0 64 64" fill="none" width="56" height="56">
          <circle cx="32" cy="32" r="30" fill="#EBF3FF" />
          <path d="M20 32h24M32 20v24" stroke="#1677FF" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <p className={styles.title}>首页</p>
        <p className={styles.desc}>功能设计中</p>
      </div>
    </div>
  )
}
