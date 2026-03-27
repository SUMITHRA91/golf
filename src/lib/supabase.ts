import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
        };
        Update: {
          full_name?: string | null;
          phone?: string | null;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_type: 'monthly' | 'yearly';
          status: 'active' | 'cancelled' | 'expired';
          amount: number;
          stripe_subscription_id: string | null;
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      charities: {
        Row: {
          id: string;
          name: string;
          description: string;
          image_url: string | null;
          website: string | null;
          is_featured: boolean;
          upcoming_events: any | null;
          created_at: string;
          updated_at: string;
        };
      };
      scores: {
        Row: {
          id: string;
          user_id: string;
          score_value: number;
          score_date: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          score_value: number;
          score_date: string;
        };
      };
    };
  };
};
