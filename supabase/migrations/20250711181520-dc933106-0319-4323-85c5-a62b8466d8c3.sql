-- Create profiles table for user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('admin', 'staff')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));

CREATE POLICY "Admins can manage all profiles" 
ON public.profiles FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Create catalogues table
CREATE TABLE public.catalogues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  "order" INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on catalogues
ALTER TABLE public.catalogues ENABLE ROW LEVEL SECURITY;

-- Create policies for catalogues (public read, admin write)
CREATE POLICY "Anyone can view catalogues" 
ON public.catalogues FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage catalogues" 
ON public.catalogues FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Create items table
CREATE TABLE public.items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  catalogue_id UUID NOT NULL REFERENCES public.catalogues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  material TEXT,
  location TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  image TEXT,
  section_type TEXT NOT NULL CHECK (section_type IN ('summer', 'winter', 'house', 'other')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on items
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;

-- Create policies for items
CREATE POLICY "Anyone can view items" 
ON public.items FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage items" 
ON public.items FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Create item_sizes table
CREATE TABLE public.item_sizes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on item_sizes
ALTER TABLE public.item_sizes ENABLE ROW LEVEL SECURITY;

-- Create policies for item_sizes
CREATE POLICY "Anyone can view item sizes" 
ON public.item_sizes FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage item sizes" 
ON public.item_sizes FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Create sales table
CREATE TABLE public.sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES auth.users(id),
  customer_name TEXT,
  customer_phone TEXT,
  total_amount NUMERIC(10,2) NOT NULL,
  items JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on sales
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create policies for sales
CREATE POLICY "Employees can view their own sales" 
ON public.sales FOR SELECT 
USING (auth.uid() = employee_id);

CREATE POLICY "Employees can create sales" 
ON public.sales FOR INSERT 
WITH CHECK (auth.uid() = employee_id);

CREATE POLICY "Admins can view all sales" 
ON public.sales FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Create shop_info table
CREATE TABLE public.shop_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on shop_info
ALTER TABLE public.shop_info ENABLE ROW LEVEL SECURITY;

-- Create policies for shop_info
CREATE POLICY "Anyone can view shop info" 
ON public.shop_info FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage shop info" 
ON public.shop_info FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles p 
  WHERE p.id = auth.uid() AND p.role = 'admin'
));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 'staff');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial shop info
INSERT INTO public.shop_info (name, address, phone, email, description) 
VALUES (
  'SS Uniforms',
  'Shop No. 123, Uniform Market, Delhi NCR',
  '+91-9876543210',
  'info@ssuniforms.com',
  'Your trusted partner for quality school uniforms across Delhi NCR. We serve multiple schools with premium quality uniforms at affordable prices.'
);