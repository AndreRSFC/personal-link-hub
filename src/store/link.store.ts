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

const initialLinks: LinkItem[] = []

const useLinksStore = create<LinksStore>(set => ({
  links: initialLinks,
  setLinks: (newLinks: LinkItem[]) => set({ links: newLinks }),
}))

export default useLinksStore
