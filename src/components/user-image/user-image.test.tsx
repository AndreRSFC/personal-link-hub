import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { UserImage } from './user-image'

describe('UserImage component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
  }

  test('renders image with correct src and alt', () => {
    render(<UserImage {...defaultProps} />)
    const image = screen.getByAltText('Test image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/test-image.jpg')
  })

  test('renders with default size of 48px', () => {
    render(<UserImage {...defaultProps} />)
    const container = screen.getByRole('img', { hidden: true }).parentElement
    expect(container).toHaveStyle('width: 48px')
    expect(container).toHaveStyle('height: 48px')
  })

  test('applies custom size when provided', () => {
    render(<UserImage {...defaultProps} size={80} />)
    const container = screen.getByRole('img', { hidden: true }).parentElement
    expect(container).toHaveStyle('width: 80px')
    expect(container).toHaveStyle('height: 80px')
  })

  test('applies additional className when provided', () => {
    render(<UserImage {...defaultProps} className="custom-class" />)
    const container = screen.getByRole('img', { hidden: true }).parentElement
    expect(container).toHaveClass('custom-class')
  })

  test('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn()
    const user = userEvent.setup()

    render(<UserImage {...defaultProps} onClick={handleClick} />)
    const container = screen.getByRole('button')

    await user.click(container)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('has role="button" and tabIndex when onClick is provided', () => {
    const handleClick = jest.fn()
    render(<UserImage {...defaultProps} onClick={handleClick} />)

    const container = screen.getByRole('button')
    expect(container).toHaveAttribute('tabIndex', '0')
  })

  test('does not have role="button" or tabIndex when onClick is not provided', () => {
    render(<UserImage {...defaultProps} />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    const container = screen.getByRole('img', { hidden: true }).parentElement
    expect(container).not.toHaveAttribute('tabIndex')
    expect(container).not.toHaveAttribute('role')
  })

  test('has overlay element for hover effect', () => {
    render(<UserImage {...defaultProps} />)
    const overlay = document.querySelector(`.${CSS.escape('overlay')}`)
    expect(overlay).toBeInTheDocument()
  })
})
