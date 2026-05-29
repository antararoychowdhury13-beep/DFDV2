# Backend twin · Notifications

> Source screen: `NotificationsScreen.tsx` · design node `9-2505`.

## What the screen shows (and the backend behind each piece)

| On the screen | Source | Window |
|---|---|---|
| Title "❖ Notifications ❖" + diamond divider | static | — |
| Filter pills (All, Puja & Rituals, Festival, Sadhana, System) | `NotificationCategory` enum (5 fixed) | static |
| "❖ New" section | client groups by `read_at IS NULL` | — |
| Each notification card — icon, title, optional "Calendar" badge, description, "7:00 AM", "2m ago", red dot | `NotificationDelivery` rows for this user | `GET /v1/me/notifications?category=<cat>&cursor=...&limit=20` |
| Tapping a notification | marks read + deep-links | `POST /v1/me/notifications/read { ids: [id] }` and route per `deep_link` |
| Tapping the red dot | (visual only) | — |
| "Mark all as read" button | bulk read | `POST /v1/me/notifications/read { all: true, category?: ... }` |
| Bottom nav (sticky) | — | — |

## States

| State | Behaviour |
|---|---|
| **Default** | list scrolls; reverse chronological |
| **Loading** | 4 skeleton cards (matches the design's 4 hero-cards-on-arrival) |
| **Empty** | calm message: "Nothing new — your reminders will land here" + suggestion to enable notifications if `UserPreference.notifications_enabled` is false |
| **Error** | "Could not load right now" + retry button; old list stays visible underneath |
| **Offline** | last fetched list shown; quiet "offline" pill at top |

## How a notification actually lands

```
Cron / event trigger ──► job lane "send notification"
                            │
                            ├─► consult UserPreference (push on? quiet hours?)
                            ├─► render title/body from NotificationTemplate
                            ├─► insert NotificationDelivery (record of attempt)
                            └─► call push gateway (Expo Push)
                                    │
                                    ▼
                            device receives push  ──► deep-link
```

The Notifications screen reads `NotificationDelivery` — **not** the templates. So if a delivery's template is later edited or deleted, the user still sees what they actually received.

## Read state, in detail

- `read_at` is set on tap. The client should set it optimistically and rollback on error.
- "Mark all as read" is 202 + a job — the API returns immediately, the worker does the bulk update. The user sees the new state instantly because the client also flips locally.

## Filtering and pagination

- Filters apply server-side via category. The current pill is a query param.
- Pagination is cursor-based (per `02`).
- Sorting: `delivered_at DESC` always.

## Validation rules

- Marking another user's notification read → `forbidden` (RLS blocks it before the API ever sees the request).
- `category` must be one of the 5 known values; anything else → `validation_failed`.

## Reuses

All entities/windows already in `01` / `02`. ✅ Nothing new.

## Rules confirmed (see `00_decisions.md`)

- **Red dot = new AND unread.** Client renders the dot when `read_at IS NULL AND delivered_at > now - 24h`. Tap sets `read_at`; the dot never returns. Calmer than a classic inbox.
- **Calendar badge is a visual label.** Today the badge is design copy on the template, no filter logic attached. **However** `NotificationTemplate.tags text[]` exists from day one (default `[]`), so when a future screen needs to filter by tag we add UI only — no migration.
