# Backend Kit Manifest

> The at-a-glance status board. Every built screen in the app gets a backend twin here.

**Design file:** *The Antar_ App2.0* · `p64W8hgnXPrUq3a4x3be4u`
**Companion file:** *Antar AppDFD2.0* · `MoO9Pj4SisPeg0VDWtSxbA` (used for the newer Notifications + Ritual Steps designs)

## Coverage

| Screen | Source file | Figma node(s) | Twin | Status |
|---|---|---|---|---|
| Home (Morning Puja) | `src/MorningPujaScreen.tsx` | `141-2318` (≈ `9-1879`) | [`backend_home.md`](./backend_home.md) | ✅ |
| Guided Puja — Select Deity (step 1) | `src/GuidedPujaScreen.tsx` | `156-3121`, `9-2064` | [`backend_guided-puja.md`](./backend_guided-puja.md) | ✅ |
| Puja Guide — Setup (step 2) | `src/PujaGuideScreen.tsx` | `139-1594`, `9-1657` | [`backend_puja-guide.md`](./backend_puja-guide.md) | ✅ |
| Ritual Steps (step 3) | `src/RitualStepsScreen.tsx` | `9-2267` / `9-2320` (duplicate) | [`backend_ritual-steps.md`](./backend_ritual-steps.md) | ✅ |
| Notifications | `src/NotificationsScreen.tsx` | `9-2505` | [`backend_notifications.md`](./backend_notifications.md) | ✅ |

## Shared (system-wide) kit

| File | What it covers |
|---|---|
| [`00_decisions.md`](./00_decisions.md) | **The locked-in answers to the six open questions** (single source of truth) |
| [`01_data-model.md`](./01_data-model.md) | Entities (nouns) derived from all 5 screens |
| [`02_api-contract.md`](./02_api-contract.md) | Service windows (verbs), pagination, errors |
| [`03_auth-and-access.md`](./03_auth-and-access.md) | Phone OTP + row-level access policies |
| [`04_storage-realtime-jobs.md`](./04_storage-realtime-jobs.md) | Storage/CDN, real-time (none), background jobs, push |
| [`05_scalability-and-failure.md`](./05_scalability-and-failure.md) | 10x roadmap, failure budgets, two quality attributes |

## Decisions confirmed ✅

The six questions the screens forced are now decided in [`00_decisions.md`](./00_decisions.md):

1. Chant-count sync — **cross-device, batched** ✅
2. Notification deep-links — **closed allow-list** ✅
3. "View substitute" — **real substitutes list** (bundled in blueprint) ✅
4. Red dot — **new AND unread, auto-clears after 24h** ✅
5. Calendar badge — **visual label for now; `tags[]` schema in place for later** ✅
6. Resume vs Start — **adaptive Home; auto-abandon at next sunrise** ✅

All the per-screen twins and the 01/02/04 docs have been patched to reflect these.

## Related product docs

- [`../PRD.md`](../PRD.md) — the Antar 2.0 Product Requirements Document (vision, target users, goals, scope, feature ladder, release plan).

## Adding the next screen later (Mode B)

When a new screen design lands:
1. Run the Golden Prompt in **Mode B** with that screen's spec.
2. The output is one new `backend_<node>.md` twin.
3. The twin will either reuse existing entities/windows (most common) or **flag a new one** — and describe it in full so we approve before adding.
4. Append a new row to this manifest and tick it off.
