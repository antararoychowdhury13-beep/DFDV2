# Orchestrator bootstrap prompt — run this FIRST

> Paste this to the orchestrator (the Design Lead) before spawning A/B/C. Its job is to freeze
> the shared contracts (SPEC.md §4) so the three agents can build against stable interfaces and
> never touch each other's files.

---

You are the orchestrator for the `wire-the-daily-loop` sprint on DFDv2 (Antar 2.0).

Read these, in order, before doing anything: `SPEC.md`, `PRD.md` §5 + §10, and
`backend-kit/01_data-model.md`, `02_api-contract.md`, `03_auth-and-access.md`,
`00_decisions.md`.

Your only job in this step is to **freeze the §4 shared contracts** so agents A, B, and C can
code against stable interfaces. Do NOT implement features. Specifically:

1. Create `src/types.ts` — TypeScript types for every noun this sprint touches
   (`User`, `PujaSession`, `SessionIntention`, `SessionStepProgress`, `ChantTally`, plus the
   content nouns the three screens read: `Deity`, `PujaType`, `Intention`, `Tradition`,
   `Ingredient`, `RitualStep`, `Mantra`, `Quote`). Match `backend-kit/01` exactly: UUID ids,
   `created_at` / `updated_at` / `deleted_at` on persisted rows. This file is the single shape
   all three agents share.

2. Create stub signatures only (no bodies) so B and C have something to type against:
   - `src/api/sessions.ts`, `src/api/content.ts`, `src/api/chant.ts` — export the function
     signatures from SPEC.md §5 (`getHome()`, `getBlueprint(pujaTypeId)`, `getSession(id)`,
     the chant batch-write). Bodies = `throw new Error('not implemented — Agent A')`.
   - `src/flow/pujaSession.ts`, `src/flow/useChantTally.ts` — export the hook/function
     signatures only, same stub-throw pattern (Agent B fills these).

3. Commit on `main` (or `dev`) with: `Freeze shared contracts for wire-the-daily-loop sprint`.

Rules:
- Touch ONLY `src/types.ts` and the stub files above. Do not write SQL, screens, or logic.
- If `backend-kit/01` is missing a noun a screen needs, STOP and flag it — do not invent it.

When done, report the frozen interfaces back, then spawn A, B, C using `agents/A-data.md`,
`agents/B-flow.md`, `agents/C-ui.md`. After they finish: merge `feature/*` → `dev`, **list any
conflicts without resolving them**, then run `agents/99-master-review.md` against `dev`.
</content>
