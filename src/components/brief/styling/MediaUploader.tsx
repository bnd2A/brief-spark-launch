
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BriefStyle } from '@/hooks/useBriefForm';
import { Upload, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MediaUploaderProps {
  type: 'logo' | 'background';
  value?: string;
  onChange: (value: string | undefined) => void;
}

export function MediaUploader({ type, value, onChange }: MediaUploaderProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      setUploading(true);
      setUploadSuccess(false);
      
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 2MB",
          variant: "destructive"
        });
        return;
      }

      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;
      
      // Create bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage
        .getBucket('brief-assets');
        
      if (bucketError && bucketError.message.includes('The resource was not found')) {
        const { error: createError } = await supabase.storage.createBucket('brief-assets', {
          public: true
        });
        
        if (createError) {
          throw createError;
        }
      }
      
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
        
      onChange(data.publicUrl);
      setUploadSuccess(true);
      
      toast({
        title: `${type === 'logo' ? 'Logo' : 'Background'} uploaded`,
        description: `Your ${type} has been uploaded successfully.`
      });
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Upload failed",
        description: `There was a problem uploading your ${type}.`,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    setUploadSuccess(false);
  };

  const getTitle = () => {
    return type === 'logo' ? 'Logo' : 'Background image';
  };

  const getRecommendation = () => {
    return type === 'logo' ? 'PNG or SVG' : 'JPG or PNG';
  };

  return (
    <div>
      <Label className="mb-1 block">{getTitle()}</Label>
      {value ? (
        <div className="flex flex-col items-center p-4 border rounded-md">
          <img 
            src={value} 
            alt={`${type === 'logo' ? 'Brand logo' : 'Background image'}`} 
            className={`max-h-40 ${type === 'background' ? 'w-full object-cover' : 'object-contain'} mb-4`} 
          />
          <Button 
            variant="outline" 
            onClick={handleRemove}
          >
            Remove {type}
          </Button>
        </div>
      ) : (
        <div className="p-6 border border-dashed rounded-md text-center">
          {uploadSuccess ? (
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">Upload successful!</p>
              <p className="text-xs text-muted-foreground mb-4">
                Your file has been uploaded successfully
              </p>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm mb-2">Upload {type === 'logo' ? 'your logo' : 'a background image'}</p>
              <p className="text-xs text-muted-foreground mb-4">
                Recommended: {getRecommendation()}, max 2MB
              </p>
            </>
          )}
          <div>
            <Button 
              variant="outline" 
              disabled={uploading}
              onClick={() => document.getElementById(`${type}-upload`)?.click()}
            >
              {uploading ? 'Uploading...' : uploadSuccess ? 'Upload another' : `Upload ${type}`}
            </Button>
            <Input
              id={`${type}-upload`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
