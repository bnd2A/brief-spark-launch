
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BriefStyle } from '@/hooks/useBriefForm';
import { Palette, Type, Layout, Upload, Image } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BriefStylingProps {
  style: BriefStyle;
  onChange: (style: BriefStyle) => void;
}

const fontOptions = [
  { value: 'Inter, sans-serif', label: 'Inter (Default)' },
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' }
];

const headerOptions = [
  { value: 'default', label: 'Default Header' },
  { value: 'minimal', label: 'Minimal Header' },
  { value: 'branded', label: 'Branded Header' }
];

export function BriefStyling({ style, onChange }: BriefStylingProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const updateStyle = (updates: Partial<BriefStyle>) => {
    onChange({ ...style, ...updates });
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      setUploading(true);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `logos/${fileName}`;
      
      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('brief-assets')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('brief-assets')
        .getPublicUrl(filePath);
        
      updateStyle({ logo: data.publicUrl });
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully."
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your logo.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    updateStyle({ logo: undefined });
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
        
        <TabsContent value="colors" className="space-y-4">
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
                onChange={(e) => updateStyle({ primaryColor: e.target.value })}
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
                onChange={(e) => updateStyle({ secondaryColor: e.target.value })}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="typography" className="space-y-4">
          <div>
            <Label htmlFor="fontFamily" className="mb-1 block">Font family</Label>
            <Select 
              value={style.fontFamily || 'Inter, sans-serif'} 
              onValueChange={(value) => updateStyle({ fontFamily: value })}
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
        </TabsContent>
        
        <TabsContent value="layout" className="space-y-4">
          <div>
            <Label htmlFor="headerStyle" className="mb-1 block">Header style</Label>
            <Select 
              value={style.headerStyle || 'default'} 
              onValueChange={(value) => updateStyle({ 
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
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <div>
            <Label className="mb-1 block">Logo</Label>
            {style.logo ? (
              <div className="flex flex-col items-center p-4 border rounded-md">
                <img 
                  src={style.logo} 
                  alt="Brand logo" 
                  className="max-h-40 object-contain mb-4" 
                />
                <Button 
                  variant="outline" 
                  onClick={handleRemoveLogo}
                >
                  Remove logo
                </Button>
              </div>
            ) : (
              <div className="p-6 border border-dashed rounded-md text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm mb-2">Upload your logo</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Recommended: PNG or SVG, max 2MB
                </p>
                <div>
                  <Button 
                    variant="outline" 
                    disabled={uploading}
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    {uploading ? 'Uploading...' : 'Upload logo'}
                  </Button>
                  <Input
                    id="logo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={uploading}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="backgroundImage" className="mb-1 block">Background image URL</Label>
            <Input 
              id="backgroundImage"
              type="text" 
              placeholder="https://example.com/image.jpg" 
              value={style.backgroundImage || ''} 
              onChange={(e) => updateStyle({ backgroundImage: e.target.value })}
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
