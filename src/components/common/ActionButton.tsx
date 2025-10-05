'use client';

import * as Icons from 'lucide-react';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'dark';
  icon?: keyof typeof Icons;
  tooltip?: string;
  children?: ReactNode;
}

const ActionButton = ({ 
  color = 'primary', 
  icon, 
  onClick, 
  tooltip, 
  children, 
  className = '',
  ...props 
}: ActionButtonProps) => {
  
  const colorVariants = {
    primary: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-500 hover:bg-gray-600 active:bg-gray-700',
    success: 'bg-green-500 hover:bg-green-600 active:bg-green-700',
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700',
    info: 'bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700',
    dark: 'bg-gray-800 hover:bg-gray-900 active:bg-black',
  };

  const IconComponent = icon ? Icons[icon] : null;

  return (
    <button
      className={`
        ${colorVariants[color]}
        w-[38px] h-[38px] 
        rounded-xl
        flex items-center justify-center
        text-white
        shadow-sm
        transition-all duration-200 ease-in-out
        hover:-translate-y-0.5 hover:shadow-md
        active:translate-y-0 active:shadow-sm
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      onClick={onClick}
      title={tooltip}
      {...props}
    >
      {IconComponent && <IconComponent size={16} />}
      {children}
    </button>
  );
};

export default ActionButton;