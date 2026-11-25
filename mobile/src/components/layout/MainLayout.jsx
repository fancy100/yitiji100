/**
 * MainLayout - 带底部 TabBar 的主布局
 */
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import {
  AppOutline,
  MessageOutline, MessageFill,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import styles from './MainLayout.module.css'

const tabs = [
  { key: '/home',      title: '首页',  icon: <AppOutline />,           activeIcon: <AppOutline /> },
  { key: '/workspace', title: '工作台', icon: <UnorderedListOutline />, activeIcon: <UnorderedListOutline /> },
  { key: '/message',   title: '消息',  icon: <MessageOutline />,       activeIcon: <MessageFill /> },
  { key: '/profile',   title: '我的',  icon: <UserOutline />,          activeIcon: <UserOutline /> },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const activeKey = tabs.find(t => location.pathname.startsWith(t.key))?.key || '/home'

  return (
    <div className={styles.layout}>
      <div className={styles.content}>
        <Outlet />
      </div>
      <div className={styles.tabbar}>
        <TabBar activeKey={activeKey} onChange={navigate}>
          {tabs.map(tab => (
            <TabBar.Item
              key={tab.key}
              icon={active => active ? tab.activeIcon : tab.icon}
              title={tab.title}
            />
          ))}
        </TabBar>
      </div>
    </div>
  )
}
