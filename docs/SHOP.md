# Shop — Royal Chess

The Shop is where players spend their hard-earned gold on visual upgrades. Currently the shop sells **premium chess piece skins** and free **board themes**.

---

## Gold Currency

Gold is the in-game currency of Royal Chess.

| Action | Gold change |
|--------|------------|
| New account created | +500 🪙 (starter bonus) |
| Win a raid | +stake amount |
| Lose a raid | −stake amount |
| Buy a skin | −skin price |

Gold is stored in `profiles.gold_balance`. Your current balance is always visible in the home page hero and the navbar dropdown.

---

## Free Board Themes

Board themes are free and can be changed any time from `/play` before starting a game:

| Theme | Light Square | Dark Square |
|-------|-------------|-------------|
| Classic | Cream `#EBECD0` | Green `#779556` |
| Walnut | Tan `#f0d9b5` | Brown `#b58863` |
| Ocean | Light blue `#bdd0e0` | Deep blue `#3d6a9e` |
| Night | Lavender `#cab8e8` | Purple `#6b3a90` |
| Ice | Pale blue `#daeeff` | Steel `#6aaccf` |

Themes are saved to `localStorage` and remembered across sessions.

---

## Free Piece Skins

These are available to every player at no cost:

| Skin | Description |
|------|-------------|
| Classic | Standard black and white Unicode chess symbols |
| Neon | Glowing colored piece icons |
| Royal | Elegant gold-toned pieces |
| Pixel | Retro pixel-art style pieces |

---

## Premium Skins (Gold Required)

### Naruto — Hidden Leaf vs Akatsuki 🍃

**Price: 500 🪙 gold**

Replaces the chess pieces with characters from the Naruto anime:

| Piece | White (Konoha) | Black (Akatsuki) |
|-------|---------------|-----------------|
| King | Naruto (Hokage) | Madara |
| Queen | Sakura | — |
| Bishop | Kakashi | Itachi |
| Knight | Rock Lee | — |

The skin uses real artwork images for each piece. When active, pieces on the board display the character artwork instead of standard symbols.

---

## How to Buy a Skin

1. Go to `/shop`
2. Browse the skin catalog
3. Click **Buy for 500 gold** on the skin you want
4. A confirmation dialog appears showing your current balance
5. Confirm the purchase

### What happens on purchase

The server endpoint `POST /api/shop/buy` runs:

1. Fetches your current `gold_balance`
2. Checks you have enough gold (returns 402 if not)
3. Deducts the price: `gold_balance = gold_balance - price`
4. Returns `{ ok: true, newBalance }`

The skin is then **unlocked** in the browser via `customizationStore.unlockSkin(skinId)` and saved to `localStorage` as owned.

> Note: Skin ownership is currently stored client-side. Purchasing on one device will not automatically unlock the skin on another device.

---

## Applying a Skin

After purchasing:

1. Go to `/play`
2. In the settings panel, click the **Skins** tab
3. Your purchased skin appears as unlocked
4. Click it to apply → the board updates immediately

---

## Pro Upgrade (Stripe)

Separate from the gold shop, players can upgrade to **Pro** via Stripe for fiat payment. The Pro badge is stored as `profiles.is_pro = true`. Pro features are cosmetic (badge display) in the current version.

The Stripe checkout flow:
1. Click **Upgrade to Pro** in the navbar "More" menu or `/upgrade` page
2. Redirected to Stripe Checkout
3. On success, redirected to `/success` and the webhook sets `is_pro = true`
