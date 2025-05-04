
import React, { useState, useRef } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Image, Upload } from 'lucide-react';

const formSchema = z.object({
  companyName: z.string().min(1, { message: "Company name is required" }),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, { message: "Must be a valid hex color" }),
  removeBranding: z.boolean(),
  customDomain: z.string().optional(),
});

const BrandingSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      primaryColor: '#0f172a',
      removeBranding: false,
      customDomain: '',
    },
  });
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setIsUploading(true);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
      setIsUploading(false);
      
      toast({
        title: "Logo uploaded",
        description: "Your logo has been uploaded successfully.",
      });
    };
    
    reader.readAsDataURL(file);
  };
  
  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast({
      title: "Logo removed",
      description: "Your logo has been removed successfully.",
    });
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call to update branding settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Branding updated",
        description: "Your branding settings have been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update branding settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Branding Settings</h3>
        <p className="text-sm text-muted-foreground">
          Customize how your briefs appear to respondents
        </p>
      </div>
      <Separator />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="logo">Company Logo</Label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-24 h-24 border rounded flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company logo preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2">
                  <div>
                    <input
                      id="logo"
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {logoPreview ? "Change Logo" : "Upload Logo"}
                    </Button>
                  </div>
                  {logoPreview && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={removeLogo}
                      disabled={isUploading}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove Logo
                    </Button>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Recommended size: 200x200px. Max size: 2MB.
                  </p>
                </div>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Your Company Name" />
                  </FormControl>
                  <FormDescription>
                    This will be displayed on your briefs and in emails
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Primary Color</FormLabel>
                  <div className="flex items-center space-x-2">
                    <Input {...field} type="color" className="w-12 h-10 p-1" />
                    <Input
                      value={field.value}
                      onChange={field.onChange}
                      className="w-28"
                      placeholder="#000000"
                    />
                  </div>
                  <FormDescription>
                    This color will be used for buttons and accents in your briefs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="removeBranding"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Remove "Powered by Briefly"
                    </FormLabel>
                    <FormDescription>
                      Remove our branding from your customer-facing pages
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="customDomain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Domain</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="briefs.yourcompany.com" />
                  </FormControl>
                  <FormDescription>
                    Available on Business plans only. Contact support to set up.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Branding Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BrandingSettings;
