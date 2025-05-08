import { ButtonStyle, ButtonVariant } from './'
import styles from './button.module.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  className?: string
  variant?: `${ButtonVariant}`
  buttonStyle?: `${ButtonStyle}`
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
  variant = ButtonVariant.DEFAULT,
  buttonStyle = ButtonStyle.PRIMARY,
}) => {
  const buttonClasses = [
    styles.button,
    styles[`button--${buttonStyle}`],
    variant !== ButtonVariant.DEFAULT ? styles[`button--${variant}`] : '',
    disabled ? styles['button--disabled'] : '',
    loading ? styles['button--loading'] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
    </button>
  )
}
