import React from 'react';
import type { LucideIcon } from 'lucide-react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  isLoading,
  className = '',
  ...props
}) => {
  const variantClass = `btn-${variant}`;
  const sizeClass = size === 'sm' ? 'btn-small' : size === 'lg' ? 'btn-large' : 'btn-medium';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className='btn-loading-spinner' />
      ) : (
        LeftIcon && <LeftIcon className='btn-icon-left' size={18} />
      )}
      {children}
      {!isLoading && RightIcon && <RightIcon className='btn-icon-right' size={18} /> }
    </button>
  );
};

export default Button;
