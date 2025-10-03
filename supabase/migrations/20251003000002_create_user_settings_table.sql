/*
  # Create User Settings Table

  1. New Tables
    - `user_settings`
      - `id` (uuid, primary key) - Unique settings identifier
      - `user_id` (uuid, foreign key, unique) - Reference to users table
      - `email_notifications` (boolean, default true) - Email notification preference
      - `push_notifications` (boolean, default false) - Push notification preference
      - `weekly_digest` (boolean, default true) - Weekly digest preference
      - `two_factor_enabled` (boolean, default false) - 2FA status
      - `language` (text, default 'en') - User language preference
      - `timezone` (text, default 'UTC') - User timezone
      - `theme` (text, default 'system') - Theme preference (light, dark, system)
      - `created_at` (timestamptz, default now()) - Settings creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Security
    - Enable RLS on user_settings table
    - Users can only view and update their own settings
    - Settings are automatically created when user registers

  3. Important Notes
    - Each user has exactly one settings record
    - Settings are created with default values
    - Updates automatically update the timestamp
*/

CREATE TABLE IF NOT EXISTS user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT false,
  weekly_digest boolean DEFAULT true,
  two_factor_enabled boolean DEFAULT false,
  language text DEFAULT 'en',
  timezone text DEFAULT 'UTC',
  theme text DEFAULT 'system',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON user_settings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON user_settings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

CREATE OR REPLACE FUNCTION update_user_settings_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_update_user_settings_timestamp'
  ) THEN
    CREATE TRIGGER trigger_update_user_settings_timestamp
      BEFORE UPDATE ON user_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_user_settings_timestamp();
  END IF;
END $$;
