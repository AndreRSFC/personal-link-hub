import { Button } from '@/components/button'
import { InputField } from '@/components/input'
import { Modal } from '@/components/modal'
import { UserImage } from '@/components/user-image'
import { DEFAULT_USER_IMAGE } from '@/constant/app.constant'
import { EditIcon } from '@/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import styled from '../dashboard.module.css'
import type { ProfileDataModel } from './user-section.model'

export const UserSection = () => {
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    username: '',
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const { data: profileData, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile')
      if (!response.ok) {
        throw new Error('Error fetching profile data')
      }
      return response.json() as Promise<ProfileDataModel>
    },
  })

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/user/profile-image', {
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

  const updateProfileMutation = useMutation({
    mutationFn: async ({
      name,
      description,
      username,
    }: {
      name: string
      description: string
      username: string
    }) => {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            name,
            description,
            username,
          },
          links: profileData?.links || [],
        }),
      })

      if (!response.ok) {
        throw new Error('Error updating profile')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      closeModal()
    },
  })

  const openModal = () => {
    if (profileData) {
      setFormData({
        name: profileData.profile.name || '',
        description: profileData.profile.description || '',
        username: profileData.profile.username || '',
      })
      setImagePreview(null)
      setImageFile(null)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImageFile(file)

    const reader = new FileReader()
    reader.onload = e => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (imageFile) {
        await uploadImageMutation.mutateAsync(imageFile)
      }

      await updateProfileMutation.mutateAsync({
        name: formData.name,
        description: formData.description,
        username: formData.username,
      })
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  const isLoading =
    isLoadingProfile ||
    uploadImageMutation.isPending ||
    updateProfileMutation.isPending

  const hasEmptyFields =
    !profileData?.profile.name ||
    !profileData?.profile.description ||
    !profileData?.profile.username

  return (
    <>
      <div className={styled.dashboard__user}>
        <div className={styled.dashboard__imageWrapper}>
          <UserImage
            src={profileData?.profile.profile_image_url || DEFAULT_USER_IMAGE}
            size={60}
            onClick={openModal}
          />
          <div
            className={styled.dashboard__editIconOverlay}
            onClick={openModal}
            onKeyDown={openModal}
          >
            <EditIcon />
          </div>
        </div>
        <div className={styled.dashboard__userInfo}>
          <div className={styled.dashboard__infoItem}>
            <span
              className={styled.dashboard__userInfo__name}
              onClick={openModal}
              onKeyDown={openModal}
            >
              {profileData?.profile.name || 'User Name'}
              {(hasEmptyFields || styled.dashboard__hoverParent) && (
                <span className={styled.dashboard__editIcon}>
                  <EditIcon />
                </span>
              )}
            </span>
          </div>
          <div className={styled.dashboard__infoItem}>
            <span
              className={styled.dashboard__userInfo__description}
              onClick={openModal}
              onKeyDown={openModal}
            >
              {profileData?.profile.description || 'Bio description'}
              {(hasEmptyFields || styled.dashboard__hoverParent) && (
                <span className={styled.dashboard__editIcon}>
                  <EditIcon />
                </span>
              )}
            </span>
          </div>
          <div className={styled.dashboard__infoItem}>
            <span
              className={styled.dashboard__userInfo__username}
              onClick={openModal}
              onKeyDown={openModal}
            >
              <span className={styled.dashboard__usernameUrl}>
                linktree.com/
                {profileData?.profile.username || 'username'}
              </span>
              {(hasEmptyFields || styled.dashboard__hoverParent) && (
                <span className={styled.dashboard__editIcon}>
                  <EditIcon />
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Edit profile">
        <form onSubmit={handleSubmit}>
          <div className={styled.dashboard__formImageContainer}>
            <UserImage
              src={
                imagePreview ||
                profileData?.profile.profile_image_url ||
                DEFAULT_USER_IMAGE
              }
              size={100}
              onClick={triggerFileInput}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageSelect}
            />
            <p className={styled.dashboard__formImageText}>
              Click to change image
            </p>
          </div>

          <InputField
            value={formData.name}
            placeholder="Profile Title here"
            label="Profile Title"
            onChange={e => {
              setFormData(prev => ({
                ...prev,
                name: e.target.value,
              }))
            }}
          />

          <InputField
            value={formData.description}
            placeholder="Profile description here"
            label="Profile description"
            onChange={e =>
              setFormData(prev => ({
                ...prev,
                description: e.target.value,
              }))
            }
          />

          <div className={styled.dashboard__usernameField}>
            <InputField
              value={formData.username}
              placeholder="Your unique username"
              label="Username"
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  username: e.target.value.replace(/\s+/g, '').toLowerCase(),
                }))
              }
            />
            <div className={styled.dashboard__usernamePreview}>
              linktree.com/{formData.username || 'username'}
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              !formData.name ||
              !formData.description ||
              !formData.username ||
              isLoading
            }
            loading={isLoading}
          >
            Save
          </Button>
        </form>
      </Modal>
    </>
  )
}
