# Backend twin · Home (Morning Puja)

> Source screen: `MorningPujaScreen.tsx` · maps to design node `141-2318` (Antar 2.0 file).
> The front of the screen knows the layout; this is the back of *the same screen*. Both halves read the same spec.

## What the screen shows (and the entity/window behind each piece)

| On the screen | Source | Window |
|---|---|---|
| Title "Morning Puja" + tagline | static content | (none — bundled) |
| Background deity image | `Asset` (CDN) | (none — CDN URL bundled in `daily`) |
| Bell badge (top right) | unread notifications count | `GET /v1/me/notifications?unread_only=true&limit=1` returns total in `meta` |
| "Light the sacred Diya" card title + image | `DailyContent.today` | `GET /v1/daily` |
| "Begin Puja" CTA | starts a `PujaSession` | `POST /v1/me/sessions` on tap |
| Mantra Chanting card: name "Om Namah Shivaya" | today's `Mantra` | `GET /v1/daily` (includes `featured_mantra`) |
| "27/108 Chants Today" | `ChantTally(user, mantra, today)` | `GET /v1/me/chants/today` |
| Waveform / play-pause | audio file ref | streamed from CDN URL on `Mantra.audio_url` |
| Quote card text + attribution | `Quote` | `GET /v1/quotes/today` |
| Bottom nav (Mandir / Sadhana / Seek / Seek / center diya) | (no data — navigation) | — |

## States and their behaviour (matches the screen's design)

| State | What the screen does | What the backend does |
|---|---|---|
| **Default** | renders cached + fresh data | serves `/v1/daily`, `/v1/quotes/today`, `/v1/me/chants/today` |
| **Loading (first launch)** | skeleton on cards | each window returns within ~150ms p95 from CDN/cache |
| **Empty (new user)** | shows today's content; "0/108" tally | tally is created lazily on first chant |
| **Error (any one call fails)** | the *other* cards still render; failed one shows "showing last seen" | each window is independent; no umbrella call |
| **Offline** | last cached `/v1/daily`, `/v1/quotes/today`; chant counts buffered locally | nothing — the device handles offline gracefully |

## Reuses (no new nouns or windows for this screen)

All entities exist already in `01`; all windows exist already in `02`. ✅ No flagged additions.

## Things the screen lets us assume (good to confirm)

- The chant counter is **per user, per day, per mantra** — confirmed by the "27/108 today" copy on Home and the "108 Mantra Japa" on Ritual Steps. Same `ChantTally` entity backs both.
- "Begin Puja" on Home starts a **fresh** session every time, unless `/v1/me/sessions/current` already returns an in-progress one — in which case Home should hint "Resume your puja" instead. Worth checking in design.
- The waveform is a *visualisation* of the audio file; no separate data needed.
