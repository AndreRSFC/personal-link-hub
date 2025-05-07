import { CloseIcon } from '@/icons'
import { type ReactNode, useEffect } from 'react'
import styles from './modal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className={styles.modal__overlay}
      onClick={onClose}
      onKeyDown={onClose}
      data-testid="modal-overlay"
    >
      <div
        className={styles.modal__container}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
        data-testid="modal-container"
      >
        <div className={styles.modal__header}>
          {title && <h2 className={styles.modal__title}>{title}</h2>}
          <button
            className={styles.modal__close}
            onClick={onClose}
            aria-label="Close"
            data-testid="modal-close"
            type="button"
          >
            <CloseIcon />
          </button>
        </div>
        <div className={styles.modal__content}>{children}</div>
      </div>
    </div>
  )
}
