
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, PaypalIcon, Plus, Edit2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// PayPal icon component
const PaypalIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="text-blue-600"
  >
    <path 
      d="M20.4061 7.53C20.1791 9.32 19.1101 10.7 17.5001 11.3L17.9001 13.7C17.9331 13.89 17.7961 14.07 17.6061 14.07H15.6961C15.5401 14.07 15.4161 13.94 15.3961 13.79L14.9961 11.42H13.9961L13.5961 13.8C13.5761 13.95 13.4461 14.07 13.2961 14.07H11.3861C11.1961 14.07 11.0591 13.89 11.0921 13.7L11.4921 11.31C10.6457 11.0518 9.86949 10.6128 9.22146 10.0249C8.57342 9.43711 8.07179 8.714 7.75608 7.91053C7.44037 7.10707 7.31757 6.24426 7.39825 5.38709C7.47894 4.52992 7.76093 3.70465 8.22014 2.97571C8.67935 2.24678 9.30299 1.63417 10.0411 1.18844C10.7792 0.742715 11.6103 0.477613 12.4701 0.414321C13.3299 0.35103 14.1916 0.490957 14.9923 0.82252C15.793 1.15408 16.5107 1.66942 17.0825 2.32764C17.6544 2.98586 18.0649 3.77019 18.2817 4.62035C18.4985 5.47052 18.5161 6.36326 18.3331 7.22C18.2991 7.33 18.2621 7.43 18.2221 7.53H20.4061ZM6.79609 14.1C6.64009 14.94 6.05609 15.74 5.08609 16.1C4.72358 16.234 4.34234 16.3106 3.95609 16.327C2.24609 16.467 0.756094 15.367 0.396094 13.717C0.0290938 12.07 1.09609 10.39 2.79609 10.26C2.92609 10.247 3.10609 10.247 3.22609 10.26C4.36609 10.35 5.36609 11.047 5.94609 12.087C6.41909 12.88 6.74609 13.63 6.79609 14.1ZM23.6001 10.26C23.6001 10.26 23.6001 10.26 23.6001 10.27C23.2401 11.92 21.7501 13.02 20.0401 12.88C19.6323 12.8646 19.2293 12.7861 18.8461 12.647C17.8761 12.287 17.2861 11.487 17.1361 10.647C17.0861 10.177 17.4121 9.427 17.8861 8.637C18.4661 7.597 19.4661 6.9 20.6061 6.81C20.7261 6.797 20.9061 6.797 21.0361 6.81C22.7361 6.94 23.8061 8.62 23.6001 10.26Z" 
      fill="currentColor"
    />
  </svg>
);

// Mock payment method data
const MOCK_PAYMENT_METHODS = [
  {
    id: 'pm_1',
    type: 'paypal',
    email: 'user@example.com',
    isDefault: true
  }
];

interface PaymentMethod {
  id: string;
  type: string;
  email?: string;
  last4?: string;
  brand?: string;
  expMonth?: number;
  expYear?: number;
  isDefault: boolean;
}

const PaymentSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enableCreditCard, setEnableCreditCard] = useState(false);
  
  // Fetch user's payment methods
  const { data: fetchedPaymentMethods, isLoading: isLoadingPaymentMethods } = useQuery({
    queryKey: ['paymentMethods', user?.id],
    queryFn: async () => {
      // In a real app, we'd fetch this from our database
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, return mock data or empty array based on user
      return user ? MOCK_PAYMENT_METHODS : [];
    },
    enabled: !!user
  });
  
  // Update state when data is fetched
  useEffect(() => {
    if (fetchedPaymentMethods) {
      setPaymentMethods(fetchedPaymentMethods);
    }
  }, [fetchedPaymentMethods]);
  
  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      toast({
        title: "PayPal Connected",
        description: "Your PayPal account has been connected successfully.",
      });
      
      // Add mock PayPal account
      const newMethod: PaymentMethod = {
        id: `pm_${Date.now()}`,
        type: "paypal",
        email: "user@example.com",
        isDefault: paymentMethods.length === 0,
      };
      
      setPaymentMethods([...paymentMethods, newMethod]);
      setIsDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add payment method",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemovePaymentMethod = async (id: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      
      toast({
        title: "Payment method removed",
        description: "Your payment method has been removed successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove payment method",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSetDefaultPaymentMethod = async (id: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      })));
      
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update default payment method",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoadingPaymentMethods) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Payment Methods</h3>
          <p className="text-sm text-muted-foreground">
            Manage your payment methods and billing information
          </p>
        </div>
        <Separator />
        <div className="flex justify-center items-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <p className="text-sm text-muted-foreground">
          Manage your payment methods and billing information
        </p>
      </div>
      <Separator />
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-md font-medium">Your Payment Methods</h4>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Payment Method</DialogTitle>
                <DialogDescription>
                  Connect your PayPal account or add a credit/debit card.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddPaymentMethod}>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="enable-card">Credit/Debit Card</Label>
                    </div>
                    <Switch 
                      id="enable-card" 
                      checked={enableCreditCard} 
                      onCheckedChange={setEnableCreditCard} 
                    />
                  </div>
                  
                  {enableCreditCard ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expDate">Expiration Date</Label>
                          <Input id="expDate" placeholder="MM / YY" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input id="cvc" placeholder="123" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input id="cardName" placeholder="John Doe" />
                      </div>
                    </>
                  ) : (
                    <div className="bg-muted/40 p-4 rounded-lg text-center">
                      <div className="flex justify-center mb-3">
                        <PaypalIcon />
                      </div>
                      <p className="text-sm mb-4">Connect with PayPal to securely pay using your PayPal account, debit or credit cards.</p>
                      <Button 
                        variant="outline" 
                        className="bg-blue-50 text-blue-600 border-blue-200"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <PaypalIcon />
                            <span className="ml-2">Connect with PayPal</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
                
                {enableCreditCard && (
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Card"}
                    </Button>
                  </DialogFooter>
                )}
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        {paymentMethods.length > 0 ? (
          paymentMethods.map((method) => (
            <Card key={method.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {method.type === 'card' ? (
                      <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    ) : (
                      <PaypalIcon />
                    )}
                    <div>
                      <p className="font-medium">
                        {method.type === 'card' 
                          ? `${method.brand} •••• ${method.last4}`
                          : `PayPal (${method.email})`
                        } 
                        {method.isDefault && <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Default</span>}
                      </p>
                      {method.type === 'card' && method.expMonth && method.expYear && (
                        <p className="text-xs text-muted-foreground">
                          Expires {method.expMonth}/{method.expYear}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.isDefault && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleSetDefaultPaymentMethod(method.id)}
                        disabled={isLoading}
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemovePaymentMethod(method.id)}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-muted-foreground mb-4">No payment methods added yet.</p>
              <Button 
                className="mt-4" 
                onClick={() => setIsDialogOpen(true)}
              >
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="mt-8">
        <h4 className="text-md font-medium mb-4">Billing History</h4>
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No billing history available.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentSettings;
