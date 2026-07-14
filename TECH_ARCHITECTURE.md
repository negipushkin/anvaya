# Anvaya — Technical Architecture

## 1. Architecture decision

Anvaya is a **static-first PWA**. Story experiences are produced and reviewed before release, then delivered as versioned JSON manifests plus immutable media assets from a CDN. The application never generates a story, illustration, narration, or parent prompt at runtime.

The system is split into two planes:

1. **Content delivery plane** — public, cacheable, static story manifests, images, and pre-rendered audio.
2. **Family data plane** — authenticated parent data only: profile, preferences, session events, and Value Journal entries/photos.

This keeps the child-facing story reader fast, offline-capable, private, and operationally simple while retaining a secure journal and parent dashboard.

## 2. Recommended stack

| Concern | Choice | Reason |
|---|---|---|
| Client | React + TypeScript + Vite | Lightweight PWA with a component model suited to the Figma system. |
| UI | CSS variables + component primitives | Maps directly to the approved Figma tokens and variants. |
| PWA/offline | Workbox service worker + Cache Storage + IndexedDB | Cache the current week and retain offline session/journal queues. |
| Static hosting/CDN | Vercel | Matches the existing GitHub → Vercel workflow. |
| Content repository | Version-controlled JSON and assets in Git | Every published story is reviewed, traceable, and reproducible. |
| Parent API | Vercel serverless functions | Small authenticated surface for family data; no story-rendering service. |
| Database | PostgreSQL (e.g. Supabase Postgres) | Relational ownership model for families, children, journals, and school assignments. |
| Auth | Parent email/OTP or passkey authentication | No child account or child login. |
| Photo storage | Private object storage with short-lived signed URLs | Journal photos are never public CDN assets. |
| Observability | First-party event endpoint and aggregated product tables | No third-party tracker on child-facing screens. |

## 3. System overview

```text
Content authors
    │
    ▼
Git content repository ── validate/review/build ──► CDN
  stories/*.json                                  ├─ manifests/catalog.v1.json
  assets/images/*                                 ├─ stories/{id}/{version}.json
  assets/audio/*                                  ├─ images/*
                                                  └─ audio/*

PWA (shared family device) ───────────────────────► CDN content plane
    │             ▲                                  (public, versioned, immutable)
    │             │
    ├─ Service worker / Cache Storage / IndexedDB
    │
    └─ authenticated parent requests ────────────► Parent API ─► PostgreSQL
                                                       │
                                                       └────────► private journal-photo storage
```

The reader can render a downloaded story entirely from its local manifest and cached media. The parent API is unavailable during an offline session without preventing the story, reflection, or mission flow from completing.

## 4. Content model

### 4.1 Hierarchy

```text
Catalog
└─ Story
   ├─ metadata (title, tradition, value, age band, version)
   ├─ parentCard
   ├─ missions[]
   └─ chapters[]
      └─ Chapter
         ├─ text (the exact narration shown on screen)
         ├─ image (one illustrated scene)
         ├─ audio (pre-rendered narration for that text)
         └─ accessibility metadata
```

For the initial stories, the existing eight “beats” become eight sequential `chapters`. The reader treats a chapter as one display unit: it renders the image first, places the story text immediately **below** that image (never over it), starts its narration, and advances by audio completion or a parent tap. This preserves the Figma reader design without tying the CMS to a fixed number of chapters.

### 4.2 Story manifest schema

Each story has one published, immutable manifest at `stories/{storyId}/{version}.json`. Assets use content-hashed filenames, so a cached story never accidentally mixes old text with new art or audio.

```json
{
  "schemaVersion": "1.0",
  "storyId": "pancha-001",
  "version": "1.0.0",
  "status": "published",
  "title": "The Crow and the Pitcher",
  "sourceTradition": "Panchatantra",
  "primaryValue": "wisdom",
  "ageBand": "5-8",
  "estimatedDurationSec": 480,
  "coverImage": {
    "src": "/content/images/pancha-001/cover.4c2a.webp",
    "alt": "A crow beside a clay pitcher in a sunlit garden",
    "width": 1600,
    "height": 1000
  },
  "chapters": [
    {
      "id": "pancha-001-c01",
      "order": 1,
      "title": "Opening",
      "text": "It was the hottest day of the summer...",
      "image": {
        "src": "/content/images/pancha-001/c01.1b9e.webp",
        "alt": "A tired crow flies above a dry forest under a hot sun",
        "width": 1600,
        "height": 1000,
        "focalPoint": { "x": 0.46, "y": 0.42 }
      },
      "audio": {
        "src": "/content/audio/pancha-001/c01.83de.mp3",
        "durationSec": 20,
        "transcript": "It was the hottest day of the summer..."
      }
    }
  ],
  "parentCard": {
    "valueSummary": "Wisdom helps us find another way.",
    "prompts": [
      {
        "text": "The crow was small and the pitcher was heavy. What did he use instead of strength?",
        "tip": "If your child says 'pebbles,' gently ask what made him think of them.",
        "watchOut": "Do not turn this into a science lesson about displacement."
      }
    ]
  },
  "missions": [
    {
      "id": "pancha-001-mission-a",
      "variant": "A",
      "text": "Find one thing at home that is a little too hard for you...",
      "effort": "low",
      "expiresAfterHours": 24
    }
  ]
}
```

`text` is the single source of truth for the on-screen narration. The build rejects a manifest when the audio transcript differs from that text, preventing accessibility and narration drift.

### 4.3 Catalog manifest

The PWA first downloads a small `catalog.v1.json` that contains only the fields needed for Today, scheduling, and download selection. It points to the exact story version to render. A published version is never edited in place; corrections create `1.0.1` and the catalog moves to it.

```json
{
  "catalogVersion": "2026-07-14.1",
  "stories": [
    {
      "storyId": "pancha-001",
      "version": "1.0.0",
      "title": "The Crow and the Pitcher",
      "primaryValue": "wisdom",
      "manifestUrl": "/content/stories/pancha-001/1.0.0.json",
      "coverImageUrl": "/content/images/pancha-001/cover.4c2a.webp"
    }
  ]
}
```

## 5. Repository structure

```text
anvaya/
├─ apps/
│  ├─ web/                         # React PWA
│  └─ api/                         # Vercel serverless handlers
├─ packages/
│  ├─ content-schema/              # TypeScript types + JSON Schema + validators
│  ├─ design-system/               # tokens and reusable UI components
│  └─ analytics/                   # first-party event contracts
├─ content/
│  ├─ catalog/
│  │  └─ catalog.v1.json
│  ├─ stories/
│  │  └─ pancha-001/
│  │     └─ 1.0.0.json
│  └─ assets/
│     ├─ images/pancha-001/
│     └─ audio/pancha-001/
├─ scripts/
│  ├─ validate-content.ts
│  ├─ optimize-images.ts
│  ├─ verify-audio-transcripts.ts
│  └─ build-content-manifest.ts
└─ docs/
   └─ TECH_ARCHITECTURE.md
```

## 6. Client architecture

### 6.1 Feature modules

```text
src/features/
├─ onboarding/          # O1–O5; local draft until parent account is established
├─ today/               # one selected story, no browse feed
├─ reader/               # chapter state machine and audio player
├─ reflect/              # prompts and dwell measurement only
├─ mission/              # log now/later/skip and offline queue
├─ parent-mode/          # parent gate, dashboard, settings
├─ journal/              # timeline, entry editor, photo upload
└─ offline/              # download manager, cache status, sync queue
```

### 6.2 Reader state machine

```text
idle → loading-story → chapter(n) → chapter(n+1) → reflect → mission → close
                         │                              │
                         └── end early ──────────────────┘
```

The reader holds only `storyId`, `version`, `chapterIndex`, and playback state. It does not request the next chapter from a server. The manifest is loaded before the session begins, and each chapter asset is requested locally or from the cache.

Key rules:

- Tapping moves forward only; there is no autoplay into another story.
- Completing chapter 8 marks a *story session complete* locally and opens Reflect.
- Reflect records only timestamps and completion state, never responses or microphone input.
- Mission status is `logged`, `queued`, or `skipped`; skipped is valid and has no negative effect.

### 6.3 Offline strategy

On Wi-Fi or an explicit parent download action, download the current week’s catalog, manifests, images, and audio into Cache Storage. Use IndexedDB for metadata and pending writes.

| Data | Storage | Offline behavior |
|---|---|---|
| App shell | Cache Storage | Precached at install. |
| Current-week story manifest/media | Cache Storage | Available fully offline. |
| Session completion and Reflect dwell | IndexedDB queue | Sent when online. |
| Mission log/note | IndexedDB queue | Immediately visible locally, synced later. |
| Journal photo | IndexedDB Blob queue where feasible | Compress locally, upload on reconnect; show “waiting to upload.” |

The download manager enforces a configurable cache budget below the 60 MB app target and evicts completed older weeks before evicting the current week.

## 7. Family data model

No child account exists. A parent account owns a family; a child profile is a minimal record inside that family.

```text
users
└─ families
   ├─ child_profiles (first_name, age_band only)
   ├─ preferences (ritual time, reminder opt-in, language)
   ├─ story_sessions (story/version, started/completed timestamps)
   ├─ reflect_events (session_id, opened_at, completed_at)
   ├─ mission_logs (mission_id, status, optional note)
   └─ journal_photos (private storage object key, encrypted metadata)
```

Important database constraints:

- Every family-owned row has `family_id` and is protected by row-level access control.
- `story_sessions` retains `story_id` **and** `story_version` so historical journal entries remain accurate after a content update.
- No table stores child answers, recordings, behavioural-ad profiles, or advertising identifiers.
- Parent deletion cascades to child profile, journal rows, and private photo objects.

## 8. API surface

Content does not go through this API. The API is only for authenticated parent data.

| Endpoint | Method | Use |
|---|---|---|
| `/api/family/bootstrap` | GET | Parent profile, child profile, preferences, current schedule. |
| `/api/sessions` | POST | Sync a completed/ended story session. |
| `/api/reflect-events` | POST | Sync timestamps for Reflect dwell. |
| `/api/missions` | POST/PATCH | Create or update a log-now/log-later/skip record. |
| `/api/journal` | GET | Paginated, filterable Value Journal. |
| `/api/journal/{id}` | GET/PATCH/DELETE | Parent-owned journal entry. |
| `/api/journal/{id}/upload-url` | POST | Short-lived signed URL for a photo upload. |
| `/api/preferences` | PATCH | Reminder, ritual preference, download preference. |
| `/api/privacy/export` | POST | Parent data export request. |
| `/api/privacy/delete` | DELETE | Parent-directed family data deletion. |

All write endpoints accept an idempotency key so an offline queue can retry safely.

## 9. Content publishing pipeline

```text
Author story JSON + art brief + narration script
    → schema validation
    → editorial/human approval
    → image optimization (WebP/AVIF + responsive variants)
    → TTS/audio render at build time
    → transcript/audio duration validation
    → asset hashing + manifest generation
    → preview deployment
    → reviewer approval
    → production catalog update
```

Required build failures:

- missing chapter text, image alt text, image dimensions, or audio;
- duplicate story/chapter/mission IDs;
- chapters out of sequence;
- a value outside the eight-value taxonomy;
- transcript mismatching chapter text;
- unpublished content referenced by the catalog;
- image/audio asset exceeding delivery budget;
- a mission without an explicit optional/guilt-free status contract.

## 10. Analytics and metrics

Use a first-party event collector with a deliberately small, documented event set:

```text
story_started
story_completed
reflect_opened
reflect_completed
mission_logged | mission_queued | mission_skipped
weekly_story_downloaded
```

Events include an anonymous family identifier, story/version, timestamps, and app version. They never include reflection text, audio, photo contents, device advertising IDs, or cross-app tracking data. Reflect dwell is calculated from `reflect_opened` and `reflect_completed` server-side.

## 11. Security and privacy controls

- Require verified parent consent before collecting family data.
- Use HTTPS, encrypted database volumes, and private encrypted object storage for journal photos.
- Serve public story media as immutable assets; never put journal photos in the public content bucket.
- Use signed, short-lived photo upload/download URLs after authorization.
- Validate all API payloads server-side with the same shared schemas used by the client.
- Enforce rate limits and idempotency on sync endpoints.
- Keep child-facing screens free of third-party analytics, ads, external links, and embedded social content.

## 12. Delivery plan

### Phase A — Reader vertical slice

Build the PWA shell, content schema, catalog, one Crow story with eight chapters, reader state machine, Parent Card, Reflect, and Mission Skip/Log Later. Verify an entire session works offline.

### Phase B — Parent data and journal

Add parent authentication, family/child profile, mission log sync, Value Journal timeline, encrypted photo upload, parent gate, and data deletion controls.

### Phase C — Launch readiness

Add current-week downloads, all 40 versioned stories, reminder preferences, first-party metric dashboard, accessibility audit, performance budgets, and content publishing checks.

### Phase D — Later extensions

Add Hindi audio/text as parallel localized chapter fields, mission A/B assignment through catalog configuration, and school theme assignments. These extend the manifest and API without changing the reader’s chapter model.

## 13. Core implementation principle

The immutable content contract is:

> A story is a reviewed, versioned sequence of chapters. Each chapter has exact display text, one accessible image, and pre-rendered narration audio.

Everything else—the reader, offline cache, Parent Card, mission, journal, metrics, and future school themes—references that contract rather than owning a second copy of story text or assets.
