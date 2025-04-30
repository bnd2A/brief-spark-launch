
import React from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefStyle } from '@/hooks/useBriefForm';
import { Palette, Type, Layout, Image } from 'lucide-react';
import { ColorSettings } from './styling/ColorSettings';
import { TypographySettings } from './styling/TypographySettings';
import { LayoutSettings } from './styling/LayoutSettings';
import { MediaSettings } from './styling/MediaSettings';

interface BriefStylingProps {
  style: BriefStyle;
  onChange: (style: BriefStyle) => void;
}

export function BriefStyling({ style, onChange }: BriefStylingProps) {
  const updateStyle = (updates: Partial<BriefStyle>) => {
    onChange({ ...style, ...updates });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-medium mb-4">Brief appearance</h2>
      
      <Tabs defaultValue="colors">
        <TabsList className="mb-4">
          <TabsTrigger value="colors">
            <Palette size={16} className="mr-2" /> 
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type size={16} className="mr-2" /> 
            Typography
          </TabsTrigger>
          <TabsTrigger value="layout">
            <Layout size={16} className="mr-2" /> 
            Layout
          </TabsTrigger>
          <TabsTrigger value="media">
            <Image size={16} className="mr-2" /> 
            Media
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors">
          <ColorSettings style={style} onChange={updateStyle} />
        </TabsContent>
        
        <TabsContent value="typography">
          <TypographySettings style={style} onChange={updateStyle} />
        </TabsContent>
        
        <TabsContent value="layout">
          <LayoutSettings style={style} onChange={updateStyle} />
        </TabsContent>
        
        <TabsContent value="media">
          <MediaSettings style={style} onChange={updateStyle} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
