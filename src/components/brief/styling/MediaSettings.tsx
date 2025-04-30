
import React from 'react';
import { BriefStyle } from '@/hooks/useBriefForm';
import { MediaUploader } from './MediaUploader';

interface MediaSettingsProps {
  style: BriefStyle;
  onChange: (updates: Partial<BriefStyle>) => void;
}

export function MediaSettings({ style, onChange }: MediaSettingsProps) {
  return (
    <div className="space-y-6">
      <MediaUploader 
        type="logo"
        value={style.logo}
        onChange={(value) => onChange({ logo: value })}
      />
      
      <MediaUploader 
        type="background"
        value={style.backgroundImage}
        onChange={(value) => onChange({ backgroundImage: value })}
      />
    </div>
  );
}
