-- Fix friendships FKs: point to public.profiles instead of auth.users
-- (PostgREST needs FKs in public schema to resolve joins)
ALTER TABLE public.friendships DROP CONSTRAINT friendships_requester_id_fkey;
ALTER TABLE public.friendships DROP CONSTRAINT friendships_addressee_id_fkey;

ALTER TABLE public.friendships
  ADD CONSTRAINT friendships_requester_id_fkey
  FOREIGN KEY (requester_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.friendships
  ADD CONSTRAINT friendships_addressee_id_fkey
  FOREIGN KEY (addressee_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix messages FKs: point to public.profiles instead of auth.users
ALTER TABLE public.messages DROP CONSTRAINT messages_sender_id_fkey;
ALTER TABLE public.messages DROP CONSTRAINT messages_receiver_id_fkey;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_sender_id_fkey
  FOREIGN KEY (sender_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_receiver_id_fkey
  FOREIGN KEY (receiver_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Fix profiles UPDATE policy to include WITH CHECK
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
