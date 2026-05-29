# 03 — Auth & Access

> Two questions: *Who is this person?* (auth) and *What are they allowed to see and change?* (access). Both are enforced at the **data layer**, not just in the app — because anything checked only in the app can be skipped by a malicious client.

## Auth model

Phone OTP is the simplest model that fits a devotional/lifestyle app in India: no passwords, no email anxiety, one source of truth (the SIM). Each device gets a short-lived **access token** (~15 min) and a **rotating refresh token** (~30 days, single-use). The refresh token rotates on every use — a stolen refresh becomes useless the next time the rightful user opens the app.

```
Sign in flow
  phone ──► /v1/auth/otp/request   (rate-limited: 3 per 10 min per phone, 10 per hour per IP)
   │                                    │
   └────────────── code via SMS ◄───────┘
  code ──► /v1/auth/otp/verify     (creates user on first verify; returns access + refresh)

Day-to-day
  access token expires ──► /v1/auth/refresh  (rotates the refresh; old one is invalid)

Sign out
  /v1/auth/signout                  (revokes refresh; access dies on expiry)
```

> *Analogy.* The access token is your **day pass** — short, often replaced. The refresh token is your **club membership card** — lasts a month, but the receptionist clips a corner each time you swap your pass, and a card with the wrong number of corners gets confiscated.

### Rate limits (on the auth windows, always — abuse vector)

- **OTP request**: 3 per phone per 10 min, 10 per IP per hour, captcha if exceeded.
- **OTP verify**: 5 wrong codes → 15-min lockout for that phone.
- **Refresh**: 60 per minute per token (generous; just stops a runaway client).

### What we deliberately did NOT add

- Email/password sign-up (not in any screen).
- Social sign-in (introduces dependency on Google/Apple consoles before a real screen needs it).
- Magic-link email (same).
- MFA (overkill for a devotional app — phone OTP *is* the second factor).

---

## Access model — tag every screen, enforce at the row

Every screen is one of:

| Tag | Meaning | Examples in this app |
|---|---|---|
| **🔓 public** | unauthenticated; safe to cache | content lists (deities, puja types, intentions, traditions, today's quote, daily content) |
| **🔒 private — owner-only** | authenticated; the user sees only their own rows | Home (chant tallies), Notifications, Guided Puja session draft, Puja Guide session view, Ritual Steps progress |
| **🚪 gated** (not in scope yet) | role / feature-flag controlled | future admin tools, beta features |

### Owner-only is enforced at the database, not the API

In Supabase/Postgres this is **Row-Level Security (RLS)**. Every private table has a policy that says, in plain language: *"a row is visible / writable only when its `user_id` equals the caller's auth uid."*

```sql
-- Plain English: only you can see your sessions.
alter table puja_session enable row level security;
create policy "own sessions" on puja_session
  using ( user_id = auth.uid() )
  with check ( user_id = auth.uid() );
```

The same shape applies to: `session_intention`, `session_step_progress`, `chant_tally`, `notification_delivery`, `user_preference`.

> *Analogy.* RLS is the **bouncer at every table**, not a velvet rope at the door. Even if someone gets a backstage pass (a leaked token or a bug in the API), the bouncer still checks the room.

### Public content is read-only via the API

Content tables (`deity`, `puja_type`, `intention`, `tradition`, `ingredient`, `ritual_step`, `mantra`, `quote`, `notification_template`) are public-readable. **Writes are blocked entirely from the client** — content is edited only through an admin path (off-app, see `04`).

---

## Per-screen access map

| Screen | Auth required? | Public data it reads | Private data it reads/writes |
|---|---|---|---|
| **Home (Morning Puja)** | yes (or guest with cached content) | today's daily content, today's quote, mantra | chant tallies, current session (if any) |
| **Notifications** | yes | notification template metadata | notification deliveries (own) |
| **Guided Puja (step 1)** | yes | deities, puja types, intentions | current/draft session, session intentions |
| **Puja Guide (step 2)** | yes | puja blueprint (ingredients, traditions) | current session (read; advance step on Begin Puja) |
| **Ritual Steps (step 3)** | yes | ritual steps, mantras for chosen puja type | session step progress, chant batches |

### Guest mode (an optional, friendly mode)

The Home screen can render with cached public content even before sign-in, because it has no per-user data on first render. Tapping **Begin Puja** is the first private action — that's the right moment to require sign-in (low friction; the user just demonstrated intent).

> *Analogy.* The temple courtyard is open; the inner sanctum needs you to identify yourself. We don't ask at the gate.

---

## Sensitive-data hygiene (small rules with big impact)

- **No PII in URLs.** Phone numbers go in request bodies, never query strings.
- **No sequential ids.** UUIDs everywhere (`01` rule).
- **No secrets in logs.** Tokens, OTP codes, phone numbers are redacted in app logs.
- **Soft delete only.** Even "delete account" sets `deleted_at` and queues a 30-day purge — recoverable, audit-able, and matches what most users actually mean by "delete".

---

## What changes when we add another screen later

Pick the screen's access tag from the table above. If it's owner-only, no new policy is usually needed — the existing per-user RLS already covers any private data it touches. **Only flag a new policy if the screen introduces a new relationship** (e.g., shared content with a friend). Today none of the screens do.
