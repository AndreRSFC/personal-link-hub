import { UserImage } from '@/components/user-image'
import { useEffect, useRef, useState } from 'react'
import styles from './link-card.module.css'

interface LinkCardProps {
  id: string
  title: string
  url: string
  image_url: string | null
}

export const LinkCard = ({ id, title, url, image_url }: LinkCardProps) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const optionsButtonRef = useRef<HTMLButtonElement>(null)

  const handleCardClick = () => {
    copyToClipboard(url)
    window.open(url, '_blank')
  }

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPopoverOpen(!isPopoverOpen)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOutsidePopOver =
        popoverRef.current && !popoverRef.current.contains(event.target as Node)

      const isClickOutsideButton =
        optionsButtonRef.current &&
        !optionsButtonRef.current.contains(event.target as Node)

      if (isClickOutsidePopOver && isClickOutsideButton) {
        setIsPopoverOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className={styles.link_card} key={id}>
      <div
        className={styles.link_card__container}
        onClick={handleCardClick}
        onKeyDown={handleCardClick}
      >
        {image_url && (
          <div className={styles.link_card__image}>
            <UserImage src={image_url} alt={title} size={32} />
          </div>
        )}
        <div className={styles.link_card__content}>
          <h3 className={styles.link_card__title}>{title}</h3>
        </div>
        <button
          className={styles.link_card__options}
          onClick={handleOptionsClick}
          aria-label="Options"
          type="button"
          ref={optionsButtonRef}
        >
          <span className={styles.link_card__dots}>⋮</span>
        </button>
      </div>

      {isPopoverOpen && (
        <div className={styles.link_card__popover} ref={popoverRef}>
          <div className={styles.link_card__popover_content}>
            <button
              className={styles.link_card__copy_button}
              onClick={e => {
                e.stopPropagation()
                copyToClipboard(url)
                setIsPopoverOpen(false)
              }}
              type="button"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
