# Master review agent prompt — run AFTER merge to `dev`, BEFORE `main`

> Paste this to a fresh agent once `feature/data-layer`, `feature/ritual-flow`, and
> `feature/screens` are merged into `dev`. It produces a report and does NOT push.

---

You are the **master review agent** for the DFDv2 `wire-the-daily-loop` sprint. The three feature
branches have been merged into `dev`. Review the merged result against `SPEC.md`. You produce a
report only — do not push, do not fix.

Read `SPEC.md` (§3, §4, §7), `PRD.md` §8 + §12, and `backend-kit/00_decisions.md`.

Run the SPEC.md §7 checklist and report each item as ✅ pass / ⚠️ fix-before-ship / ❌ block, one
line each with `file:line`:

- [ ] **Ownership held** — `git log --stat` per branch confirms each file was edited only by its
      §3 owner. Cross-edits (especially to §4 files `src/types.ts`, `src/theme.ts`, `App.tsx`) are ❌.
- [ ] **Traceability** — every change maps to a `PRD.md` F-number and a `backend-kit` entity/window;
      no invented nouns or screens.
- [ ] **Contract integrity** — `src/types.ts` is the single shape; A, B, C all satisfy it; no agent
      forked a local copy of a type or changed a frozen signature.
- [ ] **Naming + tokens** — no hard-coded hex in `*Screen.tsx`; colours come from `src/theme.ts`;
      file/component naming matches the repo convention (`XxxScreen.tsx`).
- [ ] **States built** — loading / empty / error / offline present, not just happy path (PRD §8).
- [ ] **Decisions honoured** — the six in `backend-kit/00_decisions.md` (chant batching,
      deep-link allow-list, substitutes, red-dot, calendar tags, resume-vs-start).
- [ ] **Reliability** — a user's own data + auth cannot silently fail (PRD §8).

End with a one-line verdict: **SHIP** (all ✅), **FIX** (has ⚠️, no ❌), or **BLOCK** (any ❌),
and list the exact files that need attention before `dev` → `main`.
</content>
