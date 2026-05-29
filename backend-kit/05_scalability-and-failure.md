# 05 — Scalability & Failure

> "Will it scale?" is the wrong first question for a devotional app. The right one is: **what happens when something is slow, missing, or wrong — and does the user still feel calm?** Build for 10x, not 1000x, and design every failure mode like a feature.

## The two quality attributes we optimise for

Pick two. Antar's two:

1. **Reliability.** The app must work when the connection doesn't. A user opening it in a temple basement, in airplane mode on a flight, or at 5 AM on a quiet network must still get *something* peaceful.
2. **Maintainability.** A small team has to be able to add a screen on a Tuesday without breaking the others. Every choice in this kit is biased toward "future-you can read this".

Everything else (latency, throughput, multi-region) is a downstream concern; we name where it would matter, we don't pre-build it.

---

## Failure budget per data piece

For every piece of information a screen shows, decide which bucket it falls into. The screen designs in `screen_*.md` already imply this; we just label it.

| Bucket | Rule | Examples |
|---|---|---|
| **Cannot fail** | Show or block. If the data isn't there, the screen says so loudly and offers a path forward. | Sign-in state, current puja session id |
| **May degrade** | If slow/missing, show a cached/stale version + a quiet note. | Today's daily content, today's quote, deity list (cache for a day) |
| **May fail silently** | If it's flaky, drop it; don't bother the user. | Analytics events, chant tally upload (will retry from queue) |

> *Analogy.* These three buckets are the **traffic lights** for engineering — red (stop everything), amber (proceed with caution + tell the user), green (don't even mention it).

### Per-screen failure behaviour (summary)

| Screen | If offline | If a list call fails | If a write fails |
|---|---|---|---|
| Home | cached daily content + cached quote + last chant tally; Begin Puja queues a session locally that drains on reconnect | "showing last seen" pill at top; retry quietly | optimistic UI; show a small "saving…" if it lingers |
| Notifications | last fetched list; quiet "offline" pill | retry on pull-to-refresh | "Mark all as read" is optimistic; rollback if it errors |
| Guided Puja | content cached at build time + 24h; session draft kept locally | retry; if list missing, soft block with a calm message | optimistic; advance to next step only when server confirms |
| Puja Guide | content cached; blueprint cached per puja type | same | Begin Puja blocked until session call returns |
| Ritual Steps | blueprint cached; chant counter is local-first | retry quietly | chant batch goes to local queue; drains on reconnect |

---

## Caching strategy (the hot path only)

We do **not** cache everything; we cache what's hot:

| Item | Where | TTL | Bust by |
|---|---|---|---|
| Content lists (deities, puja types, intentions, traditions, ingredients, ritual steps) | client + CDN | 24h | content-version header |
| Today's quote / daily content | client + CDN | until midnight (TZ) | TTL |
| Per-user current session | client memory | session | invalidated on every write |
| Chant tally for today | client memory | session | merged with server response on read |

> *Analogy.* The cache is the **pantry** next to the kitchen. We stock it with what we use most often. We don't move the whole supermarket into the pantry — at some point you can't find anything.

---

## Architecture: monolith-first, with named seams

We start as **one service**: API + jobs + admin. That's not laziness — it's the cheapest thing that can serve a devotional app for years.

The seams we keep clean (so a future split is two days, not two months):

```
   ┌──────────────────────────────────────────────────────────────────┐
   │                       One service (monolith)                     │
   │                                                                  │
   │   API layer  ──►  use cases  ──►  data layer (Postgres + RLS)    │
   │       │                                                          │
   │       └──► storage (signed URLs) ◄── CDN                         │
   │                                                                  │
   │   Worker (jobs table)  ──► push gateway / SMS / email            │
   └──────────────────────────────────────────────────────────────────┘
```

- API and worker are **separate processes** in the same repo. Cheap to deploy together; trivial to split later.
- Data access goes through a **use-case layer**, not the HTTP handler. (Means: when we split anything later, we move the use case + its tests, not a tangle of route handlers.)
- Storage and CDN are already separate services; nothing to extract later.

---

## The just-in-time 10x roadmap (named, not built)

When a real load problem appears, here's the *cheap* fix in that order:

| Problem (10x load) | First cheap move | Costlier move (do later) |
|---|---|---|
| Reads dominate | Tighter content cache + CDN long TTL | Read replica on Postgres |
| Writes spike (chant batches at 7 AM nationwide) | Larger batch window + queue | Write-side sharding by `user_id` mod N |
| Notification jobs back up | More worker processes | Move to a managed queue (SQS) |
| Push gateway throttles | Per-template rate limiter + spreading delivery over a window | Multi-gateway fallback |
| Storage egress | Longer-lived signed URLs + image preloading | Multi-region CDN |

Each row is **one paragraph in a runbook**, not a fix we ship today. We just know which lever to pull when.

---

## Observability (the bare minimum that pays back)

- **Request id** on every API response, every job, every log line. A user can paste a request id; a developer finds the path in seconds.
- **Structured logs** (key=value), not free text. (Searchable, alertable.)
- **Three SLO-style numbers we actually watch:**
  1. **Time to first content on Home** (cached or not).
  2. **Push delivery success rate.**
  3. **Sign-in completion rate** (request OTP → verify success).
- **One synthetic check** every 5 minutes: open Home, log in with a test phone, verify a session can be created. If that breaks, we know before users do.

> *Analogy.* These three numbers are the **pulse, breath, and pupil response** of the system. Everything else is a chart someone will eventually stop reading.

---

## What we deliberately did NOT build

- **A microservice per entity.** Not yet — see the 10x table.
- **A multi-region active-active database.** Single region until traffic justifies it.
- **A custom CDN.** Use Supabase's / a vendor's.
- **Full event sourcing.** Soft-delete + `created_at`/`updated_at` is enough audit for now.
- **A separate analytics database.** Land a daily snapshot of the live tables into a warehouse only when someone asks the second analytical question. Not today.

---

## Closing rule

If a future decision conflicts with **Reliability** or **Maintainability**, the decision loses. That includes a clever feature that adds a flaky dependency, or a refactor that fragments knowledge across three repos. The two attributes are the constitution.
