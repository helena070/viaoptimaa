ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS vehicle_type text DEFAULT null,
ADD COLUMN IF NOT EXISTS vehicle_plate text DEFAULT null,
ADD COLUMN IF NOT EXISTS company_name text DEFAULT null;