
import React, { useEffect, useState } from 'react';
import { XCircle, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { createRoot } from 'react-dom/client';

type ToastType = 'success' | 'warning' | 'danger';
type ToastPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';

interface ToastProps {
  type?: ToastType;
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
  position?: ToastPosition;
}

const typeConfig = {
  success: {
    Icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    progressBg: 'bg-green-600',
    border: 'border-green-200',
  },
  warning: {
    Icon: AlertTriangle,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    progressBg: 'bg-amber-600',
    border: 'border-amber-200',
  },
  danger: {
    Icon: XCircle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-600',
    progressBg: 'bg-red-600',
    border: 'border-red-200',
  },
};

const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-5 left-5',
  'top-right': 'top-5 right-5',
  'bottom-left': 'bottom-5 left-5',
  'bottom-right': 'bottom-5 right-5',
  'top-center': 'top-5 left-1/2 -translate-x-1/2',
  'bottom-center': 'bottom-5 left-1/2 -translate-x-1/2',
};

const ToastCustom: React.FC<ToastProps> = ({
  type = 'success',
  title,
  description,
  duration = 5000,
  onClose,
  position = 'top-right',
}) => {
  const [progress, setProgress] = useState(100);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          handleClose();
          return 0;
        }
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const config = typeConfig[type];
  const Icon = config.Icon;

  return (
    <div
      className={`fixed z-50 max-w-[420px] min-w-[300px] transition-all duration-300 ease-out ${
        positionClasses[position]
      } ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'
      }`}
    >
      <div
        className={`bg-white rounded-xl p-4 flex items-start gap-3 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)] border ${config.border}`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.iconBg} ${config.iconColor}`}
        >
          <Icon size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-semibold text-gray-800 mb-1 leading-snug">
            {title}
          </div>
          {description && (
            <div className="text-sm text-gray-600 leading-snug mb-2">
              {description}
            </div>
          )}
          <div className="w-full h-[3px] bg-gray-100 rounded-sm overflow-hidden">
            <div
              className={`h-full transition-all duration-100 linear rounded-sm ${config.progressBg}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded flex items-center justify-center flex-shrink-0 transition-all duration-200"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Toast Manager Function
export const Toasts = (
  type: ToastType = 'success',
  duration: number = 3000,
  title: string,
  description?: string
): void => {
  if (typeof window === 'undefined') return;

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  const div = document.createElement('div');
  container.appendChild(div);

  const removeToast = () => {
    root.unmount();
    if (container && div.parentNode === container) {
      container.removeChild(div);
    }
  };

  const root = createRoot(div);
  root.render(
    <ToastCustom
      type={type}
      title={title}
      description={description}
      duration={duration}
      onClose={removeToast}
      position="top-right"
    />
  );
};

// Demo Component
export default function ToastDemo(p0: string, p1: number, p2: string) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Toast Notification Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Klik button dibawah untuk test toast notification
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() =>
                Toasts(
                  'success',
                  5000,
                  'Berhasil!',
                  'Data berhasil disimpan ke database'
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Success Toast
            </button>

            <button
              onClick={() =>
                Toasts(
                  'warning',
                  5000,
                  'Peringatan',
                  'Periksa kembali data sebelum melanjutkan'
                )
              }
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Warning Toast
            </button>

            <button
              onClick={() =>
                Toasts(
                  'danger',
                  5000,
                  'Error!',
                  'Terjadi kesalahan saat memproses data'
                )
              }
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Danger Toast
            </button>
          </div>

          {/* <div className="mt-8 p-6 bg-slate-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Cara Pakai:
            </h2>
            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <code className="bg-slate-200 px-2 py-1 rounded">
                  Toasts(&apos;success&apos;, 3000, &apos;Judul&apos;, &apos;Deskripsi&apos;)
                </code>
              </p>
              <p>
                <code className="bg-slate-200 px-2 py-1 rounded">
                  Toasts(&apos;warning&apos;, 5000, &apos;Peringatan&apos;)
                </code>
              </p>
              <p>
                <code className="bg-slate-200 px-2 py-1 rounded">
                  Toasts(&apos;danger&apos;, 4000, &apos;Error&apos;, &apos;Detail error&apos;)
                </code>
              </p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}   