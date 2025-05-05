
import React from 'react';
import { BriefStyle } from '@/hooks/useBriefForm';
import { MediaUploader } from './MediaUploader';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DragDropContext } from '@/components/brief/styling/DragDropContext';

interface MediaSettingsProps {
  style: BriefStyle;
  onChange: (updates: Partial<BriefStyle>) => void;
}

export function MediaSettings({ style, onChange }: MediaSettingsProps) {
  const handlePositionChange = (position: { x: number; y: number }) => {
    onChange({ logoPosition: position });
  };

  const handleLogoSizeChange = (value: number[]) => {
    onChange({ logoSize: value[0] });
  };

  return (
    <div className="space-y-6">
      <MediaUploader 
        type="logo"
        value={style.logo}
        onChange={(value) => onChange({ logo: value })}
      />

      {style.logo && (
        <>
          <div className="space-y-2">
            <Label>Logo size</Label>
            <Slider
              defaultValue={[style.logoSize || 100]}
              min={50}
              max={200}
              step={5}
              onValueChange={handleLogoSizeChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Logo position</Label>
            <div className="border rounded-md p-4 bg-muted/30">
              <DragDropContext 
                position={style.logoPosition || { x: 50, y: 20 }}
                onChange={handlePositionChange}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
