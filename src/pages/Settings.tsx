
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettings from '@/components/settings/AccountSettings';
import SubscriptionSettings from '@/components/settings/SubscriptionSettings';
import PaymentSettings from '@/components/settings/PaymentSettings';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Determine the active tab based on query parameters or default to "account"
  let initialTab = "account";
  if (queryParams.get('success') || queryParams.get('canceled')) {
    initialTab = "subscription";
  } else if (queryParams.get('paypal_connected')) {
    initialTab = "payment";
  }
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check for success messages in URL params
  useEffect(() => {
    if (queryParams.get('paypal_connected') === 'true') {
      setSuccessMessage('PayPal account successfully connected!');
      setShowSuccessAlert(true);
      
      // Auto-hide the alert after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessAlert(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [queryParams]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        {showSuccessAlert && (
          <Alert className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="ml-2">{successMessage}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-background">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
          </TabsList>
          
          <Card className="p-6">
            <TabsContent value="account" className="space-y-4">
              <AccountSettings />
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-4">
              <SubscriptionSettings />
            </TabsContent>
            
            <TabsContent value="payment" className="space-y-4">
              <PaymentSettings />
            </TabsContent>
          </Card>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
