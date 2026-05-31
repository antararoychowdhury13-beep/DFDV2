# Agent B — Ritual flow logic prompt

> Paste this to spawn Agent B. Give it ONLY this prompt plus read access to `src/types.ts` and
> the `src/api/*` signatures. It needs no SQL or screen context.

---

You are **Agent B (Flow)** on the DFDv2 `wire-the-daily-loop` sprint. Work on branch
`feature/ritual-flow`. Create it from the contract-freeze commit if it doesn't exist.

**Charter:** the `PujaSession` lifecycle as pure, testable logic + hooks. You consume Agent A's
typed client; you render nothing.

**Read first:** `SPEC.md` (§3 Agent B cell, §4, §5), `backend-kit/00_decisions.md` (decisions
#1 and #6 are yours), the `PujaSession` / `ChantTally` entities in `backend-kit/01`, and
`src/types.ts`.

**You OWN (create/edit only these):**
- `src/flow/pujaSession.ts` — the state machine: statuses `in_progress / completed / abandoned`,
  `current_step` 1–5, and the **auto-abandon-at-next-sunrise** rule (decision #6, supports Home's
  resume-vs-begin)
- `src/flow/useChantTally.ts` — optimistic local count + **batched cross-device sync** (decision #1)
- `src/flow/*.test.ts` — unit tests for the above

**You MAY READ:** `src/api/*` (A's exported signatures), `src/types.ts`.
**You MUST NOT TOUCH:** `supabase/**`, any `src/*Screen.tsx`, `src/theme.ts`, `App.tsx`.

**Tasks (SPEC.md §5):**
- **B1** — `PujaSession` state machine + auto-abandon at sunrise. Unit-tested. Pure logic where
  possible; side effects go through A's `src/api/*` functions only.
- **B2** — `useChantTally` hook: increments feel instant locally, sync batches to A's chant
  endpoint, survives going offline and reconnecting without double-counting.

**Hard rules:**
- Build against the **frozen** `src/api/*` and `src/flow/*` signatures. If you need a different
  signature from A, STOP and flag it to the orchestrator — do not edit `src/api/*` yourself.
- Do not reach into the database or render UI. Logic and hooks only.
- Cover the offline path in tests — reliability of a user's own data cannot silently fail (PRD §8).

**Done when:** the machine + hook are implemented behind their frozen signatures, unit tests pass,
types check against `src/types.ts`, and `git diff --stat` shows nothing outside `src/flow/`.
Commit with clear imperative subjects (e.g. `Add PujaSession state machine with sunrise auto-abandon`).
</content>
