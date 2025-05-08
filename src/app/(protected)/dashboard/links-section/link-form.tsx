import { Button } from '@/components/button'
import { ButtonVariant } from '@/components/button'
import { InputField } from '@/components/input'
import { UserImage } from '@/components/user-image'
import { DEFAULT_LINK_IMAGE } from '@/constant/app.constant'
import { useEffect, useRef, useState } from 'react'
import styles from './links-section.module.css'

interface LinkItem {
  id: string
  title: string
  url: string
  is_visible?: boolean
  image_url?: string | null
}

interface LinkFormProps {
  initialData: LinkItem
  isNewLink: boolean
  isLoading: boolean
  onSubmit: (linkData: LinkItem, imageFile: File | null) => void
  onDelete?: () => void
  isDeleting?: boolean
}

export const LinkForm: React.FC<LinkFormProps> = ({
  initialData,
  isNewLink,
  isLoading,
  onSubmit,
  onDelete,
  isDeleting = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [linkData, setLinkData] = useState<LinkItem>(initialData)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    setLinkData(initialData)
    setImagePreview(null)
    setImageFile(null)
  }, [initialData])

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
    onSubmit(linkData, imageFile)
  }

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

  const removeImage = () => {
    setImagePreview(null)
    setImageFile(null)
    setLinkData(prev => ({
      ...prev,
      image_url: null,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.links_section__formImageContainer}>
        <UserImage
          src={imagePreview || linkData.image_url || DEFAULT_LINK_IMAGE}
          size={60}
          onClick={triggerFileInput}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageSelect}
        />
        <p className={styles.links_section__formImageText}>
          Click to change image
        </p>
        {(imagePreview || linkData.image_url) && (
          <button
            type="button"
            className={styles.links_section__removeImageBtn}
            onClick={removeImage}
          >
            Remove image
          </button>
        )}
      </div>

      <InputField
        value={linkData.title}
        placeholder="Link title"
        label="Title"
        onChange={handleChange}
        required
      />

      <InputField
        value={linkData.url}
        placeholder="URL (e.g. https://example.com)"
        label="URL"
        onChange={handleChange}
        required
      />

      <div className={styles.links_section__checkbox}>
        <input
          type="checkbox"
          id="visibility"
          checked={linkData.is_visible}
          onChange={toggleVisibility}
        />
        <label htmlFor="visibility">Visible</label>
      </div>

      <div className={styles.links_section__buttonContainer}>
        {!isNewLink && onDelete && (
          <Button
            type="button"
            variant={ButtonVariant.DANGER}
            onClick={onDelete}
            disabled={isDeleting}
            loading={isDeleting}
          >
            Delete
          </Button>
        )}

        <Button
          type="submit"
          disabled={!linkData.title || !linkData.url || isLoading}
          loading={isLoading}
        >
          {isNewLink ? 'Add' : 'Save'}
        </Button>
      </div>
    </form>
  )
}
