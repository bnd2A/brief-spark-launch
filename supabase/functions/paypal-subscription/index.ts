
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const PAYPAL_API_URL = Deno.env.get("PAYPAL_API_URL") || "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = Deno.env.get("PAYPAL_CLIENT_ID") || "";
const PAYPAL_SECRET = Deno.env.get("PAYPAL_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get PayPal access token
async function getPayPalAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`);
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  if (!response.ok) {
    console.error("PayPal token error:", data);
    throw new Error("Failed to get PayPal access token");
  }

  return data.access_token;
}

// Create a subscription plan in PayPal if it doesn't exist
async function getOrCreatePlan(token, planData) {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Check if plan exists in our database
  const { data: existingPlan, error } = await supabase
    .from("subscription_plans")
    .select("paypal_plan_id")
    .eq("name", planData.name)
    .single();

  if (existingPlan?.paypal_plan_id) {
    // Verify plan still exists in PayPal
    try {
      const verifyRes = await fetch(`${PAYPAL_API_URL}/v1/billing/plans/${existingPlan.paypal_plan_id}`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      
      if (verifyRes.ok) {
        return existingPlan.paypal_plan_id;
      }
    } catch (e) {
      console.error("Failed to verify PayPal plan:", e);
    }
  }

  // Create product first
  const productRes = await fetch(`${PAYPAL_API_URL}/v1/catalogs/products`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: planData.name,
      description: planData.description,
      type: "SERVICE",
      category: "SOFTWARE",
    }),
  });

  if (!productRes.ok) {
    console.error("PayPal product creation failed:", await productRes.json());
    throw new Error("Failed to create PayPal product");
  }

  const product = await productRes.json();

  // Create plan
  const planRes = await fetch(`${PAYPAL_API_URL}/v1/billing/plans`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product_id: product.id,
      name: planData.name,
      description: planData.description,
      status: "ACTIVE",
      billing_cycles: [
        {
          frequency: {
            interval_unit: planData.interval,
            interval_count: 1,
          },
          tenure_type: "REGULAR",
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: planData.price.toString(),
              currency_code: "USD",
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: "0",
          currency_code: "USD",
        },
        setup_fee_failure_action: "CONTINUE",
        payment_failure_threshold: 3,
      },
    }),
  });

  if (!planRes.ok) {
    console.error("PayPal plan creation failed:", await planRes.json());
    throw new Error("Failed to create PayPal plan");
  }

  const plan = await planRes.json();

  // Store plan in our database
  await supabase.from("subscription_plans").upsert({
    name: planData.name,
    description: planData.description,
    price: planData.price,
    interval: planData.interval,
    paypal_plan_id: plan.id,
    features: planData.features,
  });

  return plan.id;
}

// Create subscription
async function createSubscription(token, planId, userId) {
  const subscriptionRes = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": `sub_${userId}_${Date.now()}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      custom_id: userId,
      application_context: {
        brand_name: "Briefly",
        locale: "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        payment_method: {
          payer_selected: "PAYPAL",
          payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
        },
        return_url: `${Deno.env.get("PUBLIC_APP_URL") || "https://zdpileidtdzlambmbsiq.lovable.dev"}/app/settings?success=true`,
        cancel_url: `${Deno.env.get("PUBLIC_APP_URL") || "https://zdpileidtdzlambmbsiq.lovable.dev"}/app/settings?canceled=true`,
      },
    }),
  });

  if (!subscriptionRes.ok) {
    console.error("PayPal subscription creation failed:", await subscriptionRes.json());
    throw new Error("Failed to create PayPal subscription");
  }

  return await subscriptionRes.json();
}

// Handle webhook events from PayPal
async function handleWebhook(request) {
  const body = await request.json();
  const eventType = body.event_type;
  const resource = body.resource;
  
  console.log(`Handling PayPal webhook event: ${eventType}`);
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  // Extract subscription ID
  const subscriptionId = resource.id;
  
  try {
    // Get subscription details from PayPal
    const token = await getPayPalAccessToken();
    const subRes = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!subRes.ok) {
      throw new Error("Failed to fetch subscription details");
    }
    
    const subscription = await subRes.json();
    const userId = subscription.custom_id;
    
    if (!userId) {
      throw new Error("Missing custom_id in subscription");
    }
    
    // Update user subscription status based on event type
    switch(eventType) {
      case "BILLING.SUBSCRIPTION.ACTIVATED":
        await supabase.from("user_subscriptions").upsert({
          user_id: userId,
          subscription_id: subscriptionId,
          plan_id: subscription.plan_id,
          status: "ACTIVE",
          next_billing_time: subscription.billing_info?.next_billing_time,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        break;
        
      case "BILLING.SUBSCRIPTION.CANCELLED":
      case "BILLING.SUBSCRIPTION.EXPIRED":
        await supabase.from("user_subscriptions").update({
          status: "CANCELED",
          updated_at: new Date().toISOString(),
        }).eq("subscription_id", subscriptionId);
        break;
        
      case "BILLING.SUBSCRIPTION.SUSPENDED":
        await supabase.from("user_subscriptions").update({
          status: "SUSPENDED",
          updated_at: new Date().toISOString(),
        }).eq("subscription_id", subscriptionId);
        break;
    }
    
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  
  const url = new URL(req.url);
  const path = url.pathname.split("/").pop();
  
  try {
    // Handle webhook events
    if (path === "webhook") {
      return handleWebhook(req);
    }
    
    const { userId, action, planType } = await req.json();
    
    if (!userId) {
      throw new Error("User ID is required");
    }
    
    const token = await getPayPalAccessToken();
    
    if (action === "create_subscription") {
      // Define plan data based on requested plan type
      let planData;
      if (planType === "pro_monthly") {
        planData = {
          name: "Freelance Pro Monthly",
          description: "Professional plan with unlimited briefs and premium features",
          price: 9.00,
          interval: "MONTH",
          features: [
            "Unlimited briefs",
            "PDF & Markdown export",
            "White-labeling",
            "Custom background & logo",
            "Email notifications",
            "Priority support"
          ]
        };
      } else if (planType === "pro_yearly") {
        planData = {
          name: "Freelance Pro Yearly",
          description: "Professional plan with unlimited briefs and premium features (annual billing)",
          price: 84.00,
          interval: "YEAR",
          features: [
            "Unlimited briefs",
            "PDF & Markdown export",
            "White-labeling",
            "Custom background & logo",
            "Email notifications",
            "Priority support"
          ]
        };
      } else {
        throw new Error("Invalid plan type");
      }
      
      // Get or create plan in PayPal
      const planId = await getOrCreatePlan(token, planData);
      
      // Create subscription
      const subscription = await createSubscription(token, planId, userId);
      
      return new Response(JSON.stringify({
        success: true,
        subscription_id: subscription.id,
        approve_url: subscription.links.find(link => link.rel === "approve").href,
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Default response for unsupported action
    return new Response(JSON.stringify({ error: "Unsupported action" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
