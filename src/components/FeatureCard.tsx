
import React from 'react';
import { Book, Download, Folder, Pencil, Save, Share } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: 'pencil' | 'share' | 'folder' | 'download' | 'book' | 'save';
  className?: string;
}

const FeatureCard = ({ title, description, icon, className }: FeatureCardProps) => {
  const getIcon = () => {
    switch (icon) {
      case 'pencil': return <Pencil size={24} />;
      case 'share': return <Share size={24} />;
      case 'folder': return <Folder size={24} />;
      case 'download': return <Download size={24} />;
      case 'book': return <Book size={24} />;
      case 'save': return <Save size={24} />;
      default: return <Pencil size={24} />;
    }
  };

  return (
    <div className={cn(
      "relative p-6 rounded-xl border bg-background/60 backdrop-blur-sm hover:shadow-md transition-shadow duration-300",
      className
    )}>
      <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default FeatureCard;
