-- SQL to create games history table
CREATE TABLE IF NOT EXISTS public.games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  white_name TEXT,
  black_name TEXT,
  winner TEXT, -- 'White', 'Black', or 'Draw'
  result TEXT, -- '1-0', '0-1', '1/2-1/2'
  moves TEXT[], -- Array of SAN moves
  fen TEXT, -- Final position
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- Users can view their own games
CREATE POLICY "Users can view own games"
  ON public.games
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own games
CREATE POLICY "Users can insert own games"
  ON public.games
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
