
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
}

// This interface should match the user_subscriptions table structure
interface UserSubscription {
  id: string;
  user_id: string;
  subscription_id: string;
  status: string;
  plan_id: string;
  plan_name: string | null;
  interval: string | null;
  next_billing_time: string | null;
  created_at: string;
  updated_at: string;
}

const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    description: 'Try Briefly',
    price: 0,
    interval: 'FOREVER',
    features: [
      '1 active brief',
      '7-day Pro trial',
      '"Made with Briefly" branding',
    ]
  },
  {
    id: 'pro_monthly',
    name: 'Freelance Pro',
    description: 'Everything you need for professional work',
    price: 9,
    interval: 'MONTH',
    features: [
      'Unlimited briefs',
      'PDF & Markdown export',
      'White-labeling (remove branding)',
      'Custom background & logo',
      'Email notifications',
      'Priority support',
      '3 ready-to-use templates'
    ]
  },
  {
    id: 'pro_yearly',
    name: 'Freelance Pro (Yearly)',
    description: 'Save 22% with annual billing',
    price: 84,
    interval: 'YEAR',
    features: [
      'Unlimited briefs',
      'PDF & Markdown export',
      'White-labeling (remove branding)',
      'Custom background & logo',
      'Email notifications',
      'Priority support',
      '3 ready-to-use templates'
    ]
  }
];

const SubscriptionSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  
  // Check for success or canceled URL parameters (for PayPal return)
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    
    if (success) {
      toast({
        title: "Subscription successful",
        description: "Your subscription has been activated. Thank you!",
      });
      // Remove the query parameters
      window.history.replaceState({}, document.title, location.pathname);
      // Refresh subscription data
      refetchSubscription();
    } else if (canceled) {
      toast({
        title: "Subscription canceled",
        description: "You've canceled the subscription process.",
        variant: "destructive",
      });
      // Remove the query parameters
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location, toast]);
  
  // Fetch user's current subscription
  const { 
    data: userSubscription, 
    isLoading: isLoadingSubscription, 
    refetch: refetchSubscription 
  } = useQuery({
    queryKey: ['userSubscription', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        // Check if user_subscriptions table exists first
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) {
          console.error("Error fetching subscription:", error);
          return null;
        }
        
        return data as UserSubscription | null;
      } catch (error) {
        console.error("Error fetching subscription:", error);
        return null;
      }
    },
    enabled: !!user
  });
  
  const currentPlanId = userSubscription ? 
    (userSubscription.interval === 'MONTH' ? 'pro_monthly' : 
     userSubscription.interval === 'YEAR' ? 'pro_yearly' : 'free') : 
    'free';
  
  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Use the correct URL format for Supabase Edge Functions
      const response = await fetch(`https://zdpileidtdzlambmbsiq.supabase.co/functions/v1/paypal-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          userId: user.id,
          action: 'create_subscription',
          planType: planId
        })
      });
      
      // Check if response is OK before trying to parse JSON
      if (!response.ok) {
        const errorText = await response.text();
        console.error('PayPal API error:', errorText);
        throw new Error(`Failed to create subscription (${response.status})`);
      }
      
      const result = await response.json();
      
      // Redirect to PayPal approval URL
      window.location.href = result.approve_url;
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Error",
        description: error.message || "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelSubscription = async () => {
    if (!user || !userSubscription) {
      toast({
        title: "Error",
        description: "No active subscription found to cancel.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a production app, this would connect to the PayPal API to cancel the subscription
      const confirmCancel = window.confirm("Are you sure you want to cancel your subscription? Your subscription will remain active until the end of the current billing period.");
      
      if (!confirmCancel) {
        setIsLoading(false);
        return;
      }
      
      // Simulate API call for demonstration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Subscription Canceled",
        description: "Your subscription will remain active until the end of the billing period."
      });
      
      // Refresh subscription data
      refetchSubscription();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to cancel subscription",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading state
  if (isLoadingSubscription) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">Subscription Plans</h3>
          <p className="text-sm text-muted-foreground">
            Choose the plan that works best for you
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
        <h3 className="text-lg font-medium">Subscription Plans</h3>
        <p className="text-sm text-muted-foreground">
          Choose the plan that works best for you
        </p>
      </div>
      <Separator />
      
      {userSubscription && userSubscription.status === 'ACTIVE' && (
        <Card className="bg-primary/5 border-primary/20 mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Current Subscription</CardTitle>
            <CardDescription>
              You are currently on the {userSubscription.plan_name || 'Pro'} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">
                  Status: <span className="font-medium text-foreground">Active</span>
                </p>
                {userSubscription.next_billing_time && (
                  <p className="text-sm text-muted-foreground">
                    Next billing date: <span className="font-medium text-foreground">
                      {new Date(userSubscription.next_billing_time).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
              <Badge variant="outline" className="bg-primary/10">
                {userSubscription.interval === 'MONTH' ? 'Monthly' : 
                 userSubscription.interval === 'YEAR' ? 'Annual' : 'Free'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="grid gap-6 md:grid-cols-3">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <Card key={plan.id} className={`${currentPlanId === plan.id ? 'border-primary' : ''}`}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                {currentPlanId === plan.id && (
                  <Badge className="bg-primary">Current Plan</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                {plan.id === 'free' ? (
                  <span className="text-3xl font-bold">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{plan.interval.toLowerCase() === 'month' ? 'month' : 'year'}</span>
                  </>
                )}
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
              {currentPlanId === plan.id ? (
                <Button disabled className="w-full" variant="outline">
                  Current Plan
                </Button>
              ) : (
                <Button 
                  className="w-full" 
                  onClick={() => handleUpgrade(plan.id)}
                  disabled={isLoading || plan.id === 'free'}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : plan.price > 0 ? 'Upgrade' : 'Downgrade'}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-8">
        <h4 className="text-md font-medium mb-4">Future Plans</h4>
        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle>Coming Soon - "Agency Pack"</CardTitle>
            <CardDescription>Advanced features for agencies and teams</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Agency features including multi-user support, client portal, CRM sync, and more.</p>
            <div className="mt-4">
              <Button variant="outline" disabled>Get Notified</Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {userSubscription && userSubscription.status === 'ACTIVE' && (
        <div className="mt-8">
          <Button 
            variant="outline" 
            className="text-destructive hover:text-destructive"
            onClick={handleCancelSubscription}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : "Cancel Subscription"}
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
