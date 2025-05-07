'use client'
import { EyeIcon, EyeOffIcon } from '@/icons'
import { useEffect, useState } from 'react'
import styles from './input.module.css'
import { validateEmail } from './input.util'

interface InputFieldProps {
  type?: 'text' | 'email' | 'password'
  label?: string
  placeholder?: string
  value: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  required?: boolean
  onError?: (hasError: boolean) => void
}

export const InputField = ({
  type = 'text',
  label,
  placeholder = '',
  value,
  onChange,
  disabled = false,
  required = false,
  onError,
}: InputFieldProps) => {
  const [focused, setFocused] = useState(false)
  const [touched, setTouched] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const isEmailError =
    type === 'email' && touched && value && !validateEmail(value)
  const isRequiredError = required && touched && !value
  const displayError =
    (isEmailError ? 'Please enter a valid email address' : '') ||
    (isRequiredError ? `${label || 'Field'} is required` : '')

  useEffect(() => {
    if (onError && touched) {
      const hasError = !!displayError
      onError(hasError)
    }
  }, [displayError, touched, onError])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e)
    }
  }

  const handleBlur = () => {
    setFocused(false)
    setTouched(true)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const actualType = type === 'password' && showPassword ? 'text' : type

  const labelClassName = `${styles['input-field__label']} ${
    disabled
      ? styles['input-field__label--disabled']
      : displayError
        ? styles['input-field__label--error']
        : ''
  }`

  const inputClassName = `${styles['input-field__input']} ${
    disabled
      ? styles['input-field__input--disabled']
      : focused
        ? styles['input-field__input--focused']
        : displayError
          ? styles['input-field__input--error']
          : ''
  }`

  return (
    <div className={styles['input-field']}>
      {label && (
        <label className={labelClassName} htmlFor="">
          {label}{' '}
          {required && (
            <span className={styles['input-field__required']}>*</span>
          )}
        </label>
      )}

      <div className={styles['input-field__wrapper']}>
        <input
          type={actualType}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={inputClassName}
          aria-invalid={displayError ? 'true' : 'false'}
        />

        {type === 'password' && !disabled && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={styles['input-field__eye-button']}
          >
            {showPassword ? (
              <EyeOffIcon className={styles['input-field__eye-icon']} />
            ) : (
              <EyeIcon className={styles['input-field__eye-icon']} />
            )}
          </button>
        )}
      </div>

      {displayError && (
        <p className={styles['input-field__error-message']}>{displayError}</p>
      )}
    </div>
  )
}
