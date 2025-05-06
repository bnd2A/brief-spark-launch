
-- Create a payment_methods table to store user payment methods
CREATE TABLE IF NOT EXISTS public.payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'card' or 'paypal'
  email TEXT, -- For PayPal accounts
  last4 TEXT, -- For cards
  brand TEXT, -- For cards
  exp_month INTEGER, -- For cards
  exp_year INTEGER, -- For cards
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own payment methods
CREATE POLICY "Users can view their own payment methods"
  ON public.payment_methods
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own payment methods
CREATE POLICY "Users can add their own payment methods"
  ON public.payment_methods
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own payment methods
CREATE POLICY "Users can update their own payment methods"
  ON public.payment_methods
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own payment methods
CREATE POLICY "Users can delete their own payment methods"
  ON public.payment_methods
  FOR DELETE
  USING (auth.uid() = user_id);

-- Add updated_at trigger
CREATE TRIGGER set_payment_methods_updated_at
BEFORE UPDATE ON public.payment_methods
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create subscription_plans table if it doesn't already exist
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  interval TEXT NOT NULL,
  paypal_plan_id TEXT NOT NULL UNIQUE,
  features JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add updated_at trigger for subscription_plans
CREATE TRIGGER set_subscription_plans_updated_at
BEFORE UPDATE ON public.subscription_plans
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
