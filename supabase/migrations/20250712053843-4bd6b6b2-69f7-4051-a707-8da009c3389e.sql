-- Fix infinite recursion in RLS policies by creating security definer functions

-- Create security definer function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Admins can manage items" ON public.items;
DROP POLICY IF EXISTS "Admins can manage item sizes" ON public.item_sizes;
DROP POLICY IF EXISTS "Admins can view all sales" ON public.sales;
DROP POLICY IF EXISTS "Admins can manage shop info" ON public.shop_info;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage catalogues" 
ON public.catalogues 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage items" 
ON public.items 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can manage item sizes" 
ON public.item_sizes 
FOR ALL 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can view all sales" 
ON public.sales 
FOR SELECT 
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Staff and admin can create sales" 
ON public.sales 
FOR INSERT 
WITH CHECK (
  auth.uid() = employee_id AND 
  public.get_current_user_role() IN ('admin', 'staff')
);

CREATE POLICY "Staff can view their own sales" 
ON public.sales 
FOR SELECT 
USING (
  auth.uid() = employee_id AND 
  public.get_current_user_role() IN ('admin', 'staff')
);

CREATE POLICY "Admins can manage shop info" 
ON public.shop_info 
FOR ALL 
USING (public.get_current_user_role() = 'admin');