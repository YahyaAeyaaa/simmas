import { LucideIcon, Upload, X, File, Image as ImageIcon } from "lucide-react";
import { useState, useRef } from "react";

interface FormFileInputProps {
  label: string;
  name: string;
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: string; // e.g., "image/*", ".pdf,.doc,.docx"
  maxSize?: number; // in MB
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  showPreview?: boolean; // Show image preview
  icon?: LucideIcon;
  helperText?: string;
}

export default function FormFileInput({
  label,
  name,
  value,
  onChange,
  accept = "*",
  maxSize = 5, // Default 5MB
  error,
  disabled = false,
  required = false,
  className = "",
  showPreview = true,
  icon: Icon,
  helperText
}: FormFileInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if file is an image
  const isImage = (file: File) => {
    return file.type.startsWith("image/");
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  // Handle file selection
  const handleFileChange = (file: File | null) => {
    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }

    // Validate file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`Ukuran file terlalu besar! Maksimal ${maxSize}MB`);
      return;
    }

    onChange(file);

    // Generate preview for images
    if (isImage(file) && showPreview) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  // Handle remove file
  const handleRemove = () => {
    handleFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Handle click on drop area
  const handleClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept={accept}
        onChange={handleInputChange}
        disabled={disabled}
        className="hidden"
      />

      {/* Drop area */}
      {!value && (
        <div
          onClick={handleClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-cyan-400 hover:bg-cyan-50'}
            ${dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-gray-300'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            {Icon ? (
              <Icon size={40} className="text-gray-400" />
            ) : (
              <Upload size={40} className="text-gray-400" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-700">
                Klik untuk upload atau drag & drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {helperText || `Maksimal ${maxSize}MB`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* File preview */}
      {value && (
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <div className="flex items-start gap-4">
            {/* Image preview or file icon */}
            <div className="flex-shrink-0">
              {preview && showPreview ? (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                  {isImage(value) ? (
                    <ImageIcon size={32} className="text-gray-400" />
                  ) : (
                    <File size={32} className="text-gray-400" />
                  )}
                </div>
              )}
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {value.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(value.size)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {value.type || "Unknown type"}
              </p>
            </div>

            {/* Remove button */}
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex-shrink-0 p-1 hover:bg-red-50 rounded-full transition-colors"
              >
                <X size={20} className="text-red-500" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

