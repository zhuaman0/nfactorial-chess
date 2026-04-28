-- Add streak tracking columns to profiles

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS current_streak  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_streak  INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_active_at  TIMESTAMPTZ;
