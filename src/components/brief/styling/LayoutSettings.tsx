
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

const headerOptions = [
  { value: 'default', label: 'Default Header' },
  { value: 'minimal', label: 'Minimal Header' },
  { value: 'branded', label: 'Branded Header' }
];

interface LayoutSettingsProps {
  style: BriefStyle;
  onChange: (updates: Partial<BriefStyle>) => void;
}

export function LayoutSettings({ style, onChange }: LayoutSettingsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="headerStyle" className="mb-1 block">Header style</Label>
        <Select 
          value={style.headerStyle || 'default'} 
          onValueChange={(value) => onChange({ 
            headerStyle: value as 'default' | 'minimal' | 'branded' 
          })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select header style" />
          </SelectTrigger>
          <SelectContent>
            {headerOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
