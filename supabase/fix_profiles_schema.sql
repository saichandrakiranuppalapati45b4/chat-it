-- Create a new migration file to add phone_number to profiles and ensure username constraint

-- Add phone_number column if it doesn't exist
alter table profiles 
add column if not exists phone_number text;

-- If you want to rename or modify the table structure:
-- (Assuming the previous table was created, this is safe to run)
-- alter table profiles alter column username set not null; 
-- (Assuming username should be required)
