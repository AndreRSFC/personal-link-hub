'use client'
import { Button } from '@/components/button'
import { InputField } from '@/components/input'
import { LinksList } from '@/components/link-list'
import { Modal } from '@/components/modal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import styled from './links-section.module.css'

interface LinkItem {
  id: string
  title: string
  url: string
  is_visible?: boolean
  image_url?: string | null
}

export const LinksSection = () => {
  const queryClient = useQueryClient()
  const [selectedLink, setSelectedLink] = useState<LinkItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [linkData, setLinkData] = useState<LinkItem>({
    id: '',
    title: '',
    url: '',
    is_visible: true,
    image_url: null,
  })
  const [localLinks, setLocalLinks] = useState<LinkItem[]>([])
  const [isNewLink, setIsNewLink] = useState(false)

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userLinks'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Erro ao buscar perfil e links')
      }
      return response.json()
    },
  })

  useEffect(() => {
    if (profileData?.links) {
      setLocalLinks(profileData.links)
    }
  }, [profileData])

  const addLinkMutation = useMutation({
    mutationFn: async (newLinkData: LinkItem) => {
      const updatedLocalLinks = [...localLinks, newLinkData]

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: profileData?.profile || {},
          links: updatedLocalLinks,
        }),
      })

      if (!response.ok) {
        throw new Error('Erro ao adicionar link')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLinks'] })
      handleModalClose()
    },
    onError: () => {
      console.error('Falha ao adicionar link')
    },
  })

  const updateLinkMutation = useMutation({
    mutationFn: async () => {
      const updatedLinks = localLinks.map((item: LinkItem) =>
        item.id === linkData.id ? linkData : item
      )

      setLocalLinks(updatedLinks)

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: profileData?.profile || {},
          links: updatedLinks,
        }),
      })

      if (!response.ok) {
        setLocalLinks(profileData?.links || [])
        throw new Error('Erro ao atualizar link')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLinks'] })
      handleModalClose()
    },
    onError: () => {
      console.error('Falha ao atualizar link')
    },
  })

  const reorderLinksMutation = useMutation({
    mutationFn: async (newLinks: LinkItem[]) => {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: profileData?.profile || {},
          links: newLinks,
        }),
      })

      if (!response.ok) {
        setLocalLinks(profileData?.links || [])
        throw new Error('Erro ao reordenar links')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLinks'] })
    },
    onError: () => {
      console.error('Falha ao reordenar links')
    },
  })

  const handleAddLink = () => {
    setLinkData({
      id: '',
      title: '',
      url: '',
      is_visible: true,
      image_url: null,
    })

    setIsNewLink(true)

    setIsModalOpen(true)
  }

  const handleItemClick = (link: LinkItem) => {
    setLinkData({
      id: link.id,
      title: link.title,
      url: link.url,
      is_visible: link.is_visible ?? true,
      image_url: link.image_url,
    })
    setSelectedLink(link)
    setIsNewLink(false)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedLink(null)
    setIsNewLink(false)
  }

  const handleReorder = (newItems: LinkItem[]) => {
    setLocalLinks(newItems)

    reorderLinksMutation.mutate(newItems)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLinkData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const toggleVisibility = () => {
    setLinkData(prev => ({
      ...prev,
      is_visible: !prev.is_visible,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isNewLink) {
      addLinkMutation.mutate(linkData)
    } else {
      updateLinkMutation.mutate()
    }
  }

  return (
    <>
      <div className={styled.linksSection__container}>
        <LinksList
          items={localLinks}
          onItemClick={handleItemClick}
          onReorder={handleReorder}
        />
        <Button onClick={handleAddLink} type="button">
          + Adicionar Novo Link
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={isNewLink ? 'Adicionar Novo Link' : 'Editar Link'}
      >
        <form onSubmit={handleSubmit}>
          <InputField
            value={linkData.title}
            placeholder="Título do link"
            label="Título"
            onChange={handleChange}
            required
          />

          <InputField
            value={linkData.url}
            placeholder="URL (ex: https://exemplo.com)"
            label="URL"
            onChange={handleChange}
            required
          />

          <div
            style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}
          >
            <input
              type="checkbox"
              id="visibility"
              checked={linkData.is_visible}
              onChange={toggleVisibility}
            />
            <label htmlFor="visibility" style={{ marginLeft: '8px' }}>
              Visível
            </label>
          </div>

          <Button
            type="submit"
            disabled={
              !linkData.title ||
              !linkData.url ||
              updateLinkMutation.isPending ||
              addLinkMutation.isPending
            }
          >
            {isNewLink
              ? addLinkMutation.isPending
                ? 'Adicionando...'
                : 'Adicionar'
              : updateLinkMutation.isPending
                ? 'Salvando...'
                : 'Salvar'}
          </Button>
        </form>
      </Modal>
    </>
  )
}
