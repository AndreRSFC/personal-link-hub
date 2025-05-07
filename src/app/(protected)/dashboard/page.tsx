'use client'
import { Sidebar } from '@/components/sidebar'
import { UserImage } from '@/components/user-image'
import { UserMenu } from '@/components/user-menu'
import { LogoImage } from '@/image'
import Link from 'next/link'
import styled from './dashboard.module.css'
import { LinksSection } from './links-section'
import { UserSection } from './user-section'

export default function Dashboard() {
  return (
    <div className={styled.dashboard}>
      <nav className={styled.dashboard__header}>
        <Link href="/dashboard">
          <LogoImage className={styled.dashboard__header__icon} />
        </Link>
        <UserMenu />
      </nav>
      <main className={styled.dashboard__container}>
        <Sidebar />
        <div className={styled.dashboard__content}>
          <UserSection />
          <LinksSection />
        </div>
      </main>
    </div>
  )
}
