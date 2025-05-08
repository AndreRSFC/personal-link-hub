import { Button } from '@/components/button'
import { ButtonVariant } from '@/components/button'
import { Modal } from '@/components/modal'
import styles from '../links-section/links-section.module.css'

interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isDeleting: boolean
}

export const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteConfirmationModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm deletion">
      <div className={styles.links_section__confirmModal}>
        <p>Are you sure you want to delete this link?</p>
        <div className={styles.links_section__confirmButtons}>
          <Button
            type="button"
            variant={ButtonVariant.OUTLINE}
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant={ButtonVariant.DANGER}
            onClick={onConfirm}
            disabled={isDeleting}
            loading={isDeleting}
          >
            Yes, delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
