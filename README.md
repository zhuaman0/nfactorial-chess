# 🏰 Epic Chess Adventures: The Ultimate Battle! ♟️

Welcome to the most awesome chess game ever! This isn't just regular chess—it's a magical world where you can complete quests, train your own robot, and battle friends to become the ultimate Grandmaster! 

## 🌟 Welcome to the Kingdom (Main Page)
This is your home base! From here, you can see your whole kingdom and choose your next great adventure. It's your map to all the fun stuff you can do!

## ⚔️ The Battle Arena (Play Chess)
Ready to play? Choose your battle style:
* **🛡️ Training Camp (Practice):** Not ready for a real player yet? No problem! Practice your moves against our friendly bots and computer AI to level up your brain.
* **🤖 The Robot Lab (Train AI):** This is where the magic happens! You get to teach and train your very own Artificial Intelligence robot. Make it super smart!
* **🏰 Kingdom Clash (Attack):** Just like in Clash Royale, you can go on the offensive! Attack other players' kingdoms to collect their shiny gold. But watch out—you won't be playing the player, you'll be battling the smart AI robot *they* trained to defend their base!

## 📜 Treasure Quests & Brain Teasers
Want to earn rewards? Jump into our daily quests and fun quizzes! Every time you learn something new or complete a challenge, you get awesome **XP (Experience Points)** and **In-game Gold**. Level up your hero!

## 🏆 Real-Life Tournaments!
Take the battle to the real world! You can create a tournament, share a secret code with your friends, and set a time and place to meet up (like a cool spot right here in Almaty!). Meet face-to-face, play your matches, and see who the true champion is.

## 💬 The Friendship Tavern
* **Find Heroes:** Look up all the other players in the game.
* **Add Friends & Chat:** Send friend requests and send secret messages or emojis to your buddies.
* **The Hall of Fame (Leaderboard):** Check the giant scoreboard to see who is the #1 player in the world. Can you climb to the top?

## 🛍️ The Magic Shop
Got a lot of gold from winning battles? Spend it here! Buy super cool, colorful **Skins** to make your chess pieces and your profile look totally unique and awesome. 

## 📰 The Town Crier (News)
Read all about it! Check this page for cool updates, new events, and secret tips on how to play better.

## 👑 The Royal Pass (Upgrade)
Want the ultimate VIP experience? Get the **Royal Pass** for a one-time payment of **$9.99** and unlock exclusive perks forever:

* ❤️ **Unlimited HP** in Survival Mode — never run out of lives
* 🧠 **Advanced AI Coach** — deep move analysis and strategic coaching
* 🖤 **Obsidian Board Skin** — exclusive dark-fantasy pieces unavailable to free players
* 👑 **Royal Pass badge** — gold crown on your profile and leaderboard

Payment is handled securely by **Stripe** — one-time charge, no subscription, lifetime access.

---

## 📚 Detailed Feature Documentation

| Section | File | Description |
|---------|------|-------------|
| 🔐 Authentication | [docs/AUTH.md](docs/AUTH.md) | Sign up, login, Google OAuth, profile creation |
| ♟️ Play Chess | [docs/PLAY.md](docs/PLAY.md) | Practice vs AI, training mode, Shadow Siege |
| 📜 Quests | [docs/QUESTS.md](docs/QUESTS.md) | Earn XP through quiz and piece-training quests |
| 🏰 Shadow Siege | [docs/RAIDS.md](docs/RAIDS.md) | Bet gold, raid other players, steal their gold |
| 🛍️ Shop | [docs/SHOP.md](docs/SHOP.md) | Gold economy, board themes, premium skins |
| 🏆 Leaderboard | [docs/LEADERBOARD.md](docs/LEADERBOARD.md) | Global rankings by wins and win rate |
| 📍 Tournaments | [docs/TOURNAMENTS.md](docs/TOURNAMENTS.md) | Real-life chess events with venue + invite codes |
| 👑 Royal Pass | [docs/PRO.md](docs/PRO.md) | One-time $9.99 upgrade via Stripe — Pro features and badge |

---

## 🛠️ For Developers

**Live demo →** https://royalchess-khaki.vercel.app

**Tech stack:** Nuxt 4 · Vue 3 · Supabase · Stockfish 18 · Tailwind CSS · Stripe · Vercel

```bash
npm install && npm run dev   # → http://localhost:3000
```

Required `.env` variables: `SUPABASE_URL`, `SUPABASE_KEY`, `SUPABASE_SERVICE_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
