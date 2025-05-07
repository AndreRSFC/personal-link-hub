'use client'
import { LinksList } from '@/components/link-list'
import { Sidebar } from '@/components/sidebar'
import { UserImage } from '@/components/user-image'
import { LogoImage } from '@/image'
import useLinksStore, { type LinkItem } from '@/store/link.store'
import styled from './dashboard.module.css'
import { UserSection } from './user-section'

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
          <UserSection />
          <LinksList
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            items={item as any}
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            onItemClick={(item: any) => {
              console.log('Item clicado:', item)

              alert(`Clicou em: ${item.title}`)
            }}
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            onReorder={(newItems: any) => {
              console.log('Nova ordem:', newItems)
            }}
          />
          {/* hover de cada item mostrar icone de editar e abrir um modal geral */}
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
