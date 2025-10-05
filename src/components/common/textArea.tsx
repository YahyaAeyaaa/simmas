// File: components/common/FormTextarea.tsx
import { LucideIcon } from "lucide-react";

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
}

export default function FormTextarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  disabled = false,
  required = false,
  className = "",
  rows = 4,
  maxLength,
  showCharCount = false
}: FormTextareaProps) {
  const charCount = value.length;
  const isNearLimit = maxLength && charCount >= maxLength * 0.9;

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-3 text-gray-400 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none ${
            error 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:ring-cyan-200 focus:border-cyan-500"
          }`}
        />
      </div>
      
      {/* Error or Character Count */}
      <div className="flex items-center justify-between mt-1">
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        {showCharCount && maxLength && (
          <p className={`text-xs ml-auto ${isNearLimit ? 'text-amber-600' : 'text-gray-500'}`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}