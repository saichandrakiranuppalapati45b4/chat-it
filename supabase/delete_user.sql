-- Run this in your Supabase SQL Editor
-- Replace 'THE_USERNAME_HERE' with the actual username you want to delete

-- Step 1: Find the user's ID
SELECT id, username, email FROM public.profiles WHERE username = 'THE_USERNAME_HERE';

-- Step 2: Delete the profile first (replace THE_USERNAME_HERE)
DELETE FROM public.profiles WHERE username = 'THE_USERNAME_HERE';

-- Step 3: Delete from auth.users (use the ID from Step 1)
-- Replace 'THE_USER_ID_HERE' with the UUID you got from Step 1
DELETE FROM auth.users WHERE id = 'THE_USER_ID_HERE';
