import { create } from 'zustand'

export interface LinkItem {
  id: string
  title: string
  url: string
  imageUrl?: string
}

interface LinksStore {
  links: LinkItem[]
  setLinks: (links: LinkItem[]) => void
}

const initialLinks: LinkItem[] = [
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

const useLinksStore = create<LinksStore>(set => ({
  links: initialLinks,
  setLinks: (newLinks: LinkItem[]) => set({ links: newLinks }),
}))

export default useLinksStore
