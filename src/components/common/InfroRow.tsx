
import React from 'react';
import { User, Building2, MapPin, Calendar, LucideIcon } from 'lucide-react';

// Info Row Component
interface InfoRowProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  valueClass?: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ 
  icon: Icon, 
  label, 
  value, 
  valueClass = "text-gray-800" 
}) => {
  return (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-gray-400" />}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className={`text-sm font-medium ${valueClass} text-right max-w-[60%]`}>
        {value}
      </span>
    </div>
  );
};

export default InfoRow;
