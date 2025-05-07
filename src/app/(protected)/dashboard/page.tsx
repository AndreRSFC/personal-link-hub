'use client'
import { Sidebar } from '@/components/sidebar'
import { UserImage } from '@/components/user-image'
import { LogoImage } from '@/image'
import styled from './dashboard.module.css'
import { LinksSection } from './links-section'
import { UserSection } from './user-section'

export default function Dashboard() {
  return (
    <div className={styled.dashboard}>
      <nav className={styled.dashboard__header}>
        <LogoImage className={styled.dashboard__header__icon} />
        <UserImage
          src="https://ugc.production.linktr.ee/c848e59a-79c6-4e0a-bcfc-4e6e291b8112_untitled.webp?io=true&size=avatar"
          size={32}
        />
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
