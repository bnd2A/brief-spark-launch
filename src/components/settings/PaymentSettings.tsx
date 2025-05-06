
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
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
import { PaymentMethod } from '@/types/paymentMethod';

// PayPal logo component - using the uploaded image
const PayPalLogo = () => (
  <img 
    src="/lovable-uploads/0f1aa099-86d5-45f5-9d09-51b0ac0b5837.png" 
    alt="PayPal" 
    width="24" 
    height="24"
  />
);

const PaymentSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [enableCreditCard, setEnableCreditCard] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expDate, setExpDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');
  
  // Fetch user's payment methods
  const { data: fetchedPaymentMethods, isLoading: isLoadingPaymentMethods, refetch } = useQuery({
    queryKey: ['paymentMethods', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      try {
        // Cast the response to PaymentMethod[] to resolve type issues
        const { data, error } = await supabase
          .from('payment_methods')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        return (data || []) as PaymentMethod[];
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        return [] as PaymentMethod[];
      }
    },
    enabled: !!user
  });
  
  // Update state when data is fetched
  useEffect(() => {
    if (fetchedPaymentMethods && Array.isArray(fetchedPaymentMethods)) {
      setPaymentMethods(fetchedPaymentMethods);
    }
  }, [fetchedPaymentMethods]);
  
  const connectWithPayPal = async () => {
    setIsLoading(true);
    
    try {
      // Call PayPal subscription function
      const response = await fetch('/api/paypal-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId: user?.id,
          action: 'connect_account'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to connect PayPal account');
      }
      
      const result = await response.json();
      
      if (result.approve_url) {
        // Redirect to PayPal for approval
        window.location.href = result.approve_url;
      } else {
        // Handle success directly if no approval needed
        toast({
          title: "PayPal Connected",
          description: "Your PayPal account has been connected successfully.",
        });
        
        // Add mock PayPal account
        const newMethod: PaymentMethod = {
          id: `pm_paypal_${Date.now()}`,
          user_id: user?.id || '',
          type: "paypal",
          email: user?.email || "user@example.com",
          is_default: paymentMethods.length === 0,
        };
        
        setPaymentMethods([...paymentMethods, newMethod]);
        setIsDialogOpen(false);
        refetch();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to connect PayPal account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Basic validation
    if (!cardNumber || !expDate || !cvc || !cardName) {
      toast({
        title: "Missing information",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // In a real application, you would use a secure payment gateway SDK
      // For this demo, we'll simulate adding the card to the database
      const [expMonth, expYear] = expDate.split('/').map(part => part.trim());
      
      // Create new card record
      const newCardData: Omit<PaymentMethod, 'id'> = {
        user_id: user?.id || '',
        type: 'card',
        last4: cardNumber.slice(-4),
        brand: getCardBrand(cardNumber),
        exp_month: parseInt(expMonth),
        exp_year: parseInt(`20${expYear}`), // Assuming 2-digit year format
        is_default: paymentMethods.length === 0
      };
      
      // Insert into Supabase with type casting
      const { data, error } = await supabase
        .from('payment_methods')
        .insert(newCardData as any)
        .select('*')
        .single();
      
      if (error) throw error;
      
      toast({
        title: "Card Added",
        description: "Your card has been added successfully.",
      });
      
      // Add the new card to local state
      const newCardMethod = data as PaymentMethod;
      
      setPaymentMethods([...paymentMethods, newCardMethod]);
      setIsDialogOpen(false);
      
      // Reset form fields
      setCardNumber('');
      setExpDate('');
      setCvc('');
      setCardName('');
      setEnableCreditCard(false);
      
      // Refresh payment methods
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add card",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getCardBrand = (cardNumber: string): string => {
    // Very basic card brand detection based on first digit
    const firstDigit = cardNumber.charAt(0);
    switch (firstDigit) {
      case '4':
        return 'Visa';
      case '5':
        return 'Mastercard';
      case '3':
        return 'Amex';
      case '6':
        return 'Discover';
      default:
        return 'Unknown';
    }
  };
  
  const handleRemovePaymentMethod = async (id: string) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      
      toast({
        title: "Payment method removed",
        description: "Your payment method has been removed successfully."
      });
      
      // Refresh payment methods
      refetch();
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
      // First, set all payment methods to non-default
      await supabase
        .from('payment_methods')
        .update({ is_default: false } as any)
        .eq('user_id', user?.id);
      
      // Set the selected payment method as default
      await supabase
        .from('payment_methods')
        .update({ is_default: true } as any)
        .eq('id', id);
      
      // Update local state
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        is_default: method.id === id
      })));
      
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated successfully."
      });
      
      // Refresh payment methods
      refetch();
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
              
              <form onSubmit={handleAddCard}>
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
                        <Input 
                          id="cardNumber" 
                          placeholder="1234 5678 9012 3456" 
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expDate">Expiration Date</Label>
                          <Input 
                            id="expDate" 
                            placeholder="MM / YY" 
                            value={expDate}
                            onChange={(e) => setExpDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvc">CVC</Label>
                          <Input 
                            id="cvc" 
                            placeholder="123" 
                            value={cvc}
                            onChange={(e) => setCvc(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Name on Card</Label>
                        <Input 
                          id="cardName" 
                          placeholder="John Doe" 
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
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
                        type="button"
                        onClick={connectWithPayPal}
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
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : "Add Card"}
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
                        {method.is_default && <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">Default</span>}
                      </p>
                      {method.type === 'card' && method.exp_month && method.exp_year && (
                        <p className="text-xs text-muted-foreground">
                          Expires {method.exp_month}/{method.exp_year}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {!method.is_default && (
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
