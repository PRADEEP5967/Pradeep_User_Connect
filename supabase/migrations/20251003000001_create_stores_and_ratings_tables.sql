/*
  # Create Stores and Ratings Tables

  1. New Tables
    - `stores`
      - `id` (uuid, primary key) - Unique store identifier
      - `name` (text, not null) - Store name
      - `email` (text, not null) - Store contact email
      - `phone` (text) - Store phone number
      - `address` (text, not null) - Store physical address
      - `category` (text) - Store category (e.g., Restaurant, Retail, Service)
      - `description` (text) - Store description
      - `price_range` (text) - Price range indicator
      - `owner_id` (uuid, foreign key) - Reference to users table
      - `created_at` (timestamptz, default now()) - Store creation timestamp
      - `average_rating` (numeric, default 0) - Calculated average rating
      - `total_ratings` (integer, default 0) - Total number of ratings

    - `ratings`
      - `id` (uuid, primary key) - Unique rating identifier
      - `user_id` (uuid, foreign key) - Reference to users table
      - `store_id` (uuid, foreign key) - Reference to stores table
      - `rating` (integer, not null) - Rating value (1-5)
      - `comment` (text) - Optional review comment
      - `created_at` (timestamptz, default now()) - Rating creation timestamp
      - `updated_at` (timestamptz, default now()) - Last update timestamp

  2. Security
    - Enable RLS on both tables
    - Stores:
      - All authenticated users can view stores
      - Store owners can update their own stores
      - Admins can manage all stores
    - Ratings:
      - All authenticated users can view ratings
      - Users can create and update their own ratings
      - Users cannot delete ratings (audit trail)

  3. Important Notes
    - Each user can only rate a store once (enforced by unique constraint)
    - Store ratings are automatically calculated
    - Category-based filtering enabled through indexes
*/

CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  address text NOT NULL,
  category text,
  description text,
  price_range text,
  owner_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  average_rating numeric DEFAULT 0,
  total_ratings integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  store_id uuid REFERENCES stores(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, store_id)
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stores"
  ON stores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Store owners can update their stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Admins can insert stores"
  ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Anyone can view ratings"
  ON ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ratings"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ratings"
  ON ratings
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON stores(owner_id);
CREATE INDEX IF NOT EXISTS idx_stores_category ON stores(category);
CREATE INDEX IF NOT EXISTS idx_stores_average_rating ON stores(average_rating);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_store_id ON ratings(store_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at);

CREATE OR REPLACE FUNCTION update_store_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE stores
  SET
    average_rating = (
      SELECT AVG(rating)::numeric(3,2)
      FROM ratings
      WHERE store_id = NEW.store_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings
      WHERE store_id = NEW.store_id
    )
  WHERE id = NEW.store_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_rating_timestamp()
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
    WHERE tgname = 'trigger_update_store_rating_insert'
  ) THEN
    CREATE TRIGGER trigger_update_store_rating_insert
      AFTER INSERT ON ratings
      FOR EACH ROW
      EXECUTE FUNCTION update_store_rating();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_update_store_rating_update'
  ) THEN
    CREATE TRIGGER trigger_update_store_rating_update
      AFTER UPDATE ON ratings
      FOR EACH ROW
      EXECUTE FUNCTION update_store_rating();
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgname = 'trigger_update_rating_timestamp'
  ) THEN
    CREATE TRIGGER trigger_update_rating_timestamp
      BEFORE UPDATE ON ratings
      FOR EACH ROW
      EXECUTE FUNCTION update_rating_timestamp();
  END IF;
END $$;
