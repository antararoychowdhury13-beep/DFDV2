# Backend twin · Ritual Steps (Step 3)

> Source screen: `RitualStepsScreen.tsx` · design node `9-2267`.

## What the screen shows (and the backend behind each piece)

| On the screen | Source | Window |
|---|---|---|
| Title + subtitle | static | — |
| Progress stepper (3 active) | `PujaSession.current_step` | `GET /v1/me/sessions/current` |
| **Sankalpa (Intention)** expanded card — number 1, title, description | `RitualStep` row 1 of chosen puja type | bundled in `blueprint` |
| "What you need" mini list (Water, Flower, Akshat, Kumkum) | the step's required `Ingredient` rows | bundled in `blueprint` |
| 4 collapsed step rows (Avahana, Asana & Padya, Snan, Alankara) — number, title, desc, time | `RitualStep` rows 2–5 | bundled |
| Tapping a step | route to that step's detail (future screen) | — |
| **Chant count** card: "108 / Mantra Japa" | `ChantTally(user, mantra, today)` | `GET /v1/me/chants/today?mantra_id=...` |
| "Today's Progress 0% / Steps Completed" | `SessionStepProgress` aggregate | computed client-side from session state |
| "Om Namah Shivaya" + waveform | `Mantra` for this puja type | bundled |
| "Start step 1 / Sankalpa (intention)" button | begins step 1 | `POST /v1/me/sessions/{id}/steps/{step_id}/complete` (on completion) or a session start-step PATCH |
| Bottom nav (sticky) | — | — |

## Order of calls on first paint

```
on screen mount:
   GET /v1/me/sessions/current
   GET /v1/puja-types/{id}/blueprint    (likely already cached from step 2)
   GET /v1/me/chants/today?mantra_id=...
```

## Chant counter (the interesting part)

The counter is **local-first**:
- Every tap increments a counter in device memory.
- Every N seconds (or N taps), the device flushes a batch:
  `POST /v1/me/chants  { items: [{ client_id, mantra_id, date, increment }] }`
- The server **dedupes by `client_id`** so a retried batch never inflates the count.
- The screen reconciles by trusting the server's response (`{ count: 108 }`) on read.

> *Analogy.* The counter is an **odometer**, not a courier. It clicks locally on every motion and reports the total — it doesn't send a courier per click.

## States

| State | Behaviour |
|---|---|
| **Default** | expanded current step + collapsed upcoming + chant counter |
| **Loading** | step rows show skeleton; counter shows last cached number, not "—" |
| **Empty** | not possible — content is bundled with the puja type |
| **Error (chant batch fails)** | chant batch goes to local queue; counter still increments visually |
| **Offline** | reads from cache; writes queue; reconciliation on reconnect |

## Validation rules (server-enforced)

- A step can only be marked complete when the previous step is complete (`step_order` enforced). The server rejects out-of-order writes with `conflict`.
- Chant count `date` must be today (server time, user timezone respected). Past-date batches are coalesced into the correct date silently.
- Increment must be a positive integer ≤ 108 in one batch (sanity bound; a real chanter doesn't 10k-click in one batch).

## Reuses

All entities and windows already in `01` / `02`. ✅ Nothing new.
