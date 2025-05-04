
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

// Mock subscription data - in a real app, this would come from your backend
const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic features for personal use',
    price: 0,
    features: [
      'Create up to 3 briefs',
      'Basic customization options',
      'Unlimited responses'
    ]
  },
  {
    id: 'pro',
    name: 'Professional',
    description: 'Everything you need for professional work',
    price: 19,
    features: [
      'Create unlimited briefs',
      'Advanced customization',
      'Remove branding',
      'Priority support'
    ]
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Enterprise-grade features for teams',
    price: 49,
    features: [
      'Everything in Professional',
      'Team collaboration',
      'Custom domain',
      'API access',
      'Dedicated support'
    ]
  }
];

const SubscriptionSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentPlan, setCurrentPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(false);
  
  // Simulate loading the user's current plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;
      
      try {
        // In a real app, you would fetch this from your database
        // For now, we'll just simulate a delay
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate getting the current plan - replace with actual DB query
        setCurrentPlan('free'); // Default to free plan
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserPlan();
  }, [user]);
  
  const handleUpgrade = async (planId: string) => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual Stripe checkout or similar
      toast({
        title: "Coming soon",
        description: `Upgrading to ${planId} plan will be available soon!`,
      });
      
      // Simulate success for demo purposes
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upgrade subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Subscription Plans</h3>
        <p className="text-sm text-muted-foreground">
          Choose the plan that works best for you
        </p>
      </div>
      <Separator />
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <p>Loading subscription details...</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <Card key={plan.id} className={`${currentPlan === plan.id ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </div>
                  {currentPlan === plan.id && (
                    <Badge className="bg-primary">Current Plan</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                {currentPlan === plan.id ? (
                  <Button disabled className="w-full" variant="outline">
                    Current Plan
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading}
                  >
                    {plan.price > 0 ? 'Upgrade' : 'Downgrade'}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {currentPlan !== 'free' && (
        <div className="mt-8">
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive"
            onClick={() => handleUpgrade('free')}
            disabled={isLoading}
          >
            Cancel Subscription
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Your subscription will continue until the end of the current billing period
          </p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionSettings;
