# 01 — Data Model

> A data model is the **noun list** of the app. Every distinct *thing* a screen shows or changes is an entity. Same-named things become one entity; many small ones become attributes. **Derived from the 5 screens already built.** If a screen needs a new noun, it's flagged below and we stop to ask before adding.

## The 7 modelling rules (applied throughout)

1. **Read-first modelling.** The shape follows how screens read the data, not how a database textbook says to store it.
2. **UUIDs, never sequential ids.** A leaked URL must not expose how many users you have.
3. **Soft delete.** Every table has `deleted_at` — nothing is destroyed; recoverable + audit-able.
4. **Normalise first, denormalise later** with eyes open (and only when a screen proves it's needed).
5. **Index what the screens query.** Don't index everything; index the fields screens actually filter or sort by.
6. **Every row has `created_at` and `updated_at`.** Free history, free debugging.
7. **Split operational from analytical.** Live app tables are kept lean; reporting/analytics is a separate downstream concern.

Stack note: the live tables below assume **Postgres** (Supabase). The stack is **swappable** — every choice is structural first, named second.

---

## The nouns (entities)

### Content nouns (public, read-mostly — what the app *teaches*)

| Entity | Why it exists (which screen demands it) | Key attributes (plain language) |
|---|---|---|
| **Deity** | Guided Puja step 1 (Select Deity list) | name, short tag ("Vighnaharta"), description, portrait image |
| **PujaType** | Guided Puja step 1 (Choose puja type) | name (Daily / Standard / Full), one-line subtitle, expected duration |
| **Intention** | Guided Puja step 1 (Set your intention chips) | label (one or two lines), small icon |
| **Tradition** | Puja Guide step 2 ("This pujs follow Smarta tradition" + "See other traditions") | name, short description |
| **Ingredient** | Puja Guide step 2 ("What you will need" grid) | name, category (Essential / If Available), icon |
| **RitualStep** | Ritual Steps screen (Sankalpa, Avahana, Asana & Padya, Snan, Alankara) | step number (1–5+), title, short description, expected duration, required ingredients (FK) |
| **Mantra** | Home (Mantra Chanting card) + Ritual Steps (Om Namah Shivaya) | name, audio file ref, target count (default 108) |
| **Quote** | Home (quote card) + Notifications ("New Quote for you") | text, attribution ("Divine Within") |
| **NotificationTemplate** | Notifications screen (4 reminder cards) | category (Puja & Rituals / Festival / Sadhana / System), title, body, default time, optional deep-link target |

> *Analogy.* Content nouns are the **library** — a fixed set of devotional knowledge the app gives users. They change rarely, are the same for every user, and want to be cache-friendly.

### User-state nouns (private — what a user *does*)

| Entity | Why it exists (which screen demands it) | Key attributes |
|---|---|---|
| **User** | Implied by every private screen | phone (auth), name (optional), tradition default, created_at |
| **PujaSession** | The 3-step flow (Guided Puja → Puja Guide → Ritual Steps) needs a single object that walks through it | user_id, deity_id, puja_type_id, tradition_id, current_step (1–5), status (in_progress / completed / abandoned), started_at, completed_at |
| **SessionIntention** | A session has many intentions (multi-select chips in step 1) | session_id, intention_id |
| **SessionStepProgress** | Ritual Steps screen tracks per-step completion + chant counts | session_id, ritual_step_id, started_at, completed_at, chant_count |
| **ChantTally** | Home ("27/108 Chants Today") + Ritual Steps ("108 Mantra Japa") — counts persist per user per mantra per day | user_id, mantra_id, date, count |
| **NotificationDelivery** | Notifications list shows what was actually sent to *this* user | user_id, template_id (FK), title, body, deep_link, scheduled_at, delivered_at, read_at |
| **UserPreference** | "You can always change the tradition later in Puja Preference" + bell on/off | user_id, default_tradition_id, default_deity_id, notifications_enabled, morning_reminder_time, evening_reminder_time |

> *Analogy.* User-state nouns are the **diary** — they belong to one user, are written more than read, and never leak across users (RLS in `03`).

---

## What we deliberately did NOT add

- **Streaks / leaderboards.** No screen shows them. If they appear, we add `Streak`.
- **Comments / community / sharing.** Not in any current screen.
- **Festivals as a first-class entity.** Notification category is enough today. If a Festival hub screen ships, promote it.
- **Search index, recommendations engine.** No screen demands these.

---

## Confirmed decisions baked into this model

See `00_decisions.md` for rationale. Summary of what changes here:

- **Chant counts are cross-device, batched.** `ChantTally` is server-authoritative; device writes batches with `client_id` for dedupe.
- **Notification deep-links are a closed enum.** `NotificationDelivery.deep_link` ∈ `{ morning-puja, puja-session/{id}, quote/{id}, festival/{slug}, settings/notifications }`. Server validates on write.
- **`IngredientSubstitute` is a real entity** (added below). Substitutes are bundled into the puja blueprint so no extra round-trip is needed.
- **`NotificationTemplate.tags text[]`** ships from day one (default `[]`) so promoting the Calendar badge to a filter later is a UI change, no migration.
- **`PujaSession.status`** includes `abandoned`. A daily job auto-abandons sessions whose `started_at < last_sunrise(user_tz)` — supports the Home screen's "Resume vs Begin" rule.

### IngredientSubstitute (added)

| Attribute | Type | Notes |
|---|---|---|
| `id` | uuid | |
| `ingredient_id` | uuid (FK → Ingredient) | indexed |
| `alternatives` | jsonb | array of `{ label, note? }` rendered as a sheet on tap |
| `note` | text | overall guidance ("intention matters more than form") |

Read path: `Ingredient.alternatives[]` is denormalised into the `GET /v1/puja-types/{id}/blueprint` response so the Puja Guide screen needs no extra call.

---

## ER sketch (plain English)

```
User ──< PujaSession ──< SessionIntention >── Intention
                       └─< SessionStepProgress >── RitualStep ──< (uses) Ingredient
                       └── (chose) Deity
                       └── (chose) PujaType
                       └── (chose) Tradition

User ──< ChantTally >── Mantra
User ──< NotificationDelivery >── NotificationTemplate
User ──── UserPreference
```

Read this as: *"A User has many PujaSessions; a PujaSession has many SessionIntentions, each pointing to an Intention; a PujaSession has many SessionStepProgress rows, each pointing to a RitualStep; a RitualStep uses many Ingredients,"* and so on.

---

## Indexing (only what the screens query)

- `PujaSession(user_id, status)` — every private screen asks "what's my current session".
- `NotificationDelivery(user_id, delivered_at desc)` — the Notifications list is a reverse-chronological scroll.
- `NotificationDelivery(user_id, template_category, delivered_at desc)` — the filter pills filter by category.
- `ChantTally(user_id, mantra_id, date)` — Home asks "today's count for this mantra".
- `RitualStep(puja_type_id, step_number)` — the Ritual Steps list is ordered.

Everything else: leave un-indexed until a real screen demands it.
