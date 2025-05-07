import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import { Modal } from './'

describe('Modal Component', () => {
  const mockOnClose = jest.fn()
  const modalTitle = 'Modal Title'
  const modalContent = 'Modal Content'

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    )

    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument()
  })

  test('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    )

    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument()
    expect(screen.getByTestId('modal-container')).toBeInTheDocument()
    expect(screen.getByText(modalContent)).toBeInTheDocument()
  })

  test('renders with title when provided', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose} title={modalTitle}>
        {modalContent}
      </Modal>
    )

    expect(screen.getByText(modalTitle)).toBeInTheDocument()
  })

  test('calls onClose when close button is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    )

    fireEvent.click(screen.getByTestId('modal-close'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('calls onClose when overlay is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    )

    fireEvent.click(screen.getByTestId('modal-overlay'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('does not call onClose when modal content is clicked', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    )

    fireEvent.click(screen.getByTestId('modal-container'))
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  test('calls onClose when Escape key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Escape' })
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  test('does not call onClose when another key is pressed', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        {modalContent}
      </Modal>
    )

    fireEvent.keyDown(document, { key: 'Enter' })
    expect(mockOnClose).not.toHaveBeenCalled()
  })
})
