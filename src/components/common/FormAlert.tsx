import { AlertCircle, Info, CheckCircle, XCircle, LucideIcon } from "lucide-react";

type AlertType = "warning" | "info" | "success" | "error";

interface FormAlertProps {
  type: AlertType;
  title?: string;
  message: string;
  className?: string;
}

const alertConfig: Record<AlertType, {
  bgColor: string;
  borderColor: string;
  textColor: string;
  titleColor: string;
  icon: LucideIcon;
}> = {
  warning: {
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    titleColor: "text-amber-800",
    icon: AlertCircle
  },
  info: {
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    titleColor: "text-blue-800",
    icon: Info
  },
  success: {
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    titleColor: "text-green-800",
    icon: CheckCircle
  },
  error: {
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    titleColor: "text-red-800",
    icon: XCircle
  }
};

export default function FormAlert({
  type,
  title,
  message,
  className = ""
}: FormAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-3 ${className}`}>
      <div className="flex gap-2">
        <Icon size={20} className={`${config.textColor} flex-shrink-0 mt-0.5`} />
        <div>
          {title && (
            <p className={`text-sm font-medium ${config.titleColor}`}>{title}</p>
          )}
          <p className={`text-sm ${config.textColor} ${title ? 'mt-0.5' : ''}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}
