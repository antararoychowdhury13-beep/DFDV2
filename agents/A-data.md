# Agent A — Data layer prompt

> Paste this to spawn Agent A. Give it ONLY this prompt plus read access to the frozen contracts
> (`src/types.ts`, the `src/api/*` stubs). It needs no UI or flow context.

---

You are **Agent A (Data)** on the DFDv2 `wire-the-daily-loop` sprint. Work on branch
`feature/data-layer`. Create it from the contract-freeze commit if it doesn't exist.

**Charter:** stand up the Supabase schema and the typed read/write windows that the daily loop
reads from. You build the data; you render nothing.

**Read first:** `SPEC.md` (§3 Agent A cell, §4, §5), `backend-kit/01_data-model.md`,
`02_api-contract.md`, `03_auth-and-access.md`, `00_decisions.md`, and `src/types.ts` (the frozen
shape you must satisfy).

**You OWN (create/edit only these):**
- `supabase/migrations/**` — tables for `User`, `PujaSession`, `SessionIntention`,
  `SessionStepProgress`, `ChantTally`, and the content tables (`backend-kit/01`)
- `supabase/policies/**` — row-level access; owner-only enforced at the data layer (`backend-kit/03`)
- `src/api/client.ts`, `src/api/sessions.ts`, `src/api/content.ts`, `src/api/chant.ts`
- Keep `backend-kit/01_data-model.md`, `02_api-contract.md`, `03_auth-and-access.md` in sync if
  reality forces a detail

**You MAY READ:** `src/types.ts`, `src/theme.ts`.
**You MUST NOT TOUCH:** any `src/*Screen.tsx`, `src/flow/**`, `App.tsx`, `src/types.ts` (read-only).

**Tasks (SPEC.md §5):**
- **A1** — migrations for all content + user-state tables. UUID ids, soft delete (`deleted_at`),
  `created_at`/`updated_at` everywhere, index only what the screens query (`backend-kit/01` §indexing).
  Done: schema applies clean; RLS on every user-owned table.
- **A2** — implement the typed windows `getHome()`, `getBlueprint(pujaTypeId)`, `getSession(id)`.
  Returns must satisfy `src/types.ts` and be offline-friendly in shape (`backend-kit/02`).
- **A3** — chant batch-write with `client_id` dedupe; idempotent (decision #1).

**Hard rules:**
- Implement the **bodies** behind the frozen `src/api/*` signatures. Do NOT change a signature —
  that's a contract change; STOP and flag it to the orchestrator instead.
- If a screen would need a noun not in `backend-kit/01`, STOP and flag — do not invent it.
- Stack is Supabase/Postgres; read `backend-kit` before choosing shapes.

**Done when:** schema applies, types check against `src/types.ts`, the three windows return real
data, and `git diff --stat` shows no file outside your ownership cell. Commit with clear imperative
subjects (e.g. `Add PujaSession schema with owner-only RLS`).
</content>
