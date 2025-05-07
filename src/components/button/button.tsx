import styles from './button.module.css'

interface ButtonProps {
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  loading = false,
  className = '',
}) => {
  const buttonClassName = `
    ${styles.button}
    ${disabled ? styles['button--disabled'] : ''}
    ${loading ? styles['button--loading'] : ''}
    ${className}
  `.trim()

  return (
    <button
      type={type}
      className={buttonClassName}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {children}
    </button>
  )
}
