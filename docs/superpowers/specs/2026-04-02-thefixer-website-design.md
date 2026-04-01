# The Fixer Website — Design Specification

**Date:** 2026-04-02
**Domain:** thefixer.in
**Status:** Approved by stakeholder

---

## 1. Overview

A single-page, cinematic scroll-driven website for The Fixer — an AI Agentic & Software Development Consultancy. The site serves as the brand's first impression to enterprise-level clients and must convey competence, exclusivity, and technical mastery at a level that is memorable for days.

**Design Approach:** "The Cinematic Scroll" — one continuous narrative experience where the visitor scrolls through a cosmic journey. No page transitions, no breaks in immersion. The entire site is a film that unfolds as you move through it.

**Target Audience:** Enterprise decision-makers willing to pay thousands per week for elite AI and software consultancy. These are people who have seen everything — the site must exceed their expectations.

**Brand Values:**
- Confidence without arrogance
- Exclusivity through quality, not gatekeeping
- Precision matching — "you don't hire a world-class mathematician for basic calculations"
- Discretion — clients value privacy, so does The Fixer

---

## 2. Visual Identity

### Color System — "Deep Cosmos"

| Token | Role | Value (approximate) |
|-------|------|---------------------|
| `--cosmos-void` | Primary background | Deep navy / near-black (#0A0E1A) |
| `--cosmos-deep` | Secondary background | Rich indigo (#111833) |
| `--cosmos-nebula` | Accent background | Dark blue-purple (#1A1F4D) |
| `--celestial-white` | Primary text | Soft white (#E8ECF5) |
| `--celestial-dim` | Secondary text | Muted blue-white (#8B95B0) |
| `--ethereal-blue` | Accent / interactive | Luminous blue (#4A7BF7) |
| `--ethereal-glow` | Particle glow / highlights | Soft cyan-blue (#6BB8FF) |
| `--gold-warm` | Premium accent / CTA | Warm gold (#D4A853) |
| `--gold-bright` | Logo pulse / emphasis | Bright gold (#F0C45A) |

All colors specified in OKLCH for perceptual uniformity and smooth gradient transitions. Hex values above are approximations for reference.

### Typography

Custom font pairing to be selected during implementation. Requirements:
- **Display / Headlines:** Geometric or neo-grotesque sans-serif. Must feel futuristic but readable. Candidates: Inter, Satoshi, General Sans, or a premium option like Neue Montreal.
- **Body:** Clean, highly legible sans-serif optimized for screen. Must pair with display font without competing.
- **Monospace (code/technical moments):** JetBrains Mono or similar.
- No serif fonts. The brand is forward-looking.

### Logo / Brand Mark

Designed from scratch as part of this project. The logo must be:
- Geometrically clean enough to be reconstructed from particles
- Recognizable at small sizes (favicon, mobile nav)
- Meaningful — the mark should suggest "fixing," "precision," or "convergence"
- SVG-based, with paths extractable as 3D point cloud targets for the hero animation

---

## 3. Brand Voice

### Tone Principles

| Principle | Meaning | Example |
|-----------|---------|---------|
| Confident | States altitude, doesn't compare | "We build systems that actually think." |
| Client-focused | Acknowledges the visitor's reality | "Complex problems don't need more people. They need the right ones." |
| Calm | Never urgent, never desperate | "It starts with listening." |
| Non-arrogant | Never diminishes the visitor or their past teams | Describes our standard, not their shortcomings |

### Voice Usage

- **C voice (second person, client-focused):** Used for emotional connection points — hero tagline, section openings, the gateway invitation. Makes the visitor feel seen and understood.
- **A voice (first person plural, authoritative):** Used for capability statements — service descriptions, process descriptions, team section. Communicates what The Fixer is and does.
- Voices blend naturally. A section may open with C ("You've exhausted every option.") and close with A ("We arrive.").

---

## 4. Site Architecture — The Cinematic Scroll

The entire site is a single page with 8 sequential sections connected by particle-based transitions. The scroll itself is the navigation. A particle river flows between sections as connective tissue, making the experience feel like a continuous film rather than a series of slides.

### Section 1: "Cosmic Emergence" — Hero

**Purpose:** Jaw-drop. Establish the brand in the visitor's memory within 5 seconds.

**Experience:**
1. Visitor lands on pitch-black void. Stillness.
2. Subtle drift of particles begins — hundreds of thousands of luminous points scattered in deep space.
3. Soft ethereal blue light bleeds in from edges.
4. Particles begin moving with gravitational purpose — swirling, condensing, accelerating.
5. Visitor's cursor (desktop) or device gyroscope (mobile) subtly influences the particle field.
6. Convergence: particles stream from all directions, assembling into The Fixer's logo over 3-4 seconds.
7. Logo pulses once with warm gold light, then settles into calm breathing glow.
8. Tagline fades in below: C-voice line (e.g., "You've exhausted every option. That's why you're here.")
9. Minimal scroll indicator pulses at bottom.

**Technical:**
- Three.js r183 WebGPU renderer (WebGL2 auto-fallback)
- GPU-computed particle system: 100K-500K particles, adaptive to device capability
- Custom vertex + fragment shaders for particle glow and trails
- Desktop: mouse interaction via raycasting into particle field
- Mobile: gyroscope/accelerometer for particle field parallax, touch-hold for gravitational well, touch-drag for cosmic wake, pinch for depth zoom
- Gyroscope fallback: gentle automatic drift + touch-only interaction
- iOS DeviceOrientationEvent permission triggered on first touch
- Logo geometry: SVG paths → 3D point cloud target positions
- GSAP timeline orchestrates emergence sequence
- Frame-rate monitor: dynamically adjusts particle count to maintain 60fps

### Section 2: "Descent Into Purpose" — Scroll Transition

**Purpose:** Transform the hero into the journey. Bridge between impact and content.

**Experience:**
1. As visitor scrolls, the assembled logo breathes apart — dissolving back into particles.
2. Particles don't scatter randomly — they reorganize into a flowing river guiding downward.
3. Camera perspective begins a slow descent through space.
4. Color temperature shifts subtly from cold deep-space blue to warmer tones.
5. Stars streak past in periphery (parallax depth layers) creating velocity without disorientation.

**Technical:**
- GSAP ScrollTrigger drives camera movement and particle reorganization
- Lenis provides smooth scroll mechanics
- Parallax depth achieved through multiple particle layers at different z-depths
- Color temperature shift via shader uniform interpolation keyed to scroll position

### Section 3: "What We Do" — Services

**Purpose:** Communicate the three core capabilities with precision and confidence.

**Experience:**
1. Particle river slows and pools into a calm nebula formation.
2. Content materializes — not snapping in, but stabilizing like holograms.
3. Three pillars appear sequentially, each preceded by a particle formation:
   - **AI Agentic Solutions** — particles form neural network constellation
   - **Software Architecture & Systems Design** — particles form geometric structural forms
   - **Technical Rescue & Recovery** — particles form diagnostic/targeting pattern
4. Each pillar has 2-3 lines of sharp A-voice copy (confident, not arrogant).
5. Scrolling past each pillar dissolves its formation back into the river.

**Copy direction (final copy to be refined during implementation):**
- AI: States our standard for what "intelligence" means — not automation dressed up
- Systems: Conveys designing for what's coming, not patching what's here
- Rescue: Positions us as the team that arrives when the problem demands it

### Section 4: "How We Work" — The Selective Process

**Purpose:** Communicate exclusivity through process, not proclamation. The selectivity is implied, never stated.

**Experience:**
1. Particle river narrows and focuses — environment tightens, becomes intimate.
2. Fewer particles, but brighter and more detailed. Feeling shifts from vast cosmos to precision optics.
3. Four stages materialize sequentially on scroll:

**Stage 1 — "The Conversation"**
- Particles form subtle waveform pattern (calm audio signal)
- Copy: "It starts with listening. We understand the problem before we ever discuss solutions."
- Implies the psychologist's role without naming it

**Stage 2 — "The Assessment"**
- Particles shift into diagnostic grid/matrix
- Copy: "Not every problem needs us. We're honest about that. When it does, we're precise about why."
- The "world-class mathematician" philosophy stated with grace

**Stage 3 — "The Engagement"**
- Particles converge into tight unified constellation
- Copy: "Small team. Full focus. Your problem becomes our only problem until it isn't one anymore."
- Communicates exclusivity without naming numbers

**Stage 4 — "The Handoff"**
- Particles expand outward like controlled supernova
- Copy: "We don't build dependencies. We build capabilities. When we leave, you're stronger than when we arrived."
- No lock-in. Independence is the deliverable.

### Section 5: "Proof" — Case Studies

**Purpose:** Demonstrate track record. Discretion itself signals caliber.

**Experience:**
1. Particle field restructures into a constellation map — nodes connected by subtle streams.
2. Each node represents a project.
3. Scrolling activates nodes one at a time — glow warm gold, draw particle streams, expand into case study card.

**Case study card format:**
- The problem (one line)
- What we did (one line)
- The outcome (one measurable result)
- Abstract particle visualization representing the domain (no screenshots, no client logos)

**Content strategy:**
- Real case studies described abstractly to honor client discretion
- Example: "A fintech platform processing $XXM daily needed their settlement engine rebuilt in 3 weeks"
- Closing line: "Our clients value discretion. So do we."
- New case studies added as constellation nodes over time

**Data architecture:**
- Case studies stored as structured content files (JSON or MDX)
- Animation system reads from content data
- New entries require zero animation code changes

### Section 6: "The Unit" — Team

**Purpose:** Beam confidence into the visitor without revealing identities, names, roles, or tech stacks. The depth is felt, not catalogued.

**Experience:**
1. Constellation contracts, particles pulling inward.
2. Reforms into a single unified organism — a murmuration. Thousands of particles acting as one intelligence.
3. The organism breathes, shifts, holds together. Alive. Inseparable.
4. No names. No roles. No headshots. No tech stacks.
5. Three to four lines fade in sequentially:
   - "Engineers who think in systems."
   - "Minds that see what others overlook."
   - "A team built on conviction, not contracts."
   - "You don't need to know who we are. You need to know we don't fail."
6. The visitor's takeaway is a feeling: these people are different.

**Technical:**
- Murmuration algorithm: Boids flocking simulation (alignment, cohesion, separation) on GPU
- The organism reacts subtly to cursor/gyroscope — acknowledges the visitor without breaking formation
- Particle density and movement speed tuned for organic, living feel

### Section 7: "The Gateway" — AI-Powered Contact

**Purpose:** The destination of the entire journey. Where the visitor transitions from observer to participant. Also a live demonstration of The Fixer's AI capabilities.

**Experience:**
1. Organism expands and thins — particles form vast calm field.
2. At center, a luminous gateway forms — warm-gold aperture of converging particle streams.
3. Gateway pulses gently. Above it: "Ready to talk?"
4. Visitor clicks/taps gateway.
5. 3D environment smoothly transitions — particle field dims to ambient, conversational interface emerges from center.
6. The interface IS the page now — not a widget, not a sidebar.

**AI Interaction — Two Modes:**

**Mode 1 — The Gatekeeper (default):**
- Warm, intelligent conversation (not a form)
- Asks about: what brought them here, nature of the problem, what they've tried, timeline/urgency
- Listens, acknowledges, asks follow-ups showing genuine understanding
- Outcome A: "This sounds like something we'd want to understand deeper. We'll be in touch within 48 hours." → qualified lead, team notified
- Outcome B: "Based on what you've described, we might not be the right fit — but here's what we'd suggest." → graceful redirect with helpful guidance

**Mode 2 — The Diagnostic (toggle):**
- Small elegant toggle: "Or describe your technical challenge"
- Visitor describes a technical problem
- AI returns structured preliminary analysis: architecture observations, unconsidered questions, potential failure points
- Not a solution — a demonstration of how The Fixer thinks about problems
- Enough to make them think: "These people already understand my problem better than my current team"

**Mode switching:** Preserves full conversation history. AI acknowledges the shift naturally.

**AI Backend Architecture:**
- Model: Claude Opus 4.6 via Azure AI Foundry (East US 2 or Sweden Central)
- System prompt: carefully crafted to embody The Fixer's voice, knowledge domain, and qualification criteria
- Session management: single session per visitor, mode flag in context
- Logging: every message (both directions) timestamped and stored
- Auto-report: after visitor leaves (or inactivity timeout), Opus generates structured summary — visitor intent, problem description, qualification assessment, recommended next steps, confidence rating
- Storage: Azure Cosmos DB free tier (1000 RU/s, 25GB — sufficient for early-stage)
- Admin access: secure dashboard/page for reviewing conversation logs + Opus summaries
- Fallback: "Prefer email? hello@thefixer.in"

### Section 8: "The Coda" — Footer

**Purpose:** Graceful ending that doesn't feel like an ending. The cosmos continues.

**Experience:**
1. If visitor scrolls past gateway (or after closing AI conversation), particle field returns.
2. Warmer than before — more gold in particle tones.
3. Feeling: the universe remembers you were here.
4. Minimal footer fades in:
   - The Fixer logo mark (small, calm)
   - thefixer.in
   - hello@thefixer.in
   - "The right problems find us. So did you."
5. Particles continue drifting infinitely. Page never feels like it ends.

---

## 5. Mobile Experience

**Mandate:** Full experience on all devices. No compromises. No "visit on desktop" messages.

### Interaction Model

| Input | Desktop | Mobile |
|-------|---------|--------|
| Ambient interaction | Mouse position influences particle field | Gyroscope/accelerometer tilts the cosmos |
| Direct interaction | Hover effects, click | Touch-hold (gravitational well), touch-drag (cosmic wake), pinch (depth zoom) |
| Scroll | Mouse wheel / trackpad | Touch scroll |
| AI chat | Keyboard + click | Mobile keyboard + tap |

### Gyroscope Fallback
Devices without gyroscope (rare in 2026) fall back to gentle automatic drift animation with touch-only interaction. No broken or static states ever.

### iOS Permission Handling
`DeviceOrientationEvent` requires one-time user permission on iOS. First touch on hero triggers the permission request, so gyroscope is active before the emergence animation plays.

### Performance Adaptation
- GPU capability detection (not device-type sniffing) determines particle counts and shader complexity
- Frame-rate monitoring dynamically adjusts: if FPS drops below 55, reduce particle count and shader passes
- Mobile baseline: 50K-100K particles (flagship phones handle this easily)
- Desktop baseline: 200K-500K particles
- All thresholds are measured, not assumed — the engine adapts in real-time

---

## 6. Performance Strategy

### Core Principles
1. **GPU acceleration only:** Animate only `transform` and `opacity` for DOM elements. All particle/3D work runs on GPU via WebGPU/WebGL2.
2. **Progressive loading:** Hero 3D scene loads immediately. Subsequent section assets lazy-loaded as user scrolls within range.
3. **Code splitting:** Three.js, shaders, GSAP, and heavy animation code in separate dynamic chunks. Main bundle stays lean.
4. **Adaptive quality:** Real-time FPS monitoring adjusts particle counts, shader complexity, and post-processing passes. The visitor never sees jank — the engine silently adapts.
5. **React Compiler:** Next.js 16's built-in React Compiler handles automatic memoization — critical for maintaining 60fps with heavy 3D alongside React UI.

### Loading Sequence
1. Initial HTML + critical CSS + minimal JS (< 100KB) — first paint in < 1s
2. Hero 3D scene initializes (Three.js + shaders + particle system)
3. Emergence animation plays while rest of site lazy-loads below the fold
4. Section assets load progressively as scroll position approaches them
5. AI chat module loads only when gateway section enters viewport

### Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3s
- Cumulative Layout Shift: < 0.1
- Frame rate: sustained 60fps during all animations
- Lighthouse Performance: > 85 (accounting for heavy 3D which Lighthouse penalizes)

---

## 7. Tech Stack (Verified April 2, 2026)

### Core Framework
| Package | Version | Purpose |
|---------|---------|---------|
| Next.js | 16.2.2 | Full-stack React framework, Turbopack, React Compiler |
| React | 19.2.4 | UI library with View Transitions, Activity |
| TypeScript | 6.0.2 | Type safety, strict by default |
| Tailwind CSS | 4.2.2 | Utility-first styling, OKLCH colors, Rust engine |

### 3D & Visual Effects
| Package | Version | Purpose |
|---------|---------|---------|
| Three.js | r183 (0.183.2) | WebGPU/WebGL2 3D engine |
| @react-three/fiber | 9.5.0 | React bindings for Three.js |
| @react-three/drei | 10.7.7 | Helper components for R3F |
| @react-three/postprocessing | 3.0.4 | Post-processing effects (bloom, glow) |
| Custom GLSL/TSL shaders | — | Bespoke particle effects, noise, distortion |

### Animation & Scroll
| Package | Version | Purpose |
|---------|---------|---------|
| GSAP | 3.14.2 | Scroll animations, timelines, SplitText, MorphSVG |
| Motion | 12.38.0 | React UI animations, layout transitions, spring physics |
| Lenis | 1.3.21 | Smooth scroll mechanics |
| tsParticles | 3.9.1 | Lightweight 2D particle backgrounds (where appropriate) |

### AI Backend
| Service | Details | Purpose |
|---------|---------|---------|
| Azure AI Foundry | Claude Opus 4.6 (preview) | Conversational AI for Gatekeeper + Diagnostic |
| Azure Cosmos DB | Free tier (1000 RU/s, 25GB) | Conversation logs, visitor reports |
| Azure Functions | Consumption plan (1M free/month) | API proxy, form handling, notification triggers |

### Hosting & Deployment
| Service | Details | Purpose |
|---------|---------|---------|
| AWS Amplify Gen 2 | v6.16.3 | Hosting, SSR, CI/CD, branch deployments |
| Custom domain | thefixer.in | Connected via Amplify |

---

## 8. Data Architecture

### Case Studies
Structured content files (MDX or JSON) in the repository. Each case study contains:
```
{
  "id": "unique-id",
  "problem": "One-line problem statement",
  "solution": "One-line what we did",
  "outcome": "One measurable result",
  "domain": "fintech | healthtech | infrastructure | ai | etc",
  "particleVisualization": "neural | geometric | diagnostic | organic"
}
```
Adding a new case study = adding a file. Zero animation code changes required.

### AI Conversation Logs
Stored in Azure Cosmos DB with the following schema:
```
{
  "sessionId": "uuid",
  "visitorId": "anonymous-uuid",
  "startedAt": "ISO timestamp",
  "endedAt": "ISO timestamp",
  "mode": "gatekeeper | diagnostic | both",
  "messages": [
    {
      "role": "visitor | assistant",
      "content": "message text",
      "timestamp": "ISO timestamp",
      "mode": "gatekeeper | diagnostic"
    }
  ],
  "report": {
    "summary": "Opus-generated summary",
    "visitorIntent": "...",
    "problemDescription": "...",
    "qualificationAssessment": "qualified | not-a-fit | unclear",
    "recommendedNextSteps": "...",
    "confidenceRating": 0.0-1.0,
    "generatedAt": "ISO timestamp"
  }
}
```

---

## 9. Admin Dashboard

A private, authenticated page (not publicly accessible) for The Fixer team to:
- View all conversation logs chronologically
- Read Opus-generated summary reports for each visitor
- Filter by qualification status (qualified / not-a-fit / unclear)
- See conversation transcripts in full
- Basic analytics: conversations per day, qualification rate, average conversation length

Authentication: simple but secure — could be a password-protected route or OAuth via Azure AD. To be determined during implementation based on team preference.

---

## 10. Accessibility

Despite heavy visual effects, the site must be accessible:
- All text content readable without animations (progressive enhancement)
- `prefers-reduced-motion`: disables particle animations, provides static alternatives with the same content
- Keyboard navigation works through all sections
- AI chat interface fully accessible via keyboard and screen reader
- Color contrast meets WCAG AA for all text against backgrounds
- Semantic HTML structure underneath the visual layer

---

## 11. Out of Scope (For Now)

- Blog / Insights section (to be added later)
- Interactive portfolio narrator AI (future enhancement)
- Multi-language support (despite Azure Translator availability)
- CMS integration (content managed via code files initially)
- Analytics beyond the admin dashboard (Google Analytics or similar can be added post-launch)
