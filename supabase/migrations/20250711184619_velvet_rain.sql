/*
  # Fix authentication and profile creation issues

  1. Ensure proper profile creation trigger
  2. Add better error handling for authentication
  3. Create demo users for testing
*/

-- Recreate the profile creation function with better error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    'staff'
  );
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create demo admin user if it doesn't exist
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if admin user already exists
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@ssuniforms.com';
  
  IF admin_user_id IS NULL THEN
    -- Insert admin user into auth.users
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
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@ssuniforms.com',
      crypt('Admin123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Admin User"}',
      FALSE,
      '',
      '',
      '',
      ''
    ) RETURNING id INTO admin_user_id;
    
    -- Insert admin profile
    INSERT INTO public.profiles (id, name, role)
    VALUES (admin_user_id, 'Admin User', 'admin');
  END IF;
END $$;

-- Create demo staff user if it doesn't exist
DO $$
DECLARE
  staff_user_id UUID;
BEGIN
  -- Check if staff user already exists
  SELECT id INTO staff_user_id 
  FROM auth.users 
  WHERE email = 'staff@ssuniforms.com';
  
  IF staff_user_id IS NULL THEN
    -- Insert staff user into auth.users
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
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'staff@ssuniforms.com',
      crypt('Staff123!', gen_salt('bf')),
      NOW(),
      NOW(),
      NOW(),
      '{"name": "Staff User"}',
      FALSE,
      '',
      '',
      '',
      ''
    ) RETURNING id INTO staff_user_id;
    
    -- Insert staff profile
    INSERT INTO public.profiles (id, name, role)
    VALUES (staff_user_id, 'Staff User', 'staff');
  END IF;
END $$;