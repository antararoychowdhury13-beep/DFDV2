# 02 — API Contract

> An API is a list of **service windows**. Each window is named for what a screen needs, not for a database table. Default rules: `/v1/` everywhere (so we can change shapes later without breaking the app), every list is paginated, every response has a standard shape, every error has a standard shape, slow work goes into a queue (`04`).

## The standard response shape (every window)

```
SUCCESS
{
  "data": <object or array>,
  "meta": { "next_cursor": "...", "request_id": "..." }   // meta only when relevant
}

ERROR
{
  "error": {
    "code": "machine_readable_code",     // e.g. "session_not_found"
    "message": "Plain text for the user",
    "details": { ... },                  // optional, dev-facing
    "request_id": "..."
  }
}
```

> *Analogy.* The standard shape is the **envelope** every letter arrives in. The app doesn't have to inspect the envelope; it just opens it and reads.

---

## Windows (grouped by purpose)

Legend: **🔓 public** · **🔒 owner-only** · **R** read · **W** write · **📄** paginated · **🧊** cacheable for hours · **🔥** never cache (per-user)

### Content (library — same for every user)

| Window | Verb | Path | Why a screen needs it |
|---|---|---|---|
| 🔓 R 🧊 List deities | GET | `/v1/deities` | Guided Puja "Select Deity" list |
| 🔓 R 🧊 List puja types | GET | `/v1/puja-types` | Guided Puja "Choose puja type" |
| 🔓 R 🧊 List intentions | GET | `/v1/intentions` | Guided Puja "Set your intention" chips |
| 🔓 R 🧊 List traditions | GET | `/v1/traditions` | Puja Guide "See other traditions" |
| 🔓 R 🧊 Get puja blueprint | GET | `/v1/puja-types/{id}/blueprint` | One call returns: ingredients (each with `alternatives[]` for the substitute sheet), ritual steps, recommended mantras — Puja Guide + Ritual Steps screens |
| 🔓 R 🧊 Today's quote | GET | `/v1/quotes/today` | Home quote card |
| 🔓 R 🧊 Today's daily content | GET | `/v1/daily` | Home "Light the sacred Diya" card + mantra of the day |

> **Why one "blueprint" instead of three calls** — the Puja Guide and Ritual Steps screens both render the same conceptual unit (a puja's full setup + steps). Bundling avoids three round-trips on a possibly slow connection.

### User-state (each user's own data)

| Window | Verb | Path | Why a screen needs it |
|---|---|---|---|
| 🔒 R 🔥 Get current session | GET | `/v1/me/sessions/current` | Returns the latest `in_progress` session whose `started_at >= last_sunrise(user_tz)`. Older sessions are treated as null (auto-abandoned by the daily job). Home uses this to render Resume vs Begin. |
| 🔒 W Start session | POST | `/v1/me/sessions` | Begin Puja CTA on Home |
| 🔒 W Update session | PATCH | `/v1/me/sessions/{id}` | Selecting deity / puja type / intentions in Guided Puja; Continue button advances `current_step` |
| 🔒 W Complete a ritual step | POST | `/v1/me/sessions/{id}/steps/{step_id}/complete` | Ritual Steps "Start step 1" → completion |
| 🔒 W Abandon session | DELETE | `/v1/me/sessions/{id}` | Back-to-home from deep in the flow (soft delete) |
| 🔒 W Record chant batch | POST | `/v1/me/chants` | Home + Ritual Steps "108" counter; **body is a batch** of `{ mantra_id, date, increment }` so device can queue offline |
| 🔒 R 🔥 Today's chant tallies | GET | `/v1/me/chants/today` | Home "27/108 Chants Today" |
| 🔒 R 📄 List notifications | GET | `/v1/me/notifications?category={cat}&cursor=...` | Notifications screen list + filter pills |
| 🔒 W Mark notifications read | POST | `/v1/me/notifications/read` | Body: `{ ids: [...] }` or `{ all: true }` for "Mark all as read" |
| 🔒 R 🔥 Get preferences | GET | `/v1/me/preferences` | Bell on/off; reminder times; default tradition/deity |
| 🔒 W Update preferences | PATCH | `/v1/me/preferences` | Settings flow (future) — already needed by the design's "change tradition later" copy |

### Auth (full detail in `03`)

| Window | Verb | Path | Purpose |
|---|---|---|---|
| 🔓 W Request OTP | POST | `/v1/auth/otp/request` | phone → code |
| 🔓 W Verify OTP | POST | `/v1/auth/otp/verify` | code → tokens |
| 🔓 W Refresh tokens | POST | `/v1/auth/refresh` | rotating refresh token |
| 🔒 W Sign out | POST | `/v1/auth/signout` | invalidate refresh |

---

## Pagination

Cursor-based (opaque string). Reasons in plain words:
- **Stable across writes.** A new notification arriving while the user scrolls won't shift the page.
- **Cheap on the database.** Index seek vs offset count.
- **Mobile-friendly.** Easy to round-trip in an URL param.

`?cursor=<opaque>&limit=20` → response has `meta.next_cursor` if there's more.

---

## Caching strategy (what's safe to cache, what isn't)

| Cacheable? | Where | TTL | Reason |
|---|---|---|---|
| 🧊 Content (deities, puja types, intentions, traditions, blueprint, today's quote, daily content) | CDN + client | hours-to-day | Same for every user; rare changes |
| 🔥 Anything `/v1/me/*` | Never on shared cache | — | Per user, leaks if shared |
| 🔥 Chant tallies for *today* | Client only | session | Live-updating |

Cache-busting for content: include a content version header (`x-content-version: 2025-05-29`) so clients can hold a build-time cache and revalidate cheaply.

---

## Idempotency

Two writes must be safe to retry without duplicating effects:
- **`POST /v1/me/sessions`** (start) — accept an `Idempotency-Key` header. Same key + same payload within 24h returns the same session.
- **`POST /v1/me/chants`** (batch) — each item in the batch carries a client-side `client_id`. Server dedupes by `(user_id, mantra_id, date, client_id)`.

Otherwise an unstable network = inflated counts and duplicate sessions.

---

## Error codes (the small fixed list)

| Code | Meaning | Screen behaviour |
|---|---|---|
| `unauthenticated` | no/expired token | route to sign-in |
| `forbidden` | not the owner | show generic "not allowed" |
| `not_found` | id doesn't exist | empty state |
| `rate_limited` | too many calls | "try again in a moment" |
| `validation_failed` | bad input | inline field errors |
| `conflict` | concurrent edit | reload + ask user to retry |
| `server_error` | 5xx | retry with backoff, then friendly error UI |
| `offline` (client-synthesised) | no network | cached view + "showing last seen" note |

The screen never has to invent its own error vocabulary. The full list lives here.

---

## What we deliberately did NOT add

- **WebSockets / GraphQL subscriptions** — no screen needs live cross-client updates.
- **Bulk export / admin endpoints** — not a user-facing concern.
- **Server-rendered HTML** — the React Native client renders.
- **Public write endpoints** — every write is owner-only via the auth header.
