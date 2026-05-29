# 04 — Storage, Real-time, and Background Jobs

> Three categories of work the API request cycle should *not* try to do live: **large media**, **changes-while-watching**, and **slow or optional steps**. Each gets its own lane.

## Storage (images and audio)

What the screens carry:

| Asset | Where | Size | Hot or cold? |
|---|---|---|---|
| Deity portraits | Guided Puja deity list | small (≤200 KB) | hot (cached on CDN; rarely changes) |
| Where-to-setup diagram | Puja Guide | medium (≤500 KB) | hot |
| Background scenes (temple hall, ganesha) | every screen | medium (1–3 MB) | hot |
| Ingredient icons / sprites | Puja Guide, Guided Puja | small | hot |
| Mantra audio | Home, Ritual Steps | 1–5 MB | hot |
| Notification thumbnails | Notifications | small | hot |

### Storage rules

- **Bucket per category**, signed-URL by default. Even "public" content goes through a short-lived signed URL so we keep the option to revoke or watermark later. (Buckets: `content`, `audio`, `user-uploads-private`.)
- **CDN in front of everything** the app reads. The CDN is the only place a phone in a temple basement reaches for assets.
- **Resize / pre-process at upload time**, not on the read path. We store the sizes the screens render — never on-the-fly resizing per request.
- **No user-uploaded assets** today (no screen requires it). When that arrives, it gets its own private bucket + virus scan.
- **Asset versioning by filename hash.** When an icon changes, the URL changes; client caches invalidate themselves; no manual cache-bust.

> *Analogy.* The storage system is the **archive**. The CDN is the **reading room** next to the entrance — fast, copies of the popular books, the originals stay safe in the back. Nobody photocopies a book during the visit.

### Cost-of-failure note

If storage is unreachable: screens still render with placeholder images (the layout knows its dimensions). A devotional screen with a missing image is still calming; a crashed screen is not. The fallback is part of the design, not an afterthought.

---

## Real-time (changes-while-watching)

**Default = none.** A devotional app is single-user, single-device for almost every interaction.

We checked every screen:

- Home — chant count? Not real-time. The number ticks because *this* device incremented it. Sync on save.
- Notifications — new notification appearing while the list is open? Push triggers a soft refresh, not a websocket.
- Guided Puja / Puja Guide / Ritual Steps — single user, no co-editing.

> *Analogy.* Real-time is **walkie-talkies**. They're great for live collaboration. We don't have any, so we don't issue any.

If a screen ever demands it (a live aarti room, shared chanting?), we add **one** Supabase Realtime channel for that screen, owner-only, and document it here. Not before.

---

## Background jobs (slow, scheduled, or optional work)

A queue is just **a list of jobs the API drops off and a worker picks up**. The user's tap returns instantly; the worker handles the slow part.

### The job lanes we actually need

| Lane | Triggered by | Why it's a job, not inline |
|---|---|---|
| **Send scheduled notification** | Cron at user's chosen reminder time (per `UserPreference`) | We don't keep an HTTP request open from 7 AM until the push lands |
| **Send event notification** (Ekadashi, festival) | Cron daily, checks calendar | Same |
| **Daily content rotation** | Cron at midnight (server time + user TZ) | Pre-compute `daily` payload so the Home screen feels instant |
| **Send "Mark all as read"** confirmation | App write | Returns 202 instantly; worker writes the bulk update; eventual consistency is fine for "read" markers |
| **Audio transcoding** (when admin uploads a mantra) | Admin upload | Multi-second work, no user is waiting |
| **Chant tally rollup** (weekly stats) | Cron weekly | Analytical, not operational — see `05` |
| **Delete-account purge** | 30 days after `deleted_at` | Lets the user change their mind |
| **Auto-abandon stale puja sessions** | Daily cron, per user-tz, fires at local sunrise | Marks any `in_progress` `PujaSession` whose `started_at < last_sunrise` as `abandoned`. Idempotent. Supports Home's "Resume vs Begin" rule. |

### Job rules

- **Idempotent.** A job that runs twice produces the same outcome as running once. (Notifications use a `dedupe_key = user_id|template_id|date`.)
- **Has a dead letter queue.** A job that fails 5 times lands in a DLQ for a human to inspect.
- **Logged with a request_id.** When a user says "I didn't get my reminder", we can find why in one query.
- **Push prefs live on the server.** The user toggles the bell once; every job consults the server before sending. No client-side "do not disturb" lying to the system.

> *Analogy.* The queue is the **kitchen**. The waiter (API) takes the order and walks away. The chef (worker) cooks. The bell rings (push) when it's ready. Nobody stands at the table holding the pan.

---

## Push notifications (the consumer end of the job lane)

- **One service**, not three. Use one push gateway (Expo Push for now — swappable for FCM/APNs later) so notification logic lives in one place.
- **Server-side preferences.** The bell on/off and quiet-hours live on the server (`UserPreference`) — never trust the client to filter.
- **Every push has a deep-link.** Tapping `Time for Morning Puja` opens the Home screen with **Begin Puja** ready to tap. Tapping a quote opens the Home quote card. Tapping a festival opens that festival's day (if/when there's a festival screen).
- **No marketing pushes** unless tagged in a separate category the user can opt out of — devotional apps lose trust fast if pushes feel transactional.

---

## What we deliberately did NOT add (and why)

- **Search backend (Elasticsearch / Algolia).** No screen searches.
- **Real-time multi-device sync.** No screen needs it; chant tally syncing on save is good enough.
- **Edge functions for content shaping.** Content is small enough to ship whole.
- **Live-streamed audio.** Mantras are short audio files; HTTP-range works fine.

---

## Stack note (swappable)

- Storage + CDN: **Supabase Storage** with the default CDN. Swappable for S3 + CloudFront.
- Jobs: **Supabase Edge Functions + a `jobs` table polled by a worker**, or pgmq. Swappable for SQS + Lambda.
- Push: **Expo Push**. Swappable for FCM/APNs direct when more volume justifies it.
