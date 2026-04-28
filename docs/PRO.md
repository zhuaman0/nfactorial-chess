# Royal Pass (Pro Upgrade) — Royal Chess

The **Royal Pass** is a one-time paid upgrade that unlocks exclusive features unavailable to free players. It is purchased through **Stripe** — no subscription, no recurring charges, lifetime access.

---

## Price

**$9.99 — one-time payment**

---

## What You Get

| Benefit | Description |
|---------|-------------|
| ❤️ Unlimited HP in Survival Mode | Never run out of lives — siege as long as you dare |
| 🧠 Advanced AI Coach | Deep analysis of every move with strategic coaching powered by Stockfish |
| 🖤 Obsidian Board Skin | Exclusive dark-fantasy pieces and board — not available to free players |
| 👑 Royal Pass badge | A gold crown badge displayed on your profile and in the leaderboard |

---

## How to Upgrade

1. Click **Upgrade** in the navbar "More" menu — or go directly to `/upgrade`
2. If you already have the Royal Pass, the page shows a confirmation message and no button
3. If you don't, click **⚔️ Claim Your Royal Pass**
4. You are redirected to **Stripe Checkout** (secure, hosted by Stripe)
5. Enter your card details and complete the payment
6. On success, you are redirected to `/success`
7. Your profile is updated: `is_pro = true`

---

## Payment Flow (Technical)

### Step 1 — Create Checkout Session

`POST /api/create-checkout-session` is called with your `userId` and `userEmail`.

The server creates a Stripe Checkout session:
- **Mode:** `payment` (one-time, not subscription)
- **Price:** Stripe price ID `price_1TQtGfPCOVqRy0WVjmPRrZD4`
- **Metadata:** `{ userId }` — used by the webhook to find your account
- **Success URL:** `/success?session_id=...`
- **Cancel URL:** `/upgrade` (brings you back if you close Stripe)

### Step 2 — Stripe Webhook

After a successful payment, Stripe sends a `checkout.session.completed` event to `POST /api/stripe-webhook`.

The webhook:
1. Verifies the Stripe signature (using `STRIPE_WEBHOOK_SECRET`)
2. Extracts `userId` from `session.metadata`
3. Updates `profiles.is_pro = true` using the Supabase service role key

### Step 3 — Success Page

After payment, Stripe redirects to `/success`. The page confirms your Royal Pass is active.

---

## Checking Pro Status

Your Pro status is stored in `profiles.is_pro` (boolean). The `profileStore` exposes it:

```ts
const profileStore = useProfileStore()
profileStore.isPro  // true or false
```

The `isPro` getter is used across the app to:
- Show/hide Pro-only features
- Display the 👑 crown badge in the navbar dropdown
- Show "You already have the Royal Pass!" on the upgrade page

---

## Cancellation / Refunds

Since this is a one-time payment (not a subscription), there is no cancellation. Refunds are handled through Stripe's dashboard if needed.

---

## Free vs Pro Comparison

| Feature | Free | Royal Pass |
|---------|------|-----------|
| Play vs Stockfish AI | ✅ | ✅ |
| All quests | ✅ | ✅ |
| Shadow Siege raids | ✅ | ✅ |
| Gold economy | ✅ | ✅ |
| Classic / Neon / Royal / Pixel skins | ✅ | ✅ |
| Naruto skin (500 gold) | ✅ | ✅ |
| Unlimited HP in Survival Mode | ❌ | ✅ |
| Advanced AI Coach (deep analysis) | ❌ | ✅ |
| Obsidian Board Skin | ❌ | ✅ |
| 👑 Royal Pass badge | ❌ | ✅ |
