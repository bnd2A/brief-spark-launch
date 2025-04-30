
import React from 'react';
import { Label } from "@/components/ui/label";
import { BriefStyle } from '@/hooks/useBriefForm';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fontOptions = [
  { value: 'Inter, sans-serif', label: 'Inter (Default)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' }
];

interface TypographySettingsProps {
  style: BriefStyle;
  onChange: (updates: Partial<BriefStyle>) => void;
}

export function TypographySettings({ style, onChange }: TypographySettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="fontFamily" className="mb-1 block">Font family</Label>
        <Select 
          value={style.fontFamily || 'Inter, sans-serif'} 
          onValueChange={(value) => onChange({ fontFamily: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select font" />
          </SelectTrigger>
          <SelectContent>
            {fontOptions.map((font) => (
              <SelectItem key={font.value} value={font.value}>
                <span style={{ fontFamily: font.value }}>{font.label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="p-4 border rounded-md">
        <p className="mb-2 text-sm text-muted-foreground">Font preview:</p>
        <p className="text-2xl" style={{ fontFamily: style.fontFamily || 'Inter, sans-serif' }}>
          The quick brown fox jumps over the lazy dog
        </p>
        <p className="mt-2" style={{ fontFamily: style.fontFamily || 'Inter, sans-serif' }}>
          This is how your text will look in the brief.
        </p>
      </div>
    </div>
  );
}
