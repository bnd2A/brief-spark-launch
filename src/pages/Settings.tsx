
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettings from '@/components/settings/AccountSettings';
import SubscriptionSettings from '@/components/settings/SubscriptionSettings';
import PaymentSettings from '@/components/settings/PaymentSettings';
import { Card } from '@/components/ui/card';

const Settings = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Determine the active tab based on query parameters or default to "account"
  let initialTab = "account";
  if (queryParams.get('success') || queryParams.get('canceled')) {
    initialTab = "subscription";
  }
  
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

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
