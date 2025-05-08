'use client'

import { DEFAULT_USER_IMAGE } from '@/constant/app.constant'
import { useQuery } from '@tanstack/react-query'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { UserImage } from '../user-image'
import styles from './user-menu.module.css'

export const UserMenu = () => {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const { data: profileData } = useQuery({
    queryKey: ['userLinks'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Error fetching profile and links')
      }
      return response.json()
    },
  })

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
          profileData?.profile.profile_image_url ??
          DEFAULT_USER_IMAGE
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
