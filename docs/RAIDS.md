# Shadow Siege (Raids) — Royal Chess

Shadow Siege is the PvP gold economy system. You pick a real player, bet gold, and play a chess game against an AI built from **their actual game history**. Win and you steal their gold. Lose and they take yours.

---

## The Core Concept

Every player on Royal Chess has a **Shadow** — an AI profile built from their last 20 games. The Shadow knows:

- The player's **most played opening** (first 10 moves from their game history)
- Their **estimated ELO** (calculated from their win rate: `600 + winRate × 1200`)

When you raid someone, you don't play against the real person. You play against their Shadow. This means:

- Players who never played games have a weak Shadow (ELO 800, no opening moves)
- Players who play a lot have a strong Shadow with predictable patterns you must adapt to

---

## How to Start a Raid

1. Go to `/play` → click **Shadow Siege**
2. The **Raid Lobby** appears — a ranked list of all other players by gold balance
3. Each card shows:
   - Player name and avatar
   - Gold balance (what you can steal)
   - Raid wins / Defense wins
   - Estimated ELO of their Shadow
4. Set your **Gold Stake** (minimum 10 gold)
5. Click **Raid [Name]**

> You cannot raid yourself. Your own profile is excluded from the list.

---

## The Raid Game

Once you start a raid:

1. A chess board appears — you play as **White**
2. The Shadow plays the opponent's **signature opening moves** first
3. A status bar shows: `Shadow Move 3 / 7 — ELO ~1050`
4. Once the Shadow's opening moves are exhausted, **Stockfish takes over** at difficulty matching the ELO level

### Shadow Difficulty Levels

| Estimated ELO | Label | Stockfish Depth |
|---------------|-------|----------------|
| < 900 | Easy | Low |
| 900 – 1199 | Medium | Medium |
| 1200 – 1499 | Hard | High |
| 1500+ | AI | Maximum |

---

## Winning and Losing

When the game ends:

| Outcome | What happens |
|---------|-------------|
| **You win** | Gold stake transfers from defender → you. Your `raid_wins` +1 |
| **You lose** | Gold stake transfers from you → defender. Their `defense_wins` +1 |

Gold transfers are handled by the `transfer_gold(p_from, p_to, p_amount)` SQL function, which is atomic and uses `GREATEST(0, ...)` to prevent negative balances.

The result is recorded in the `raids` table with:
- `attacker_id`, `defender_id`
- `status` (`won` or `lost`)
- `gold_stake`
- `completed_at`

---

## How the Shadow Profile Is Built

The server endpoint `GET /api/shadow/[userId]` builds the Shadow in real time:

```
1. Fetch the last 20 games of the target player
2. For each game, take the first 10 moves
3. Group identical opening sequences and count frequency
4. Pick the most-played opening sequence
5. Calculate win rate → estimate ELO
6. Cache the result in shadow_profiles table
```

If the target has no game history, the Shadow returns:
- `opening_moves: []`
- `estimated_elo: 800`
- `games_analyzed: 0`

---

## Gold Balance Protection

- You cannot stake more gold than you have
- You cannot go below 0 gold (the SQL function floors at 0)
- The defender's gold cannot be stolen below 0

---

## Strategy Tips

- **Target players with lots of gold and few games** — their Shadow is weak (ELO 800, no opening book)
- **Study your own opening** — if you always play e4 and get raided, the attacker will know your first 7 moves
- **Play varied games** — mixing openings makes your Shadow harder to predict
- **Build your gold slowly** — win small stakes before attempting big raids
