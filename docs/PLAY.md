# Play Chess — Royal Chess

The `/play` page is the heart of the platform. It has **three game modes**, each with a different purpose.

---

## Mode 1 — Practice (vs Stockfish AI)

**Purpose:** Play a full chess game against the computer at any difficulty.

### How to play

1. Open `/play` — the **Practice** card is shown by default
2. Choose your **difficulty** (1–20 engine depth):
   - Depth 1–4 → Beginner
   - Depth 5–9 → Intermediate
   - Depth 10–15 → Advanced
   - Depth 16–20 → Master
3. Click **Start Game**
4. You play as **White**, the AI plays as **Black**
5. Click a piece to see valid moves highlighted, then click a destination square

### During the game

- **Move list** appears on the right in algebraic notation
- **Undo** button lets you take back your last move
- **New Game** restarts with the same settings
- The **AI Advisor** (King's Advisor button) can hint at the best move using Stockfish analysis

### After the game ends

- The result (win / lose / draw) is displayed
- The game is saved to your **history** (visible in Game History tab)
- A server call to `/api/games/save` records: moves, result, piece names, final position

### Stockfish Integration

The engine runs in a **Web Worker** (`/public/stockfish.js` — copied from the `stockfish` npm package at build time). Communication uses the UCI protocol:

```
position fen <FEN>
go depth <N>
→ bestmove e2e4
```

The `useStockfish` composable manages the worker lifecycle and parses responses.

---

## Mode 2 — AI Mirror (Training Mode)

**Purpose:** Train specific chess openings and test your own opening style against a stronger engine.

### How to use

1. Click the **AI Mirror** mode card
2. Choose a **training line** from the dropdown:
   - Italian Game
   - Sicilian Defense
   - Queen's Gambit
   - King's Indian
   - Ruy López
   - French Defense
3. The board loads with the first move of that opening already played
4. Play your reply — the engine continues the line while you practice your responses

### Training steps

Each training line shows a **step indicator** guiding you through the key moves of the opening. As you play each correct move, the step advances and the AI responds with the theory continuation.

### Purpose

This mode lets you practice real opening theory so you recognize key positions and don't have to memorize moves blindly — you understand the patterns.

---

## Mode 3 — Shadow Siege (Raid Mode)

**Purpose:** Challenge another real player's "shadow" — an AI built from their actual game history — and bet gold on the outcome.

> Full details in [RAIDS.md](./RAIDS.md). Here is the in-game experience:

### How it starts

1. Click **Shadow Siege**
2. The **Raid Lobby** appears — a list of all other players sorted by gold balance
3. Pick a target and set your **gold stake** (default: 100 gold)
4. Click **Raid**

### During the Shadow Siege game

- You still play as White on the board
- The **shadow** (your opponent) plays the first N moves from the real player's most common opening, then hands off to Stockfish
- A banner shows you how many "shadow moves" remain and the player's estimated ELO

### Winning or losing

- **You win** → the gold stake is transferred from the defender to you
- **You lose** → the gold stake is transferred from you to the defender
- `raid_wins` or `defense_wins` counters are incremented on both profiles

---

## Keyboard Controls

| Key | Action |
|-----|--------|
| Click piece | Select it, show valid moves |
| Click highlighted square | Move the piece |
| No keyboard shortcuts currently | — |

---

## Game History

The **Game History** tab (bottom of `/play` or sidebar) shows your last 20 games fetched from `public.games`. Each row shows:

- Opponent name (white / black)
- Result badge (Win / Loss / Draw)
- Date played
- Number of moves

Click a row to replay or review a game.

---

## Board Customization

Before starting a game, you can choose:

- **Board Theme** — Classic, Walnut, Ocean, Night, Ice
- **Piece Skin** — Classic, Neon, Royal, Pixel, or the premium **Naruto** skin (if purchased)

These settings are saved to `localStorage` and persist across sessions.
