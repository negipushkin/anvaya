# Anvaya — Product Requirements Document

**Version:** 1.0 (Draft for review)
**Owner:** Pushkin Singh Negi
**Date:** July 2026
**Status:** Pre-build. Phase 0 gate criteria defined in §9.

---

## 1. Executive Summary

Anvaya is a parent-child storytelling platform that converts screen time into an active, values-based family ritual. Each session follows a fixed loop — a short, culturally rooted story, a guided parent-child dialogue, and a small real-world mission — built on the Observe-Reflect-Act (ORA) architecture. The product's job is not to entertain a child alone; it is to structure fifteen minutes of high-quality parent-child interaction that passive audio and video incumbents cannot replicate.

Anvaya inherits the content system, static-asset architecture, and school-first distribution strategy already validated during the Cosmo Explorer / Story Studio work. This PRD treats those as constraints, not open questions.

## 2. Problem Statement

Two deficits compound each other in urban Indian families. Parents of young children report wanting meaningful shared time but defaulting to passive screen handoffs because active engagement requires preparation they don't have energy for. Meanwhile, the children's content market in India is dominated by passive consumption formats — audio stories, animated video, edutainment apps — that occupy the child but exclude the parent and transfer no behavior into the real world.

The gap is not "better stories." Katha Room and YouTube have stories. The gap is a **facilitation layer**: something that scripts the parent's role so that engagement requires zero preparation, and something that closes the loop from moral lesson to observable action.

## 3. Product Vision & Mission

**Vision:** Every Indian family has a daily fifteen-minute ritual where a timeless story becomes a conversation, and the conversation becomes an action.

**Mission:** Transform India's story heritage — Panchatantra, Jataka, Ramayana, regional folk tales — into structured family experiences that build character, curiosity, and connection.

**Core philosophy:** Guide-on-the-side. The app facilitates the bond; it never substitutes for the parent. Every design decision is tested against one question: does this increase eye contact between parent and child, or replace it?

## 4. Target Users & Non-Goals

**Primary child user: ages 5–8.** This is a deliberate narrowing from earlier 6–12 framings. At 5–8, the parent is still the reader/co-reader, reflection can be concrete rather than abstract, and missions can be household-scale. This band has one product, one voice, one mission difficulty curve.

**Primary buyer: the parent** (typically mother, 28–40, urban/metro Tier-1 and Tier-2, values-conscious, already paying for at least one children's subscription). Secondary buyer: **schools** (pre-primary and primary sections), who are the primary distribution channel (§10).

**Personas:**

*The Intentional Parent (buyer/facilitator).* Wants values transmission and guilt-free screen time. Has 15 minutes at bedtime or weekend mornings. Will not read a facilitation manual; needs talking points surfaced in-flow.

*The Child (5–8).* Pre-reader to early reader. Motivated by narrative, agency ("what happens next?"), and visible progress. Attention window ~10 minutes for a single narrative arc.

*The Educator (channel + light user).* Primary-school teacher or coordinator who assigns a weekly theme and wants evidence of home reinforcement without grading burden.

**Explicit non-goals for v1:**
- Children aged 9+ (reflection depth and mission types diverge; revisit post-PMF)
- Solo-child mode (an "occupy my kid" mode would cannibalize the core differentiator)
- Runtime AI generation of stories (all narrative content is curated, human-reviewed, and built at compile time, consistent with the existing zero-runtime-AI architecture)
- Multi-language at launch (English-first with Hindi terms embedded; full Hindi in Phase 2)
- Social features between families

## 5. Core Product Architecture: ORA

Every story session is a fixed three-act loop. The loop is the product.

### 5.1 Observe (Engagement Layer)

A 7–10 minute narrative segment: illustrated story with pre-rendered TTS narration (build-time, not runtime), designed for co-viewing on one shared device. Stories are adaptations of Indian classical and folk sources, compressed into single-arc episodes. Emotional connection is prioritized over information density — the story exists to set up the dialogue, not to teach facts.

Design requirements: landscape co-viewing layout, large tap targets, no autoplay chaining (a session ends; it does not feed the next one), no ads, no external links, COPPA/child-safety-clean by construction.

### 5.2 Reflect (Dialogue Layer)

At the story's end, the app pauses and hands the session to the parent. The screen shows 2–3 reflection prompts written for the parent to ask aloud. Prompts avoid binary right/wrong framing; they target character motivation ("Why do you think the crow shared the water?") and mild ethical tension ("Was it okay for him to trick the crocodile? When is tricking okay?").

Each story ships with a **Parent Card**: the day's value in one line, the prompts, one "if your child says X, try Y" facilitation tip, and one common wrong turn to avoid (e.g., lecturing). The Parent Card is visible in Parent Mode before the session and inline after the story.

The app does not record, transcribe, or evaluate the child's answers. The Reflect layer is deliberately instrumentation-free at the conversation level — both for privacy and because measuring it would distort it.

### 5.3 Act (Transfer Layer)

Every story closes with one **Micro-Mission**: a concrete, household-scale action completable within 24 hours, mapped to the story's value. Examples: *Resilience →* "Finish one chore you started but left halfway, without being reminded." *Empathy →* "Notice one thing someone in the family did for you today and thank them for it."

Mission design rules: zero materials required beyond what a household has; completable by the child with light parent witnessing; observable (a parent can see it happened); never punitive or performance-graded.

Completion is logged by the parent in the Value Journal (§7.2) with one tap plus an optional photo/note. **Missions are optional by design.** Skipping a mission never blocks the next story, breaks a streak, or triggers guilt messaging — this is the primary mitigation for parent-effort fatigue (§12, R1).

## 6. Content System & Production Pipeline

### 6.1 Story object schema (single source of truth)

All content lives as modular JSON objects in a static content repository, compiled at build time. Narrative and mission are decoupled so missions can be A/B tested or refreshed without touching story assets.

```json
{
  "story_id": "pancha-014",
  "title": "The Crow and the Pitcher",
  "source_tradition": "Panchatantra",
  "moral_category": "Wisdom",
  "age_band": "5-8",
  "narrative_segments": [ { "seg_id": "...", "text": "...", "art_ref": "...", "tts_ref": "..." } ],
  "reflection_prompts": [ { "prompt": "...", "facilitation_tip": "...", "wrong_turn": "..." } ],
  "micro_missions": [ { "mission_id": "...", "text": "...", "effort": "low", "variant": "A" } ],
  "review_status": "human_approved",
  "version": "1.2"
}
```

### 6.2 Taxonomy

Every story maps to exactly one primary value from a closed set of eight for v1: Wisdom, Resilience, Empathy, Honesty, Courage, Gratitude, Patience, Fairness. Mapping examples: Panchatantra / Wisdom / creative-household-fix mission; Ramayana episode / Resilience / chore-completion mission. The taxonomy is the join key between stories, missions, the Value Journal, and (Phase 3) school theme assignments — it must be locked before content production scales.

### 6.3 Production pipeline (reuse, not rebuild)

Anvaya inherits the Cosmo Story Studio asset base: ~85 curated art/character assets and 30 human-reviewed story skeletons are the seed corpus. The delta work per story is (a) compression to a single 7–10 minute arc, (b) authoring 2–3 reflection prompts + Parent Card, (c) authoring 2 mission variants, (d) human review pass. Target: 40 launch stories (5 per value), produced via the existing Claude Code → GitHub → Vercel pipeline with the same plan-before-execute and security discipline (target ≥95/100 on the existing audit rubric).

Content velocity requirement post-launch: 4 new stories/month minimum to sustain a 2–3 sessions/week ritual without repetition inside 90 days (40 + 12/quarter ≈ 6 months of fresh rotation at 3x/week).

## 7. User Experience Requirements

### 7.1 Session flow (the golden path)

Parent opens app → today's story surfaced (one primary CTA, no browsing pressure) → optional 20-second Parent Card preview → co-viewing story → Reflect screen with prompts → Mission reveal → session ends cleanly. Total: 12–15 minutes. No infinite feed, no "up next," no notification spam. One gentle ritual-time reminder per day, set by the parent, off by default.

### 7.2 Parent-facing features

**Parent Mode Dashboard.** Today's value and talking points, the week's arc, facilitation tips, and mission history. Gated behind a parent gate (hold-to-enter or math challenge).

**Value Journal.** One-tap mission completion log with optional photo/note. Renders as a scrapbook timeline ("In March, Aarav practiced Patience 4 times"). This is the emotional retention asset and the bridge to the physical product: journal content feeds the printed hardcover keepsake (§11).

### 7.3 Child-facing features

Gamification rewards the *ritual*, not consumption speed: a story-world map that fills in per completed session, character stickers earned on mission completion (parent-confirmed), and a weekly "family badge" for 3 sessions. No leaderboards, no timers, no loss-framed streaks. All reward loops must survive the guide-on-the-side test — nothing that makes the child grab the device away from the parent.

### 7.4 Design principles

Shared-device-first (one screen, two laps). Warm, storybook visual language, not neon-edutainment. Text large enough for over-the-shoulder reading. Every screen answerable to: does this create conversation or consume it?

## 8. Technical Requirements

- **Architecture:** static-first. Story content, art, and TTS narration compiled at build time; no runtime AI, no runtime story generation. Client is a PWA/lightweight app reading from CDN-served JSON manifests (same pattern as Cosmo Explorer).
- **Offline:** current week's stories cached for offline playback (bedtime ≠ good wifi).
- **Data:** minimal PII. Child profile is first-name + age band only. No child conversation capture, no behavioral ad tracking, no third-party analytics SDKs in child-facing surfaces. Journal photos stored encrypted, parent-deletable.
- **Compliance:** designed to India DPDP Act standards for children's data (verifiable parental consent, no tracking-based profiling of minors); COPPA-clean by construction for future portability.
- **Performance:** story load < 2s on a mid-range Android device on 4G; total app size < 60MB with per-story lazy download.

## 9. Success Metrics

The north-star narrative remains "consumption → completion," but the instrumented metrics must be behavioral and observable, not self-report-dependent.

| Metric | Definition | Phase 1 gate |
|---|---|---|
| **Ritual repetition (primary)** | % of activated families with ≥2 completed sessions/week, week 4 | ≥ 40% |
| Session completion | % of started sessions reaching the Mission reveal screen | ≥ 70% |
| Reflect dwell | Median time on Reflect screen (proxy for a real conversation) | ≥ 90 sec |
| Journal engagement | Journal entries per active family per week | ≥ 1.0 |
| Child pull | Parent-reported "child asked for the next story" (pilot survey) | ≥ 6/10 |
| Unaided flow completion | Pilot observation: child+parent complete session without help | ≥ 8/10 |

Mission-completion *rate* from the Value Journal is tracked and reported but is explicitly a secondary, inflation-prone signal — it informs mission design (which missions get logged) rather than serving as the PMF gate. The Phase 0 behavioral gates (8/10 unaided completion, 6/10 ask-for-another) carry over unchanged as the pilot go/no-go.

## 10. Go-to-Market & Roadmap

Schools are the **primary distribution channel from Phase 1**, not a Phase 3 expansion. This leverages existing enterprise sales experience, solves cold-start trust (a school recommendation converts parents that app-store ads cannot), and creates the weekly theme cadence the product wants anyway.

**Phase 0 — Pilot (Months 0–2).** 40 launch stories. 20–30 founding families recruited through 2 partner schools + personal network. Moderated sessions against the behavioral gates in §9. Exit criteria: both Phase 0 gates met.

**Phase 1 — School-anchored beta (Months 3–6).** 3–5 partner schools; school pushes a value-of-the-week, Anvaya serves the matching stories at home. Value Journal ships. Measure ritual repetition and Reflect dwell. Exit criteria: ritual repetition ≥ 40%, ≥ 2 schools renew interest for the next term.

**Phase 2 — Monetization + Hindi (Months 6–10).** Freemium wall activates (§11) only after habit metrics are proven. Hindi narration for top 20 stories. Mission A/B testing via decoupled mission variants. Exit criteria: free→paid conversion ≥ 4%, M2 paid retention ≥ 70%.

**Phase 3 — School-Home platform (Months 10+).** Educator dashboard: theme assignment, anonymized class-level participation view (never individual-child surveillance), school licensing tier. B2B2C pricing pilot.

## 11. Business Model

Phased freemium-to-paid, gated on proven habit formation — monetize the ritual, never the story access alone.

- **Free tier:** 2 stories/week + full ORA loop. Enough to form the habit, not enough to sustain a 3x/week ritual.
- **Family plan:** ₹149–199/month or ₹1,199–1,499/year. Full library, Value Journal export, both mission variants, Hindi narration.
- **Keepsake layer:** printed hardcover "Our Family's Value Journal" and story collections at ₹599–999 — the emotional artifact and gifting SKU, generated from the family's own journal timeline.
- **School licensing (Phase 3):** per-section annual license bundling educator dashboard + discounted family plans; priced per pilot learnings.

Pricing to be validated in Phase 1 willingness-to-pay interviews; the numbers above are hypotheses anchored to the Indian kids-app market and the prior Cosmo pricing work.

## 12. Risks & Mitigations

**R1 — Parent-effort fatigue (highest risk).** A daily real-world mission is a retention tax on the parent. Mitigations: missions optional and guilt-free by design; product cadence framed as 2–3x/week ritual, not daily; "low-energy mode" that ends a session after Reflect with no mission; re-entry flow after a lapse that welcomes back rather than shames ("pick up where you left off," never "you lost your streak").

**R2 — Reflect layer gets skipped.** Parents may tap through prompts. Mitigations: prompts written to take < 15 seconds to ask; Reflect dwell tracked as a design health metric; Parent Card previews reduce in-the-moment friction.

**R3 — Passive incumbents (Katha Room, audio platforms) add "discussion questions."** A feature is copyable; a facilitation system is less so. Moat: Parent Cards + mission taxonomy + Value Journal + school theme integration form a loop, not a feature. Speed to school partnerships compounds this.

**R4 — Content velocity stalls.** 4 stories/month is a hard requirement. Mitigation: pipeline reuse from Story Studio; mission decoupling means refresh can come from mission variants when narrative production lags.

**R5 — Metric gaming via journal self-report.** Addressed structurally in §9: self-report metrics are secondary; gates are behavioral.

## 13. Open Questions

1. Brand relationship: does Anvaya ship under the Cosmo Explorer umbrella (shared trust, shared site) or as a standalone brand? Affects school pitch and domain strategy.
2. TTS voice: single narrator identity vs. per-tradition voices — cost vs. warmth tradeoff to test in Phase 0.
3. Mission confirmation integrity: is parent one-tap enough, or does the photo-optional model under-capture completions? Decide after Phase 1 journal data.
4. Educator dashboard scope: read-only participation vs. theme authoring — defer detailed spec to a Phase 3 PRD addendum.

---
*Document ends. Review focus requested: §9 gate thresholds and §11 price points.*
