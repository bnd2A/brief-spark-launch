
import React from 'react';
import { BriefStyle } from '@/hooks/useBriefForm';

interface BriefHeaderProps {
  title: string;
  description: string;
  style: BriefStyle;
}

export const BriefHeader: React.FC<BriefHeaderProps> = ({ title, description, style }) => {
  const headerClasses = {
    default: 'p-6 md:p-8 bg-accent text-accent-foreground',
    minimal: 'p-4 md:p-6 border-b',
    branded: 'p-6 md:p-8 bg-accent text-accent-foreground'
  };

  return (
    <div 
      className={headerClasses[style.headerStyle || 'default']} 
      style={{
        backgroundColor: style.headerStyle !== 'minimal' ? style.primaryColor : 'transparent',
        color: style.headerStyle !== 'minimal' ? '#ffffff' : 'inherit'
      }}
    >
      {style.headerStyle === 'branded' && style.logo && (
        <div className="flex justify-center mb-4">
          <img 
            src={style.logo} 
            alt="Brand logo" 
            className="max-h-16 object-contain" 
          />
        </div>
      )}
      
      <h1 className={`font-bold ${style.headerStyle === 'minimal' ? 'text-xl' : 'text-2xl'} mb-2`}>
        {title}
      </h1>
      <p className={style.headerStyle === 'minimal' ? 'text-muted-foreground text-sm' : ''}>
        {description}
      </p>
    </div>
  );
};
