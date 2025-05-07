'use client'

import { signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { UserImage } from '../user-image'
import styles from './user-menu.module.css'

export const UserMenu = () => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (!session) return null

  return (
    <div className={styles.container} ref={menuRef}>
      <UserImage
        onClick={() => setIsOpen(true)}
        src={
          session.user?.image ??
          'https://ugc.production.linktr.ee/c848e59a-79c6-4e0a-bcfc-4e6e291b8112_untitled.webp?io=true&size=avatar'
        }
        size={32}
      />

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <p className={styles.userName}>
              {session.user?.username || 'User'}
            </p>
            <p className={styles.userEmail}>{session.user?.email}</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.divider} />

          <div className={styles.menuFooter}>
            <button
              className={styles.logoutButton}
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
