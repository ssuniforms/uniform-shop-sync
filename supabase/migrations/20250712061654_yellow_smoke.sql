/*
  # Fix catalogue visibility and permissions

  1. Update RLS policies to allow public access to catalogues and items
  2. Ensure staff can view all data needed for sales
  3. Maintain admin-only write permissions
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Anyone can view catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Staff can view catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Anyone can view items" ON public.items;
DROP POLICY IF EXISTS "Staff can view items" ON public.items;
DROP POLICY IF EXISTS "Anyone can view item sizes" ON public.item_sizes;
DROP POLICY IF EXISTS "Staff can view item sizes" ON public.item_sizes;

-- Create new policies that allow public read access
CREATE POLICY "Public can view catalogues" 
ON public.catalogues FOR SELECT 
USING (true);

CREATE POLICY "Public can view items" 
ON public.items FOR SELECT 
USING (true);

CREATE POLICY "Public can view item sizes" 
ON public.item_sizes FOR SELECT 
USING (true);

CREATE POLICY "Public can view shop info" 
ON public.shop_info FOR SELECT 
USING (true);

-- Ensure admin policies still exist for write operations
CREATE POLICY "Admins can manage catalogues" 
ON public.catalogues FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage items" 
ON public.items FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admins can manage item sizes" 
ON public.item_sizes FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Update shop_info to have default data
UPDATE public.shop_info SET 
  name = 'SS Uniforms',
  address = 'Shop No. 123, Uniform Market, Chhawla, Delhi NCR - 110071',
  phone = '+91-9876543210',
  email = 'info@ssuniforms.com',
  description = 'Delhi NCR''s premier school uniform provider. Quality uniforms, competitive prices, and exceptional service for educational institutions. Trusted by 50+ schools across the region.',
  images = '["https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg"]'::jsonb
WHERE id = (SELECT id FROM public.shop_info LIMIT 1);

-- Insert shop_info if it doesn't exist
INSERT INTO public.shop_info (name, address, phone, email, description, images)
SELECT 
  'SS Uniforms',
  'Shop No. 123, Uniform Market, Chhawla, Delhi NCR - 110071',
  '+91-9876543210',
  'info@ssuniforms.com',
  'Delhi NCR''s premier school uniform provider. Quality uniforms, competitive prices, and exceptional service for educational institutions. Trusted by 50+ schools across the region.',
  '["https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg"]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.shop_info);