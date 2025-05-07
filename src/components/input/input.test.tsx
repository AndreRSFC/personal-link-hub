import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { InputField } from './'

describe('InputField Component', () => {
  test('renders correctly with default props', () => {
    render(<InputField value="" />)
    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toBeInTheDocument()
    expect(inputElement).toHaveAttribute('type', 'text')
  })

  test('renders with label when provided', () => {
    render(<InputField value="" label="Name" />)
    expect(screen.getByText('Name')).toBeInTheDocument()
  })

  test('shows asterisk when required is true', () => {
    render(<InputField value="" label="Name" required />)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  test('applies focus class when input receives focus', async () => {
    render(<InputField value="" />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)

    expect(inputElement).toHaveClass('input-field__input--focused')
  })

  test('displays error message for empty required field after blur', async () => {
    render(<InputField value="" label="Name" required />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    const errorMessage = screen.getByText('Name is required')
    expect(errorMessage).toBeInTheDocument()
  })

  test('does not display error message for empty non-required field', async () => {
    render(<InputField value="" label="Name" required={false} />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    const errorMessage = screen.queryByText('Name is required')
    expect(errorMessage).not.toBeInTheDocument()
  })

  test('displays error message for invalid email after blur', async () => {
    render(<InputField type="email" value="invalid-email" label="Email" />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    const errorMessage = screen.getByText('Please enter a valid email address')
    expect(errorMessage).toBeInTheDocument()
  })

  test('does not display error message for valid email', async () => {
    render(<InputField type="email" value="test@example.com" label="Email" />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    const errorMessage = screen.queryByText(
      'Please enter a valid email address'
    )
    expect(errorMessage).not.toBeInTheDocument()
  })

  test('calls onChange function when input value changes', async () => {
    const handleChange = jest.fn()
    render(<InputField value="" onChange={handleChange} />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.type(inputElement, 'new value')

    expect(handleChange).toHaveBeenCalled()
  })

  test('calls onError with true when there is an error', async () => {
    const handleError = jest.fn()
    render(
      <InputField type="email" value="invalid-email" onError={handleError} />
    )
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    expect(handleError).toHaveBeenCalledWith(true)
  })

  test('calls onError with false when there is no error', async () => {
    const handleError = jest.fn()
    render(
      <InputField type="email" value="test@example.com" onError={handleError} />
    )
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    expect(handleError).toHaveBeenCalledWith(false)
  })

  test('renders disabled input when disabled is true', () => {
    render(<InputField value="" disabled />)
    const inputElement = screen.getByRole('textbox')

    expect(inputElement).toBeDisabled()
    expect(inputElement).toHaveClass('input-field__input--disabled')
  })

  test('password field toggles visibility when eye button is clicked', async () => {
    render(<InputField type="password" value="password123" />)
    const user = userEvent.setup()

    const inputElement = screen.getByDisplayValue('password123')
    expect(inputElement).toHaveAttribute('type', 'password')

    const eyeButton = screen.getByRole('button')
    await user.click(eyeButton)

    expect(inputElement).toHaveAttribute('type', 'text')

    await user.click(eyeButton)
    expect(inputElement).toHaveAttribute('type', 'password')
  })

  test('password input does not show eye button when disabled', () => {
    render(<InputField type="password" value="password123" disabled />)

    const eyeButton = screen.queryByRole('button')
    expect(eyeButton).not.toBeInTheDocument()
  })

  test('sets aria-invalid attribute based on error state', async () => {
    render(<InputField type="email" value="invalid-email" />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    expect(inputElement).toHaveAttribute('aria-invalid', 'true')
  })

  test('applies appropriate error class to input when there is an error', async () => {
    render(<InputField type="email" value="invalid-email" />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    expect(inputElement).toHaveClass('input-field__input--error')
  })

  test('applies appropriate error class to label when there is an error', async () => {
    render(<InputField type="email" value="invalid-email" label="Email" />)
    const inputElement = screen.getByRole('textbox')
    const user = userEvent.setup()

    await user.click(inputElement)
    await user.tab()

    const labelElement = screen.getByText('Email')
    expect(labelElement).toHaveClass('input-field__label--error')
  })

  test('shows placeholder text when provided', () => {
    render(<InputField value="" placeholder="Enter value" />)
    const inputElement = screen.getByPlaceholderText('Enter value')
    expect(inputElement).toBeInTheDocument()
  })

  test('initializes with untouched state', () => {
    render(<InputField value="" required label="Name" />)

    const errorMessage = screen.queryByText('Name is required')
    expect(errorMessage).not.toBeInTheDocument()
  })
})
