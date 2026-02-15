-- Add new columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS birthday DATE,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS identity_confirmed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS privacy_settings JSONB DEFAULT '{"comment_privacy": "Everyone", "tag_privacy": "Everyone", "mention_privacy": "Everyone", "manual_filter": true, "hide_offensive": true}'::jsonb,
ADD COLUMN IF NOT EXISTS hidden_words TEXT[] DEFAULT ARRAY['spam', 'fake', 'scam', '🚫'];

-- Create linked_accounts table
CREATE TABLE IF NOT EXISTS public.linked_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    platform TEXT NOT NULL, -- 'Chat It', 'Vibe Lab', 'Spotify', etc.
    platform_username TEXT NOT NULL,
    avatar_url TEXT,
    is_synced BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for linked_accounts
ALTER TABLE public.linked_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own linked accounts" 
ON public.linked_accounts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own linked accounts" 
ON public.linked_accounts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own linked accounts" 
ON public.linked_accounts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own linked accounts" 
ON public.linked_accounts FOR DELETE 
USING (auth.uid() = user_id);


-- Create blocked_users table
CREATE TABLE IF NOT EXISTS public.blocked_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(blocker_id, blocked_id)
);

-- Enable RLS for blocked_users
ALTER TABLE public.blocked_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view who they blocked" 
ON public.blocked_users FOR SELECT 
USING (auth.uid() = blocker_id);

CREATE POLICY "Users can block others" 
ON public.blocked_users FOR INSERT 
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can unblock" 
ON public.blocked_users FOR DELETE 
USING (auth.uid() = blocker_id);


-- Create close_friends table
CREATE TABLE IF NOT EXISTS public.close_friends (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    friend_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, friend_id)
);

-- Enable RLS for close_friends
ALTER TABLE public.close_friends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their close friends" 
ON public.close_friends FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can add close friends" 
ON public.close_friends FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove close friends" 
ON public.close_friends FOR DELETE 
USING (auth.uid() = user_id);
