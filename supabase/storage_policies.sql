-- Create a storage bucket for avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true);

-- Policy: Give authenticated users access to upload to their own folder
create policy "Authenticated users can upload avatars"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Give public access to view avatars
create policy "Public Access to Avatars"
on storage.objects for select
to public
using ( bucket_id = 'avatars' );

-- Policy: Allow users to update their own avatar
create policy "Users can update their own avatar"
on storage.objects for update
to authenticated
using (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = auth.uid()::text
);
