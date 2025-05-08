'use client'
import { Button, ButtonStyle } from '@/components/button'
import { LinksList } from '@/components/link-list'
import { Modal } from '@/components/modal'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { DeleteConfirmationModal } from '../delete-confirmation'
import { LinkForm } from './link-form'
import styles from './links-section.module.css'

interface LinkItem {
  id: string
  title: string
  url: string
  is_visible?: boolean
  image_url?: string | null
}

export const LinksSection = () => {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [currentLink, setCurrentLink] = useState<LinkItem>({
    id: '',
    title: '',
    url: '',
    is_visible: true,
    image_url: null,
  })
  const [isNewLink, setIsNewLink] = useState(false)

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Error fetching profile and links')
      }
      return response.json()
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/link/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Error uploading image')
      }

      const data = await response.json()
      return data.imageUrl
    },
  })

  const addLinkMutation = useMutation({
    mutationFn: async ({
      linkData,
      imageFile,
    }: { linkData: LinkItem; imageFile: File | null }) => {
      const updatedLinkData = { ...linkData }

      if (imageFile) {
        try {
          const imageUrl = await uploadImageMutation.mutateAsync(imageFile)
          updatedLinkData.image_url = imageUrl
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }

      const updatedLocalLinks = [...(profileData?.links || []), updatedLinkData]

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
        throw new Error('Error adding link')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      handleModalClose()
    },
    onError: () => {
      console.error('Failed to add link')
    },
  })

  const updateLinkMutation = useMutation({
    mutationFn: async ({
      linkData,
      imageFile,
    }: { linkData: LinkItem; imageFile: File | null }) => {
      const updatedLinkData = { ...linkData }

      if (imageFile) {
        try {
          const imageUrl = await uploadImageMutation.mutateAsync(imageFile)
          updatedLinkData.image_url = imageUrl
        } catch (error) {
          console.error('Error uploading image:', error)
        }
      }

      const updatedLinks = (profileData?.links || []).map((item: LinkItem) =>
        item.id === updatedLinkData.id ? updatedLinkData : item
      )

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
        throw new Error('Error updating link')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      handleModalClose()
    },
    onError: () => {
      console.error('Failed to update link')
    },
  })

  const deleteLinkMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const filteredLinks = (profileData?.links || []).filter(
        (link: any) => link.id !== linkId
      )

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: profileData?.profile || {},
          links: filteredLinks,
        }),
      })

      if (!response.ok) {
        throw new Error('Error deleting link')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      handleModalClose()
      setIsDeleteConfirmOpen(false)
    },
    onError: () => {
      console.error('Failed to delete link')
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
        throw new Error('Error reordering links')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    },
    onError: () => {
      console.error('Failed to reorder links')
    },
  })

  const handleAddLink = () => {
    setCurrentLink({
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
    setCurrentLink(link)
    setIsNewLink(false)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const handleDeleteConfirm = () => {
    if (currentLink.id) {
      deleteLinkMutation.mutate(currentLink.id)
    }
  }

  const handleSubmitLink = (linkData: LinkItem, imageFile: File | null) => {
    if (isNewLink) {
      addLinkMutation.mutate({ linkData, imageFile })
    } else {
      updateLinkMutation.mutate({ linkData, imageFile })
    }
  }

  const handleReorder = (newItems: LinkItem[]) => {
    reorderLinksMutation.mutate(newItems)
  }

  return (
    <>
      <div className={styles.links_section__container}>
        <LinksList
          items={profileData?.links || []}
          onItemClick={handleItemClick}
          onReorder={handleReorder}
        />
        <Button
          onClick={handleAddLink}
          type="button"
          buttonStyle={ButtonStyle.SECONDARY}
        >
          + Add New Link
        </Button>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={isNewLink ? 'Add New Link' : 'Edit Link'}
      >
        <LinkForm
          initialData={currentLink}
          isNewLink={isNewLink}
          isLoading={
            addLinkMutation.isPending ||
            updateLinkMutation.isPending ||
            uploadImageMutation.isPending
          }
          onSubmit={handleSubmitLink}
          onDelete={() => setIsDeleteConfirmOpen(true)}
          isDeleting={deleteLinkMutation.isPending}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteLinkMutation.isPending}
      />
    </>
  )
}
