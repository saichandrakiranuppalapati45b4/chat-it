-- Run this in your Supabase SQL Editor

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email text;

-- Optional: Index for faster lookup
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (username);
