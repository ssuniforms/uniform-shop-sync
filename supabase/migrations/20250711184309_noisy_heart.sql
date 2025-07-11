/*
  # Complete fix for infinite recursion in RLS policies

  1. Security Functions
    - Create/replace security definer functions to bypass RLS
    - These functions can safely query profiles table without triggering RLS

  2. Policy Cleanup
    - Drop ALL existing policies that might cause recursion
    - Ensure clean slate before recreating policies

  3. New Policies
    - Recreate all policies using security definer functions
    - Maintain proper access control without recursion
*/

-- Drop all existing policies to ensure clean slate
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Admins can manage catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Staff can view items" ON public.items;
DROP POLICY IF EXISTS "Admins can manage items" ON public.items;
DROP POLICY IF EXISTS "Staff can view item sizes" ON public.item_sizes;
DROP POLICY IF EXISTS "Admins can manage item sizes" ON public.item_sizes;
DROP POLICY IF EXISTS "Staff can create sales" ON public.sales;
DROP POLICY IF EXISTS "Staff can view own sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can view all sales" ON public.sales;
DROP POLICY IF EXISTS "Staff can view shop info" ON public.shop_info;
DROP POLICY IF EXISTS "Admins can manage shop info" ON public.shop_info;

-- Create/replace security definer functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('staff', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles table policies (non-recursive)
CREATE POLICY "Users can read own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (public.is_admin());

-- Catalogues table policies
CREATE POLICY "Staff can view catalogues" 
ON public.catalogues FOR SELECT 
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can manage catalogues" 
ON public.catalogues FOR ALL 
USING (public.is_admin());

-- Items table policies
CREATE POLICY "Staff can view items" 
ON public.items FOR SELECT 
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can manage items" 
ON public.items FOR ALL 
USING (public.is_admin());

-- Item sizes table policies
CREATE POLICY "Staff can view item sizes" 
ON public.item_sizes FOR SELECT 
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can manage item sizes" 
ON public.item_sizes FOR ALL 
USING (public.is_admin());

-- Sales table policies
CREATE POLICY "Staff can create sales" 
ON public.sales FOR INSERT 
WITH CHECK (public.is_staff_or_admin());

CREATE POLICY "Staff can view own sales" 
ON public.sales FOR SELECT 
USING (auth.uid() = employee_id OR public.is_admin());

CREATE POLICY "Admins can view all sales" 
ON public.sales FOR SELECT 
USING (public.is_admin());

-- Shop info table policies
CREATE POLICY "Staff can view shop info" 
ON public.shop_info FOR SELECT 
USING (public.is_staff_or_admin());

CREATE POLICY "Admins can manage shop info" 
ON public.shop_info FOR ALL 
USING (public.is_admin());