import { act, fireEvent, render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { LinkCard } from './link-card'

describe('LinkCard', () => {
  const mockProps = {
    id: 'test-id',
    title: 'Test Link',
    url: 'https://example.com',
    image_url: 'https://example.com/image.jpg',
  }

  beforeEach(() => {
    window.open = jest.fn()

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn(),
      },
      writable: true,
      configurable: true,
    })
  })

  test('renders correctly with image', () => {
    render(<LinkCard {...mockProps} />)

    expect(screen.getByText('Test Link')).toBeInTheDocument()
    expect(document.querySelector('.link_card__image')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Options/i })).toBeInTheDocument()
  })

  test('renders correctly without image', () => {
    render(<LinkCard {...mockProps} image_url={null} />)

    expect(screen.getByText('Test Link')).toBeInTheDocument()
    expect(document.querySelector('.link_card__image')).not.toBeInTheDocument()
  })

  test('calls writeText and window.open when card is clicked', async () => {
    render(<LinkCard {...mockProps} />)

    const card = screen.getByText('Test Link').closest('.link_card__container')
    await userEvent.click(card)

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockProps.url)
    expect(window.open).toHaveBeenCalledWith(mockProps.url, '_blank')
  })

  test('shows and hides popover through state changes', () => {
    const { container, rerender } = render(<LinkCard {...mockProps} />)

    expect(
      container.querySelector('.link_card__popover')
    ).not.toBeInTheDocument()

    const optionsButton = screen.getByRole('button', { name: /Options/i })
    expect(optionsButton).toBeInTheDocument()

    act(() => {
      fireEvent.click(optionsButton)
    })

    rerender(<LinkCard {...mockProps} />)
    expect(container.querySelector('.link_card__popover')).toBeInTheDocument()
    expect(
      container.querySelector('.link_card__copy_button')
    ).toBeInTheDocument()
  })

  test('calls writeText when clicking the copy button with simulated event handlers', () => {
    const { container } = render(<LinkCard {...mockProps} />)

    const optionsButton = screen.getByRole('button', { name: /Options/i })
    act(() => {
      fireEvent.click(optionsButton)
    })

    const copyButton = container.querySelector('.link_card__copy_button')
    expect(copyButton).toBeInTheDocument()

    if (copyButton) {
      act(() => {
        fireEvent.click(copyButton)
      })
    }

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(mockProps.url)

    expect(
      container.querySelector('.link_card__popover')
    ).not.toBeInTheDocument()
  })
})
