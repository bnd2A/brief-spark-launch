
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

  // Get logo size with a default of 100%
  const logoSize = style.logoSize || 100;

  // Calculate logo position styles
  const getLogoStyles = (): React.CSSProperties => {
    if (!style.logo) return {};
    
    return {
      position: 'relative' as const,
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1rem',
    };
  };

  const getLogoImageStyles = (): React.CSSProperties => {
    if (!style.logo) return {};
    
    // Default position if not specified
    const position = style.logoPosition || { x: 50, y: 20 };
    
    return {
      maxHeight: `${logoSize}px`,
      objectFit: 'contain' as const,
      position: style.headerStyle === 'branded' ? 'relative' as const : 'absolute' as const,
      left: style.headerStyle === 'branded' ? 'auto' : `${position.x}%`,
      top: style.headerStyle === 'branded' ? 'auto' : `${position.y}%`,
      transform: style.headerStyle === 'branded' ? 'none' : 'translate(-50%, -50%)',
    };
  };

  return (
    <div 
      className={headerClasses[style.headerStyle || 'default']} 
      style={{
        backgroundColor: style.headerStyle !== 'minimal' ? style.primaryColor : 'transparent',
        color: style.headerStyle !== 'minimal' ? '#ffffff' : 'inherit',
        position: 'relative',
      }}
    >
      {style.headerStyle === 'branded' && style.logo ? (
        <div className="flex justify-center mb-4" style={getLogoStyles()}>
          <img 
            src={style.logo} 
            alt="Brand logo" 
            style={getLogoImageStyles()}
          />
        </div>
      ) : style.logo && (
        <img 
          src={style.logo} 
          alt="Brand logo" 
          className="absolute z-10"
          style={getLogoImageStyles()}
        />
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
