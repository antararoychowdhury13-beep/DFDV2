# 00 — Decisions Log

> This file is the **single source of truth** for the six choices the screens forced. Read this first; everything else in the kit assumes these answers. Each decision lists the **rule**, the **why in one line**, and **where in the kit it shows up**.

Date confirmed: 2026-05-29 · Confirmed by: project lead

---

## 1. Chant counts sync cross-device (batched, idempotent)

- **Rule.** Every chant tap increments a device-local counter. The device flushes batches to the server (`POST /v1/me/chants`) every few seconds with a per-item `client_id` for dedupe. The server is the source of truth on read.
- **Why.** Devotional practice must survive phone-switches and reinstalls. The cost (one indexed table, one batched endpoint) is small; the cost of breaking trust is large.
- **Where it lives.**
  - `01_data-model.md` — entity `ChantTally(user_id, mantra_id, date, count)` with index `(user_id, mantra_id, date)`.
  - `02_api-contract.md` — `POST /v1/me/chants` batch with `client_id` idempotency.
  - `backend_home.md` + `backend_ritual-steps.md` — local-first / server-reconciled behaviour.

## 2. Notification deep-links use a closed allow-list

- **Rule.** A notification's `deep_link` must match one of: `morning-puja`, `puja-session/{id}`, `quote/{id}`, `festival/{slug}`, `settings/notifications`. The server validates on write (admin upload) and on read (defensive). The app routes by `switch`.
- **Why.** A push that can't be opened is the loudest broken thing in the app. Predictability beats flexibility.
- **Where it lives.**
  - `01_data-model.md` — `NotificationDelivery.deep_link` is the validated enum.
  - `02_api-contract.md` — `validation_failed` if a non-enum value is submitted by admin tools.
  - `04_storage-realtime-jobs.md` — the worker validates again before sending push.

## 3. "View substitute" opens a real substitutes list

- **New entity.** `IngredientSubstitute(ingredient_id FK, alternatives jsonb, note text)`.
- **New window.** Substitutes are bundled into the puja blueprint response (no extra round-trip): each `Ingredient` in `GET /v1/puja-types/{id}/blueprint` carries an `alternatives: []` array. Tap-to-open in the Puja Guide opens a sheet rendered from that data.
- **Why.** Solves a real user anxiety ("I don't have Akshat — can I still do this puja?") in keeping with the app's "intention over perfection" voice.
- **Where it lives.**
  - `01_data-model.md` — adds `IngredientSubstitute` to content nouns.
  - `02_api-contract.md` — blueprint shape carries `alternatives` per ingredient.
  - `backend_puja-guide.md` — "View substitute" pill → sheet.

## 4. Red dot = new AND unread, auto-clears after 24h

- **Rule.** Client shows the red dot when `read_at IS NULL AND delivered_at > now - 24h`. Tapping a notification sets `read_at`. The dot does not return.
- **Why.** Devotional context — the dot must mean "fresh attention needed", not "spiritual debt".
- **Where it lives.**
  - `01_data-model.md` — `NotificationDelivery.read_at` is the only state that needs persisting (no separate "shown dot" field).
  - `backend_notifications.md` — confirmed rendering rule.

## 5. "Calendar" badge stays a visual label — data shaped for later promotion

- **Rule.** Today the badge is a static design label; no filtering is wired to it. **But** `NotificationTemplate` carries a `tags text[]` column from day one so promoting to a real filter is one UI change (no migration of historical data).
- **Why.** Don't pay for a feature no screen demands; pay the cheap data cost so we never *can't* add it.
- **Where it lives.**
  - `01_data-model.md` — `NotificationTemplate.tags text[]` (default empty).
  - `backend_notifications.md` — confirmed: today visual only.

## 6. Home shows "Resume" or "Begin", with auto-abandon at the next morning

- **Rule.** `GET /v1/me/sessions/current` returns the latest `in_progress` session whose `started_at >= last_sunrise(user_tz)` — i.e., the puja "of this morning". Older in-progress sessions are auto-marked `abandoned` by a daily job (one row per user per cron tick, idempotent).
- **Client behaviour.** Home renders:
  - If a current session exists: primary CTA = **"Resume your puja"** with step name; secondary = "Start fresh" (creates a new session, abandons the old).
  - If none: primary CTA = **"Begin Puja"** as today.
- **Why.** Respects time already invested without confusing users hours later. The "next sunrise" boundary is the devotional version of a 24h timeout.
- **Where it lives.**
  - `01_data-model.md` — `PujaSession.status` includes `abandoned`.
  - `02_api-contract.md` — `GET /v1/me/sessions/current` returns null if past the boundary.
  - `04_storage-realtime-jobs.md` — adds the daily "auto-abandon stale sessions" job.
  - `backend_home.md` — adaptive Home rendering rule.

---

## What's no longer "flagged"

The `Items flagged for sign-off` section in `manifest.md` is replaced by the link to this file. Any future ambiguity goes through the same pattern: surface it in a per-screen twin, recommend, decide, log here.
