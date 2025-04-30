
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BriefStyle } from '@/hooks/useBriefForm';

interface ColorSettingsProps {
  style: BriefStyle;
  onChange: (updates: Partial<BriefStyle>) => void;
}

export function ColorSettings({ style, onChange }: ColorSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="primaryColor" className="mb-1 block">Primary color</Label>
        <div className="flex gap-3">
          <div 
            className="w-10 h-10 rounded-md border" 
            style={{ backgroundColor: style.primaryColor || '#9b87f5' }}
          />
          <Input 
            id="primaryColor"
            type="text" 
            value={style.primaryColor || '#9b87f5'} 
            onChange={(e) => onChange({ primaryColor: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="secondaryColor" className="mb-1 block">Secondary color</Label>
        <div className="flex gap-3">
          <div 
            className="w-10 h-10 rounded-md border" 
            style={{ backgroundColor: style.secondaryColor || '#f1f0fb' }}
          />
          <Input 
            id="secondaryColor"
            type="text" 
            value={style.secondaryColor || '#f1f0fb'} 
            onChange={(e) => onChange({ secondaryColor: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
