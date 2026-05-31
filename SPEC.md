# SPEC.md — Multi-Agent Build Spec (Antar 2.0 / DFDv2)

> **What this file is.** The single source of truth a Claude Code *orchestrator* reads
> before spawning sub-agents. It defines **what** each parallel workstream builds, **which
> files it owns**, and **what "done" means** — so three agents can work at once without
> stepping on each other's boards.
>
> **How it relates to the kits.** This file sits *beside* the existing chain, it does not
> replace it. The discipline is the same one already in the repo — **one source of truth,
> no drift.**
>
> ```
> PRD.md            →  WHY + WHAT            (product intent — already written)
> antar-spec-kit/   →  HOW it looks/behaves  (design)
> backend-kit/      →  HOW it's served/stored (backend, derived from design)
> SPEC.md (this)    →  WHO builds WHICH file, in WHICH branch, to WHICH definition of done
> ```
>
> Every task below must trace up to a feature in [`PRD.md` §5](./PRD.md) and, where it
> touches data, to an entity in [`backend-kit/01_data-model.md`](./backend-kit/01_data-model.md).
> If a task needs something not in those docs, the agent **stops and flags it** — it does
> not invent a noun or a screen.

---

## 0. The mental model (design-team sprint)

| Sprint role | Here it is | Rule it lives by |
|---|---|---|
| Design Lead | **Orchestrator agent** | reads this file, splits work, assigns boundaries, owns the shared contracts |
| Designers | **Sub-agents A / B / C** | each works one workstream, on its own branch, touching only its own files |
| Their boards | **Git branches** (one per agent) | isolation — nobody edits another agent's frame |
| Standup / merge | **Sync step** → `dev` | conflicts are *listed*, never auto-resolved |
| Design review | **Master review agent** | checks the merged `dev` against this spec before anything ships |

**The one thing that breaks this system:** two agents editing the same file. The whole spec
below is organised to make that impossible — see §3 (Ownership map) and §4 (Shared contracts).

---

## 1. This sprint's goal

> Edit this section per sprint. Everything below it is generated from this goal.

**Sprint name:** `wire-the-daily-loop`
**Goal:** Put the real Supabase data layer behind the three screens that already exist as
static UI, so the core habit loop (PRD §10, Phase 1.0 — F1–F4) runs end to end against live data.

**In scope:** Home (Morning Puja), the Guided-Puja → Puja-Guide → Ritual-Steps flow, and the
data/auth layer they all read from.
**Out of scope:** Premium (F7), Commerce (F8), Services (F9), Notifications delivery jobs.
Those are later phases — do not start them in this sprint.

---

## 2. The agents (workstreams)

Three agents, mapped exactly to Anupam's three natural workstreams: **data layer**, **ritual
flow logic**, **UI screens**.

| Agent | Workstream | Branch | One-line charter |
|---|---|---|---|
| **A — Data** | Supabase schema + typed client | `feature/data-layer` | Stand up the tables from `backend-kit/01` and the typed read/write windows from `backend-kit/02`. Owns nothing in `src/*Screen.tsx`. |
| **B — Flow** | Puja session state machine | `feature/ritual-flow` | The `PujaSession` lifecycle (start → step progress → complete/abandon) as pure, testable logic + hooks. Consumes A's client; renders nothing. |
| **C — UI** | Screen wiring | `feature/screens` | Replace the three screens' hard-coded data with calls into B's hooks. Owns the `*Screen.tsx` files; touches no SQL. |

> **Why this split has no overlap:** data has no UI, flow has no SQL, UI has no schema. The only
> things all three *share* are the type contract and the design tokens — and those are frozen
> and owned by the orchestrator (§4), not by any agent.

---

## 3. Ownership map (the anti-collision rule)

**Hard rule:** a file appears in exactly **one** "Owns" cell. If a task seems to need a file
another agent owns, that's a **contract change** → it goes through the orchestrator (§4), not a
direct edit.

### Agent A — Data (`feature/data-layer`)
- **Owns (create/edit):**
  - `supabase/migrations/**` — schema for `User`, `PujaSession`, `SessionIntention`,
    `SessionStepProgress`, `ChantTally`, content tables (per `backend-kit/01`)
  - `supabase/policies/**` — row-level access (per `backend-kit/03`, owner-only enforced at data layer)
  - `src/api/client.ts` — Supabase client init
  - `src/api/sessions.ts`, `src/api/content.ts`, `src/api/chant.ts` — the typed windows
  - `backend-kit/01_data-model.md`, `02_api-contract.md`, `03_auth-and-access.md` — keep twins in sync
- **May read:** `src/types.ts`, `src/theme.ts`
- **Must not touch:** anything under `src/*Screen.tsx`, `src/flow/**`, `App.tsx`

### Agent B — Flow (`feature/ritual-flow`)
- **Owns (create/edit):**
  - `src/flow/pujaSession.ts` — the state machine (statuses `in_progress / completed / abandoned`,
    `current_step` 1–5, the auto-abandon-at-sunrise rule from `backend-kit/00_decisions.md` #6)
  - `src/flow/useChantTally.ts` — batched cross-device chant count hook (decision #1)
  - `src/flow/*.test.ts` — unit tests for the logic
- **May read:** `src/api/*` (A's exports), `src/types.ts`
- **Must not touch:** `supabase/**`, `src/*Screen.tsx`, `src/theme.ts`

### Agent C — UI (`feature/screens`)
- **Owns (create/edit):**
  - `src/MorningPujaScreen.tsx` (F1 — daily darshan / Home)
  - `src/GuidedPujaScreen.tsx` (step 1 — select deity / type / intention)
  - `src/PujaGuideScreen.tsx` (step 2 — tradition + ingredients)
  - `src/RitualStepsScreen.tsx` (step 3 — per-step progress + japa)
- **May read:** `src/flow/*` (B's hooks), `src/theme.ts`, `src/types.ts`, `src/Chrome.tsx`
- **Must not touch:** `supabase/**`, `src/api/**`, `src/flow/**`, `App.tsx`

### Orchestrator-only (no agent edits these directly — §4)
- `src/types.ts` — the shared type contract (the data-model nouns as TS types)
- `src/theme.ts` — design tokens (frozen this sprint)
- `App.tsx` — routing/navigation hub
- `SPEC.md`, `PRD.md` — the source-of-truth docs
- `package.json` — dependency changes are reviewed centrally (avoids three agents bumping deps)

---

## 4. Shared contracts (the seam between agents)

Where two agents must agree, they agree on a **frozen interface owned by the orchestrator**, not
on a shared editable file. This is what keeps "no overlapping ownership" true even though the
agents obviously depend on each other.

**Contract 1 — Types (`src/types.ts`).** The TS shape of every noun in `backend-kit/01`
(`PujaSession`, `RitualStep`, `ChantTally`, …). A writes data that satisfies it; B's logic is
typed against it; C renders it. **Set before the sprint starts.** Any change = orchestrator edits
`src/types.ts`, re-freezes, and notifies all three agents.

**Contract 2 — Data API (`src/api/*` signatures).** Agent A publishes the function signatures
*first* (names, args, return types) before implementing them. B and C code against the signatures.
A may change the *body* freely; changing a *signature* is a contract change.

**Contract 3 — Hook surface (`src/flow/*` exports).** Agent B publishes its hook signatures
(`usesPujaSession()`, `useChantTally()`) first; C builds against them.

> **The seam rule in one line:** *agents depend on each other's published interfaces, never on
> each other's files.* If an interface must change, it's an orchestrator decision logged in §7,
> not an edit one agent makes to another's branch.

---

## 5. Per-task definition of done

Reuse this block per task (mirrors `PRD.md` §12 so nothing drifts from the product contract).

```
### [Agent X] T[n] — <task name>            Feature: F<n>   Branch: feature/<…>
- Traces to:        PRD §5 F<n>  +  backend-kit entity/window (name it)
- Builds:           <observable, testable outcome>
- Owns files:       <exact paths — must be inside this agent's §3 cell>
- Consumes:         <which frozen contract from §4>
- States honoured:  loading / empty / error / offline   (per PRD §8, backend-kit/05 §6)
- Done when:        [ ] builds  [ ] types check  [ ] tests pass  [ ] no file outside its cell touched
```

### This sprint's tasks

| ID | Agent | Task | Feature | Done signal |
|---|---|---|---|---|
| A1 | Data | Migrations for content + user-state tables | F1–F4 | `supabase db push` clean; RLS on every user table |
| A2 | Data | Typed windows: `getHome()`, `getBlueprint(pujaTypeId)`, `getSession(id)` | F1–F2 | matches `src/types.ts`; offline-friendly shape (backend-kit/02) |
| A3 | Data | Chant batch-write endpoint with `client_id` dedupe | F1 | decision #1 honoured; idempotent |
| B1 | Flow | `PujaSession` state machine + auto-abandon at sunrise | F1 | unit-tested; matches decision #6 |
| B2 | Flow | `useChantTally` (optimistic local + batched sync) | F1 | unit-tested; survives offline |
| C1 | UI | Wire Home to `getHome()` + tally hook | F1 | skeletons not spinners; offline shows saved copy |
| C2 | UI | Wire the 3-step flow to the session machine | F1 | resume-vs-begin rule visible; empty/error states built |

---

## 6. Workflow (the six steps)

1. **Brief.** Orchestrator reads this `SPEC.md` + `PRD.md` + `backend-kit/`. Freezes the §4
   contracts (writes `src/types.ts`, stubs `src/api/*` and `src/flow/*` signatures).
2. **Spawn.** Orchestrator starts A, B, C — each gets *only* its §3 cell + the frozen contracts,
   "no more context than it needs."
3. **Build in isolation.** Each agent works its own branch. Bottom-up order is fine
   (A's signatures → B → C) but they code against the *frozen interfaces*, so they don't block.
4. **Sync.** Orchestrator merges `feature/*` → `dev`. **Conflicts are listed, never
   auto-resolved.** If §3 was respected, the only possible conflicts are in §4 files — which means
   a contract drifted and needs an explicit decision.
5. **Master review** (separate agent, §7) audits merged `dev` against this spec.
6. **Ship.** If review passes → `dev` → `main`.

---

## 7. Master review checklist (the design review)

The review agent runs *after* merge to `dev`, *before* `main`. It produces a report; it does not
push. It checks:

- [ ] **Ownership held.** Each file was edited by only the agent that owns it in §3 (`git log --
      stat` per branch confirms no cross-edits).
- [ ] **Traceability.** Every task maps to a `PRD.md` F-number and a `backend-kit` entity/window.
      No invented nouns, no invented screens.
- [ ] **Contract integrity.** `src/types.ts` is the single shape; A/B/C all satisfy it. No agent
      forked a local copy of a type.
- [ ] **Naming + tokens.** UI uses `src/theme.ts` tokens only — no hard-coded hex (`#…`) in
      `*Screen.tsx`. Component/file naming matches existing repo convention (`XxxScreen.tsx`).
- [ ] **States built, not just happy path** — loading / empty / error / offline present (PRD §8).
- [ ] **Decisions honoured** — the six locked decisions in `backend-kit/00_decisions.md`
      (chant batching, deep-link allow-list, substitutes, red-dot, calendar tags, resume-vs-start).
- [ ] **Reliability rule** — a user's own data + auth cannot silently fail (PRD §8).

Report format: ✅ pass / ⚠️ fix-before-ship / ❌ block, one line each, with `file:line`.

---

## 8. Conventions every agent inherits

- **Stack:** Expo SDK 56 / React Native 0.85 / React 19. Read the *versioned* docs at
  <https://docs.expo.dev/versions/v56.0.0/> before writing code (per `AGENTS.md`) — Expo APIs changed.
- **Tokens, not literals.** All colour/spacing from `src/theme.ts`; the artboard scales by
  `screenWidth / 440` (see `DESIGN_WIDTH`).
- **Data model rules** (`backend-kit/01`): UUID ids, soft delete (`deleted_at`), `created_at` /
  `updated_at` on every row, index only what a screen queries.
- **Offline-first is a requirement, not a nice-to-have** (PRD §2, §8).
- **One job per screen; one dominant element** (PRD §6 design principles).
- **Commit style:** short imperative subject describing the user-visible change (matches existing
  history, e.g. *"Wire Home to live daily-darshan data"*).

---

## 9. Adding the next sprint later

When this sprint's gate is green (PRD §10), don't rewrite this file top-to-bottom — just:
1. Update §1 (new goal) and §5 (new task table).
2. Re-draw §3 ownership for the new files (keep zero overlap).
3. Re-freeze §4 contracts if the data model grew (and patch `backend-kit/01` first — design
   before backend, always).
4. Spawn, sync, review, ship.
</content>
</invoke>
