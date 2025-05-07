import React from 'react'
import styles from './user-image.module.css'

interface UserImageProps {
  src: string
  alt?: string
  size?: number
  onClick?: () => void
  className?: string
}

export const UserImage = ({
  src,
  alt = '',
  size = 48,
  onClick,
  className = '',
}: UserImageProps) => {
  const imageStyle = {
    width: `${size}px`,
    height: `${size}px`,
  }

  return (
    <div
      className={`${styles.container} ${className}`}
      style={imageStyle}
      onClick={onClick}
      onKeyDown={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <img src={src} alt={alt} className={styles.image} />
      <div className={styles.overlay} />
    </div>
  )
}
