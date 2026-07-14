# Anvaya — Figma Design Brief

**Single document for Figma AI to generate the full app.**
Paste this entire file into Figma AI (Make or First Draft) as one prompt. It contains design tokens, component library, and every screen for two complete story flows across both mobile (portrait) and tablet (landscape). Screens are numbered and can be generated sequentially.

---

## 0. Product context (for the AI)

Anvaya is a parent-child ritual app for Indian families with children aged 5–8. Each session runs a fixed loop: an 8-beat illustrated story, a scripted parent-child dialogue, and one real-world Micro-Mission. The parent is the primary user during story time, not the child. The app facilitates the bond; it never substitutes for the parent.

Visual intent: **warm, grounded, quietly premium.** Feels like a hand-bound family journal, not a kids' app. Trustworthy to a values-conscious Indian parent in a metro. Never neon, never edutainment-cartoon, never generic minimalist SaaS. The illustration language (warm watercolor, terracotta and indigo palette, 1970s Amar Chitra Katha era softness) extends into the UI chrome — the app is the frame around the story, and the frame belongs to the same world.

Form factors: **mobile portrait (390 × 844)** and **tablet landscape (1194 × 834)**. Every screen in §5 has both variants. Shared components stay identical; layout adapts.

---

## 1. Design tokens

### 1.1 Color

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#FBF5EA` | App background |
| `--cream-warm` | `#F4EAD5` | Card surfaces, elevated panels |
| `--paper` | `#EFE3C8` | Journal tiles, keepsake surfaces |
| `--ink-deep` | `#2B1D14` | Primary text |
| `--ink-soft` | `#5B4636` | Secondary text |
| `--ink-mute` | `#8A7458` | Tertiary text, timestamps |
| `--terracotta` | `#C25A3D` | Primary CTA, key accents |
| `--terracotta-deep` | `#9A4229` | Pressed states, active nav |
| `--mustard` | `#D4A017` | Value badges, sticker highlights |
| `--indigo` | `#2E3A5F` | Parent Mode chrome, gates |
| `--forest` | `#3E5B3A` | Success states, mission completion |
| `--rose-dawn` | `#E8B4A0` | Soft accents, mission cards |
| `--jade-mute` | `#8CA89E` | Info states, quiet callouts |

**Never used:** pure black, pure white, cyan, magenta, saturated red-green pairings, Christmas palette, Halloween palette.

### 1.2 Typography

Two families, both free and Indic-friendly.

- **Fraunces** (variable serif) — headings, story titles, narration, reflection prompts
- **Inter** (variable sans) — UI, body, labels, buttons

| Token | Family / Weight | Size / Line-height | Use |
|---|---|---|---|
| `display` | Fraunces 700 | 40 / 48 | Welcome, story titles on Today screen |
| `h1` | Fraunces 600 | 28 / 36 | Screen headers |
| `h2` | Inter 600 | 20 / 28 | Section headers, Parent Card value line |
| `narration` | Fraunces 500 | 22 / 32 | Story beat narration |
| `prompt` | Fraunces 600 | 24 / 34 | Reflection prompt text |
| `body` | Inter 400 | 16 / 24 | Body copy, tips |
| `label` | Inter 500 | 14 / 20 | Buttons, labels |
| `caption` | Inter 400 | 13 / 18 | Timestamps, metadata |
| `tiny` | Inter 500 | 11 / 14 | Progress dot labels, badges |

Narration and prompt sizes are large — text must be readable over the shoulder by a parent leaning in.

### 1.3 Spacing

8-point grid, no exceptions. `4 · 8 · 16 · 24 · 32 · 48 · 64`.

Screen edge padding: 20 mobile, 32 tablet. Card internal padding: 24. Card gap: 16.

### 1.4 Corner radii

`sm 8 · md 12 · lg 20 · xl 28 · pill 999`. Cards use lg (20). Buttons use xl (28), pill-adjacent, warm not sharp. Story illustrations use md (12). Journal photos use sm (8).

### 1.5 Elevation

Warm ink-based shadows, never crisp or blue-tinted.

- `e1` (cards at rest): `0 1px 2px rgba(43,29,20,0.06), 0 2px 8px rgba(43,29,20,0.04)`
- `e2` (active card): `0 2px 6px rgba(43,29,20,0.10), 0 8px 24px rgba(43,29,20,0.06)`
- `e3` (modals, mission reveal): `0 8px 24px rgba(43,29,20,0.14), 0 24px 48px rgba(43,29,20,0.08)`

### 1.6 Iconography

Phosphor (regular) or Lucide, 1.5px stroke, rounded joins, `--ink-soft` default. Sizes: 20 inline, 24 in buttons, 32 in headers. No filled icons. No emoji in UI chrome.

### 1.7 Motion

Slow, warm, never bouncy. All transitions ≤ 300ms `ease-out`. No spring physics on child surfaces. Fade-through between story beats: 250ms crossfade only, no slide. Modal reveals: 200ms fade + 8px rise. Reward animations subtle — a sticker "settles" over 400ms, no fanfare.

Prohibited motion: bouncy springs, particle bursts, confetti, sparkle animations, flame streaks.

### 1.8 Accessibility floor

Minimum tap target 48×48. Body copy ≥ 16, narration ≥ 22. Text contrast AAA on `--cream`. No color-only state indication — always paired with icon or text.

### 1.9 Voice tokens (for copy the AI generates)

- Narration: warm storyteller, unhurried, sensory
- Parent Card: peer-to-peer, one adult to another, never instructional
- Child-facing: direct, warm, second-person, short sentences
- Empty states: matter-of-fact and inviting, never apologetic or cute
- **No exclamation marks in UI chrome** — only in narration text. Not in Parent Card, prompts, missions, journal, or settings.

---

## 2. Component library

Build these as reusable Figma components before generating screens. Every screen in §5 references them by name.

### 2.1 Buttons

**`Button/Primary`** — pill (radius xl 28), `--terracotta` fill, `--cream` text (label token), height 56 mobile / 60 tablet, horizontal padding 32. Pressed: `--terracotta-deep`. Full-width variant available.

**`Button/Secondary`** — pill, transparent fill, 1.5px `--ink-soft` border, `--ink-deep` text, same heights.

**`Button/Ghost`** — no border, `--ink-soft` label text, used for skip / dismiss.

**`Button/Triad`** — three equal buttons horizontally (mobile: stacked vertically). Used only on Mission reveal screen. Each 100% width in its column, height 60, `--cream-warm` fill, `--ink-deep` label, no elevation.

### 2.2 Cards

**`Card/Story`** — `--cream-warm` fill, radius lg, elevation e1, padding 24. Contains: illustration (16:10 landscape image with radius md at top), value badge overlay top-right, title in Fraunces 600 24pt, one-line subtitle in Inter 400 14pt, `--ink-mute`.

**`Card/ParentCard`** — `--paper` fill, radius lg, elevation e1, padding 24. Contains: "Today's value" label in tiny + value name in h2 mustard, 2–3 prompt lines in prompt token (collapsed by default with reveal chevron), "One tip" section in body, "Watch out for" section in body `--ink-soft`.

**`Card/Mission`** — `--rose-dawn` fill at 40% opacity over `--cream-warm`, radius lg, elevation e2, padding 32 top / 24 sides / 24 bottom. Contains: "Micro-Mission" tiny label, mission text in prompt token, "You have 24 hours" caption in `--ink-mute` with clock icon.

**`Card/JournalEntry`** — `--paper` fill, radius sm, elevation e1, padding 16. Contains: date caption top, mission text body, optional 8:5 photo with radius sm, optional note in caption `--ink-soft`, value badge bottom-left.

### 2.3 Value badge

**`Badge/Value`** — pill (radius pill), `--mustard` fill at 20% opacity, `--mustard` 1px border, `--ink-deep` label text at 12pt weight 600, horizontal padding 12, vertical padding 6. Text is always one of: Wisdom · Resilience · Empathy · Honesty · Courage · Gratitude · Patience · Fairness.

### 2.4 Progress dots (story beats)

**`Progress/BeatDots`** — 8 circles in a row, 8px diameter, 12px gap. States: completed = `--terracotta` solid, current = `--terracotta` solid with 16px halo at 30% opacity, upcoming = `--ink-mute` at 30% opacity. Fixed at top of story reader with 20px vertical padding. No numbers, no scrubber, no time indicator.

### 2.5 Story world map node

**`Map/Node`** — circular sticker, 64px diameter, `--mustard` fill with a small character illustration inside, `--terracotta` 2px border. Two states: unlocked (full color, elevation e1) and locked (`--paper` fill, no illustration, no border, 40% opacity).

### 2.6 Parent gate

**`Gate/Hold`** — full-screen overlay, `--indigo` at 92% opacity. Center: circular button 96px diameter, `--cream` fill, text "Hold to enter Parent Mode" in Fraunces 600 20pt below in `--cream`. Filling animation: `--terracotta` ring completes over 3 seconds while held. Cancel: release before complete. No visible dismiss — tapping outside does not close.

### 2.7 Session close card

**`Card/SessionClose`** — `--cream-warm` fill, radius lg, elevation e1, padding 32. Contains: "See you next time" in display token, small map preview showing the just-filled node, one-line date caption. No CTA button. No "next story" teaser. The only way forward is to close the app or wait for tomorrow's session.

### 2.8 Nav

**Mobile:** no bottom nav during a session. Between sessions, a minimal top bar: Anvaya wordmark left (Fraunces 600 20pt, `--terracotta`), Parent Mode icon right (small door/key icon, opens `Gate/Hold`).

**Tablet:** same top bar, wider. No side navigation.

### 2.9 States for every interactive element

- Rest, hover (tablet only), pressed, disabled, loading
- Disabled: 40% opacity, no elevation
- Loading: skeleton in `--cream-warm` with subtle 800ms shimmer

---

## 3. Story content (real, not placeholder)

Two full stories that populate every screen. Use this exact text — Figma AI should not paraphrase.

### 3.1 Story A: The Crow and the Pitcher

- **story_id:** pancha-001
- **source_tradition:** Panchatantra
- **value:** Wisdom
- **estimated_duration_sec:** 480

**8 beats:**

1. **Opening** — "It was the hottest day of the summer. The rivers had dried up, the ponds had turned to dust, and every animal in the forest was searching for water. Among them was a small black crow, flying tired circles under the burning sun."
2. **Setup** — "The crow had been flying since morning. His wings ached, his throat was dry as bark, and everywhere he looked — nothing. Not a drop. He had to find water soon, or he wouldn't make it home."
3. **Inciting** — "Just as he was losing hope, the crow saw something wonderful — a tall clay pitcher, sitting quietly in the corner of a garden. He flew down at once, his heart lifting. Water. Finally, water."
4. **First attempt** — "But when the crow dipped his beak inside, he couldn't reach the water. The pitcher was too tall, and the water was too low. He stretched. He strained. He tipped his head sideways. Nothing worked."
5. **Complication** — "The crow tried to knock the pitcher over, pushing with all his tiny weight. But the pitcher was heavy, and the crow was small. He sat down beside it, more thirsty than before, and thought hard. There had to be a way."
6. **Turn** — "Then the crow noticed something. A small pebble, lying near his feet. He looked at the pebble. He looked at the pitcher. And slowly, a very clever idea began to take shape in his mind."
7. **Resolution** — "One by one, the crow picked up pebbles and dropped them into the pitcher. Plop. Plop. Plop. With each pebble, the water rose a little higher. Higher, and higher, and higher — until at last, it reached the very top."
8. **Landing** — "The crow drank his fill, feeling the cool water reach every corner of his tired body. He hadn't been the strongest. He hadn't been the biggest. But he had used his mind — and sometimes, that is the greatest strength of all."

**Parent Card:**
- Today's value: Wisdom
- Prompt 1: "The crow was small and the pitcher was heavy. What did he use instead of strength?"
  - Tip: If your child says "pebbles", gently push once — "And what made him think of the pebbles?" You're guiding them from the object to the thinking.
  - Watch out for: turning this into a science lesson about displacement.
- Prompt 2: "Can you think of a time you couldn't do something the big way, so you tried a different way?"
  - Tip: Share your own small example first if they're stuck.
  - Watch out for: steering toward school examples. Household and play examples land better.

**Micro-Missions:**
- Variant A: "Find one thing at home that's a little too hard for you, and figure out a clever way to do it without asking a grown-up for the muscle. Show us what you tried."
- Variant B: "The next time something feels stuck today, before giving up, stop and think of three different ways to try. Pick the cleverest one."

### 3.2 Story B: The Monkey and the Crocodile

- **story_id:** pancha-002
- **source_tradition:** Panchatantra
- **value:** Wisdom (secondary read: discernment about trust)
- **estimated_duration_sec:** 500

**8 beats:**

1. **Opening** — "On the bank of a wide, slow river stood a great jamun tree, heavy with dark purple fruit. High in its branches lived a young monkey, who spent his days climbing, swinging, and eating the sweetest jamuns in the forest."
2. **Setup** — "One afternoon, a crocodile came to rest under the tree. The monkey, who was kind, tossed him a few jamuns to try. The crocodile had never tasted anything so sweet. He came back the next day, and the next, and soon the two became friends."
3. **Inciting** — "The crocodile carried some jamuns home to his wife. She loved them — but a strange, dark thought crept into her mind. 'If the fruit is this sweet,' she said, 'imagine how sweet the monkey's heart must be. Bring it to me.'"
4. **First attempt** — "The crocodile did not want to. But his wife would not let it go. So the next day, he told the monkey, 'My wife has invited you for a feast. Climb onto my back and I will carry you across the river.' The trusting monkey agreed."
5. **Complication** — "Halfway across the deep, wide river, the crocodile stopped. 'My friend,' he said, 'I must tell you the truth. My wife wants to eat your heart.' The monkey's blood turned cold. He was far from any tree. He could not swim. He was trapped."
6. **Turn** — "But the monkey did not panic. He took a slow breath, and his mind began to work. 'Oh dear friend,' he said cheerfully, 'why didn't you tell me sooner? Monkeys never carry their hearts with them. Mine is hanging safely in the jamun tree. Let us go back and fetch it.'"
7. **Resolution** — "The foolish crocodile believed him and turned around. The moment they reached the bank, the monkey leapt high into the branches of his tree, safe at last. 'You may go home now,' he called down. 'And tell your wife that monkeys keep their hearts, and their wits, exactly where they belong.'"
8. **Landing** — "The crocodile swam away in silence. The monkey sat quietly among the leaves, his heart still beating. He had learned something that afternoon — that a kind heart is a gift, but a thinking mind is what keeps it safe."

**Parent Card:**
- Today's value: Wisdom
- Prompt 1: "The monkey was scared, but he didn't show it. Why do you think he stayed calm?"
  - Tip: If your child says "because he was clever" — push once: "What helped him be clever in that scary moment?"
  - Watch out for: making it about "never trust anyone." The story isn't about that.
- Prompt 2: "When has staying calm helped you think of something you would have missed if you panicked?"
  - Tip: If they can't think of one, share yours first. Small examples work best.
  - Watch out for: turning it into a lecture about controlling emotions.

**Micro-Missions:**
- Variant A: "The next time you feel a big feeling today — surprise, upset, or worry — take three slow breaths before you say anything. See what you notice."
- Variant B: "Think of one time this week when you knew someone was being unfair, but you handled it with your mind instead of a fight. Tell us about it at bedtime."

---

## 4. Screen inventory

18 screens total. Onboarding runs once. Two full story flows (A and B) share the same 6-screen loop template with different content. Parent Mode is gated and shared. Every screen has mobile (390×844) and tablet (1194×834) variants.

**Onboarding (5 screens, once per household):** O1 Welcome · O2 Parent Gate · O3 Child Profile · O4 Ritual Preference · O5 Handoff to first story

**Story Flow A — Crow & Pitcher (6 screens):** A1 Today · A2 Parent Card Preview · A3 Story Reader (8 beats × 1 screen = 1 layout, content varies) · A4 Reflect · A5 Mission Reveal · A6 Session Close

**Story Flow B — Monkey & Crocodile (6 screens):** B1 Today · B2 Parent Card Preview · B3 Story Reader · B4 Reflect · B5 Mission Reveal · B6 Session Close

**Parent Mode (4 screens, gated):** P1 Dashboard · P2 Value Journal · P3 Journal Entry Detail · P4 Settings

Screens A3 and B3 are the reader — one layout, generate 8 frames per story to show all beats.

---

## 5. Screen specifications

Each screen below has: purpose, mobile layout, tablet layout, components used, exact copy, states, and interaction notes. Generate mobile first, then tablet.

---

### O1 — Welcome

**Purpose:** First launch. Establish brand, land the promise, one path forward.

**Mobile layout (390×844):**
Background `--cream`. Center-aligned column, edge padding 20.
- Top 25%: empty (visual breathing room)
- Middle: Anvaya wordmark, Fraunces 700 48pt, `--terracotta`. Below it, single line in Fraunces 500 22pt, `--ink-soft`: "A story, a talk, a small act — every week."
- Below tagline: an illustration slot 320×200, `--cream-warm` fill with radius lg, contains a placeholder for a hero watercolor of a parent-child reading pose in warm palette
- Bottom 20%: `Button/Primary` full-width, label "Get Started"
- Below button: caption `--ink-mute`, "Made for parents. Made in India."

**Tablet layout (1194×834):**
Two-column split. Left column 55%: illustration slot 600×500 with radius lg, holding the hero watercolor. Right column 40% (with 32px padding): wordmark at 64pt, tagline at 26pt, primary button at 240px width (not full column), caption below.

**States:** rest only. No loading, no error on this screen.

**Interaction:** Get Started → O2 Parent Gate.

---

### O2 — Parent Gate

**Purpose:** Confirm an adult is setting up. Establish the parent-first tone from the first interaction.

**Mobile & Tablet layout (same, adapts to width):**
Full-screen `--indigo` at 96% opacity over a blurred `--cream` background.
Center: `Gate/Hold` component. Circular 96px button, `--cream` fill. Below the button in Fraunces 600 20pt `--cream`: "Hold to enter". Below that in Inter 400 14pt `--cream` at 70% opacity: "We do this so little hands don't skip ahead."

**Interaction:** hold 3 seconds → `--terracotta` ring fills → success haptic → O3. Release early: ring resets. No skip. No dismiss.

---

### O3 — Child Profile

**Purpose:** Capture minimum viable child profile: first name + age.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Top: back chevron left (`--ink-soft`, 24px)
- Below: h1 in Fraunces 600 28pt: "Who's this for?"
- Below header, 32px gap: body in Inter 400 16pt `--ink-soft`: "Just a first name and age. Nothing else."
- Form:
  - Label "First name" in label token
  - Text input, radius md, 1.5px `--ink-mute` border, `--cream-warm` fill, height 56, padding 16. Placeholder in `--ink-mute`: "e.g. Aarav"
  - Gap 24
  - Label "Age"
  - Segmented control with 4 options: 5 · 6 · 7 · 8. Each segment 72×56, radius md, `--cream-warm` fill. Selected state: `--terracotta` fill, `--cream` text.
- Bottom: `Button/Primary` full-width, "Continue". Disabled state until both fields valid.

**Tablet layout:**
Same content, form column centered at 520px width. Header at h1 34pt.

**States:** rest, filled, disabled (button until valid), error (name field left empty).

**Interaction:** Continue → O4.

---

### O4 — Ritual Preference

**Purpose:** Ask when the family plans to use Anvaya, and whether they want a reminder. Reminder defaults OFF.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Back chevron
- h1: "When's your usual story time?"
- Body: "This helps us set the rhythm. You can change it later."
- Three radio cards, stacked, 16px gap. Each is a `Card/Story`-style container without illustration, padding 20:
  - Card 1: icon (moon), label in h2 "Bedtime", caption "7–9 PM most evenings"
  - Card 2: icon (sun), label in h2 "Weekend mornings", caption "Saturdays and Sundays"
  - Card 3: icon (clock), label in h2 "No fixed time", caption "We'll figure it out"
  - Selected state: 2px `--terracotta` border, `--cream-warm` background
- Gap 32
- Row: toggle switch (default OFF) + label in body "Send me a gentle reminder"
- Bottom: `Button/Primary` full-width, "Continue"

**Tablet layout:**
Three radio cards in a horizontal row, each 340×160. Everything else same as mobile.

**Interaction:** Continue → O5.

---

### O5 — Handoff to first story

**Purpose:** Skip the home screen on first run and drop straight into the first story's Parent Card preview to establish the loop immediately.

**Mobile & Tablet layout:**
Full-screen `--cream`, center-column.
- Illustration slot 240×180 (small watercolor of a crow or a pipal tree)
- Fraunces 600 28pt: "Your first story is ready."
- Body: "It's called The Crow and the Pitcher. About five minutes reading, five minutes talking together."
- 32px gap
- `Button/Primary` "Begin" full-width mobile / 320px tablet
- `Button/Ghost` below: "Maybe later"

**Interaction:** Begin → A2 (Parent Card Preview for Crow). Maybe later → A1 (Today screen).

---

### A1 / B1 — Today screen

**Purpose:** Surface today's story. One primary path. No library browse. No "up next" strip.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Top bar: Anvaya wordmark left (Fraunces 600 20pt `--terracotta`), Parent Mode icon right (small key icon, 24px, `--ink-soft`)
- Below top bar, 24px gap:
  - Tiny label `--ink-mute`: "TODAY'S STORY"
  - h1 in Fraunces 600 28pt `--ink-deep`: story title
    - A1: "The Crow and the Pitcher"
    - B1: "The Monkey and the Crocodile"
  - `Badge/Value` below title: "Wisdom" (both stories)
- 24px gap
- `Card/Story` component, full-width. Illustration slot 350×220 (watercolor hero for the story), value badge overlay top-right. No title inside card since it's already above. Body copy inside card in Inter 400 16pt `--ink-soft`:
  - A1: "A small crow, a tall pitcher, and one very clever idea. About 5 minutes reading, 5 minutes talking."
  - B1: "A monkey, a crocodile, and a moment that tests everything. About 5 minutes reading, 5 minutes talking."
- 24px gap
- `Button/Primary` full-width: "Start Story"
- Below button, `Button/Ghost` centered: "Preview the Parent Card" (small text link)

**Tablet layout (1194×834):**
Two-column split with 48px gap. Left column 60%: `Card/Story` at 680×500 with illustration filling most of the card. Right column 35%: label · title h1 34pt · value badge · body 18pt · primary button 320px · ghost link. Vertically centered.

**States:** rest, loading (skeleton on story card).

**Interaction:** Start Story → A2/B2. Preview → same A2/B2. Parent Mode icon → `Gate/Hold` (O2 style) → P1 on success.

---

### A2 / B2 — Parent Card Preview

**Purpose:** 20-second read for the parent before the story. What today's value is, what to ask, one tip, one thing to avoid.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Top bar: back chevron left, "Parent Card" in h2 center, close X right
- 24px gap
- `Card/ParentCard` full-width, expanded (not collapsed on preview):
  - Tiny label `--ink-mute`: "TODAY'S VALUE"
  - h2 in `--mustard`: "Wisdom" (both stories)
  - 24px gap
  - Section header in label token `--ink-soft`: "TWO THINGS TO ASK"
  - Prompts listed in prompt token 20pt (slightly smaller than the reader version), 16px gap between:
    - A2 prompts: from §3.1
    - B2 prompts: from §3.2
  - 24px gap
  - Section header: "ONE TIP"
  - Body: A2 — "Guide from the object to the thinking. If your child says 'pebbles,' ask what made him think of them." · B2 — "Small examples from your own day work better than big lessons."
  - 16px gap
  - Section header `--ink-soft`: "WATCH OUT FOR"
  - Body `--ink-soft`: A2 — "Turning it into a science lesson about displacement." · B2 — "Making it about 'never trust anyone'. The story isn't about that."
- Bottom of screen, sticky:
  - `Button/Primary` full-width: "Ready — Start Story"
  - `Button/Ghost`: "Skip preview"

**Tablet layout:**
Card at 720×620 centered. Same content. Sticky buttons at bottom of screen, not card.

**Interaction:** Ready → A3/B3. Skip → A3/B3.

---

### A3 / B3 — Story Reader (one layout, 8 beats)

**Purpose:** The Observe layer. One illustration per beat, TTS narration auto-plays, tap-to-advance early.

**Mobile layout (390×844) — portrait orientation:**
Background `--ink-deep` (a warm near-black; this is the only screen where the app goes dark, to make the illustration pop).
- Top bar: `Progress/BeatDots` (8 dots) centered, 20px top padding. Small X close in top-right (opens confirm dialog).
- Below top bar, 16px gap: illustration frame, full-width, aspect 16:10 (so ~390×244), radius md. Illustration takes up upper 40% of screen.
- Below illustration, 24px gap: narration text in narration token 22pt, `--cream` color. Left-aligned, edge padding 24. Max 4 sentences.
- Below narration, flexible space, then centered at bottom: subtle audio-playing indicator (thin waveform bar in `--terracotta`), 32px above bottom edge.
- Tap anywhere on the screen (except the X and progress dots): advance to next beat.

**Tablet layout (1194×834) — landscape, co-viewing:**
Same dark `--ink-deep` background. Two-panel horizontal split with 32px gap and 40px edge padding.
- Left panel 60% width: illustration at ~660×560, radius lg. Full artwork visible.
- Right panel 35%: `Progress/BeatDots` at top, narration text 26pt `--cream` (larger than mobile — over-shoulder reading distance), audio indicator at bottom-right.
- Tap anywhere except X and dots: advance.

**Generate 8 beat frames per story = 16 total frames (Crow beats 1–8, Monkey beats 1–8), each with the exact narration text from §3.1 / §3.2.** For the illustration slot, use a placeholder rectangle labeled with the beat's illustration_direction from the PRD (§13.1 style). Figma AI does not need to generate the actual watercolor — that comes from the image pipeline. But the frame layout, aspect, and position must be locked.

**Interaction:** Tap → next beat. On beat 8 tap → A4/B4 Reflect. Close X → confirm dialog "End story now? You can come back later." with Cancel / End buttons.

**States per beat:** narration streaming (subtle fade-in of text over 400ms as TTS begins), audio playing (waveform animating), audio complete (waveform still), tapped (250ms crossfade to next beat).

---

### A4 / B4 — Reflect

**Purpose:** Hand the session to the parent. Show 2 prompts. Require parent tap to advance.

**Mobile layout (390×844):**
Background transitions from `--ink-deep` (fade out over 400ms) to `--cream`. Edge padding 20.
- Top: no progress dots (story is done). No close X.
- 40px gap from top.
- Center-column:
  - Small illustration slot 200×140 (a soft closing image — e.g. the crow drinking peacefully, or the monkey safe in the tree)
  - 32px gap
  - Header in h1 Fraunces 600 26pt `--ink-deep`: "Now it's your turn to talk."
  - 16px gap
  - Body Inter 400 16pt `--ink-soft`: "Take your time with these. There are no wrong answers."
  - 32px gap
  - Prompt 1 in prompt token 24pt, left-aligned
  - 20px gap
  - Prompt 2 in prompt token 24pt
  - (If story has 3 prompts, add prompt 3 with same gap)
- Below prompts, 40px gap:
  - Collapsed section "One tip if you get stuck" with chevron. Tap to expand — expanded shows the tip in body `--ink-soft`.
- Sticky bottom: `Button/Primary` full-width: "We're Done Talking"

**Tablet layout:**
Same content, prompts at 30pt. Prompts and tip on left 60% column, closing illustration on right 35% column at 400×280. Sticky button at bottom of screen.

**Interaction:** "We're Done Talking" → A5/B5 Mission Reveal. This tap generates the Reflect-dwell metric. There is no way past this screen except through the button.

**States:** rest, tip expanded, tip collapsed.

---

### A5 / B5 — Mission Reveal

**Purpose:** Show the Micro-Mission. Three equal options: Log Now, Log Later, Skip. All guilt-free.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Top: small `Badge/Value` centered at top, 20px from top edge
- 24px gap
- `Card/Mission` component full-width, elevation e2:
  - Tiny label at top `--terracotta`: "MICRO-MISSION"
  - 12px gap
  - Mission text in prompt token 22pt `--ink-deep`, left-aligned:
    - A5: "Find one thing at home that's a little too hard for you, and figure out a clever way to do it without asking a grown-up for the muscle. Show us what you tried."
    - B5: "The next time you feel a big feeling today — surprise, upset, or worry — take three slow breaths before you say anything. See what you notice."
  - 20px gap
  - Row: clock icon 20px + caption `--ink-mute`: "You have 24 hours. No pressure."
- 32px gap
- `Button/Triad` stacked as three vertical buttons on mobile (not horizontal):
  - Button 1 primary style: "Log It Now"
  - Button 2 secondary style: "Log It Later"
  - Button 3 ghost style: "Skip This One"
- Below the three buttons, caption `--ink-mute` centered: "Skipping is okay. Not every day needs a mission."

**Tablet layout:**
Mission card at 720×360 centered. `Button/Triad` in horizontal row below, three buttons each 220 wide. Caption below.

**Interaction:** Log Now → mini-modal for optional photo/note → A6 with confirmation state · Log Later → A6 with "queued" state · Skip → A6 without any mission state.

**States:** rest, Log Now expanded (modal shows text input for note + optional photo attach button), submitting (button loading spinner), confirmed.

---

### A6 / B6 — Session Close

**Purpose:** Warm close. No autoplay. No "up next." Session ends.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20, center column.
- 60px gap from top
- Small map preview 320×200, showing the story-world map with the just-completed node lit up (sticker "settling" animation 400ms on first render). Other nodes shown but only 2–3 are lit, rest are locked-state.
- 32px gap
- h1 in Fraunces 600 26pt: "See you next time."
- 12px gap
- Body `--ink-soft`: 
  - After Log Now: "Great — you've added to your Value Journal."
  - After Log Later: "We've saved the mission. You can log it from Parent Mode when it's done."
  - After Skip: "No mission today. Come back for the next story whenever you're ready."
- 40px gap
- No CTA button. Only a small `Button/Ghost` at bottom: "Close"

**Tablet layout:**
Map preview at 540×340, header at 32pt, body at 18pt. Same center-column composition.

**Interaction:** Close → home screen of device / app dismisses. Explicitly no "next story" affordance.

**States:** three variants based on prior mission action (Log Now / Log Later / Skip).

---

### P1 — Parent Mode Dashboard

**Purpose:** Parent's view of the family's rhythm. Behind the gate.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20. Note: everything in Parent Mode uses `--indigo` accents instead of `--terracotta` — this is the visual signal that the parent is behind the gate.
- Top bar: "Parent Mode" in h2 center, `--indigo`. Close X right → back to Today screen.
- 24px gap
- Section: today's value card
  - Tiny label `--ink-mute`: "TODAY"
  - h2 in `--indigo`: "Wisdom — The Crow and the Pitcher"
  - Body: "Two things to ask · One tip · One to avoid"
  - Small chevron right — tapping opens A2 (Parent Card Preview) directly
- 32px gap
- Section: this week's rhythm
  - Label: "THIS WEEK"
  - 7 tiles in a row (small squares 44px each), one per day. States: completed session = filled `--indigo`, today = ring `--indigo`, upcoming = `--paper` fill.
  - Caption below: "3 sessions this week"
- 32px gap
- Section: quick links (list rows, 56px each, chevron right on each):
  - "Value Journal" — subtitle "12 entries across 4 values"
  - "Settings" — subtitle "Reminder, downloads, subscription"

**Tablet layout:**
Same content in a two-column layout: left column today's value card + week rhythm, right column quick links as larger cards.

**Interaction:** Tap today's value → A2. Tap Value Journal → P2. Tap Settings → P4. Close X → A1.

---

### P2 — Value Journal

**Purpose:** Scrapbook timeline of logged missions.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Top bar: back chevron, "Value Journal" in h2, filter icon right (small funnel, 24px)
- 20px gap
- Filter chips row, horizontal scroll: "All" (selected, `--indigo` fill) · "Wisdom" · "Resilience" · "Empathy" · "Honesty" · "Courage" · "Gratitude" · "Patience" · "Fairness"
- 24px gap
- Timeline of `Card/JournalEntry` components, stacked vertically with 16px gap:
  - Entry 1 (most recent): date "Today", mission text (Crow variant A), photo of a child's setup, note "Aarav figured out how to reach the top shelf using a stack of books.", value badge "Wisdom"
  - Entry 2: date "3 days ago", mission text (Empathy example), no photo, note "He noticed his sister was tired and got her a glass of water.", value badge "Empathy"
  - Entry 3: date "5 days ago", mission text (Patience example), photo, no note, value badge "Patience"
  - Entry 4: date "1 week ago", mission text (Wisdom variant B for Monkey story), note "Big feeling at dinner. He took the breaths. He told me later.", value badge "Wisdom"
  - Entries continue below (show 6-8 for design purposes)
- Bottom sticky: caption `--ink-mute`, "12 entries · Export as keepsake" with small chevron

**Tablet layout:**
Filter chips as a left rail column. Timeline in center column, wider entries. Right column reserved for a future keepsake preview or empty on v1.

**Interaction:** Tap any entry → P3. Tap filter chip → filter timeline. Tap export → keepsake flow (out of scope for this brief, generate as a placeholder screen).

**States:** rest, filtered (chip active), empty (if no entries: gentle illustration + "Your first mission will land here.")

---

### P3 — Journal Entry Detail

**Purpose:** Full view of one logged mission.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Top bar: back chevron, share icon right (small, 24px)
- 20px gap
- Date caption `--ink-mute`: "Today · 8:14 PM"
- 8px gap
- Value badge
- 20px gap
- Mission text in prompt token 22pt: full mission text
- 24px gap
- Photo (if present) at full width, aspect 4:3, radius md
- 20px gap
- Section label `--ink-mute`: "WHAT HAPPENED"
- Note in body 16pt `--ink-deep`: parent's note
- 32px gap
- Section: which story this came from
  - Small `Card/Story` in compact variant: illustration thumbnail 80×60 left, title + tradition + value stacked right
  - Tap → opens the story again in Today-screen style

**Tablet layout:**
Two-column: photo + note on left, story reference card on right.

**Interaction:** Back → P2. Share → native share sheet. Story card → A1 for that story.

**States:** rest, no photo variant, no note variant.

---

### P4 — Settings

**Purpose:** Ritual reminder, subscription, downloads, data controls.

**Mobile layout (390×844):**
Background `--cream`, edge padding 20.
- Top bar: back chevron, "Settings" h2
- 24px gap
- Section grouped rows (each row 64px, subtle divider `--ink-mute` at 20% opacity):
  - "Ritual reminder" — right side: toggle + time picker "8:00 PM" if on
  - "Story time preference" — right side: "Bedtime" with chevron
  - Divider 24px gap
  - "Subscription" — right side: "Free plan" with chevron
  - "Offline downloads" — right side: "This week: 3 stories, 45 MB" with chevron
  - Divider 24px
  - "Child profile" — "Aarav, age 6" with chevron
  - "Language" — "English (Hindi coming soon)" with chevron
  - Divider 24px
  - "Privacy & data" — chevron
  - "About Anvaya" — chevron
  - "Sign out" — right side: `--terracotta-deep` text, no chevron

**Tablet layout:**
Same content, centered at 720px column width.

**Interaction:** Each row → its respective sub-screen (out of scope for this brief, placeholder screens acceptable).

---

## 6. Generation instructions for Figma AI

Generate in this order:

1. **Set up tokens (§1) as Figma variables** — colors, type styles, spacing, radii, effects. Every component and screen references these variables, never raw values.
2. **Build components (§2)** as reusable Figma components with variants for all states.
3. **Generate onboarding screens (O1–O5)** in mobile first, then tablet variants.
4. **Generate Story Flow A (A1–A6)** using Crow & Pitcher content from §3.1. For A3, generate 8 frames — one per beat.
5. **Generate Story Flow B (B1–B6)** using Monkey & Crocodile content from §3.2. For B3, generate 8 frames.
6. **Generate Parent Mode screens (P1–P4)**.
7. **Prototype flows:** wire O1→O2→O3→O4→O5→A2→A3(×8)→A4→A5→A6. Same for Story B. Wire A1 Parent Mode icon → P1 → P2 → P3, and P1 → P4.

**For illustration slots throughout:** do not generate final watercolor art. Use rectangular placeholders with radius md and a subtle diagonal cross-hatch or a text label describing the intended image (e.g. "Beat 6: crow spotting a pebble, warm dusk light"). Real illustrations come from the AI image pipeline (documented separately in the PRD §13).

**For copy:** use the exact text in §3 verbatim. Do not paraphrase narration, prompts, missions, or Parent Card content. UI chrome copy (button labels, section headers, empty states) is also exact as specified.

**Naming convention for frames:** `[flow]/[screen]/[form-factor]` e.g. `Onboarding/O1-Welcome/mobile`, `StoryA/A3-Reader-Beat6/tablet`.

---

## 7. Out of scope for this design brief

- Final watercolor illustrations (image pipeline, not Figma)
- Loading states beyond skeleton and shimmer specifications
- Error states beyond form validation
- Payment / subscription upgrade flows (Phase 2)
- Educator dashboard (Phase 3)
- Sub-screens under Settings rows (Language selector, Privacy detail, About)
- Push notification designs
- Onboarding for returning users on new devices

Deliverables at end of Figma AI generation: 18 unique screens × 2 form factors = 36 primary frames, plus 16 story beat frames (8 per story × 2 stories, mobile) and 16 more (tablet) = additional 32 frames. **Total ~68 frames** across the two story flows plus onboarding, Parent Mode, and shared components.

*End of brief.*
