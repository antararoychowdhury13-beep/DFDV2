# Product Requirements Document — Antar App 2.0

| | |
|---|---|
| **Product** | Antar (mobile app), version 2.0 |
| **Owner** | Anupam |
| **Status** | 🟢 Draft v0.2 — core intent confirmed (unified vision · subscription + commerce · daily-devotee primary); feature specifics still ⏳ awaiting the 7 screens |
| **Last updated** | 2026-05-29 |
| **Related documents** | `antar-spec-kit/` (design system + screen specs) · [`backend-kit/`](./backend-kit/) (backend, derived from design) — including [`backend-kit/00_decisions.md`](./backend-kit/00_decisions.md) for confirmed cross-cutting decisions |

> **Legend:** ✅ = derived from the kits, solid · 🟦 `[CONFIRM]` = a sensible draft I've written from context; you confirm or correct · ⏳ = waiting on the 7 captured screens.

---

## 0. How to read this PRD (the logic)

A PRD is the **single source of product intent.** Everything below it should trace back to a line in here. The chain:

```
PRD (this doc)         →  WHY the product exists + WHAT it must do
   │
   ├─► antar-spec-kit  →  HOW each requirement looks & behaves   (design)
   └─► backend-kit/    →  HOW each requirement is served & stored (backend, derived from design)
```

The discipline that makes this scalable is the same one in the kits: **one source of truth, no drift.** A feature here points to its screen spec and its backend twin. Change the feature → you know exactly which screen and which backend slice change. Nothing else moves. The PRD is the "why," the kits are the "how," and they stay in lockstep because each "how" is generated from a "why" above it.

---

## 1. Vision & problem ✅ confirmed

**Vision.** Antar is a daily companion for an inner/devotional life — a calm, beautiful space that unifies spiritual *content*, *commerce* (devotional goods/offerings), and *services* (rituals, guidance) into one trustworthy place, instead of the fragmented landscape users juggle today.

**The problem.** Devotional users today bounce between scattered content apps, untrusted commerce sites, and offline-only services. No single product treats the devotee's day as one continuous experience. The white space — and the highest-value opportunity — is the product that unifies all three with the warmth and trust the category demands.

**The unify strategy (important — this is the sequencing, not a hedge).** "Unify all three" is the **destination**, reached in order — because all three monetisation surfaces stand on the same foundation: *frequency*. A subscription is only renewed by someone who shows up often; a store only sells with footfall; services only get booked once the app is part of a routine. So we build the daily habit first (content), then layer the businesses onto the audience it gathers:

```
CONTENT  →  builds the daily habit  →  gathers a frequent, trusting audience
   └─► PREMIUM (subscription)  monetises the most engaged of that audience
   └─► COMMERCE (goods)        monetises the trust earned through daily presence
   └─► SERVICES (later)        monetises depth, once habit + trust are proven
```

> *Temple analogy:* the daily darshan is why people walk through the gates each morning; the shop selling offerings and the priest's paid rituals thrive **only because** that daily crowd exists. Build the daily visit first; the shop and the services monetise the crowd you've gathered. Building the shop first = a store with no footfall.

**Why now** 🟦 `[CONFIRM]`: growing comfort with devotional tech, your existing DFD foundations to build on, and Antara's audience as a launch channel.

---

## 2. Target users ✅ primary confirmed

| Persona | Who they are | Emotional state when opening the app | What they want first | Role in the strategy |
|---|---|---|---|---|
| **The daily devotee** ⭐ **PRIMARY** | returns each morning for ritual/content | seeking, reflective, calm | today's darshan/content, instantly | the foundation — the frequency everything else stands on |
| **The occasion seeker** | opens around festivals/life events | purposeful, sometimes anxious | the right ritual/service for *this* moment | a secondary surge audience; served, not optimised-for, in v2.0 |
| **The gifting/commerce user** | buys devotional goods/offerings | trust-sensitive | a credible, simple purchase | monetised *after* daily trust is earned |

**Primary persona: the daily devotee.** Rationale (this is *why*, not just *which*): all three of your monetisation surfaces — subscription, commerce, and future services — depend on **frequency**, and the daily devotee is the only persona with daily frequency. Optimising for them builds the habit that the businesses then attach to. The occasion seeker (a few visits a year) and the commerce user (transactional) can't sustain a habit or a recurring business on their own. Consistent with the core mobile-UX law: **retention > acquisition.**

**Context that shapes design:** India-first, **Hinglish + multi-language**, often on patchy connectivity (temples, travel) → **offline-first is a product requirement, not a nice-to-have.**

---

## 3. Goals & success metrics

> A PRD must define what success *looks like*, or every later argument is unwinnable.

**North Star metric** ✅: **returning daily users** (people who complete a devotional moment on ≥4 of 7 days). Chosen because it captures the core promise (a daily companion) *and* it is the leading indicator for both monetisation models — subscriptions renew and stores sell only where daily users exist. Optimise this one number and the businesses follow.

**Supporting metrics, mapped to the three retention cliffs** (from mobile-UX practice):

| Moment | Risk | Metric |
|---|---|---|
| End of onboarding | user doesn't grasp the value | % who reach their first devotional moment in <90s |
| Day 3 | habit not yet formed | Day-3 return rate |
| Day 30 | "got what I came for," no reason to return | Day-30 retention; streak continuation |

**Monetisation metrics** ✅ (model confirmed: **premium subscription + commerce**):

| Surface | Metric | Note |
|---|---|---|
| Premium subscription | free→premium conversion %; subscription renewal rate | monetises the *most engaged* daily users |
| Commerce (goods) | first-purchase conversion; repeat-purchase rate; trust-signal exposure before purchase | trust shown *before* the ask, always |
| Services | — | not monetised in v2.0; sequenced later |

**Non-goals as metrics:** vanity numbers (raw installs, total screens viewed) are explicitly *not* how we judge v2.0.

---

## 4. Scope (v2.0)

**In scope — the v2.0 release surface = the 7 screens you sent** ⏳

| # | Figma node | Working name (to confirm on capture) | Status |
|---|---|---|---|
| 1 | `141-2318` | `[CAPTURE]` | ⏳ |
| 2 | `161-5543` | `[CAPTURE]` | ⏳ |
| 3 | `161-4821` | `[CAPTURE]` | ⏳ |
| 4 | `139-1594` | `[CAPTURE]` | ⏳ |
| 5 | `156-3121` | `[CAPTURE]` | ⏳ |
| 6 | `168-4162` | `[CAPTURE]` | ⏳ |
| 7 | `141-2957` | `[CAPTURE]` | ⏳ |

> Once captured, each row gets a real name + links to its `screen_[node].md` (design) and `backend_[node].md` (backend). This table is the spine that ties the PRD to both kits.

**Out of scope for v2.0** ✅ (follows the unify-as-sequence strategy): **full services/marketplace, live-streaming, and social/community** are deferred. v2.0 proves the daily habit + premium + a light commerce entry — it does *not* try to fully deliver all three pillars at once. (A product doing three things does none well.)

**Later (post-2.0):** full commerce catalogue/checkout depth, paid services/consultations, community — layered on once daily retention and trust are proven by the metrics in §3.

---

## 5. Feature requirements

> The heart of the PRD. Each feature follows one repeatable shape so the list scales the same way the kits do. **Reuse the template; add a feature only when a screen demands it.**

### Feature requirement template (copy per feature)

```
### F[n] — [Feature name]            Priority: Must / Should / Could / Won't (this release)
- Problem / user need:   (trace to a persona in §2)
- Requirement:           (what the product must do — observable, testable)
- Primary screen(s):     (Figma node → screen_[node].md)
- Backend slice:         (→ backend_[node].md; the data + windows it needs)
- Success signal:        (which metric in §3 this moves)
- States to honour:      (loading / empty / error / offline — from design 05 §6)
- Out of scope:          (what this feature deliberately does NOT do)
```

### Draft feature set ⏳ (priorities now reflect: daily-devotee primary · subscription + commerce · services later)

| ID | Feature | Priority | Serves | Likely screen | Notes |
|---|---|---|---|---|---|
| F1 | Daily darshan / today's content | **Must** | the habit (North Star) | feed/home | the habit engine; hot path; offline-first |
| F2 | Content detail (read/listen) | **Must** | the habit | reader | media via CDN; resumes where left off |
| F3 | Onboarding + language choice | **Must** | the habit | onboarding | <90s to first value; Hinglish/multi-language |
| F4 | Bookmarks / saved | **Must** | the habit | list | owner-only data; a reason to return |
| F5 | Reminders / daily nudge | **Should** | the habit | settings + push | gentle, not marketing; prefs server-side |
| F6 | Profile / preferences | **Should** | the habit | form | syncs across devices |
| F7 | **Premium content + subscription** | **Should** | monetisation #1 | paywall/upgrade | unlock for engaged users; "a door, not a wall"; measure free→premium |
| F8 | **Commerce entry (devotional goods)** | **Could** | monetisation #2 | store entry | *light* entry only in v2.0; trust signals **before** the ask; full catalogue is post-2.0 |
| F9 | Services (rituals/guidance) | **Won't (this release)** | future | — | sequenced after habit + trust are proven |

> Why these priorities: everything that builds the **daily habit** is *Must* (no habit = no audience = nothing to monetise). **Subscription** (F7) is *Should* because it monetises the habit you're building. **Commerce** (F8) is a *Could* — present as a light, trust-first entry point, not a full store, so it doesn't overload a 7-screen release. **Services** (F9) is explicitly *Won't* this release. The MoSCoW column is the single most useful one here: it lets you cut scope under pressure without re-litigating the vision.
>
> ⏳ The actual mapping of F1–F9 onto your 7 screens happens at capture — some of these may merge, and the screens may reveal one I haven't listed.

---

## 6. Design requirements ✅ (derived from `antar-spec-kit`)

These are already decided in the design kit; the PRD just *commits* to them.

- **Design principles:** one dominant element per screen; one job per screen; whitespace as stillness; sacred-not-kitsch; primary actions in the thumb zone.
- **Cross-platform compliance:** Apple HIG **and** Material 3, via a shared token layer (see `spec-kit/04`). Touch targets ≥48 everywhere; system fonts for body + one brand display face; semantic colours with light **and** dark mode.
- **Responsive:** Compact (phone) designed first, flexing to Medium and Expanded (tablet) per `spec-kit/03`. No phone layout stretched across a tablet.
- **Brand:** Antar defines its own brand tokens (the available "brand-guidelines" asset is Anthropic's, not Antar's) — encoded in `spec-kit/01`. `[CAPTURE]` exact brand values from Figma.

---

## 7. Technical & architecture requirements ✅ (derived from `backend-kit/`)

- **Principle:** the backend is **derived from the design**, not invented — so it can't drift from the product (see [`backend-kit/00_decisions.md`](./backend-kit/00_decisions.md)).
- **Reference stack:** Supabase (Postgres + Auth + Storage + Realtime), simple and invisible, as a devotional backend should be. Marked swappable.
- **Data:** read-first modelling, UUID ids, soft deletes, normalise-first, operational-vs-analytical split ([`backend-kit/01_data-model.md`](./backend-kit/01_data-model.md)).
- **API:** versioned `/v1/`, one window per screen's need, pagination on every list, offline-friendly responses, slow work queued ([`backend-kit/02_api-contract.md`](./backend-kit/02_api-contract.md)).
- **Auth & access:** phone-OTP, access + rotating-refresh tokens, rate-limited auth windows; **owner-only data enforced at the data layer** (row-level), not in the app ([`backend-kit/03_auth-and-access.md`](./backend-kit/03_auth-and-access.md)).
- **Top-two quality attributes:** **Reliability + Maintainability.** Raw scale is explicitly *not* a top-two yet — build for 10×, not 1000× ([`backend-kit/05_scalability-and-failure.md`](./backend-kit/05_scalability-and-failure.md)).

---

## 8. Non-functional requirements ✅/🟦

| Area | Requirement |
|---|---|
| **Performance** | feels instant — target sub-300ms for hot reads; skeletons, never silent spinners |
| **Offline-first** | core content readable offline; graceful "showing saved copy"; never a blank error wall ✅ |
| **Accessibility** | WCAG AA contrast; Dynamic Type / font scaling supported and stress-tested; no colour-only state signals; Reduce-Motion honoured ✅ |
| **Reliability** | a user's own data + auth *cannot fail*; recommendations *may degrade*; analytics *may fail silently* ✅ |
| **Privacy & compliance** 🟦 | India **DPDP Act** compliance; OTP/SMS **DLT** compliance; clear consent; data-deletion path `[CONFIRM]` |
| **Localisation** 🟦 | Hinglish + multi-language UI; devotional content translated with care (machine for UI, human for sacred text) `[CONFIRM]` |

---

## 9. Constraints, assumptions, dependencies 🟦 `[CONFIRM]`

- **Constraints:** small team (you + Claude Code); India-first connectivity; app-store review (Apple rejects non-standard nav / missing Dynamic Type / sub-44pt targets).
- **Assumptions:** Supabase stack; the 7 screens represent the v2.0 surface; Antara's audience as a launch channel.
- **Dependencies:** SMS/OTP provider (DLT-registered); CDN for media; translation pipeline; the captured Figma screens (currently ⏳ blocked).

---

## 10. Release plan & phasing ✅ (the unify sequence)

The phases *are* the sequencing strategy from §1 — each gate must pass before the next pillar is added, so you never bolt on a business before the foundation can carry it.

| Phase | Goal | Features | Gate to next phase |
|---|---|---|---|
| **0.1 Foundations** | tokens, components, backend skeleton (the kits) | — | kits filled from real screens |
| **1.0 Core habit** | the daily loop works end to end | F1–F4 | Day-3 return looks healthy |
| **1.x Retention** | reminders, profile, streaks | F5–F6 | Day-30 retention target met |
| **1.y Premium** | subscription monetises engaged users | F7 | free→premium conversion proven |
| **2.x Commerce** | light goods entry, trust-first | F8 | first-purchase conversion + trust signals validated |
| **3.x Services** | the final pillar | F9 | only once habit + trust are proven |

Scaling is **just-in-time**, per the 10× roadmap in [`backend-kit/05_scalability-and-failure.md`](./backend-kit/05_scalability-and-failure.md) — you add a cache layer or split a service only when a measured number says to, not before. Same discipline applies to *features*: add the next pillar only when the gate before it is green.

---

## 11. Risks & open questions

| Risk / question | Why it matters | Owner | Status |
|---|---|---|---|
| 7 screens uncaptured (Figma blocked) | features can't be mapped/finalised | you + me | ⏳ open — the main blocker |
| "Unify all three" over-scoping v2.0 | trying to deliver 3 pillars at once = none done well | me (guardrail) | ✅ mitigated — sequenced in §10 |
| Commerce trust before launch | devotional buyers are trust-sensitive | you | 🟦 open — trust signals must precede the ask |
| Premium paywall feeling like a "wall" | kills goodwill in a sacred context | you + me | 🟦 open — design as "a door, not a wall" |
| "Why now" + launch timing | shapes go-to-market | you | 🟦 open |
| Over-engineering the backend | a devotional backend should stay invisible | me (guardrail in kits) | ✅ mitigated |

---

## 12. Definition of done (ties back to the kits)

A v2.0 feature is "done" only when:

- [ ] It traces to a feature requirement in §5.
- [ ] Its screen passes the design compliance checklist (`spec-kit/04`).
- [ ] Its backend twin passes the backend acceptance list (`backend-kit/`).
- [ ] Its empty/error/offline states are built, not just the happy path.
- [ ] It moves (or is instrumented to measure) a metric in §3.

---

## Appendix — the full chain, one picture

```
        PRD  (this doc: why + what)
         │
         │  features →  screens  →  backend twins
         ▼
   ┌─────────────┐        ┌──────────────────┐
   │ spec-kit    │ ─05/06─►│ backend-kit       │
   │ (design)    │ screens │ (derived backend) │
   └─────────────┘        └──────────────────┘
         │  design Golden Prompt        │  backend Golden Prompt
         ▼                              ▼
     built front  ───── guaranteed to fit ───── built back
```

Fill the intent half of this PRD (§1–§3, §5), capture the 7 screens, and the entire chain below it generates itself.
