import { fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LinkCard } from './'

Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockImplementation(() => Promise.resolve()),
  },
})

const mockOpen = jest.fn()
window.open = mockOpen

describe('LinkCard Component', () => {
  const mockProps = {
    id: 'test-id',
    title: 'Test Link',
    url: 'https://exemplo.com',
    image_url: null,
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders with correct title and URL', () => {
    render(<LinkCard {...mockProps} />)

    expect(screen.getByText(mockProps.title)).toBeInTheDocument()
    expect(screen.getByText(mockProps.url)).toBeInTheDocument()
  })

  test('renders with image when image_url is provided', () => {
    const propsWithImage = {
      ...mockProps,
      image_url: 'https://exemplo.com/image.jpg',
    }

    render(<LinkCard {...propsWithImage} />)

    const imageContainer = document.querySelector('.' + 'link_card__image')
    expect(imageContainer).toBeInTheDocument()
  })

  test('calls copyToClipboard and opens URL when card is clicked', () => {
    render(<LinkCard {...mockProps} />)

    const card = screen
      .getByText(mockProps.title)
      .closest('.' + 'link_card__container')
    fireEvent.click(card)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockProps.url)

    expect(mockOpen).toHaveBeenCalledWith(mockProps.url, '_blank')
  })

  test('opens modal when options button is clicked', () => {
    render(<LinkCard {...mockProps} />)

    const optionsButton = document.querySelector('.' + 'link_card__options')
    fireEvent.click(optionsButton)

    const modal = document.querySelector('.' + 'link_card__modal')
    expect(modal).toBeInTheDocument()

    expect(screen.getByText('Opções')).toBeInTheDocument()
    expect(screen.getByText('Copiar Link')).toBeInTheDocument()
    expect(screen.getByText('Fechar')).toBeInTheDocument()
  })

  test('closes modal when close button is clicked', () => {
    render(<LinkCard {...mockProps} />)

    const optionsButton = document.querySelector('.' + 'link_card__options')
    fireEvent.click(optionsButton)

    const closeButton = screen.getByText('Fechar')
    fireEvent.click(closeButton)

    const modal = document.querySelector('.' + 'link_card__modal')
    expect(modal).not.toBeInTheDocument()
  })

  test('copies link and closes modal when copy button is clicked', () => {
    render(<LinkCard {...mockProps} />)

    const optionsButton = document.querySelector('.' + 'link_card__options')
    fireEvent.click(optionsButton)

    const copyButton = screen.getByText('Copiar Link')
    fireEvent.click(copyButton)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockProps.url)

    const modal = document.querySelector('.' + 'link_card__modal')
    expect(modal).not.toBeInTheDocument()
  })

  test('closes modal when clicking outside of it', () => {
    render(<LinkCard {...mockProps} />)

    const optionsButton = document.querySelector('.' + 'link_card__options')
    fireEvent.click(optionsButton)

    const modalOverlay = document.querySelector(
      '.' + 'link_card__modal_overlay'
    )
    fireEvent.click(modalOverlay)

    const modal = document.querySelector('.' + 'link_card__modal')
    expect(modal).not.toBeInTheDocument()
  })
})
