
import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plus, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Mock payment method data
const MOCK_PAYMENT_METHODS = [
  {
    id: 'card_1',
    type: 'card',
    brand: 'visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
    isDefault: true
  }
];

const PaymentSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This would be replaced with actual payment processor integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Coming soon",
        description: "Payment method management will be available soon!",
      });
      
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
      // This would be replaced with actual payment processor API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state for demo purposes
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
      // This would be replaced with actual payment processor API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state for demo purposes
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
                  Add a new credit card or debit card to your account.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddPaymentMethod}>
                <div className="grid gap-4 py-4">
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
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Adding..." : "Add Card"}
                  </Button>
                </DialogFooter>
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
                    <CreditCard className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="font-medium capitalize">
                        {method.brand} •••• {method.last4} 
                        {method.isDefault && <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Default</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expires {method.expMonth}/{method.expYear}
                      </p>
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
              <p className="text-muted-foreground">No payment methods added yet.</p>
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
