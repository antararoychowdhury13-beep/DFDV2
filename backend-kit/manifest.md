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
| [`01_data-model.md`](./01_data-model.md) | Entities (nouns) derived from all 5 screens |
| [`02_api-contract.md`](./02_api-contract.md) | Service windows (verbs), pagination, errors |
| [`03_auth-and-access.md`](./03_auth-and-access.md) | Phone OTP + row-level access policies |
| [`04_storage-realtime-jobs.md`](./04_storage-realtime-jobs.md) | Storage/CDN, real-time (none), background jobs, push |
| [`05_scalability-and-failure.md`](./05_scalability-and-failure.md) | 10x roadmap, failure budgets, two quality attributes |

## Items flagged for sign-off (do not silently build)

These come up across the per-screen twins. Decide before an engineer codes them:

1. **Chant-count sync — device-only or cross-device?** Default proposal in `01`: yes, cross-device, batched.
2. **Notification deep-link allow-list.** Confirm the destinations: `morning-puja`, `puja-session/{id}`, `quote/{id}`, `festival/{slug}`, `settings/notifications`.
3. **"View substitute"** in Puja Guide — does it open a list of ingredient substitutes? If yes, promote to an `IngredientSubstitute` table (new noun).
4. **Red-dot semantics on Notifications.** Unread, or just "today"?
5. **Filter chip → tag relationship.** "Calendar" badge: is it a free-text label or a real category the user can filter by?
6. **Resume vs Start on Home's "Begin Puja"** when a session is already in progress.

Until the above are answered, the backend treats them with the safest default (described in each twin) and is built such that switching is a single-day change.

## Adding the next screen later (Mode B)

When a new screen design lands:
1. Run the Golden Prompt in **Mode B** with that screen's spec.
2. The output is one new `backend_<node>.md` twin.
3. The twin will either reuse existing entities/windows (most common) or **flag a new one** — and describe it in full so we approve before adding.
4. Append a new row to this manifest and tick it off.
