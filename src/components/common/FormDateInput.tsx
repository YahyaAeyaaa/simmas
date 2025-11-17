import { LucideIcon, Calendar } from "lucide-react";

interface FormDateInputProps {
  label: string;
  name: string;
  type?: "date" | "datetime-local" | "time" | "month" | "week";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: LucideIcon;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  min?: string; // Minimum date/time
  max?: string; // Maximum date/time
  helperText?: string;
}

export default function FormDateInput({
  label,
  name,
  type = "date",
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  disabled = false,
  required = false,
  className = "",
  min,
  max,
  helperText
}: FormDateInputProps) {
  // Format display text based on type
  const getDisplayText = () => {
    if (!value) return "";
    
    try {
      switch (type) {
        case "date": {
          const date = new Date(value);
          return date.toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
          });
        }
        case "datetime-local": {
          const date = new Date(value);
          return date.toLocaleString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
          });
        }
        case "time": {
          return value;
        }
        case "month": {
          const [year, month] = value.split("-");
          const date = new Date(parseInt(year), parseInt(month) - 1);
          return date.toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long"
          });
        }
        case "week": {
          return value;
        }
        default:
          return value;
      }
    } catch (e) {
      return value;
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        
        <input
          type={type}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error 
              ? "border-red-500 focus:ring-red-200" 
              : "border-gray-300 focus:ring-cyan-200 focus:border-cyan-500"
          }`}
        />
      </div>

      {/* Display formatted date */}
      {value && !error && (
        <p className="mt-1 text-xs text-gray-500">
          {getDisplayText()}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && !value && (
        <p className="mt-1 text-xs text-gray-500">{helperText}</p>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

