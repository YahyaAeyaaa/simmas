import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
}

export const Button = ({ 
  text, 
  type = "button", 
  className, 
  onClick, 
  disabled,
  ...rest
}: ButtonProps) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      {...rest}
    >
      {text}
    </button>
  );
};