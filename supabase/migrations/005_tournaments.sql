-- ═══════════════════════════════════════════════════════════════
-- 005_tournaments.sql
-- Run this in your Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════

-- ── 1. tournaments ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tournaments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  invite_code TEXT NOT NULL UNIQUE,
  max_players INT  NOT NULL DEFAULT 10 CHECK (max_players BETWEEN 2 AND 10),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'finished')),
  created_by  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read tournaments (needed to join by code)
CREATE POLICY "Authenticated users can view tournaments"
  ON public.tournaments FOR SELECT
  USING (auth.role() = 'authenticated');

-- Only creator can update/delete
CREATE POLICY "Creator can update tournament"
  ON public.tournaments FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Creator can delete tournament"
  ON public.tournaments FOR DELETE
  USING (auth.uid() = created_by);

-- Any authenticated user can create a tournament
CREATE POLICY "Authenticated users can create tournaments"
  ON public.tournaments FOR INSERT
  WITH CHECK (auth.uid() = created_by);


-- ── 2. tournament_participants ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tournament_participants (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

ALTER TABLE public.tournament_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view participants"
  ON public.tournament_participants FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can join tournament"
  ON public.tournament_participants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave tournament"
  ON public.tournament_participants FOR DELETE
  USING (auth.uid() = user_id);


-- ── 3. tournament_matches ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.tournament_matches (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  player_a_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  player_b_id   UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  round         INT NOT NULL,          -- which round in the robin
  result        TEXT CHECK (result IN ('a_wins', 'b_wins', 'draw', NULL)),
  played_at     TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.tournament_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view matches"
  ON public.tournament_matches FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Participants can insert matches"
  ON public.tournament_matches FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Only a player in the match can submit the result
CREATE POLICY "Players can update their match result"
  ON public.tournament_matches FOR UPDATE
  USING (auth.uid() = player_a_id OR auth.uid() = player_b_id);


-- ── 4. Helper view: standings ────────────────────────────────────
-- (optional but handy – you can also compute in the client)
CREATE OR REPLACE VIEW public.tournament_standings AS
SELECT
  tp.tournament_id,
  tp.user_id,
  p.first_name,
  p.last_name,
  p.avatar_url,
  COUNT(CASE WHEN (m.player_a_id = tp.user_id AND m.result = 'a_wins')
                OR (m.player_b_id = tp.user_id AND m.result = 'b_wins') THEN 1 END) AS wins,
  COUNT(CASE WHEN m.result = 'draw' AND (m.player_a_id = tp.user_id OR m.player_b_id = tp.user_id) THEN 1 END) AS draws,
  COUNT(CASE WHEN (m.player_a_id = tp.user_id AND m.result = 'b_wins')
                OR (m.player_b_id = tp.user_id AND m.result = 'a_wins') THEN 1 END) AS losses,
  COUNT(CASE WHEN m.result IS NOT NULL AND (m.player_a_id = tp.user_id OR m.player_b_id = tp.user_id) THEN 1 END) AS played,
  (
    COUNT(CASE WHEN (m.player_a_id = tp.user_id AND m.result = 'a_wins')
                  OR (m.player_b_id = tp.user_id AND m.result = 'b_wins') THEN 1 END) * 3
    + COUNT(CASE WHEN m.result = 'draw' AND (m.player_a_id = tp.user_id OR m.player_b_id = tp.user_id) THEN 1 END)
  ) AS points
FROM public.tournament_participants tp
JOIN public.profiles p ON p.id = tp.user_id
LEFT JOIN public.tournament_matches m
  ON m.tournament_id = tp.tournament_id
  AND (m.player_a_id = tp.user_id OR m.player_b_id = tp.user_id)
GROUP BY tp.tournament_id, tp.user_id, p.first_name, p.last_name, p.avatar_url;
