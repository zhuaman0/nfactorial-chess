# ♚ Royal Chess — nFactorial Chess Platform

> A full-stack chess platform built with Nuxt 3, Supabase, and Stockfish 18.
> **Live demo → https://royalchess-khaki.vercel.app**

---

## What is this?

Royal Chess is a modern chess web application that goes far beyond just moving pieces. Players can:

- Play chess against a real Stockfish AI engine at adjustable difficulty
- Train specific openings and piece movements through guided quests
- **Raid** other players — bet gold and face an AI clone built from their real game history
- Compete in real-life tournament events organized at physical venues
- Customize their board with animated premium skins (Naruto theme)
- Climb a global leaderboard ranked by wins

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Nuxt 4 · Vue 3 · Composition API |
| Styling | Tailwind CSS |
| State | Pinia |
| Backend | Nuxt server routes (Node.js) |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth — Email/Password + Google OAuth |
| Chess Engine | Stockfish 18 Lite (WebAssembly) |
| Realtime | Supabase Realtime (tournament matches) |
| Payments | Stripe (Pro upgrade) |
| Deployment | Vercel |

---

## Feature Docs

| Section | File | Description |
|---------|------|-------------|
| Authentication | [docs/AUTH.md](docs/AUTH.md) | Sign up, login, Google OAuth, profile creation |
| Play Chess | [docs/PLAY.md](docs/PLAY.md) | Practice vs AI, training mode, Shadow Siege |
| Quests | [docs/QUESTS.md](docs/QUESTS.md) | Earn XP through quiz and piece-training quests |
| Shadow Siege | [docs/RAIDS.md](docs/RAIDS.md) | Bet gold, raid other players, steal their gold |
| Shop | [docs/SHOP.md](docs/SHOP.md) | Gold economy, board themes, premium skins |
| Leaderboard | [docs/LEADERBOARD.md](docs/LEADERBOARD.md) | Global rankings by wins and win rate |
| Tournaments | [docs/TOURNAMENTS.md](docs/TOURNAMENTS.md) | Real-life chess events with venue + invite codes |

---

## Gold & XP Economy

Every player starts with **500 🪙 gold** and **0 ⭐ XP**.

| Currency | How to earn | How to spend |
|----------|-------------|--------------|
| Gold | Win raids | Buy skins in the Shop, wager in raids |
| XP | Complete quests | Levels up your title automatically |
| Streak | Check in daily | Displayed on your profile — resets after 48 h |

### Level Titles

| XP Range | Title |
|----------|-------|
| 0 – 99 | Newcomer |
| 100 – 249 | Pawn |
| 250 – 499 | Brave Pawn |
| 500 – 999 | Knight |
| 1 000 – 1 999 | Bishop |
| 2 000 – 3 999 | Rook |
| 4 000 – 6 999 | Queen |
| 7 000 – 10 999 | Elite |
| 11 000 – 15 999 | Master |
| 16 000+ | Grandmaster |

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables (see below)
cp .env.example .env

# 3. Apply SQL migrations in Supabase SQL Editor
#    Run files inside supabase/migrations/ in order

# 4. Start dev server
npm run dev
# → http://localhost:3000
```

### Required `.env` variables

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## Project Structure

```
/
├── app/
│   ├── pages/           # Route pages
│   │   ├── index.vue        # Home dashboard
│   │   ├── play.vue         # Chess game (all 3 modes)
│   │   ├── quests/          # Quest list + quest detail
│   │   ├── tournaments/     # Tournament list + detail + match
│   │   ├── leaderboard.vue
│   │   ├── shop.vue
│   │   └── login.vue / register.vue
│   ├── components/      # Reusable Vue components
│   ├── stores/          # Pinia: auth, profile, chess, raid, quests, tournament, leaderboard
│   ├── composables/     # useLevel, useStockfish, useAdvisor
│   └── data/skins.ts    # Skin catalog
├── server/api/          # Server-side API endpoints
│   ├── raid/complete.post.ts
│   ├── shop/buy.post.ts
│   ├── shadow/[userId].get.ts
│   ├── games/save.post.ts
│   └── streak/checkin.post.ts
└── supabase/migrations/ # Sequential SQL files (001 → 008)
```
