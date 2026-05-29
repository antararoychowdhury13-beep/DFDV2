# Backend twin · Guided Puja (Step 1 — Select Deity)

> Source screen: `GuidedPujaScreen.tsx` · design node `156-3121` / `9-2064`.

## What the screen shows (and the backend behind each piece)

| On the screen | Source | Window |
|---|---|---|
| Title "Puja Guide" + subtitle | static | — |
| Progress stepper (1 active, 2–5 ahead) | `PujaSession.current_step` | `GET /v1/me/sessions/current` (or implicit on fresh start) |
| Select Deity card — 5 rows | `Deity` list | `GET /v1/deities` |
| Deity portrait, name, tag, description | per `Deity` row | (in same response) |
| Selecting a deity | session draft | `PATCH /v1/me/sessions/{id}` with `{ deity_id }` |
| Choose puja type — 3 cards | `PujaType` list | `GET /v1/puja-types` |
| Selecting a puja type | session draft | `PATCH /v1/me/sessions/{id}` with `{ puja_type_id }` |
| Set your intention — 13 chips | `Intention` list | `GET /v1/intentions` |
| Toggling intentions (multi-select) | session draft | `PATCH /v1/me/sessions/{id}` with `{ intention_ids: [...] }` |
| Tradition note "You can always change later…" | static copy | — |
| "Continue to Rituals steps" button | advances `current_step` to 2 | `PATCH /v1/me/sessions/{id}` with `{ current_step: 2 }` |
| Bottom nav | (no data) | — |

## Order of calls on first paint

```
on screen mount:
   parallel:  GET /v1/deities         (cacheable)
              GET /v1/puja-types      (cacheable)
              GET /v1/intentions      (cacheable)
              GET /v1/me/sessions/current   (no-cache; small)
   if no current session:  POST /v1/me/sessions  (creates a draft)
```

Idempotency on `POST /v1/me/sessions` prevents duplicate drafts on a retry.

## States

| State | Behaviour |
|---|---|
| **Default** | three lists + a draft session |
| **Loading** | content lists likely hit from cache (24h); session call shows a small inline shimmer; never blocks the deity list from rendering |
| **Empty** | not possible — content is bundled at build for first paint; if a list is truly empty server-side, the screen renders the "Set your intention" card empty with a calm message |
| **Error (session call fails)** | UI lets the user pick, but disables Continue until the draft session is created; shows a quiet "saving your choices…" pill |
| **Offline** | content cached; selections held locally; PATCH calls queued and drained on reconnect |

## Validation rules (the backend enforces these, not the UI)

- A session **may** have 0 intentions selected. (Design lets the user skip.)
- A session **must** have a deity and a puja type before `current_step` can advance to 2. Server returns `validation_failed` if you try.
- `puja_type_id` and `deity_id` must exist and not be soft-deleted.

## Reuses

All entities and windows already defined in `01` / `02`. ✅ Nothing new.
