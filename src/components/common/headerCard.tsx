import { ReactNode } from 'react';

interface HeaderCardProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  rightContent?: ReactNode;
  variant?: 'default' | 'gradient';
}

const HeaderCard = ({ 
  title, 
  subtitle, 
  icon, 
  rightContent,
  variant = 'default'
}: HeaderCardProps) => {
  return (
    <div 
      className={`rounded-xl shadow-md p-6 ${
        variant === 'gradient' 
          ? 'bg-gradient-to-r from-[#970747] to-[#C21563]' 
          : 'bg-[#970747]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="text-white/80 mt-1 text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        {rightContent && (
          <div className="flex items-center">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeaderCard;