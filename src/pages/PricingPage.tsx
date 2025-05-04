
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check, LayoutDashboard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PricingPage = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const pricingPlans = [
    {
      name: "Free",
      description: "For individuals just getting started",
      price: {
        monthly: 0,
        yearly: 0,
      },
      features: [
        "3 active briefs",
        "Unlimited responses",
        "Basic form builder",
        "Email notifications",
        "Export to PDF"
      ],
      limitations: [
        "Briefly branding",
        "No custom domains",
        "Basic analytics"
      ],
      buttonText: "Start for free",
      popular: false
    },
    {
      name: "Professional",
      description: "For freelancers and small teams",
      price: {
        monthly: 19,
        yearly: 15,
      },
      features: [
        "20 active briefs",
        "Unlimited responses",
        "Advanced form builder",
        "Email notifications",
        "Export to PDF & Markdown",
        "Remove Briefly branding",
        "Basic analytics"
      ],
      limitations: [],
      buttonText: "Get started",
      popular: true
    },
    {
      name: "Business",
      description: "For agencies and growing teams",
      price: {
        monthly: 49,
        yearly: 39,
      },
      features: [
        "Unlimited active briefs",
        "Unlimited responses",
        "Advanced form builder",
        "Email notifications",
        "Export to all formats",
        "Remove Briefly branding",
        "Custom domain",
        "Advanced analytics",
        "Team collaboration",
        "Priority support"
      ],
      limitations: [],
      buttonText: "Get started",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="mb-6">
              Simple, transparent <span className="gradient-text">pricing</span>
            </h1>
            <p className="text-xl mb-10 text-muted-foreground max-w-3xl mx-auto">
              Get started for free, upgrade as your needs grow. No hidden fees.
            </p>
            
            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-12">
              <Button 
                variant={billingCycle === 'monthly' ? "secondary" : "ghost"} 
                onClick={() => setBillingCycle('monthly')}
                className="rounded-r-none border"
              >
                Monthly
              </Button>
              <Button 
                variant={billingCycle === 'yearly' ? "secondary" : "ghost"} 
                onClick={() => setBillingCycle('yearly')}
                className="rounded-l-none border"
              >
                Yearly <span className="ml-1.5 text-xs bg-accent text-white px-2 py-0.5 rounded-full">Save 20%</span>
              </Button>
            </div>
            
            {/* Pricing Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {pricingPlans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`flex flex-col h-full relative ${plan.popular ? 'border-accent shadow-lg' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 translate-x-2 -translate-y-2 px-4 py-1 bg-accent text-white text-sm rounded-lg font-medium">
                      Popular
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <p className="text-muted-foreground">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">${plan.price[billingCycle]}</span>
                      <span className="text-muted-foreground ml-2">
                        {plan.price[billingCycle] > 0 ? `/month${billingCycle === 'yearly' ? ', billed yearly' : ''}` : ''}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start">
                          <Check className="h-5 w-5 text-accent mr-2 mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, i) => (
                        <li key={i} className="flex items-start text-muted-foreground">
                          <Check className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 shrink-0" />
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => navigate("/app/dashboard")}
                    >
                      {plan.buttonText}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 px-6 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-center mb-12">Frequently asked questions</h2>
            <div className="grid gap-6">
              {[
                {
                  question: "Can I cancel at any time?",
                  answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll still have access to your paid features until the end of your billing cycle."
                },
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards and PayPal."
                },
                {
                  question: "Can I upgrade or downgrade my plan?",
                  answer: "Yes, you can upgrade or downgrade your plan at any time. If you upgrade, you'll be charged the prorated difference. If you downgrade, you'll receive credit towards your next billing cycle."
                },
                {
                  question: "Do you offer a free trial?",
                  answer: "We offer a fully-featured free plan that you can use indefinitely. This allows you to try out our core features before deciding to upgrade to a paid plan."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-lg border">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-6 bg-accent text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Start improving your client onboarding today</h2>
            <p className="text-xl mb-10 text-accent-foreground/90 max-w-2xl mx-auto">
              Try Briefly for free, no credit card required. Upgrade when you're ready.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => navigate("/app/dashboard")}
              className="h-12 px-6"
            >
              Get started for free
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingPage;
