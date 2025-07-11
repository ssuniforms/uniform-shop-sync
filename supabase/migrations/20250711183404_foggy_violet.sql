/*
  # Fix infinite recursion in RLS policies

  1. New Functions
    - `public.is_admin()` - Security definer function to check admin role without RLS
    - `public.get_user_role()` - Security definer function to get user role without RLS

  2. Policy Updates
    - Update all admin role checks to use the new functions
    - Remove recursive dependencies on profiles table RLS

  3. Security
    - Functions use SECURITY DEFINER to bypass RLS
    - Maintain proper access control through function logic
*/

-- Create function to check if current user is admin (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get current user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role 
  FROM public.profiles 
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'staff');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Admins can manage items" ON public.items;
DROP POLICY IF EXISTS "Admins can manage item sizes" ON public.item_sizes;
DROP POLICY IF EXISTS "Admins can view all sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can manage shop info" ON public.shop_info;

-- Recreate profiles policies without recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (public.is_admin());

-- Recreate catalogues policies
CREATE POLICY "Admins can manage catalogues" 
ON public.catalogues FOR ALL 
USING (public.is_admin());

-- Recreate items policies
CREATE POLICY "Admins can manage items" 
ON public.items FOR ALL 
USING (public.is_admin());

-- Recreate item_sizes policies
CREATE POLICY "Admins can manage item sizes" 
ON public.item_sizes FOR ALL 
USING (public.is_admin());

-- Recreate sales policies
CREATE POLICY "Admins can view all sales" 
ON public.sales FOR SELECT 
USING (public.is_admin());

-- Recreate shop_info policies
CREATE POLICY "Admins can manage shop info" 
ON public.shop_info FOR ALL 
USING (public.is_admin());