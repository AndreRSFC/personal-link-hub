import { UserImage } from '@/components/user-image'
import { useState } from 'react'
import styles from './link-card.module.css'

interface LinkCardProps {
  id: string
  title: string
  url: string
  image_url: string | null
}

export const LinkCard: React.FC<LinkCardProps> = ({
  id,
  title,
  url,
  image_url,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = () => {
    copyToClipboard(url)
    window.open(url, '_blank')
  }

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        console.log('Link copiado!')
      })
      .catch(err => {
        console.error('Erro ao copiar link:', err)
      })
  }

  return (
    <div className={styles.link_card}>
      <div
        className={styles.link_card__container}
        onClick={handleCardClick}
        onKeyDown={handleCardClick}
      >
        {image_url && (
          <div className={styles.link_card__image}>
            <UserImage src={image_url} alt={title} size={40} />
          </div>
        )}
        <div className={styles.link_card__content}>
          <h3 className={styles.link_card__title}>{title}</h3>
          <p className={styles.link_card__url}>{url}</p>
        </div>
        <button
          className={styles.link_card__options}
          onClick={handleOptionsClick}
          aria-label="Opções"
          type="button"
        >
          <span className={styles.link_card__dots}>⋮</span>
        </button>
      </div>

      {isModalOpen && (
        <div
          className={styles.link_card__modal_overlay}
          onClick={handleModalClose}
          onKeyDown={handleModalClose}
        >
          <div
            className={styles.link_card__modal}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => e.stopPropagation()}
          >
            <h4 className={styles.link_card__modal_title}>Opções</h4>
            <button
              className={styles.link_card__copy_button}
              onClick={() => {
                copyToClipboard(url)
                setIsModalOpen(false)
              }}
              type="button"
            >
              Copiar Link
            </button>
            <button
              className={styles.link_card__close_button}
              onClick={handleModalClose}
              type="button"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
