'use client'

import {
  AnalyticsIcon,
  AudienceIcon,
  ChevronIcon,
  EarnIcon,
  LinkIcon,
  MenuIcon,
  ShopIcon,
} from '@/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_ITEMS } from './sidebar.constant'
import styles from './sidebar.module.css'

export const Sidebar: React.FC = () => {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.header__grid}>
          <MenuIcon className={styles.header__icon} />
          <div className={styles.header__title}>My LinkHub</div>
          <ChevronIcon className={styles.header__chevron} />
        </div>
      </header>

      <div className={styles.sidebar__content}>
        <div className={styles.section}>
          <nav className={styles.nav}>
            <ul className={styles.nav__list}>
              {SIDEBAR_ITEMS.map(item => (
                <li
                  key={item.href}
                  className={`${styles.nav__item} ${item.disabled ? styles['nav__item--disabled'] : ''}`}
                >
                  <Link
                    href={item.href}
                    className={`${styles.nav__link} ${pathname === item.href ? styles['nav__link--active'] : ''}`}
                  >
                    <span className={styles.nav__icon}>{item.icon}</span>
                    <span className={styles.nav__label}>{item.label}</span>
                    {item.badge && (
                      <span className={styles.nav__badge}>{item.badge}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </aside>
  )
}
