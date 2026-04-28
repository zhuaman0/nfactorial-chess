-- ── 1. Add raid stat columns to profiles ─────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS raid_wins     INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS defense_wins  INTEGER NOT NULL DEFAULT 0;

-- ── 2. transfer_gold: atomically move gold between two users ──────────────
CREATE OR REPLACE FUNCTION public.transfer_gold(
  p_from   UUID,
  p_to     UUID,
  p_amount INTEGER
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profiles SET gold_balance = gold_balance - p_amount WHERE id = p_from;
  UPDATE public.profiles SET gold_balance = gold_balance + p_amount WHERE id = p_to;
END;
$$;

-- ── 3. Increment helpers ──────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.increment_raid_wins(p_user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profiles SET raid_wins = raid_wins + 1 WHERE id = p_user_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.increment_defense_wins(p_user_id UUID)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  UPDATE public.profiles SET defense_wins = defense_wins + 1 WHERE id = p_user_id;
END;
$$;

-- ── 4. get_leaderboard: ranked by game wins then total games ──────────────
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  id          UUID,
  first_name  TEXT,
  last_name   TEXT,
  avatar_url  TEXT,
  wins        BIGINT,
  total_games BIGINT
)
LANGUAGE sql SECURITY DEFINER AS $$
  SELECT
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    COUNT(CASE WHEN g.winner = 'White' THEN 1 END)  AS wins,
    COUNT(g.id)                                      AS total_games
  FROM public.profiles p
  LEFT JOIN public.games g ON g.user_id = p.id
  GROUP BY p.id, p.first_name, p.last_name, p.avatar_url
  ORDER BY wins DESC, total_games DESC
  LIMIT 100;
$$;
