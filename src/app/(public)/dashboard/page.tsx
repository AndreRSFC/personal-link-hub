'use client'
import { LinksList } from '@/components/link-list'
import { Sidebar } from '@/components/sidebar'
import { UserImage } from '@/components/user-image'
import { LogoImage } from '@/image'
import useLinksStore, { type LinkItem } from '@/store/link.store'
import styled from './dashboard.module.css'

const item = [
  {
    id: '1',
    title: 'Teste',
    url: 'http://andresimoes.dev',
    imageUrl: '/images/site-icon.png',
  },
  {
    id: '2',
    title: 'GitHub',
    url: 'https://github.com',
    imageUrl: '/images/github-icon.png',
  },
  {
    id: '3',
    title: 'Portfolio',
    url: 'https://portfolio.example.com',
    imageUrl: '/images/portfolio-icon.png',
  },
  {
    id: '4',
    title: 'Blog',
    url: 'https://blog.example.com',
    imageUrl: '/images/blog-icon.png',
  },
]

export default function Dashboard() {
  const links = useLinksStore(state => state.links)
  const setLinks = useLinksStore(state => state.setLinks)

  const handleAddLink = () => {
    const newLink: LinkItem = {
      id: `${links.length + 1}`,
      title: 'Novo Link',
      url: 'https://example.com',
      imageUrl: '/images/new-icon.png',
    }

    setLinks([...links, newLink])
  }

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
          <div className={styled.dashboard__user}>
            <UserImage
              src="https://ugc.production.linktr.ee/c848e59a-79c6-4e0a-bcfc-4e6e291b8112_untitled.webp?io=true&size=avatar"
              size={60}
            />
            <div className={styled.dashboard__userInfo}>
              <span className={styled.dashboard__userInfo__name}>
                User Name
              </span>
              <span className={styled.dashboard__userInfo__description}>
                Bio description
              </span>
            </div>
          </div>
          <LinksList
            items={item as any}
            onItemClick={(item: any) => {
              console.log('Item clicado:', item)

              alert(`Clicou em: ${item.title}`)
            }}
            onReorder={(newItems: any) => {
              console.log('Nova ordem:', newItems)
            }}
          />
          <button
            className={styled.addButton}
            onClick={handleAddLink}
            type="button"
          >
            + Adicionar Novo Link
          </button>
        </div>
      </main>
    </div>
  )
}
