
export interface PaymentMethod {
  id: string;
  user_id: string;
  type: string;
  email?: string | null;
  last4?: string | null;
  brand?: string | null;
  exp_month?: number | null;
  exp_year?: number | null;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}
