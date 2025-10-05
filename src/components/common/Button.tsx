import React from 'react';
import { LucideIcon, Plus, Save, X, Check, AlertCircle , Sparkles , SlidersHorizontal , RotateCcw } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'custom';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon | 'Plus' | 'Save' | 'X' | 'Check' | 'AlertCircle' | 'Sparkles' | 'SlidersHorizontal' | 'RotateCcw';
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  customColor?: {
    bg?: string;
    hover?: string;
    text?: string;
  };
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  disabled = false,
  type = 'button',
  className = '',
  customColor,
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    custom: '',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Icon size mapping
  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  // Get icon component
  const getIconComponent = () => {
    if (!icon) return null;

    const iconMap = {
      Plus,
      Save,
      X,
      Check,
      Sparkles,
      AlertCircle,
      SlidersHorizontal,
      RotateCcw
    };

    let IconComponent: LucideIcon;

    if (typeof icon === 'string') {
      IconComponent = iconMap[icon as keyof typeof iconMap];
    } else {
      IconComponent = icon;
    }

    return <IconComponent size={iconSizes[size]} />;
  };

  const IconElement = getIconComponent();

  // Use custom colors if variant is 'custom'
  const buttonStyle = variant === 'custom' && customColor
    ? `${customColor.bg || 'bg-gray-600'} ${customColor.hover || 'hover:bg-gray-700'} ${customColor.text || 'text-white'}`
    : variantStyles[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${buttonStyle}
        ${sizeStyles[size]}
        rounded-lg
        font-medium
        flex items-center gap-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-95
        shadow-sm hover:shadow-md
        ${className}
      `}
    >
      {iconPosition === 'left' && IconElement}
      {children}
      {iconPosition === 'right' && IconElement}
    </button>
  );
};

export default Button;