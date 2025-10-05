import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
}

export const Input = ({ 
  type, 
  placeholder, 
  name, 
  value, 
  onChange, 
  required, 
  className,
  ...rest
}: InputProps) => {
  return (
    <input 
      type={type}
      placeholder={placeholder}
      name={name}
      value={value || ''}
      onChange={onChange}
      required={required}
      className={`
        w-full px-4 py-3 mb-4 rounded-2xl
        bg-blue-50
        text-gray-900 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        transition-all duration-200
        hover:border-gray-400
        disabled:bg-gray-100 disabled:cursor-not-allowed
        ${className || ''}
      `}
      {...rest}
    />
  );
};