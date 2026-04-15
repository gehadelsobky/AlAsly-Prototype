import * as React from "react"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'success'
    size?: 'default' | 'sm' | 'lg'
  }
>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'
  
  const variants = {
    default: {
      backgroundColor: '#F4B400',
      color: '#0B1C2C',
    },
    secondary: {
      backgroundColor: '#F5F7FA',
      color: '#1F2937',
      border: '1px solid #E5E7EB',
    },
    destructive: {
      backgroundColor: '#EF4444',
      color: '#FFFFFF',
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#1F2937',
      border: '2px solid #E5E7EB',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#1F2937',
    },
    success: {
      backgroundColor: '#22C55E',
      color: '#FFFFFF',
    },
  }

  const sizes = {
    default: 'h-10 px-4 py-2 text-base',
    sm: 'h-9 rounded-md px-3 text-sm',
    lg: 'h-12 rounded-md px-8 text-lg',
  }

  const variantStyle = variants[variant]

  return (
    <button
      className={`${baseStyles} ${sizes[size]} ${className || ''}`}
      style={{
        ...variantStyle,
      }}
      onMouseEnter={(e) => {
        const button = e.currentTarget as HTMLButtonElement
        if (variant === 'default') {
          button.style.backgroundColor = '#DAA00F'
          button.style.transform = 'translateY(-1px)'
          button.style.boxShadow = '0 4px 12px rgba(244, 180, 0, 0.3)'
        } else if (variant === 'success') {
          button.style.backgroundColor = '#16A34A'
          button.style.transform = 'translateY(-1px)'
          button.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.3)'
        } else if (variant === 'secondary') {
          button.style.backgroundColor = '#EBEBEB'
        } else if (variant === 'ghost') {
          button.style.backgroundColor = '#F5F7FA'
        }
      }}
      onMouseLeave={(e) => {
        const button = e.currentTarget as HTMLButtonElement
        button.style.transform = 'translateY(0)'
        button.style.boxShadow = 'none'
        if (variant === 'default') {
          button.style.backgroundColor = '#F4B400'
        } else if (variant === 'success') {
          button.style.backgroundColor = '#22C55E'
        } else if (variant === 'secondary') {
          button.style.backgroundColor = '#F5F7FA'
        } else if (variant === 'ghost') {
          button.style.backgroundColor = 'transparent'
        }
      }}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
