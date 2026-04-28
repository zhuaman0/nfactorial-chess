# Authentication — Royal Chess

Royal Chess supports two ways to sign in: **Email + Password** and **Continue with Google**.

---

## Sign Up (Email)

1. Go to `/register`
2. Fill in **First name**, **Last name**, **Email**, and **Password** (min 6 characters)
3. Click **Create Account**
4. A Supabase account is created, and a **profile row** is automatically inserted with:
   - `gold_balance = 500` (starter gold)
   - `points = 0`
   - `current_streak = 0`

> Check your email for a confirmation link if email verification is enabled.

---

## Sign In (Email)

1. Go to `/login`
2. Enter your **Email** and **Password**
3. Click **Sign In**
4. On success you are redirected to the home page `/`

---

## Sign In with Google (OAuth)

1. Go to `/login`
2. Click **Continue with Google**
3. You are redirected to Google's consent screen
4. After approving, Google sends you back to Supabase, which redirects to `/confirm?code=...`
5. The `/confirm` page calls `supabase.auth.exchangeCodeForSession(code)` — this exchanges the PKCE authorization code for a real session
6. Once the session is ready, your profile is synced and you land on `/`

> **Flow type:** PKCE (Proof Key for Code Exchange) — the most secure OAuth flow.

### Why it goes to `/confirm` and not directly home

Supabase's OAuth callback always lands on a dedicated page so the app can safely exchange the temporary code for a session token. If you skip this step the session is never created.

---

## How Profiles Are Created

When a new user signs up, a PostgreSQL trigger (`handle_new_user`) fires on `auth.users` and inserts a row into `public.profiles`:

```sql
INSERT INTO public.profiles (id, first_name, last_name, avatar_url, gold_balance)
VALUES (NEW.id, '', '', '', 500);
```

For Google OAuth users, the app also calls `profileStore.syncFromOAuth()` on the confirm page, which fetches the profile and stores it in the Pinia `profile` store.

---

## Session Persistence

Sessions are stored in cookies by `@nuxtjs/supabase`. They are refreshed automatically. When you open the app, the stored session is restored without needing to log in again.

---

## Logout

Click your **avatar** in the top-right corner → **Sign Out**. This calls `supabase.auth.signOut()` and clears the session.

---

## Route Protection

Pages are protected by the `@nuxtjs/supabase` redirect middleware:

- **Protected pages** — if not logged in, redirected to `/login`
- **Public pages** — `/`, `/login`, `/register`, `/confirm` are accessible without auth

This is configured in `nuxt.config.ts`:

```ts
supabase: {
  redirect: true,
  redirectOptions: {
    login: '/login',
    callback: '/confirm',
    exclude: ['/', '/login', '/register', '/confirm'],
  }
}
```

---

## Security Notes

- Passwords are handled entirely by Supabase Auth (bcrypt hashed, never visible to the app)
- The service role key is only used server-side (inside `server/api/`) and never exposed to the browser
- All database tables use **Row Level Security (RLS)** — users can only read/write their own rows
