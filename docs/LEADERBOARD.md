# Leaderboard — Royal Chess

The Global Leaderboard ranks every registered player by their chess performance. It can be accessed from the navbar → **Leaderboard** or from the home page hero button.

---

## How Rankings Work

Players are ranked by:

1. **Wins** (descending) — primary sort
2. **Total games played** (descending) — tiebreaker

A "win" is any game where `result = '1-0'` (White wins) is saved under your user ID.

---

## Leaderboard Page (`/leaderboard`)

### Hall of Champions (Podium)

The top 3 players are displayed on a visual podium:

| Position | Title | Visual |
|----------|-------|--------|
| 1st | King ♔ | Gold glow, floating crown |
| 2nd | Queen ♕ | Purple ring |
| 3rd | Queen ♕ | Bronze ring |

### Full Rankings Table

Below the podium, all players appear in a table with:

- **Rank number** (gold for 1st, silver for 2nd, bronze for 3rd)
- **Tier badge** — chess piece icon assigned by rank
- **Player name and avatar**
- **Win count**
- **Win rate %** with a progress bar

### Tier Badges

| Rank | Badge | Piece |
|------|-------|-------|
| #1 | King | ♔ |
| #2 – #3 | Queen | ♕ |
| #4 – #10 | Rook | ♖ |
| #11 – #25 | Bishop | ♗ |
| #26 – #50 | Knight | ♘ |
| #51+ | Pawn | ♙ |

---

## How Data Is Fetched

The leaderboard uses a Supabase RPC function `get_leaderboard()` that runs server-side with `SECURITY DEFINER` (bypasses RLS so it can read all profiles and games):

```sql
SELECT
  p.id, p.first_name, p.last_name, p.avatar_url,
  COUNT(g.id) FILTER (WHERE g.result = '1-0') AS wins,
  COUNT(g.id)                                  AS total_games
FROM public.profiles p
LEFT JOIN public.games g ON g.user_id = p.id
GROUP BY p.id, p.first_name, p.last_name, p.avatar_url
ORDER BY wins DESC, total_games DESC;
```

The Pinia `leaderboard` store calls this RPC on page mount and caches the results.

---

## Win Rate Calculation

```
Win Rate = (wins / total_games) × 100
```

Players with 0 games show 0% win rate. The win rate bar fills proportionally.

---

## Improving Your Rank

- Play more games in **Practice mode** — every saved game counts toward `total_games`
- Win games — results are stored with `result = '1-0'`
- Complete **Quests** to improve your skills and win more games
- Win **Raids** — raid wins are tracked separately (`raid_wins` column) but are not yet included in the leaderboard ranking (coming soon)
