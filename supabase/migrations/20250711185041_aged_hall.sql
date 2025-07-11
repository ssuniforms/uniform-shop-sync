/*
  # Create demo users for testing

  1. Create demo admin and staff users
  2. Ensure proper authentication setup
  3. Add error handling for existing users
*/

-- Function to create demo users safely
CREATE OR REPLACE FUNCTION create_demo_user(
  user_email TEXT,
  user_password TEXT,
  user_name TEXT,
  user_role TEXT
) RETURNS VOID AS $$
DECLARE
  user_id UUID;
  existing_user_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF existing_user_id IS NOT NULL THEN
    RAISE NOTICE 'User % already exists with ID %', user_email, existing_user_id;
    
    -- Update profile if it exists
    UPDATE public.profiles 
    SET role = user_role, name = user_name
    WHERE id = existing_user_id;
    
    -- Create profile if it doesn't exist
    INSERT INTO public.profiles (id, name, role)
    VALUES (existing_user_id, user_name, user_role)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      role = EXCLUDED.role;
    
    RETURN;
  END IF;
  
  -- Generate new UUID for user
  user_id := gen_random_uuid();
  
  -- Insert user into auth.users
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    is_super_admin,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    user_id,
    'authenticated',
    'authenticated',
    user_email,
    crypt(user_password, gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    json_build_object('name', user_name),
    FALSE,
    '',
    '',
    '',
    ''
  );
  
  -- Insert profile
  INSERT INTO public.profiles (id, name, role)
  VALUES (user_id, user_name, user_role);
  
  RAISE NOTICE 'Created user % with ID % and role %', user_email, user_id, user_role;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to create user %: %', user_email, SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Create demo admin user
SELECT create_demo_user(
  'admin@ssuniforms.com',
  'Admin123!',
  'Admin User',
  'admin'
);

-- Create demo staff user
SELECT create_demo_user(
  'staff@ssuniforms.com',
  'Staff123!',
  'Staff User',
  'staff'
);

-- Drop the function after use
DROP FUNCTION create_demo_user(TEXT, TEXT, TEXT, TEXT);