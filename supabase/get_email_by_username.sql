-- Run this in your Supabase SQL Editor
-- This function securely looks up a user's email from auth.users using their username.
-- It works for ALL users, even those who signed up before the email column was added to profiles.

CREATE OR REPLACE FUNCTION public.get_email_by_username(input_username text)
RETURNS text AS $$
  SELECT au.email
  FROM auth.users au
  JOIN public.profiles p ON p.id = au.id
  WHERE p.username = input_username
  LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;
