import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary' | 'success'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  title?: string
  'aria-label'?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'secondary',
  size = 'md',
  className = '',
  title,
  'aria-label': ariaLabel,
  ...props
}) => {
  const baseClasses = 'btn'
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success'
  }
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg'
  }

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </button>
  )
}