# Backend twin · Puja Guide (Step 2 — Puja Setup)

> Source screen: `PujaGuideScreen.tsx` · design node `139-1594` / `9-1657`.

## What the screen shows (and the backend behind each piece)

| On the screen | Source | Window |
|---|---|---|
| Title + subtitle | static | — |
| Progress stepper (2 active) | `PujaSession.current_step` | `GET /v1/me/sessions/current` |
| "2. Puja setup" header + description | static copy | — |
| **What you will need** grid (14 ingredients) | `Ingredient` rows linked to chosen `PujaType` | `GET /v1/puja-types/{id}/blueprint` (returns `ingredients[]`) |
| Each item — name + `Essential` / `If Available` | per `Ingredient` row | (in same response) |
| Item icons (PNG / SVG) | `Ingredient.icon_url` | CDN |
| "Mission something !" row + "View substitute" pill | static copy (today); future: tap → ingredient substitutes | (none today; flagged in `01`) |
| Where to setup — diagram image | `PujaType.setup_diagram_url` | CDN |
| Face Direction / Best time / Keep the space | `PujaType.setup_meta` (3 small rows) | (in blueprint response) |
| Note: "If your home doesn't allow this exactly…" | static copy | — |
| Traditions & Method row + "See other traditions" pill | `Session.tradition_id` + `Tradition` list | `GET /v1/traditions` (lazy: only when pill is tapped) |
| "Begin Puja" button | advances session to step 3 | `PATCH /v1/me/sessions/{id}` with `{ current_step: 3 }` → routes to Ritual Steps |
| Bottom nav (sticky) | (no data) | — |

## Order of calls on first paint

```
on screen mount:
   parallel:  GET /v1/me/sessions/current     (must be in step >= 2, else redirect to step 1)
              GET /v1/puja-types/{id}/blueprint   (cacheable per type)
```

The blueprint **bundles** ingredients + ritual steps + setup_meta in one call — so the same payload backs this screen AND the next (Ritual Steps).

## States

| State | Behaviour |
|---|---|
| **Default** | grid + diagram + traditions row |
| **Loading** | grid card shows a skeleton tile per cell; diagram a soft placeholder |
| **Empty** | not possible — a puja type without ingredients is a content bug, surfaced to admins, not users |
| **Error (blueprint fails)** | full-card error state with retry — Begin Puja blocked because we can't honestly say what's needed |
| **Offline** | last cached blueprint per type renders fully; Begin Puja proceeds against the local session, syncs on reconnect |

## Validation rules (server-enforced)

- `current_step` may advance to 3 **only when** the session has a `deity_id` and `puja_type_id` set. (Same rule as step 1→2 — defence in depth.)
- The session's `tradition_id` is optional and falls back to the user's default (or "Smarta" if none).

## Reuses

All entities and windows already in `01` / `02`. ✅ Nothing new — confirms the blueprint window's value (one screen builds twice).
