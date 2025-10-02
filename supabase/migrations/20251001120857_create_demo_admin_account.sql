/*
  # Create Demo Admin Account

  1. Changes
    - Creates a demo admin user in auth.users
    - Creates corresponding profile in public.users table
    - Email: admin@system.com
    - Password: Admin123!
    - Role: admin

  2. Security
    - Uses secure password hashing through auth.users
    - Applies existing RLS policies
*/

DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Check if admin already exists
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@system.com';
  
  IF admin_user_id IS NULL THEN
    -- Generate a new UUID for the admin user
    admin_user_id := gen_random_uuid();
    
    -- Insert into auth.users (Supabase's auth table)
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role
    ) VALUES (
      admin_user_id,
      '00000000-0000-0000-0000-000000000000',
      'admin@system.com',
      crypt('Admin123!', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      'authenticated',
      'authenticated'
    );
    
    -- Insert into public.users table
    INSERT INTO public.users (
      id,
      email,
      name,
      address,
      role,
      created_at,
      updated_at
    ) VALUES (
      admin_user_id,
      'admin@system.com',
      'System Administrator',
      '123 Admin Street, Admin City, AC 12345',
      'admin',
      now(),
      now()
    );
    
    RAISE NOTICE 'Demo admin account created successfully';
  ELSE
    RAISE NOTICE 'Admin account already exists';
  END IF;
END $$;
