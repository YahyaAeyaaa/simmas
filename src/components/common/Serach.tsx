import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showClearButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Cari...',
  className = '',
  showClearButton = true,
  size = 'md',
  disabled = false,
}) => {
  const handleClear = () => {
    onChange('');
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg',
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const paddingStyles = {
    sm: 'pl-8 pr-3',
    md: 'pl-10 pr-4',
    lg: 'pl-12 pr-5',
  };

  const iconLeftPosition = {
    sm: 'left-2',
    md: 'left-3',
    lg: 'left-4',
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className={`absolute ${iconLeftPosition[size]} top-1/2 transform -translate-y-1/2 text-gray-400`}>
        <Search size={iconSizes[size]} />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full
          ${sizeStyles[size]}
          ${paddingStyles[size]}
          ${showClearButton && value ? 'pr-10' : ''}
          border border-gray-300
          rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
          placeholder:text-gray-400
        `}
      />

      {/* Clear Button */}
      {showClearButton && value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={iconSizes[size]} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;