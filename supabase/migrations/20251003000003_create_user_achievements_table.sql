/*
  # Create User Achievements Table

  1. New Tables
    - `user_achievements`
      - `id` (uuid, primary key) - Unique achievement identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `achievement_type` (text, not null) - Achievement type identifier
      - `achievement_name` (text, not null) - Human-readable achievement name
      - `description` (text) - Achievement description
      - `earned_at` (timestamptz, default now()) - When achievement was earned
      - `progress` (integer, default 0) - Current progress towards achievement
      - `target` (integer) - Target value for achievement completion

  2. Security
    - Enable RLS on user_achievements table
    - Users can view their own achievements
    - System automatically creates achievements
    - Users cannot manually create or delete achievements

  3. Important Notes
    - Achievements track user milestones
    - Common achievements: first_rating, active_rater_10, expert_reviewer_50, legend_100
    - Progress is automatically updated via triggers
*/

CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL,
  achievement_name text NOT NULL,
  description text,
  earned_at timestamptz DEFAULT now(),
  progress integer DEFAULT 0,
  target integer,
  UNIQUE(user_id, achievement_type)
);

ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "System can create achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "System can update achievements"
  ON user_achievements
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(achievement_type);

CREATE OR REPLACE FUNCTION check_user_achievements()
RETURNS TRIGGER AS $$
DECLARE
  rating_count integer;
BEGIN
  SELECT COUNT(*) INTO rating_count
  FROM ratings
  WHERE user_id = NEW.user_id;

  INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, progress, target)
  VALUES (NEW.user_id, 'first_rating', 'First Rating', 'Rate your first store', rating_count, 1)
  ON CONFLICT (user_id, achievement_type)
  DO UPDATE SET progress = rating_count;

  INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, progress, target)
  VALUES (NEW.user_id, 'active_rater', 'Active Rater', 'Rate 10 stores', rating_count, 10)
  ON CONFLICT (user_id, achievement_type)
  DO UPDATE SET progress = rating_count;

  INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, progress, target)
  VALUES (NEW.user_id, 'expert_reviewer', 'Expert Reviewer', 'Rate 50 stores', rating_count, 50)
  ON CONFLICT (user_id, achievement_type)
  DO UPDATE SET progress = rating_count;

  INSERT INTO user_achievements (user_id, achievement_type, achievement_name, description, progress, target)
  VALUES (NEW.user_id, 'rating_legend', 'Rating Legend', 'Rate 100 stores', rating_count, 100)
  ON CONFLICT (user_id, achievement_type)
  DO UPDATE SET progress = rating_count;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_check_achievements'
  ) THEN
    CREATE TRIGGER trigger_check_achievements
      AFTER INSERT OR UPDATE ON ratings
      FOR EACH ROW
      EXECUTE FUNCTION check_user_achievements();
  END IF;
END $$;
