/*
  # Golf Charity Subscription Platform - Complete Database Schema
  
  ## Overview
  This migration creates the complete database schema for a golf charity subscription platform
  combining performance tracking, monthly prize draws, and charitable giving.
  
  ## New Tables
  
  ### 1. profiles
  - `id` (uuid, references auth.users)
  - `email` (text)
  - `full_name` (text)
  - `phone` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 2. subscriptions
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `plan_type` (text: 'monthly' or 'yearly')
  - `status` (text: 'active', 'cancelled', 'expired')
  - `amount` (numeric)
  - `stripe_subscription_id` (text, optional)
  - `current_period_start` (timestamptz)
  - `current_period_end` (timestamptz)
  - `cancel_at_period_end` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 3. charities
  - `id` (uuid, primary key)
  - `name` (text)
  - `description` (text)
  - `image_url` (text, optional)
  - `website` (text, optional)
  - `is_featured` (boolean)
  - `upcoming_events` (jsonb, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 4. user_charities
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `charity_id` (uuid, references charities)
  - `contribution_percentage` (numeric, min 10, default 10)
  - `is_active` (boolean)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)
  
  ### 5. scores
  - `id` (uuid, primary key)
  - `user_id` (uuid, references profiles)
  - `score_value` (integer, 1-45)
  - `score_date` (date)
  - `created_at` (timestamptz)
  
  ### 6. draws
  - `id` (uuid, primary key)
  - `draw_date` (date)
  - `draw_month` (text)
  - `draw_year` (integer)
  - `status` (text: 'pending', 'simulated', 'published')
  - `draw_type` (text: 'random' or 'algorithmic')
  - `winning_numbers` (integer[], 5 numbers)
  - `jackpot_amount` (numeric)
  - `total_pool_amount` (numeric)
  - `five_match_pool` (numeric)
  - `four_match_pool` (numeric)
  - `three_match_pool` (numeric)
  - `created_at` (timestamptz)
  - `published_at` (timestamptz, optional)
  
  ### 7. draw_participants
  - `id` (uuid, primary key)
  - `draw_id` (uuid, references draws)
  - `user_id` (uuid, references profiles)
  - `user_numbers` (integer[], 5 numbers from user's latest scores)
  - `matches_count` (integer, 0-5)
  - `is_winner` (boolean)
  - `prize_amount` (numeric, optional)
  - `created_at` (timestamptz)
  
  ### 8. winner_verifications
  - `id` (uuid, primary key)
  - `draw_participant_id` (uuid, references draw_participants)
  - `user_id` (uuid, references profiles)
  - `proof_image_url` (text)
  - `verification_status` (text: 'pending', 'approved', 'rejected')
  - `admin_notes` (text, optional)
  - `verified_by` (uuid, references profiles, optional)
  - `verified_at` (timestamptz, optional)
  - `created_at` (timestamptz)
  
  ### 9. payments
  - `id` (uuid, primary key)
  - `draw_participant_id` (uuid, references draw_participants)
  - `user_id` (uuid, references profiles)
  - `amount` (numeric)
  - `payment_status` (text: 'pending', 'paid')
  - `payment_method` (text, optional)
  - `payment_reference` (text, optional)
  - `paid_at` (timestamptz, optional)
  - `created_at` (timestamptz)
  
  ### 10. charity_contributions
  - `id` (uuid, primary key)
  - `subscription_id` (uuid, references subscriptions)
  - `charity_id` (uuid, references charities)
  - `user_id` (uuid, references profiles)
  - `amount` (numeric)
  - `contribution_date` (date)
  - `created_at` (timestamptz)
  
  ### 11. admin_users
  - `id` (uuid, references auth.users)
  - `role` (text: 'admin' or 'super_admin')
  - `created_at` (timestamptz)
  
  ## Security
  - Enable RLS on all tables
  - Policies for authenticated users to manage their own data
  - Admin-only policies for sensitive operations
  - Public read access for charity listings
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type text NOT NULL CHECK (plan_type IN ('monthly', 'yearly')),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  amount numeric NOT NULL,
  stripe_subscription_id text,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create charities table
CREATE TABLE IF NOT EXISTS charities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  image_url text,
  website text,
  is_featured boolean DEFAULT false,
  upcoming_events jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE charities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view charities"
  ON charities FOR SELECT
  TO authenticated
  USING (true);

-- Create user_charities table
CREATE TABLE IF NOT EXISTS user_charities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  charity_id uuid REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
  contribution_percentage numeric NOT NULL DEFAULT 10 CHECK (contribution_percentage >= 10 AND contribution_percentage <= 100),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, charity_id)
);

ALTER TABLE user_charities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own charity selections"
  ON user_charities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own charity selections"
  ON user_charities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own charity selections"
  ON user_charities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create scores table
CREATE TABLE IF NOT EXISTS scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  score_value integer NOT NULL CHECK (score_value >= 1 AND score_value <= 45),
  score_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scores"
  ON scores FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own scores"
  ON scores FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own scores"
  ON scores FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create draws table
CREATE TABLE IF NOT EXISTS draws (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_date date NOT NULL,
  draw_month text NOT NULL,
  draw_year integer NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'simulated', 'published')),
  draw_type text NOT NULL DEFAULT 'random' CHECK (draw_type IN ('random', 'algorithmic')),
  winning_numbers integer[] NOT NULL,
  jackpot_amount numeric DEFAULT 0,
  total_pool_amount numeric DEFAULT 0,
  five_match_pool numeric DEFAULT 0,
  four_match_pool numeric DEFAULT 0,
  three_match_pool numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE draws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view published draws"
  ON draws FOR SELECT
  TO authenticated
  USING (status = 'published');

-- Create draw_participants table
CREATE TABLE IF NOT EXISTS draw_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_id uuid REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  user_numbers integer[] NOT NULL,
  matches_count integer DEFAULT 0 CHECK (matches_count >= 0 AND matches_count <= 5),
  is_winner boolean DEFAULT false,
  prize_amount numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(draw_id, user_id)
);

ALTER TABLE draw_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own draw participation"
  ON draw_participants FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create winner_verifications table
CREATE TABLE IF NOT EXISTS winner_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_participant_id uuid REFERENCES draw_participants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  proof_image_url text NOT NULL,
  verification_status text NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  verified_by uuid REFERENCES profiles(id),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE winner_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own verifications"
  ON winner_verifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own verifications"
  ON winner_verifications FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  draw_participant_id uuid REFERENCES draw_participants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  payment_method text,
  payment_reference text,
  paid_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create charity_contributions table
CREATE TABLE IF NOT EXISTS charity_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id uuid REFERENCES subscriptions(id) ON DELETE CASCADE NOT NULL,
  charity_id uuid REFERENCES charities(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  contribution_date date NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE charity_contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own charity contributions"
  ON charity_contributions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view admin users"
  ON admin_users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_scores_user_id ON scores(user_id);
CREATE INDEX IF NOT EXISTS idx_scores_score_date ON scores(score_date DESC);
CREATE INDEX IF NOT EXISTS idx_draws_status ON draws(status);
CREATE INDEX IF NOT EXISTS idx_draw_participants_draw_id ON draw_participants(draw_id);
CREATE INDEX IF NOT EXISTS idx_draw_participants_user_id ON draw_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_winner_verifications_status ON winner_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charities_updated_at BEFORE UPDATE ON charities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_charities_updated_at BEFORE UPDATE ON user_charities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();