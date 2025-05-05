
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useQuery } from '@tanstack/react-query';

// PayPal logo component
const PayPalLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M20.9805 6.65C20.2138 9.95583 18.0722 11.325 15.0555 11.325H13.8555C13.4305 11.325 13.0888 11.6333 13.0055 12.05L12.2805 16.8C12.2305 17.0583 12.0222 17.2667 11.7638 17.2667H8.75883C8.41716 17.2667 8.15883 17 8.2255 16.6583L10.0055 4.675C10.0638 4.40833 10.3055 4.21667 10.5805 4.21667H17.6555C18.6222 4.21667 19.5138 4.45833 20.1805 5.00833C20.722 5.45833 21.0555 5.98333 21.1888 6.60833C21.1305 6.29167 21.0805 6.45833 20.9805 6.65Z" fill="#253B80"/>
    <path d="M21.1889 6.61667C21.1139 8.075 20.7806 9.15 20.1139 9.96667C19.0889 11.3583 17.3306 11.8417 15.0556 11.8417H13.3972C12.9639 11.8417 12.5972 12.1417 12.5056 12.5667L11.3056 20.0333C11.2472 20.3583 10.9722 20.5833 10.6472 20.5833H7.78056C7.45556 20.5833 7.22222 20.3333 7.28056 20.0167L7.40556 19.1083L7.92222 15.7333L8.22556 13.9C8.31389 13.475 8.68056 13.175 9.11389 13.175H10.3056C13.7889 13.175 16.3889 11.725 17.2639 7.66667C17.6139 6.075 17.4389 4.75833 16.5889 3.825C16.4722 3.7 16.3306 3.58333 16.1889 3.48333C16.7056 3.46667 17.1972 3.51667 17.6639 3.63333C18.9139 3.975 19.7806 4.63333 20.3389 5.60833C20.7472 6.30833 20.9889 7.15 20.9889 8.09167C21.1889 7.61667 21.1889 7.1 21.1889 6.61667Z" fill="#179BD7"/>
    <path d="M8.24219 11.9917C8.19219 12.3 7.85885 12.5917 7.54219 12.5917H4.60885C4.34219 12.5917 4.11719 12.3917 4.09219 12.125C4.09219 12.1167 4.09219 12.1083 4.09219 12.1V12.0833L4.79219 7.41667C4.85052 7.03333 5.18386 6.75 5.57552 6.75H8.33386C8.56719 6.75 8.77552 6.825 8.95052 6.975C9.30885 7.23333 9.50885 7.65833 9.44219 8.14167C9.20052 9.75833 8.76719 10.9833 8.24219 11.9917Z" fill="#253B80"/>
    <path d="M3.72477 13.0333C3.67477 13.35 3.34977 13.6 2.99977 13.6H0.424766C0.183266 13.6 -0.024734 13.3917 0.000266089 13.15L1.46693 3.48333C1.52527 3.21667 1.76693 3.03333 2.04977 3.03333H6.33311C7.1998 3.03333 7.92476 3.25 8.45809 3.675C9.13311 4.225 9.40809 5.025 9.3081 6.03333C9.0581 8.525 7.5081 10.1083 5.0831 10.1083H3.59144C3.20811 10.1083 2.8831 10.3917 2.80811 10.775L2.4081 13.0333H3.72477Z" fill="#179BD7"/>
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
                        <PayPalLogo />
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
                            <PayPalLogo />
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
                      <PayPalLogo />
                    )}
                    <div className="ml-2">
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
