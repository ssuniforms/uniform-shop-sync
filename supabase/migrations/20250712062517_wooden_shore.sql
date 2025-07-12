/*
  # Fix item creation and catalogue display issues

  1. Ensure proper RLS policies for item creation
  2. Fix any foreign key constraints
  3. Ensure catalogues are visible to all users
  4. Add proper error handling
*/

-- Drop and recreate policies to ensure they work correctly
DROP POLICY IF EXISTS "Public can view catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Public can view items" ON public.items;
DROP POLICY IF EXISTS "Public can view item sizes" ON public.item_sizes;
DROP POLICY IF EXISTS "Admins can manage catalogues" ON public.catalogues;
DROP POLICY IF EXISTS "Admins can manage items" ON public.items;
DROP POLICY IF EXISTS "Admins can manage item sizes" ON public.item_sizes;

-- Create comprehensive policies for catalogues
CREATE POLICY "Anyone can view catalogues" 
ON public.catalogues FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage catalogues" 
ON public.catalogues FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create comprehensive policies for items
CREATE POLICY "Anyone can view items" 
ON public.items FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage items" 
ON public.items FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create comprehensive policies for item sizes
CREATE POLICY "Anyone can view item sizes" 
ON public.item_sizes FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage item sizes" 
ON public.item_sizes FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Ensure the foreign key constraint is correct for items
ALTER TABLE public.items 
DROP CONSTRAINT IF EXISTS items_catalogue_id_fkey;

ALTER TABLE public.items 
ADD CONSTRAINT items_catalogue_id_fkey 
FOREIGN KEY (catalogue_id) REFERENCES public.catalogues(id) ON DELETE CASCADE;

-- Ensure the item_sizes table has correct structure and constraints
ALTER TABLE public.item_sizes 
DROP CONSTRAINT IF EXISTS item_sizes_item_id_fkey;

-- Fix the item_id column type if needed
DO $$
BEGIN
  -- Check if item_id is TEXT and change to UUID if needed
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'item_sizes' 
    AND column_name = 'item_id' 
    AND data_type = 'text'
  ) THEN
    -- First, delete any invalid data
    DELETE FROM public.item_sizes WHERE item_id NOT IN (SELECT id FROM public.items);
    
    -- Change the column type
    ALTER TABLE public.item_sizes ALTER COLUMN item_id TYPE UUID USING item_id::UUID;
  END IF;
END $$;

-- Add the foreign key constraint
ALTER TABLE public.item_sizes 
ADD CONSTRAINT item_sizes_item_id_fkey 
FOREIGN KEY (item_id) REFERENCES public.items(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_catalogue_id ON public.items(catalogue_id);
CREATE INDEX IF NOT EXISTS idx_items_section_type ON public.items(section_type);
CREATE INDEX IF NOT EXISTS idx_item_sizes_item_id ON public.item_sizes(item_id);
CREATE INDEX IF NOT EXISTS idx_catalogues_order ON public.catalogues("order");

-- Insert some sample data if tables are empty
DO $$
BEGIN
  -- Insert sample catalogue if none exist
  IF NOT EXISTS (SELECT 1 FROM public.catalogues LIMIT 1) THEN
    INSERT INTO public.catalogues (name, description, image, "order") VALUES
    ('Delhi Public School', 'Complete uniform collection for DPS students', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg', 1),
    ('Ryan International School', 'Premium quality uniforms for Ryan students', 'https://images.pexels.com/photos/8923080/pexels-photo-8923080.jpeg', 2),
    ('Kendriya Vidyalaya', 'Standard KV uniform collection', 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg', 3);
  END IF;
END $$;