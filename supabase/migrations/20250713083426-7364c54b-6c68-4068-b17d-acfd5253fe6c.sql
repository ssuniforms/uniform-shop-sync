-- Add stock column to item_sizes table
ALTER TABLE public.item_sizes 
ADD COLUMN stock INTEGER NOT NULL DEFAULT 0;

-- Add comment for the new column
COMMENT ON COLUMN public.item_sizes.stock IS 'Stock quantity for this specific size variant';