-- Add gold_balance to profiles with default 500 for new users

-- 1. Add column if it doesn't exist yet (safe to run multiple times)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS gold_balance INTEGER NOT NULL DEFAULT 500;

-- 2. Give existing users 500 gold if they currently have 0 (or column was just added)
UPDATE public.profiles SET gold_balance = 500 WHERE gold_balance = 0;

-- 3. Update the new-user trigger so every signup starts with 500 gold
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, gold_balance)
  VALUES (NEW.id, 500);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
