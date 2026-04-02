# Premium Website Tech Stack Research (April 2026)

> Comprehensive research on the best tools and libraries for building high-end, futuristic websites.
> Last updated: 2026-04-02

---

## Table of Contents
1. [Particle Systems](#1-particle-systems)
2. [3D Graphics on Web](#2-3d-graphics-on-web)
3. [Premium Animations](#3-premium-animations)
4. [Scroll-Based Storytelling](#4-scroll-based-storytelling)
5. [Shaders and Visual Effects](#5-shaders-and-visual-effects)
6. [Frameworks and Styling](#6-frameworks-and-styling)
7. [Performance Optimization](#7-performance-optimization)
8. [What Top-Tier Sites Use](#8-what-top-tier-sites-use)
9. [Recommended Stack](#9-recommended-stack)
12. [GPU Particle System with Three.js r183 WebGPU](#12-gpu-particle-system-with-threejs-r183-webgpu)

---

## 1. Particle Systems

### tsParticles (Winner - The Standard)
- **Status:** Actively maintained (copyright 2026), 212M+ monthly CDN requests
- **Replaces:** particles.js (abandoned ~5 years ago)
- **Key strengths:** TypeScript, FPS limiter (60fps default), backward-compatible with particles.js config, ready-made presets (confetti, fireworks, etc.)
- **Framework support:** React, Vue 2/3, Angular, Svelte, Solid, Preact, Web Components
- **Best for:** 2D canvas-based particle backgrounds, decorative effects, lightweight particle animations

### Three.js Particle Systems (For 3D / Heavy Effects)
- **Best for:** Complex 3D particle effects, GPU-accelerated particle simulations
- **With WebGPU:** 100,000-2,000,000 particles at 60fps (vs 10,000-500,000 with WebGL)
- **Compute shaders:** Entire particle simulation runs on GPU, positions never leave GPU memory
- **Trade-off:** Steeper learning curve, larger bundle size

### WebGPU Native Particle Systems
- **Performance:** 150x improvement over CPU-based WebGL particle systems
- **Real-world:** Million-particle installation shipped at Expo 2025 Osaka
- **Browser support:** ~95% of users have WebGPU-capable browsers (Safari 26 was last holdout)
- **Recommendation:** Use Three.js WebGPURenderer for particle systems - automatic WebGL 2 fallback

---

## 2. 3D Graphics on Web

### Three.js (The King - r171+)
- **Latest milestone:** r171 - WebGPU production-ready with zero-config imports
- **WebGPU:** `import * as THREE from 'three/webgpu'` - automatic WebGL 2 fallback
- **TSL (Three Shader Language):** Write shaders in JS-like syntax, auto-transpiles to GLSL/WGSL
- **Performance:** Up to 10x improvement in draw-call-heavy scenarios with WebGPU
- **Ecosystem:** Foundation of 95% of web 3D projects

### React Three Fiber (R3F) - v9.5.0
- **Pairs with:** React 19 (@react-three/fiber@9)
- **WebGPU support:** Via `gl` prop factory pattern with WebGPURenderer
- **Key packages:** @react-three/drei@10 (helpers), @react-three/postprocessing
- **Advantage:** Three.js features available instantly without R3F updates (dynamic JSX mapping)
- **Compute shaders:** Unlock 10-100x performance gains for particle systems and physics

### Spline (No-Code 3D)
- **2026 pricing:** Free tier (with logo), Pro $20/mo
- **Engine:** Now uses WebGPU (3x faster than WebGL), works on mobile browsers
- **AI features:** Spline AI generates 3D from text prompts
- **Integration:** @splinetool/react-spline for React/Next.js, experimental R3F export
- **Best for:** Quick prototypes, marketing sites, designer-led teams
- **Limitation:** Less customization than raw Three.js, paid for commercial use

### Babylon.js 9.0 (March 2026)
- **Latest:** v9.0 - Clustered lighting, Node Particle Editor, Frame Graph system, geospatial
- **WebGPU:** Full WGSL shaders since v8.0, 20-40% performance improvements
- **Strength:** Enterprise-grade, backed by Microsoft, best for complex 3D applications/games
- **vs Three.js for websites:** Overkill for marketing sites, better for full 3D apps

### Recommendation for Premium Websites
Three.js (via React Three Fiber) for code-first projects. Spline for designer-led quick iterations. Babylon.js only if building a full 3D application, not a marketing website.

---

## 3. Premium Animations

### GSAP 3.14 (The Industry Standard)
- **MAJOR NEWS:** Now 100% FREE including ALL bonus plugins (SplitText, MorphSVG, DrawSVG, ScrollSmoother, etc.) - thanks to Webflow acquisition
- **ScrollTrigger:** Scroll-scrubbing animations tied to scroll position
- **Performance:** Up to 20x faster than jQuery, works around browser inconsistencies
- **Ecosystem:** 12M+ sites, framework-agnostic
- **Key plugins (now free):** ScrollTrigger, SplitText, MorphSVG, DrawSVG, MotionPath, Flip, ScrollSmoother
- **Integration:** Works with Three.js via gsap.context() for React cleanup

### Motion v12 (formerly Framer Motion)
- **Rebranding:** framer-motion -> motion (import from `motion/react`)
- **Stats:** 30.7k GitHub stars, 3.6M weekly downloads
- **New in v12:** oklch/oklab color support, hardware-accelerated scroll animations, layoutAnchor, axis-locked layout animations
- **Engine:** Hybrid - JavaScript power + native browser APIs for 120fps GPU-accelerated animations
- **Bundle:** ~32KB (larger than alternatives but most feature-rich for React)
- **Best for:** React UI animations, layout animations, gesture-driven interfaces, spring physics

### Lottie (lottie-web)
- **Ecosystem in 2026:** LottieFiles, Lottie Creator (AI-powered), dotLottie format
- **Best for:** Icon animations, micro-interactions, After Effects-designed animations
- **New:** AI-generated state machines, export to dotLottie/video/GIF, CDN sharing
- **Limitation:** Not for complex interactive or scroll-driven animations

### Theatre.js
- **Best for:** Visual animation editing, designer-developer collaboration
- **Strength:** Visual timeline editor for keyframe animations, works with Three.js/R3F
- **Status:** Active but niche - no major version updates found in 2025-2026

### Recommendation
GSAP for scroll-based animations, complex timelines, and Three.js integration. Motion for React UI animations, layout transitions, and gesture interactions. Lottie for lightweight micro-interactions. Use them together - they complement each other.

---

## 4. Scroll-Based Storytelling

### Lenis (The Winner - ~2.13KB)
- **Philosophy:** Smooth scrolling WITHOUT hijacking native scroll
- **Key advantage:** Works with position:sticky, Intersection Observer, all native CSS
- **Real browser scrollbar:** Accessible, performant, familiar
- **Integration:** Works perfectly with GSAP ScrollTrigger

### Locomotive Scroll v5 (~9.4KB)
- **MAJOR CHANGE:** Now built ON TOP of Lenis (uses Lenis 1.3.17 internally)
- **Adds:** Built-in parallax effects, viewport detection, scroll-based animations
- **TypeScript first, dual Intersection Observer strategy**
- **Best for:** Full scroll animation toolkit when you want more than just smooth scrolling

### GSAP ScrollTrigger (Part of GSAP - now FREE)
- **Best for:** Scroll-scrubbed animations, pinning sections, timeline-based scroll narratives
- **Integration:** Pairs perfectly with Lenis for smooth + animated scrolling
- **Advantage:** Most powerful scroll animation control available

### Recommended Combination
Lenis (smooth scrolling) + GSAP ScrollTrigger (scroll-triggered animations). This is the industry standard combination for premium scroll-based storytelling in 2026.

---

## 5. Shaders and Visual Effects

### Shaders (shaders.com) - NEW in 2026
- **Status:** Public beta, already in production projects
- **Approach:** WebGPU-first shader effects as composable components
- **Frameworks:** React, Vue, Svelte, Solid, vanilla JS
- **Value:** No GLSL/WGSL writing needed - use GPU effects like UI components

### shadcn Shaders Collection
- **GPU-accelerated components for React**
- **TypeScript-first, zero video assets (pure math), SSR-compatible**
- **Works with Next.js App Router and Server Components**

### react-shaders (by Rysana)
- **GLSL/WebGL shaders in React with TypeScript**
- **Supports Shadertoy syntax - copy/paste from Shadertoy directly**
- **Built-in uniforms: time, resolution, mouse, gyroscope**

### Three.js + postprocessing library
- **Best for:** Full 3D post-processing pipelines (bloom, blur, ASCII, dithering)
- **Standard:** Used alongside Three.js/R3F for effects like Efecto (Jan 2026)

### VFX-JS (New in 2025)
- **Automatic WebGL texture loading from DOM elements**
- **Easy shader effects on any HTML element**
- **Plugin system for sharing effects via npm (planned)**

### TSL (Three Shader Language)
- **Part of Three.js WebGPU support**
- **Write shaders in JavaScript-like syntax**
- **Auto-transpiles to GLSL or WGSL depending on browser**

---

## 6. Frameworks and Styling

### Next.js 15 (Full-Stack React)
- **Best for:** Interactive web applications, heavy client-side interactivity, full-stack features
- **Features:** React Server Components, Server Actions, Partial Pre-rendering (PPR), Turbopack (Rust)
- **Performance:** FCP 1-1.5s, Lighthouse ~85-95
- **Hosting:** Requires server compute (SSR), scales with traffic
- **3D integration:** Canvas sits behind DOM elements, works with R3F/Three.js

### Astro 5 (Content-First)
- **Best for:** Content-heavy sites, landing pages, portfolios, blogs
- **Performance:** FCP ~0.5s, Lighthouse 95-100, ships zero JS by default
- **Features:** Content Layer API, Server Islands, "Islands Architecture"
- **Build speed:** ~3x faster than Next.js (18s vs 52s for 1000 pages)
- **JS payload:** Zero JS possible for pure content (Next.js needs 40-50KB minimum runtime)
- **Hosting:** Static = cheap, 50-80% cheaper than Next.js with SSR

### Tailwind CSS v4 (Released)
- **Engine:** Rust core (Lightning CSS) - 5x faster full builds, 100x faster incremental
- **Config:** CSS-first with @theme directive (replaces tailwind.config.js)
- **Modern CSS:** Cascade layers, @property, color-mix(), OKLCH color palette
- **Setup:** Single line: `@import "tailwindcss"` - zero config
- **v4.2.0 (Feb 2026):** New colors (mauve, olive, mist, taupe), webpack plugin, logical properties
- **Breaking:** bg-linear-to-* replaces bg-gradient-to-*, JS plugin API deprecated for CSS @plugin

### Framework Decision
- **For a premium interactive website with 3D/animations:** Next.js 15 (needs React for R3F, Motion, etc.)
- **For a content-heavy portfolio/marketing site:** Astro 5 (better performance, cheaper hosting)
- **Hybrid approach:** Astro 5 with React islands for interactive 3D sections

---

## 7. Performance Optimization

### GPU Acceleration
- Animate ONLY `transform` and `opacity` (avoid width, top, margin, etc.)
- Use `will-change` CSS property sparingly for GPU compositing
- Hardware-accelerated animations remain smooth regardless of main thread load
- Motion library: treat acceleration as progressive enhancement

### Lazy Loading & Code Splitting
- Lazy-load offscreen 3D scenes and heavy animations
- Code-split Three.js and shader code into dynamic imports
- Next.js dynamic() imports for heavy components
- Implement intelligent preloading of assets needed imminently

### Progressive Enhancement
- Build solid baseline first, enhance for capable devices
- Use `prefers-reduced-motion` media query for accessibility
- Simpler transitions on mobile, full effects on desktop
- WebGPU with automatic WebGL 2 fallback

### 3D-Specific Optimizations
- Low-poly models where possible
- Bake lighting to avoid real-time shadow calculations
- Use instanced meshes for repeated objects
- Particle pooling to prevent GC pauses
- Keep particle data GPU-resident
- Compress textures (KTX2/Basis Universal)

### Animation Performance
- Stagger animation sequences instead of triggering all at once
- Use GSAP gsap.context() for React cleanup (prevents tween stacking)
- Offload heavy computations to Web Workers
- Break long tasks via requestIdleCallback
- Profile on target devices - mobile is 10x more constrained

### Benchmarks to Target
- 60fps minimum (120fps on capable displays)
- LCP < 2.5s, FID < 100ms, CLS < 0.1 (Core Web Vitals)
- 16ms frame budget for animations
- Mobile: cap particles at 10,000-50,000

---

## 8. What Top-Tier Sites Use

### Linear.app
- **Stack:** React/Next.js, TypeScript, Tailwind CSS
- **Animations:** Framer Motion (now Motion), CSS animations, smooth gradients
- **Approach:** Polished micro-interactions, signature gradient effects

### Vercel.com
- **Stack:** Next.js, React, Tailwind CSS, Postgres, Payload CMS
- **Animations:** Ray-marching (WebGL/3D), Framer Motion, custom React animations
- **Techniques:** ISR, PPR, ferrofluid-inspired 3D visuals, direction-aware navigation

### Stripe.com
- **Stack:** React, JavaScript (Ruby/Python/Go backend)
- **Animations:** Web Animations API (WAAPI), requestAnimationFrame, CSS transitions, custom shaders
- **Philosophy:** NO third-party animation libraries for core effects, custom-built for maximum performance
- **Key insight:** Keep main thread unburdened, move work off UI thread for 60/120fps

### Apple.com
- **Stack:** React 18.2, HTML5, CSS3, JavaScript
- **Animations:** Canvas image sequences on scroll, scroll-triggered animations, WebGL, CSS transitions
- **Signature technique:** Pre-loaded image frames drawn to <canvas> element, synced to scroll position
- **Philosophy:** Heavy use of canvas to hide implementation complexity

### Common Patterns Across All Four
1. React-based frontend
2. Custom animation solutions (not just dropping in a library)
3. Scroll-driven storytelling
4. Canvas/WebGL for hero sections
5. CSS for micro-interactions
6. Performance-first approach (no jank, ever)

---

## 9. Recommended Stack (The "Future" Stack)

### Core Framework
| Tool | Version | Role |
|------|---------|------|
| **Next.js** | 15+ | Framework (SSR, RSC, PPR) |
| **React** | 19+ | UI library |
| **Tailwind CSS** | v4.2+ | Styling (Rust engine, CSS-first config) |
| **TypeScript** | 5.x | Type safety |

### 3D & Visual Effects
| Tool | Version | Role |
|------|---------|------|
| **Three.js** | r171+ | 3D rendering (WebGPU + WebGL fallback) |
| **React Three Fiber** | v9.5+ | React wrapper for Three.js |
| **@react-three/drei** | v10+ | Three.js helpers |
| **postprocessing** | latest | Post-processing effects (bloom, etc.) |

### Animation
| Tool | Version | Role |
|------|---------|------|
| **GSAP** | 3.14+ | Scroll animations, timelines, complex orchestration |
| **ScrollTrigger** | (GSAP plugin) | Scroll-triggered animation control |
| **Motion** | v12+ | React UI animations, layout transitions, gestures |
| **Lenis** | latest | Smooth scrolling (native, not hijacked) |

### Shaders & Effects
| Tool | Version | Role |
|------|---------|------|
| **TSL** | (Three.js built-in) | JS-like shader authoring |
| **Shaders** | beta | Composable shader components (if needed) |
| **GLSL/WGSL** | - | Custom shader effects |

### Optional Enhancements
| Tool | Role |
|------|------|
| **Lottie** | Micro-interaction animations (icons, loaders) |
| **Spline** | Quick 3D prototyping / designer handoff |
| **Theatre.js** | Visual animation timeline editing |
| **tsParticles** | Lightweight 2D particle backgrounds |

---

## Key Takeaways

1. **WebGPU is production-ready** (95% browser coverage) - use it via Three.js with automatic fallback
2. **GSAP is now 100% free** - no reason not to use all plugins including SplitText and ScrollSmoother
3. **Lenis + GSAP ScrollTrigger** is the standard combo for scroll-based experiences
4. **Motion (formerly Framer Motion) v12** is the React animation standard
5. **Tailwind v4** is a major upgrade with Rust engine and CSS-first config
6. **Three.js via R3F** is the standard for 3D on React websites
7. **Progressive enhancement is mandatory** - build for all devices, enhance for powerful ones
8. **The best sites (Stripe, Apple) build custom** - libraries are starting points, not endings

---

## 10. Azure Services Assessment for Premium Consultancy Website

> Researched: 2026-04-02
> Scope: What Azure can and cannot contribute to a visually stunning, high-end consultancy website

---

### 10.1 Azure Static Web Apps - HOSTING (RECOMMENDED)

**What it is:** Hosting for static frontends (React, Next.js, etc.) with integrated serverless API backend via Azure Functions.

| Feature | Free Tier | Standard Tier ($9/month) |
|---------|-----------|--------------------------|
| Bandwidth | 100 GB/month | 100 GB/month (overage $0.20/GB) |
| Storage per env | 250 MB | 500 MB |
| Max total storage | 500 MB | 2 GB |
| Custom domains | 2 | 5 |
| Staging environments | 3 | 10 |
| SSL certificate | Included | Included |
| Global CDN | Included | Included |
| Authentication | Entra ID / GitHub | Custom providers |
| API (Azure Functions) | Included | Bring-your-own Functions app |
| SLA | None | Yes |
| Private endpoints | No | Yes (VNet integration) |
| Enterprise-grade edge | No | Add-on: $17.52/month |

**Critical warning (Free tier):** If bandwidth exceeds 100 GB, the site goes OFFLINE until the billing cycle resets. No overage billing -- just an outage.

**Critical warning (Service health):** Some community concern about service stagnation -- limited GitHub repo updates in 2025, features stuck in preview for years, Dedicated tier ($99/mo) retired Oct 2025.

**Verdict:** Standard tier at $9/month is the realistic production choice. Free tier works for development/staging only. Built-in global CDN means you do NOT need Azure Front Door for basic performance.

**Sources:**
- [Azure Static Web Apps Pricing](https://azure.microsoft.com/en-us/pricing/details/app-service/static/)
- [Hosting Plans Documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/plans)

---

### 10.2 Azure OpenAI Service - AI CHATBOT (VIABLE, WATCH COSTS)

**What it is:** Managed access to OpenAI models (GPT-4o, GPT-5 series) hosted on Azure infrastructure with enterprise security and compliance.

**No free tier.** Relies on Azure $200 credit or pay-as-you-go.

| Model | Input (per 1M tokens) | Output (per 1M tokens) | Best Use Case |
|-------|----------------------|------------------------|---------------|
| GPT-5-nano | $0.05 | $0.40 | Simple FAQ, classification |
| GPT-4o mini | $0.15 | $0.60 | Budget-friendly chatbots |
| GPT-4o | $5.00 | $15.00 | General purpose, complex reasoning |
| GPT-5 Global | $1.25 | $10.00 | Advanced reasoning |

**Realistic cost for a consultancy chatbot:**
- Low traffic (~100 conversations/day, GPT-4o mini): ~$5-15/month
- Moderate traffic (~1,000 conversations/day, GPT-4o mini): ~$45-100/month
- With prompt caching (70% hit rate): Costs drop by ~60%

**Hidden costs to watch:**
- Fine-tuning hosting: $1.70-$3.00/hour regardless of usage ($50-70/day)
- Standard support plan: $100/month (production-grade)
- Data transfer: Free inbound, 100GB free outbound, then $0.087/GB
- Real-world overhead: Enterprise deployments run 15-40% above advertised token costs

**Integration approaches:**
1. Azure OpenAI Web App (no-code, deploy via Foundry portal)
2. Custom API via Azure Functions (recommended for a custom website)
3. Azure Bot Service (multi-channel: web, Teams, Slack)

**Verdict:** Viable and valuable for a consultancy site. Use GPT-4o mini or GPT-5-nano for cost efficiency. Budget $5-20/month for a small consultancy. Avoid fine-tuning unless absolutely necessary (hosting costs are brutal).

**Sources:**
- [Azure OpenAI Pricing](https://azure.microsoft.com/en-us/pricing/details/azure-openai/)
- [Azure OpenAI Pricing Explained 2026](https://inference.net/content/azure-openai-pricing-explained/)
- [Real Cost Analysis](https://azure-noob.com/blog/azure-openai-pricing-real-costs/)

---

### 10.3 Azure AI Services / Foundry Tools - AI ENHANCEMENTS (GOOD FREE TIERS)

**What it is:** Pre-built AI APIs for Vision, Speech, Language, Translation, and Document Intelligence. Rebranded to "Foundry Tools" in 2026 under the unified Foundry platform.

**Free Tier (F0) Limits:**

| Service | Monthly Free Limit | Rate Limit | Useful For Consultancy Site? |
|---------|-------------------|------------|------------------------------|
| Computer Vision | 5,000 transactions | 20/minute | Low -- unless processing uploaded docs |
| Language (Sentiment, Key Phrases) | 5,000 text records | Varies | YES -- analyze contact form submissions |
| Speech (TTS) | 500,000 characters | Varies | Moderate -- accessibility, audio content |
| Translator | 2,000,000 characters | N/A | YES -- multi-language for international clients |
| Document Intelligence | Limited | Varies | Moderate -- process uploaded RFPs/documents |

**Standard Tier Pricing (when free limits exhausted):**
- Vision: ~$1.00-$2.50 per 1,000 transactions
- Language: ~$1.00 per 1,000 text records
- Speech TTS: ~$16 per 1 million characters
- Translator: ~$10 per 1 million characters

**Constraints:**
- Only ONE free tier (F0) resource per service type per subscription
- Free tier throttles (stops working) when limit reached -- no overage, just stops
- Free tier rate limits are strict and not adjustable

**Most valuable for a consultancy site:**
1. **Translator (F0):** 2M free characters/month is generous for real-time page translation
2. **Language (F0):** 5,000 free analyses/month for sentiment on contact forms, lead scoring
3. **Azure OpenAI:** More flexible than the individual AI services for chatbot purposes

**Verdict:** Good supplementary features. Free tiers are sufficient for a low-to-moderate traffic consultancy site. Translator is the standout value.

**Sources:**
- [Foundry Tools Pricing](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/)
- [Speech Quotas and Limits](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-services-quotas-and-limits)
- [Computer Vision F0 Limits](https://learn.microsoft.com/en-us/answers/questions/2155960/computer-vision-free-(f0)-limitations-(5-000-trans)

---

### 10.4 Azure Front Door / CDN - PERFORMANCE (SKIP FOR THIS PROJECT)

**What it is:** Global CDN + load balancer + WAF + DDoS protection. Microsoft's premier edge network service (replacing retiring Azure CDN Classic).

| Tier | Base Fee | Includes |
|------|----------|----------|
| Standard | ~$35/month | CDN, load balancing, SSL offload, DDoS, custom WAF rules, caching, compression |
| Premium | ~$330/month | Everything in Standard + managed WAF, bot protection, Private Link, threat intelligence |

**Additional charges:** Per-request fees + data transfer (varies by region and volume).

**Azure CDN Classic:** Being retired September 2027. Do NOT invest in this.

**Why to SKIP for this project:**
- Azure Static Web Apps Standard already includes a global CDN at $9/month
- $35/month base fee is a 4x cost increase over SWA Standard alone
- Designed for enterprises with global traffic, DDoS concerns, and complex routing
- A consultancy website does not need enterprise WAF or bot protection at launch

**When to reconsider:** If the site scales to high global traffic or faces security threats, Azure Front Door Standard can be added to the SWA Standard plan as the enterprise-grade edge add-on ($17.52/month).

**Verdict:** Overkill. The built-in CDN with Azure Static Web Apps is sufficient. Revisit only if scaling demands it.

**Sources:**
- [Azure Front Door Pricing](https://azure.microsoft.com/en-us/pricing/details/frontdoor/)
- [Front Door Tier Pricing Comparison](https://learn.microsoft.com/en-us/azure/frontdoor/understanding-pricing)
- [CDN vs Front Door Price Comparison](https://learn.microsoft.com/en-us/azure/frontdoor/compare-cdn-front-door-price)

---

### 10.5 Azure Media Services - VIDEO (RETIRED, NOT AVAILABLE)

**Status:** Fully retired as of June 30, 2024. Microsoft exited the media streaming business.

**What was retired:** Encoding, VOD streaming, live streaming, Azure Media Player.

**Alternatives (if video is needed):**
| Service | Cost | Notes |
|---------|------|-------|
| Ravnur Media Services | $499/month | Azure-native replacement, runs on Azure |
| Vimeo | $7-65/month | Best general-purpose, embed on site |
| YouTube (free embed) | $0 | Free but branded, less professional |
| Azure Blob Storage + CDN | ~$1-5/month | Self-hosted video files, basic streaming |
| Cloudinary | Free tier available | Image/video optimization and delivery |

**Verdict for consultancy site:** Use embedded Vimeo for professional video, or self-host small video files on Azure Blob Storage. Do NOT try to build a streaming solution.

**Sources:**
- [Azure Media Services Retirement Q&A](https://learn.microsoft.com/en-us/answers/questions/1336637/is-there-a-replacement-for-azure-media-services-or)
- [Ravnur Replacement](https://www.ravnur.com/azure-media-services-replacement/)

---

### 10.6 Azure DevOps - CI/CD (EXCELLENT FREE TIER)

**What it is:** Full DevOps platform: Git repos, CI/CD pipelines, work item tracking, artifact management.

**Free Tier Includes:**

| Feature | Free Allowance |
|---------|---------------|
| Users (Basic license) | First 5 free |
| Stakeholder access | Unlimited free |
| Microsoft-hosted CI/CD | 1 parallel job, 1,800 min/month (30 hours) |
| Self-hosted CI/CD | 1 parallel job, unlimited minutes |
| Private Git repos | Unlimited |
| Azure Artifacts | 2 GB storage |
| Azure Boards | Full work item tracking |

**Paid Pricing (beyond free):**
- Additional Basic users: $6/user/month
- Extra Microsoft-hosted parallel job: $40/month
- Extra self-hosted parallel job: $15/month
- Basic + Test Plans: $52/user/month

**Alternative:** GitHub Actions (free tier: 2,000 min/month for private repos) -- Azure Static Web Apps has native GitHub Actions integration.

**Verdict:** Free tier is more than sufficient for a small team. 1,800 minutes/month of build time is generous for a consultancy website project. However, GitHub Actions may be simpler since SWA integrates natively with GitHub.

**Sources:**
- [Azure DevOps Pricing](https://azure.microsoft.com/en-us/pricing/details/devops/azure-devops-services/)
- [Billing Overview](https://learn.microsoft.com/en-us/azure/devops/organizations/billing/overview)

---

### 10.7 Azure Design/Prototyping Tools - DO NOT EXIST

**Azure has ZERO design, prototyping, or visual creation tools.**

Microsoft's offerings in this space:
- **Microsoft Designer:** AI-powered design tool (consumer product, NOT an Azure service). Good for social media graphics, not web design.
- **Figma:** The industry standard for UI/UX design. Azure has no equivalent.
- **No Azure Figma alternative, no Azure prototyping tool, no Azure visual editor.**

**What to use instead:**
- Figma ($0-20/month) for UI/UX design and prototyping
- Adobe Creative Suite for visual asset creation
- Spline ($0-20/month) for 3D design
- Midjourney / DALL-E (via Azure OpenAI) for AI-generated imagery

**Verdict:** Not Azure's domain. Design tools are entirely separate from cloud infrastructure.

---

### 10.8 WHAT AZURE CANNOT DO - HONEST GAPS

**Azure has NO tools for:**

| Capability | Azure Can? | What To Use Instead |
|-----------|-----------|---------------------|
| Web animations (CSS/JS) | NO | GSAP, Motion (Framer Motion), CSS |
| Particle effects | NO | tsParticles, Three.js particles, Babylon.js |
| 3D graphics rendering (client-side) | NO | Three.js, Babylon.js, Spline |
| Shader effects | NO | GLSL/WGSL, TSL, react-shaders |
| Scroll-based animations | NO | GSAP ScrollTrigger, Lenis |
| UI/UX design | NO | Figma, Sketch, Penpot |
| Visual prototyping | NO | Figma, Adobe XD, Spline |
| Frontend component libraries | NO | shadcn/ui, Radix, Headless UI |
| CSS frameworks | NO | Tailwind CSS, CSS Modules |
| Image/video editing | NO | Adobe Suite, Canva, Cloudinary |
| Font hosting | NO | Google Fonts, Adobe Fonts, self-hosted |
| Icon libraries | NO | Lucide, Phosphor, Heroicons |

**What Azure CAN do (infrastructure/backend only):**
- Host the website (Static Web Apps)
- Run serverless backend functions (Azure Functions)
- Provide AI/ML APIs (OpenAI, Language, Speech, Translator)
- Store files and assets (Blob Storage)
- CI/CD pipelines (DevOps)
- Global content delivery (built-in CDN)
- SSL certificates and custom domains

**The key insight:** Azure is infrastructure. It hosts and serves your website, provides backend intelligence, and handles DevOps. The "premium, high-end" visual quality of the website comes entirely from frontend JavaScript libraries, CSS, and design craft -- none of which are Azure services.

---

### 10.9 Babylon.js - MICROSOFT'S RELEVANT (NON-AZURE) OFFERING

**What it is:** Open-source 3D engine for the web, maintained by Microsoft. NOT an Azure service.

**Babylon.js 9.0 (Released March 26, 2026):**
- Clustered Lighting system (WebGPU + WebGL 2)
- Flow Maps for artistic particle control
- Gravity Attractors (vortexes, magnetic fields, explosions)
- GPU-based particle systems
- `<babylon-viewer>` HTML custom element
- glTF/GLB model support
- Node Particle Editor
- Frame Graph rendering system

**Cost:** FREE (Apache 2.0 license)

**Relevance to this project:** Babylon.js is powerful but is designed for full 3D applications and games. For a consultancy website with premium visual effects, Three.js (via React Three Fiber) is typically more appropriate -- lighter weight, larger ecosystem for web use cases, better integration with React/Next.js.

**Verdict:** Acknowledge it exists, but Three.js + R3F is the better choice for a marketing/consultancy website.

**Sources:**
- [Babylon.js 9.0 Announcement](https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/)
- [Babylon.js Official Site](https://www.babylonjs.com/)

---

### 10.10 $200 CREDIT BUDGET - REALISTIC ASSESSMENT

**The $200 Azure Free Credit:**
- Valid for 30 days only from account creation
- Cannot be carried over or transferred
- Cannot be used for: Azure DevOps purchases, support plans, Marketplace products
- One-time per customer

**Development Phase Budget (30 days with $200 credit):**

| Service | Est. 30-Day Cost | Notes |
|---------|-----------------|-------|
| Static Web Apps (Standard) | $9 | Production-grade hosting |
| Azure OpenAI (development) | $10-30 | Chatbot prototyping, GPT-4o mini |
| Azure Functions (consumption) | $0 | 1M free executions/month |
| Azure AI Language (F0) | $0 | 5,000 free transactions/month |
| Azure AI Speech (F0) | $0 | 500K free characters/month |
| Azure AI Translator (F0) | $0 | 2M free characters/month |
| Azure DevOps | $0 | Free tier (5 users) |
| Blob Storage (assets) | $1-5 | Small static assets |
| **TOTAL** | **~$20-44** | **Well within $200** |

**Ongoing Monthly Production Costs (after credit expires):**

| Service | Monthly Cost | Notes |
|---------|-------------|-------|
| Static Web Apps (Standard) | $9 | Or Free if traffic < 100GB |
| Azure OpenAI (chatbot) | $5-20 | GPT-4o mini, low-moderate traffic |
| Azure Functions | $0 | Consumption plan free grant |
| AI Services (F0 tiers) | $0 | Stay within free limits |
| Blob Storage | $1-3 | Static assets |
| **TOTAL** | **~$15-32/month** | **Very manageable** |

**Budget verdict:**
- $200 credit is MORE than enough for a 30-day development sprint
- Ongoing costs of ~$15-32/month are very reasonable for production
- Adding Azure Front Door ($35/month) would nearly double costs -- skip it
- Adding Azure OpenAI with heavy usage or larger models could escalate quickly
- The site's "premium quality" comes from frontend code (free libraries), not expensive Azure services

---

### 10.11 RECOMMENDED AZURE ARCHITECTURE

```
FRONTEND (Client-Side -- NOT Azure, but hosted on Azure):
  - Next.js 15 / React 19
  - Three.js + React Three Fiber (3D/particles)
  - GSAP + ScrollTrigger (animations)
  - Motion v12 (React UI animations)
  - Lenis (smooth scrolling)
  - Tailwind CSS v4 (styling)
  - tsParticles (2D particle backgrounds)

AZURE HOSTING:
  - Azure Static Web Apps (Standard, $9/month)
    - Built-in global CDN
    - SSL certificates
    - Custom domains
    - GitHub CI/CD integration

AZURE BACKEND/API:
  - Azure Functions (consumption plan, free tier)
    - Contact form processing
    - Chatbot API proxy
    - Newsletter signup
    - Lead scoring

AZURE AI:
  - Azure OpenAI (GPT-4o mini) -- AI chatbot/assistant
  - Azure AI Language (F0) -- Sentiment analysis on inquiries
  - Azure AI Translator (F0) -- Multi-language support

AZURE DEVOPS/CI-CD:
  - GitHub Actions (native SWA integration) OR Azure DevOps (free tier)

AZURE STORAGE:
  - Azure Blob Storage -- Large media assets, PDFs, case studies
```

---

### 10.12 SERVICES TO SKIP

| Service | Why Skip | Monthly Cost Saved |
|---------|----------|-------------------|
| Azure Front Door | SWA has built-in CDN; overkill for consultancy site | $35+/month |
| Azure Media Services | Retired June 2024 | N/A |
| Azure Batch Rendering | For VFX studios, not web development | $100+/month |
| Azure Digital Twins | For IoT, not web design | $50+/month |
| Azure App Service (full) | Overkill -- SWA + Functions is cheaper | $13-55/month |
| Azure Kubernetes Service | Massive overkill for a consultancy site | $70+/month |
| Azure AI Search | Only if building RAG/knowledge base feature | $75+/month |

---

### 10.13 RESEARCH SOURCES

**Azure Static Web Apps:**
- https://azure.microsoft.com/en-us/pricing/details/app-service/static/
- https://learn.microsoft.com/en-us/azure/static-web-apps/plans
- https://learn.microsoft.com/en-us/azure/static-web-apps/quotas

**Azure OpenAI:**
- https://azure.microsoft.com/en-us/pricing/details/azure-openai/
- https://inference.net/content/azure-openai-pricing-explained/
- https://azure-noob.com/blog/azure-openai-pricing-real-costs/
- https://learn.microsoft.com/en-us/azure/app-service/tutorial-ai-openai-chatbot-dotnet

**Azure Front Door / CDN:**
- https://azure.microsoft.com/en-us/pricing/details/frontdoor/
- https://learn.microsoft.com/en-us/azure/frontdoor/understanding-pricing
- https://learn.microsoft.com/en-us/azure/frontdoor/compare-cdn-front-door-price

**Azure AI Services (Foundry Tools):**
- https://azure.microsoft.com/en-us/pricing/details/cognitive-services/
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/speech-services-quotas-and-limits
- https://azure.microsoft.com/en-us/products/ai-services

**Azure DevOps:**
- https://azure.microsoft.com/en-us/pricing/details/devops/azure-devops-services/
- https://learn.microsoft.com/en-us/azure/devops/organizations/billing/overview

**Azure Media Services (Retired):**
- https://learn.microsoft.com/en-us/answers/questions/1336637/is-there-a-replacement-for-azure-media-services-or
- https://www.ravnur.com/azure-media-services-replacement/

**Babylon.js:**
- https://blogs.windows.com/windowsdeveloper/2026/03/26/announcing-babylon-js-9-0/
- https://www.babylonjs.com/

**Azure Free Account:**
- https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account
- https://azure.microsoft.com/en-us/pricing/free-services
- https://cloudcredits.io/providers/azure/programs/azure-200

---

## 11. EXACT Next.js 16.2.2 Project Setup Commands & Configuration (April 2026)

> Researched: 2026-04-02
> All information verified against official docs and npm registry as of this date.

---

### 11.1 EXACT `create-next-app` COMMAND

**One-command setup (recommended defaults):**
```bash
npx create-next-app@latest my-project --yes
```

The `--yes` flag accepts all recommended defaults which include:
- TypeScript: YES
- ESLint: YES
- Tailwind CSS v4: YES
- App Router: YES
- Turbopack: YES (default bundler, no flag needed)
- Import alias: `@/*`
- `src/` directory: NO (not default)
- AGENTS.md: YES (new in Next.js 16)

**With explicit flags:**
```bash
npx create-next-app@latest my-project --typescript --tailwind --eslint --app --turbopack
```

**With `src/` directory:**
```bash
npx create-next-app@latest my-project --typescript --tailwind --eslint --app --turbopack --src-dir
```

**Using pnpm:**
```bash
pnpm create next-app@latest my-project --yes
```

**System requirements:**
- Node.js 20.9+ (Node.js 18 support was DROPPED in Next.js 16)
- TypeScript 5.1+ (compatible with TypeScript 6.0)

---

### 11.2 DEFAULT PROJECT STRUCTURE (Next.js 16, no `src/` dir)

```
my-project/
├── app/
│   ├── favicon.ico
│   ├── globals.css          # Tailwind v4 CSS-first config
│   ├── layout.tsx           # Root layout (html + body tags)
│   └── page.tsx             # Home page (route: /)
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── AGENTS.md                # NEW: AI agent instructions (Next.js docs bundled)
├── CLAUDE.md                # NEW: References AGENTS.md for Claude Code
├── eslint.config.mjs        # ESLint flat config (ESLint 9+)
├── next-env.d.ts            # Auto-generated Next.js type declarations
├── next.config.ts           # Next.js config (TypeScript)
├── package.json
├── postcss.config.mjs       # PostCSS with @tailwindcss/postcss
├── README.md
├── tsconfig.json            # TypeScript configuration
└── node_modules/
```

---

### 11.3 TAILWIND CSS v4 CONFIGURATION (CSS-First, NO tailwind.config.js)

**There is NO `tailwind.config.js` file.** Tailwind v4 uses CSS-first configuration.

**`postcss.config.mjs` (generated by create-next-app):**
```js
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

**`app/globals.css` (generated by create-next-app, then customized):**
```css
@import "tailwindcss";

/* Custom design tokens via @theme (replaces tailwind.config.js) */
@theme {
  /* Colors - generates bg-*, text-*, border-* utilities */
  --color-brand: #3b82f6;
  --color-accent: #8b5cf6;

  /* Fonts - generates font-* utilities */
  --font-sans: "Inter", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Custom spacing, sizing, etc. */
}
```

**Key Tailwind v4 changes:**
- `@import "tailwindcss"` replaces `@tailwind base; @tailwind components; @tailwind utilities;`
- `@theme { }` replaces `tailwind.config.js` for design tokens
- Variables in `@theme` generate utility classes; variables in `:root` do NOT
- Zero-config content detection (no `content` array needed)
- `@tailwindcss/postcss` replaces the `tailwindcss` PostCSS plugin
- Packages needed: `tailwindcss` + `@tailwindcss/postcss`

**Variable namespaces in @theme:**
| Namespace | Generates |
|-----------|-----------|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `ring-*`, etc. |
| `--font-*` | `font-*` (font-family) |
| `--text-*` | `text-*` (font-size) |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, etc. |

---

### 11.4 TypeScript CONFIGURATION

**`tsconfig.json` (generated by create-next-app):**
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

**TypeScript 6.0 new defaults (if upgrading TS independently):**
- `strict` is now `true` by default (was `false`)
- `module` defaults to `esnext`
- `target` defaults to `es2025`
- `noUncheckedSideEffectImports` is `true` by default
- `esModuleInterop` / `allowSyntheticDefaultImports` can no longer be set to `false`
- Set `"types": ["node"]` explicitly for better build performance

**Note:** Next.js's generated tsconfig uses its own preferred settings which may differ slightly from TS 6.0 defaults. The `plugins: [{ "name": "next" }]` entry enables Next.js's TypeScript plugin for advanced type-checking and route validation.

---

### 11.5 `next.config.ts` FORMAT

**Default `next.config.ts` (generated by create-next-app):**
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
}

export default nextConfig
```

**With Turbopack options (if needed):**
```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Turbopack config is now TOP-LEVEL (not under experimental)
  turbopack: {
    resolveAlias: {
      // Example: alias for module resolution
    },
  },
}

export default nextConfig
```

**Key facts:**
- Use `next.config.ts` for TypeScript projects (recommended)
- Use `next.config.mjs` for ESM in CommonJS projects
- `import type { NextConfig } from 'next'` for type safety
- Turbopack is the DEFAULT bundler -- no flag needed
- `experimental.turbopack` moved to top-level `turbopack` in Next.js 16
- Run `next dev --webpack` or `next build --webpack` to opt back to Webpack
- `turbopackFileSystemCacheForDev` is enabled by default in Next.js 16

---

### 11.6 DEFAULT `package.json` SCRIPTS

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

**Note:** No `--turbopack` flag needed. Turbopack is the default bundler in Next.js 16.
- `next dev` = dev server with Turbopack
- `next build` = production build with Turbopack
- `next dev --webpack` = opt back to Webpack
- `next build --webpack` = production build with Webpack

---

### 11.7 THREE.JS & R3F INSTALLATION

**Exact packages and versions (verified on npm, April 2026):**

| Package | Version | npm install |
|---------|---------|-------------|
| three | 0.183.2 (r183) | `three@0.183.2` |
| @react-three/fiber | 9.5.0 | `@react-three/fiber@9.5.0` |
| @react-three/drei | 10.7.7 | `@react-three/drei@10.7.7` |
| @react-three/postprocessing | 3.0.4 | `@react-three/postprocessing@3.0.4` |
| @types/three | (matches r183) | `@types/three` |

**Install command (all at once):**
```bash
npm install three@0.183.2 @react-three/fiber@9.5.0 @react-three/drei@10.7.7 @react-three/postprocessing@3.0.4 @types/three
```

**Or with pnpm:**
```bash
pnpm add three@0.183.2 @react-three/fiber@9.5.0 @react-three/drei@10.7.7 @react-three/postprocessing@3.0.4 @types/three
```

**Requirements:**
- `@react-three/fiber@9` requires React 19+
- `@react-three/postprocessing@3` requires `@react-three/fiber@9` and React 19+ (React 18 dropped)
- `@react-three/postprocessing@3` is ESM-only
- Three.js r183 = npm version `0.183.2`

---

### 11.8 ANIMATION LIBRARIES INSTALLATION

**Exact packages and versions (verified on npm, April 2026):**

| Package | Version | Import Path |
|---------|---------|-------------|
| gsap | 3.14.2 | `import gsap from "gsap"` |
| motion | 12.38.0 | `import { motion } from "motion/react"` |
| lenis | 1.3.21 | `import Lenis from "lenis"` or `import { ReactLenis } from "lenis/react"` |

**Install command (all at once):**
```bash
npm install gsap@3.14.2 motion@12.38.0 lenis@1.3.21
```

**Or with pnpm:**
```bash
pnpm add gsap@3.14.2 motion@12.38.0 lenis@1.3.21
```

**GSAP notes:**
- ALL plugins are now FREE (SplitText, MorphSVG, DrawSVG, ScrollSmoother, ScrollTrigger, etc.)
- All included in the `gsap` npm package -- no separate installs needed
- Import plugins: `import { ScrollTrigger } from "gsap/ScrollTrigger"`
- Register plugins: `gsap.registerPlugin(ScrollTrigger)`

**Motion notes:**
- `motion` is the package name (NOT `framer-motion`)
- Import from `"motion/react"` (NOT `"framer-motion"`)
- Compatible with React 18.2+

**Lenis notes:**
- Sub-packages available: `lenis/react`, `lenis/vue`, `lenis/framer`, `lenis/snap`
- For React: `import { ReactLenis } from "lenis/react"`
- Integrate with GSAP: `lenis.on('scroll', ScrollTrigger.update)` + add Lenis raf to GSAP ticker
- Integrate with Motion: use `frame`/`cancelFrame` from `"motion/react"` with `autoRaf: false`

---

### 11.9 THREE.JS WebGPU IN NEXT.JS 16 (No Special Config Needed)

**Since Three.js r171+, WebGPU requires ZERO bundler configuration.**

**Import:**
```ts
import { WebGPURenderer } from "three/webgpu";
```

**With React Three Fiber:**
```tsx
<Canvas gl={canvas => new WebGPURenderer({ canvas })}>
  {/* your scene */}
</Canvas>
```

**CRITICAL: SSR Handling Required**

Three.js WebGPU references browser globals (`self`, `navigator`, etc.) that don't exist in Node.js. You MUST:

1. **Mark 3D components with `"use client"`:**
```tsx
"use client";
import { Canvas } from "@react-three/fiber";
// ... your 3D scene component
```

2. **Use `next/dynamic` with `ssr: false` for the scene wrapper:**
```tsx
// components/dynamic-scene.tsx
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./scene"), { ssr: false });

export default Scene;
```

3. **No special Turbopack or Webpack config needed for WebGPU.**

**WebGPU Browser Support (April 2026):**
- Chrome 113+ (May 2023)
- Edge 113+ (May 2023)
- Safari 26.0+ (September 2025)
- Firefox 141+ (July 2025, Windows only)
- ~95% of users have WebGPU-capable browsers
- Automatic fallback to WebGL 2 on older browsers

**When WebGPU excels over WebGL:**
- High draw call counts
- Compute-heavy workloads (particles, physics, ML inference)
- Complex post-processing
- Large instanced meshes

---

### 11.10 FULL INSTALL SEQUENCE (Copy-Paste Ready)

```bash
# Step 1: Create Next.js 16 project
npx create-next-app@latest my-project --yes
cd my-project

# Step 2: Install 3D packages
pnpm add three@0.183.2 @react-three/fiber@9.5.0 @react-three/drei@10.7.7 @react-three/postprocessing@3.0.4 @types/three

# Step 3: Install animation packages
pnpm add gsap@3.14.2 motion@12.38.0 lenis@1.3.21

# Step 4: Verify installation
pnpm dev
```

**Total packages installed:**
| Category | Package | Version |
|----------|---------|---------|
| Framework | next | 16.2.2 |
| Framework | react | 19.2.x |
| Framework | react-dom | 19.2.x |
| Framework | typescript | 5.x+ / 6.0 |
| Styling | tailwindcss | 4.x |
| Styling | @tailwindcss/postcss | 4.x |
| 3D | three | 0.183.2 |
| 3D | @react-three/fiber | 9.5.0 |
| 3D | @react-three/drei | 10.7.7 |
| 3D | @react-three/postprocessing | 3.0.4 |
| 3D Types | @types/three | latest |
| Animation | gsap | 3.14.2 |
| Animation | motion | 12.38.0 |
| Scroll | lenis | 1.3.21 |

---

### 11.11 SOURCES

**Next.js 16 Official:**
- [Installation Docs](https://nextjs.org/docs/app/getting-started/installation)
- [create-next-app CLI](https://nextjs.org/docs/app/api-reference/cli/create-next-app)
- [Next.js 16 Blog Post](https://nextjs.org/blog/next-16)
- [Next.js 16.2 Turbopack](https://nextjs.org/blog/next-16-2-turbopack)
- [Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Upgrading to v16](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Turbopack API Reference](https://nextjs.org/docs/app/api-reference/turbopack)
- [next.config.js Reference](https://nextjs.org/docs/app/api-reference/config/next-config-js)
- [CSS Getting Started](https://nextjs.org/docs/app/getting-started/css)
- [TypeScript Config](https://nextjs.org/docs/app/api-reference/config/typescript)
- [Lazy Loading / Dynamic Imports](https://nextjs.org/docs/app/guides/lazy-loading)

**TypeScript 6.0:**
- [TypeScript 6.0 Announcement](https://devblogs.microsoft.com/typescript/announcing-typescript-6-0/)
- [TypeScript 5.x to 6.0 Migration Guide](https://gist.github.com/privatenumber/3d2e80da28f84ee30b77d53e1693378f)

**Tailwind CSS v4:**
- [Tailwind v4.0 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4)
- [Tailwind + Next.js Guide](https://tailwindcss.com/docs/guides/nextjs)
- [Tailwind v4 Complete Guide 2026](https://devtoolbox.dedyn.io/blog/tailwind-css-v4-complete-guide)

**Three.js / R3F:**
- [three on npm](https://www.npmjs.com/package/three)
- [Three.js r183 Release](https://github.com/mrdoob/three.js/releases/tag/r183)
- [R3F Installation](https://r3f.docs.pmnd.rs/getting-started/installation)
- [@react-three/fiber on npm](https://www.npmjs.com/package/@react-three/fiber)
- [@react-three/drei on npm](https://www.npmjs.com/package/@react-three/drei)
- [@react-three/postprocessing on npm](https://www.npmjs.com/package/@react-three/postprocessing)
- [Three.js WebGPU Migration Guide](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)
- [Three.js WebGPU + Next.js Issue #29916](https://github.com/mrdoob/three.js/issues/29916)

**Animation Libraries:**
- [gsap on npm](https://www.npmjs.com/package/gsap)
- [GSAP Installation Docs](https://gsap.com/docs/v3/Installation/)
- [motion on npm](https://www.npmjs.com/package/motion)
- [Motion React Installation](https://motion.dev/docs/react-installation)
- [lenis on npm](https://www.npmjs.com/package/lenis)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)

---

## 12. GPU Particle System with Three.js r183 WebGPU

> Researched: 2026-04-02
> Source: Three.js r183 source code (github.com/mrdoob/three.js/tree/r183), R3F v9.0.4 source, R3F v10 alpha discussion, npm registry

---

### 12.1 IMPORTING WebGPURenderer IN THREE.JS r183

**The exact import path is `three/webgpu`:**

```ts
import * as THREE from 'three/webgpu';
// or named imports:
import { WebGPURenderer, RenderPipeline, StorageBufferAttribute, StorageInstancedBufferAttribute } from 'three/webgpu';
```

**TSL (Three Shader Language) is a SEPARATE import path `three/tsl`:**

```ts
import { Fn, If, Loop, uniform, float, int, uint, vec2, vec3, vec4,
         uv, hash, time, deltaTime, frameId, instanceIndex,
         instancedArray, attributeArray, shapeCircle,
         pass, texture, positionWorld, positionGeometry,
         billboarding } from 'three/tsl';
```

**Addons (bloom, etc.) are at `three/addons/`:**

```ts
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
```

**What `three/webgpu` exports (verified from `Three.WebGPU.js` in r183):**

Everything from `three` core PLUS:
- `WebGPURenderer` -- the renderer
- `RenderPipeline` -- post-processing pipeline (NEW in r183, replaces PostProcessing)
- `PostProcessing` -- DEPRECATED alias for RenderPipeline (emits warning, removed in future)
- `StorageTexture`, `Storage3DTexture`, `StorageArrayTexture`
- `StorageBufferAttribute`, `StorageInstancedBufferAttribute`, `IndirectStorageBufferAttribute`
- `QuadMesh`, `PMREMGenerator`, `Lighting`, `BundleGroup`
- `IESSpotLight`, `ProjectorLight`
- `NodeLoader`, `NodeObjectLoader`, `NodeMaterialLoader`
- `ClippingGroup`
- `RendererUtils` (namespace)
- `TSL` (namespace)
- `InspectorBase`, `CanvasTarget`, `BlendMode`
- All NodeMaterials (via `NodeMaterials.js`)
- All Nodes (via `Nodes.js`)

---

### 12.2 WebGPURenderer CONSTRUCTOR

```ts
const renderer = new THREE.WebGPURenderer({
  canvas: canvasElement,          // HTMLCanvasElement (optional, creates one if omitted)
  antialias: true,                // MSAA (default: false)
  alpha: true,                    // Transparent background (default: true)
  depth: true,                    // Depth buffer (default: true)
  stencil: false,                 // Stencil buffer (default: false)
  logarithmicDepthBuffer: false,  // (default: false)
  reversedDepthBuffer: false,     // (default: false)
  samples: 0,                     // Override MSAA sample count (default: 0, uses 4 when antialias=true)
  forceWebGL: false,              // Force WebGL2 backend (default: false)
  multiview: false,               // WebXR multiview (default: false)
  outputType: undefined,          // Texture type for canvas output
  outputBufferType: HalfFloatType // Type of output buffers (default: HalfFloatType)
});
```

**CRITICAL: `await renderer.init()` MUST be called before use:**

```ts
await renderer.init();
```

**The `init()` method is async.** It detects WebGPU availability and auto-falls back to WebGL2. The fallback mechanism:

1. If `forceWebGL: true` -- directly uses `WebGLBackend`
2. If `forceWebGL: false` (default) -- tries `WebGPUBackend`, attaches a `getFallback` callback
3. If WebGPU unavailable at init time, the callback fires, logs a warning, returns `new WebGLBackend(parameters)`
4. The fallback is AUTOMATIC and TRANSPARENT -- same API surface either way

**Detecting which backend is active:**

```ts
await renderer.init();
const ctx = renderer.getContext();
// If WebGPU: ctx is a GPUCanvasContext
// If WebGL2: ctx is a WebGL2RenderingContext
const isWebGPU = ctx.constructor.name === 'GPUCanvasContext';
// OR check for compute support:
const hasCompute = renderer.hasFeature('compute'); // Not a standard check, see below
```

**API surface matches WebGLRenderer:** `render()`, `setSize()`, `setPixelRatio()`, `domElement`, `setAnimationLoop()`, `setRenderTarget()`, `dispose()`, `info`, `toneMapping`, `toneMappingExposure`, etc. are all present on the base `Renderer` class that `WebGPURenderer` extends.

---

### 12.3 R3F 9.5.0 AND WebGPU: THE HONEST TRUTH

**R3F v9.5.0 does NOT natively support WebGPU. It has LIMITED, FRAGILE compatibility.**

**The facts from source code (`packages/fiber/src/core/store.ts` at v9.0.4):**

```ts
// RootState types the renderer as:
gl: THREE.WebGLRenderer

// The isRenderer check is minimal:
export const isRenderer = (def: any) => !!def?.render
```

**The `gl` prop in R3F v9 accepts (`renderer.tsx`):**

```ts
export type GLProps =
  | Renderer                                        // Pre-built renderer instance
  | ((defaultProps: DefaultGLProps) => Renderer)     // Sync factory
  | ((defaultProps: DefaultGLProps) => Promise<Renderer>) // Async factory
  | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>  // Config object
```

**The async factory pattern IS supported** -- the `configure()` method is `async` and awaits the factory result. So this TECHNICALLY works:

```tsx
<Canvas gl={async (defaults) => {
  const renderer = new WebGPURenderer({ canvas: defaults.canvas, antialias: true });
  await renderer.init();
  return renderer;
}}>
```

**BUT there are real problems:**

1. **Type mismatch:** The internal `state.gl` is typed as `THREE.WebGLRenderer`. TypeScript will complain when accessing `state.gl` in hooks like `useThree()`.

2. **Assumptions about WebGLRenderer:** R3F v9 calls `gl.setPixelRatio()`, `gl.setSize()`, and accesses `gl.domElement` on resize. These all exist on WebGPURenderer (same base `Renderer` class), so this works.

3. **Known broken features in R3F v9 + WebGPU:**
   - PointLights reported broken (#2853, closed "not planned")
   - Morph target sync broken (#3568, fixed only in v10)
   - HMR with WebGPU node materials broken (#3677, fixed only in v10)
   - Multiple instances of Three.js can cause issues with the separate `three/webgpu` entry point (#3601)

4. **`@react-three/postprocessing` will NOT work** with WebGPURenderer -- it depends on the WebGL-based `postprocessing` library (EffectComposer), not the new node-based `RenderPipeline`.

**R3F v10 alpha (January 2026) IS the WebGPU answer:**

- `state.gl` renamed to `state.renderer`
- WebGPURenderer is first-class
- New hooks: `useUniforms`, `useNodes`, `useLocalNodes`, `usePostProcessing`
- TSL treated as first-class
- New scheduler that works outside R3F tree
- Install: `npm install @react-three/fiber@alpha`

**VERDICT: For production in April 2026, R3F v10 alpha is too unstable for production. For R3F v9.5.0, WebGPU works via the async `gl` factory but with caveats. The safest approach for a production site is one of these two patterns.**

---

### 12.4 RECOMMENDED PATTERNS FOR WebGPU IN NEXT.JS + REACT

#### PATTERN A: R3F v9 with WebGPU via async `gl` factory (Limited but functional)

```tsx
"use client";
import { Canvas, useThree } from '@react-three/fiber';
import { WebGPURenderer } from 'three/webgpu';

function Scene() {
  // state.gl is typed as WebGLRenderer but is actually WebGPURenderer
  // Use (renderer as any).compute() for compute calls
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial />
    </mesh>
  );
}

export default function WebGPUCanvas() {
  return (
    <Canvas
      gl={async (defaults) => {
        const renderer = new WebGPURenderer({
          canvas: defaults.canvas as HTMLCanvasElement,
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        await renderer.init();
        return renderer;
      }}
    >
      <Scene />
    </Canvas>
  );
}
```

**Limitations:** No compute shader access from within R3F's declarative tree. Must use `useThree()` to get the renderer, cast it, and call `.compute()` imperatively. Post-processing must use Three.js native `RenderPipeline`, not `@react-three/postprocessing`.

#### PATTERN B: Direct Three.js without R3F (Full control, recommended for heavy GPU compute)

```tsx
"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';
import { Fn, uniform, float, vec3, hash, instancedArray, instanceIndex,
         shapeCircle, uv, pass, time, deltaTime, If } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

export default function ParticleSystem() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let renderer: THREE.WebGPURenderer;
    let disposed = false;

    async function init() {
      const { clientWidth: width, clientHeight: height } = containerRef.current!;

      // Renderer
      renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
      containerRef.current!.appendChild(renderer.domElement);
      await renderer.init();
      if (disposed) { renderer.dispose(); return; }

      // Scene + Camera
      const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
      camera.position.set(0, 5, 20);
      const scene = new THREE.Scene();

      // === GPU PARTICLE SYSTEM ===
      const particleCount = 100000;

      // GPU storage buffers
      const positions = instancedArray(particleCount, 'vec3');
      const velocities = instancedArray(particleCount, 'vec3');
      const colors = instancedArray(particleCount, 'vec3');

      // Compute: Init
      const computeInit = Fn(() => {
        const position = positions.element(instanceIndex);
        const velocity = velocities.element(instanceIndex);
        const color = colors.element(instanceIndex);

        position.x = hash(instanceIndex).mul(40).sub(20);
        position.y = hash(instanceIndex.add(1)).mul(20);
        position.z = hash(instanceIndex.add(2)).mul(40).sub(20);

        velocity.assign(vec3(0, 0, 0));

        color.x = hash(instanceIndex.add(3));
        color.y = hash(instanceIndex.add(4));
        color.z = hash(instanceIndex.add(5));
      })().compute(particleCount);

      // Compute: Update (runs every frame)
      const gravity = uniform(-0.00098);
      const computeUpdate = Fn(() => {
        const position = positions.element(instanceIndex);
        const velocity = velocities.element(instanceIndex);

        velocity.y.addAssign(gravity);
        position.addAssign(velocity);
        velocity.mulAssign(0.99);

        If(position.y.lessThan(0), () => {
          position.y.assign(0);
          velocity.y.assign(velocity.y.negate().mul(0.8));
        });
      });
      const computeParticles = computeUpdate().compute(particleCount);

      // Material
      const material = new THREE.SpriteNodeMaterial();
      material.colorNode = colors.element(instanceIndex);
      material.positionNode = positions.toAttribute();
      material.scaleNode = uniform(0.12);
      material.opacityNode = shapeCircle();
      material.transparent = true;
      material.depthWrite = false;

      // Sprite (single draw call for all particles)
      const particles = new THREE.Sprite(material);
      particles.count = particleCount;
      particles.frustumCulled = false;
      scene.add(particles);

      // Init particles on GPU
      renderer.compute(computeInit);

      // Post-processing with bloom
      const renderPipeline = new THREE.RenderPipeline(renderer);
      const scenePass = pass(scene, camera);
      const sceneColor = scenePass.getTextureNode('output');
      const bloomPass = bloom(sceneColor, 0.5, 0.4, 0.1);
      renderPipeline.outputNode = sceneColor.add(bloomPass);

      // Animation loop
      renderer.setAnimationLoop(() => {
        if (disposed) return;
        renderer.compute(computeParticles);
        renderPipeline.render();
      });

      // Resize
      const onResize = () => {
        const w = containerRef.current!.clientWidth;
        const h = containerRef.current!.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);
    }

    init();

    return () => {
      disposed = true;
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
```

**Wrap with `next/dynamic` for SSR safety:**

```tsx
// components/dynamic-particles.tsx
import dynamic from 'next/dynamic';
const ParticleSystem = dynamic(() => import('./particle-system'), { ssr: false });
export default ParticleSystem;
```

---

### 12.5 GPU-COMPUTED PARTICLE SYSTEM: ARCHITECTURE

#### Using Sprite (Points replacement) -- RECOMMENDED for r183

Three.js r183 with the node system uses `THREE.Sprite` with a `.count` property for instanced particle rendering. This is the **modern replacement** for `THREE.Points` with `BufferGeometry`.

```ts
// Storage buffers (GPU-resident)
const positions = instancedArray(particleCount, 'vec3');  // StorageInstancedBufferAttribute
const velocities = instancedArray(particleCount, 'vec3');

// Material
const material = new THREE.SpriteNodeMaterial();
material.positionNode = positions.toAttribute();  // Read from compute buffer
material.scaleNode = uniform(0.1);
material.opacityNode = shapeCircle();  // Circle shape instead of square point
material.colorNode = someColorNode;

// Single Sprite with count = particle count
const particles = new THREE.Sprite(material);
particles.count = particleCount;
particles.frustumCulled = false;
scene.add(particles);
```

#### Using Mesh with `.count` -- Also works (for custom geometry per particle)

```ts
const material = new THREE.MeshBasicNodeMaterial();
material.vertexNode = billboarding({ position: positions.toAttribute() });
material.colorNode = someColorNode;

const particles = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.1), material);
particles.count = particleCount;
```

#### Using InstancedMesh -- Traditional approach, still valid

```ts
const geometry = new THREE.PlaneGeometry(1, 1);
const material = new THREE.MeshStandardNodeMaterial();
material.positionNode = positions.toAttribute();

const mesh = new THREE.InstancedMesh(geometry, material, particleCount);
mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
```

**VERDICT:** `Sprite` with `SpriteNodeMaterial` + `.count` is the cleanest pattern for r183 particles. It's what the official examples use.

---

### 12.6 COMPUTE SHADERS VIA WebGPU FOR PARTICLE PHYSICS

**The `Fn()` + `.compute()` pattern:**

```ts
import { Fn, If, Loop, uniform, float, vec3, hash, deltaTime, time,
         instancedArray, instanceIndex } from 'three/tsl';

// 1. Define GPU storage buffers
const positions = instancedArray(count, 'vec3');
const velocities = instancedArray(count, 'vec3');

// 2. Define compute shader as a TSL function
const updateParticles = Fn(() => {
  // Access per-particle data
  const pos = positions.element(instanceIndex);
  const vel = velocities.element(instanceIndex);

  // Physics
  vel.y.addAssign(float(-0.001));           // Gravity
  pos.addAssign(vel.mul(deltaTime));         // Integration
  vel.mulAssign(0.99);                       // Damping

  // Floor collision
  If(pos.y.lessThan(0), () => {
    pos.y.assign(0);
    vel.y.assign(vel.y.negate().mul(0.8));   // Bounce
  });
});

// 3. Create compute node (sets dispatch count)
const computeNode = updateParticles().compute(count);

// 4. Run in animation loop
renderer.setAnimationLoop(() => {
  renderer.compute(computeNode);              // Execute compute shader
  renderer.render(scene, camera);             // Then render
});
```

**TSL Core Syntax Reference (verified from TSLCore.js):**

| TSL Function | Purpose | Example |
|---|---|---|
| `Fn(() => { ... })` | Define a GPU function | `const update = Fn(() => { ... })` |
| `.compute(count)` | Create compute dispatch | `update().compute(100000)` |
| `If(condition, body)` | GPU conditional | `If(pos.y.lessThan(0), () => { ... })` |
| `.ElseIf(cond, body)` | Chain conditional | `.ElseIf(pos.y.greaterThan(100), () => { ... })` |
| `.Else(body)` | Else branch | `.Else(() => { ... })` |
| `Loop(count, body)` | GPU loop | `Loop(attractorCount, ({i}) => { ... })` |
| `uniform(value)` | CPU-controlled uniform | `uniform(-0.001)`, `uniform(new THREE.Vector3())` |
| `float(v)`, `int(v)`, `uint(v)` | Scalar constructors | `float(3.14)` |
| `vec2(x,y)`, `vec3(x,y,z)`, `vec4(x,y,z,w)` | Vector constructors | `vec3(0, -0.001, 0)` |
| `instanceIndex` | Current instance ID | `positions.element(instanceIndex)` |
| `instancedArray(count, type)` | GPU storage buffer | `instancedArray(100000, 'vec3')` |
| `hash(node)` | Pseudo-random hash | `hash(instanceIndex)` |
| `time` | Elapsed seconds (uniform) | `pos.x.add(time.mul(0.1))` |
| `deltaTime` | Frame delta seconds | `pos.addAssign(vel.mul(deltaTime))` |
| `frameId` | Current frame number | -- |
| `.add()`, `.sub()`, `.mul()`, `.div()` | Arithmetic operators | `vel.mul(0.99)` |
| `.addAssign()`, `.mulAssign()` | Compound assignment | `vel.y.addAssign(gravity)` |
| `.lessThan()`, `.greaterThan()` | Comparison | `pos.y.lessThan(0)` |
| `.negate()` | Negate | `vel.y.negate()` |
| `.normalize()` | Normalize vector | `direction.normalize()` |
| `.distance(other)` | Distance | `pos.distance(target)` |
| `.assign(value)` | Assignment | `pos.y.assign(0)` |
| `.toVar()` | Mutable local variable | `const temp = someNode.toVar()` |
| `.toAttribute()` | Convert storage to vertex attribute | `positions.toAttribute()` |
| `.x`, `.y`, `.z`, `.xy`, `.xyz` | Swizzle access | `pos.y`, `pos.xz` |
| `.mod(v)`, `.max(v)`, `.min(v)` | Math functions | `instanceIndex.mod(amount)` |
| `.smoothstep(a, b)` | Smoothstep | `speed.smoothstep(0, 0.5)` |
| `.remap(a, b)` | Remap range | `hash(idx).remap(0.25, 1)` |
| `shapeCircle()` | Circle alpha based on UV | `material.opacityNode = shapeCircle()` |

**Compute shader chain pattern (`Fn()()`):**

The double-call `Fn(() => { ... })()` is intentional:
1. `Fn(() => { ... })` -- creates the shader function definition
2. `()` -- invokes it, building the shader graph
3. `.compute(count)` -- wraps it in a `ComputeNode` with dispatch count
4. `.setName('label')` -- optional label for debugging

---

### 12.7 WebGL2 FALLBACK: COMPUTE SHADERS STILL WORK (EMULATED)

**WebGL2 does NOT have native compute shaders. But Three.js r183 emulates them using transform feedback.**

The `WebGLBackend` in r183 handles `renderer.compute()` calls by:
1. Enabling `gl.RASTERIZER_DISCARD` (prevents fragment processing)
2. Compiling the compute logic as a **vertex shader**
3. Using `gl.transformFeedback()` to capture outputs into buffers
4. Drawing `gl.POINTS` to trigger vertex shader invocations
5. Swapping ping-pong buffers via `dualAttributeData.switchBuffers()`

**What this means:** Your compute shader TSL code works on BOTH WebGPU and WebGL2 without changes. The same `Fn(() => { ... })().compute(count)` pattern runs on both backends.

**WebGL2 compute limitations:**
- Count must be a single number, NOT an array (no 2D/3D dispatch)
- No `IndirectStorageBufferAttribute` support
- No true workgroups or shared memory
- Performance is lower than native WebGPU compute (it's vertex shader emulation)
- No `gl_GlobalInvocationID` or workgroup concepts

**For a particle system, this is fine.** The per-particle pattern maps naturally to the "one vertex shader invocation per particle" model.

---

### 12.8 ADAPTIVE PARTICLE COUNT BASED ON GPU CAPABILITY

Three.js r183 does NOT expose GPU adapter info (vendor, architecture, VRAM) through a public API. The `WebGPUBackend` accesses `device.limits` internally but does not expose them.

**Practical approach: Tiered capability detection**

```ts
async function detectGPUTier(renderer: THREE.WebGPURenderer): Promise<'high' | 'medium' | 'low'> {
  await renderer.init();

  const ctx = renderer.getContext();
  const isWebGPU = 'configure' in ctx; // GPUCanvasContext has .configure()

  if (!isWebGPU) {
    // WebGL2 fallback -- conservative
    const gl = ctx as WebGL2RenderingContext;
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Check for known low-end GPUs
      if (/Intel|Mali-4|Adreno [23]/.test(gpuRenderer)) return 'low';
      if (/Mali-G|Adreno [45]|Apple/.test(gpuRenderer)) return 'medium';
    }
    return 'medium'; // Default for WebGL2
  }

  // WebGPU -- check device limits
  const adapter = (ctx as any).__adapter; // Not officially exposed
  // Fallback: benchmark
  return 'high';
}

// Use the tier to set particle count
const PARTICLE_TIERS = {
  high: 200000,   // 200K particles
  medium: 50000,  // 50K particles
  low: 10000,     // 10K particles
};
```

**Better approach: Runtime benchmark**

```ts
async function benchmarkParticleCount(renderer: THREE.WebGPURenderer): Promise<number> {
  // Start with a small test
  const testCount = 10000;
  const testPositions = instancedArray(testCount, 'vec3');
  const testCompute = Fn(() => {
    const pos = testPositions.element(instanceIndex);
    pos.addAssign(vec3(0.001, 0, 0));
  })().compute(testCount);

  // Warm up
  for (let i = 0; i < 10; i++) renderer.compute(testCompute);

  // Benchmark
  const start = performance.now();
  for (let i = 0; i < 60; i++) renderer.compute(testCompute);
  const elapsed = performance.now() - start;

  // Scale: if 10K takes X ms for 60 frames, estimate max for 16ms/frame budget
  const msPerFrame = elapsed / 60;
  const scaleFactor = 12 / msPerFrame; // Target 12ms compute budget (leaving 4ms for render)
  const maxParticles = Math.floor(testCount * scaleFactor);

  // Clamp to reasonable range
  return Math.min(Math.max(maxParticles, 5000), 500000);
}
```

---

### 12.9 FRAME-RATE MONITORING WITH DYNAMIC PARTICLE COUNT ADJUSTMENT

```ts
class AdaptiveParticleManager {
  private frameTimestamps: number[] = [];
  private currentCount: number;
  private targetFPS = 55; // Slightly below 60 to avoid constant adjustment
  private minCount: number;
  private maxCount: number;
  private adjustCooldown = 0;

  constructor(initialCount: number, min: number, max: number) {
    this.currentCount = initialCount;
    this.minCount = min;
    this.maxCount = max;
  }

  // Call once per frame
  update(): number {
    const now = performance.now();
    this.frameTimestamps.push(now);

    // Keep last 60 frames
    while (this.frameTimestamps.length > 60) {
      this.frameTimestamps.shift();
    }

    if (this.adjustCooldown > 0) {
      this.adjustCooldown--;
      return this.currentCount;
    }

    // Need at least 30 frames to measure
    if (this.frameTimestamps.length < 30) return this.currentCount;

    const fps = this.calculateFPS();

    if (fps < this.targetFPS - 10) {
      // Severe drop -- reduce aggressively
      this.currentCount = Math.max(this.minCount, Math.floor(this.currentCount * 0.7));
      this.adjustCooldown = 60; // Wait 60 frames before next adjustment
    } else if (fps < this.targetFPS) {
      // Mild drop -- reduce gently
      this.currentCount = Math.max(this.minCount, Math.floor(this.currentCount * 0.9));
      this.adjustCooldown = 30;
    } else if (fps > 58 && this.currentCount < this.maxCount) {
      // Headroom -- increase slowly
      this.currentCount = Math.min(this.maxCount, Math.floor(this.currentCount * 1.05));
      this.adjustCooldown = 60;
    }

    return this.currentCount;
  }

  private calculateFPS(): number {
    if (this.frameTimestamps.length < 2) return 60;
    const oldest = this.frameTimestamps[0];
    const newest = this.frameTimestamps[this.frameTimestamps.length - 1];
    const elapsed = newest - oldest;
    return ((this.frameTimestamps.length - 1) / elapsed) * 1000;
  }
}
```

**Adjusting particle count at runtime:**

The `particles.count` property on `Sprite` or `Mesh` controls how many instances are drawn. Changing it is instant -- no reallocation needed as long as the storage buffers were allocated at `maxCount`:

```ts
// Allocate at max
const positions = instancedArray(MAX_PARTICLES, 'vec3');
const computeNode = updateFn().compute(MAX_PARTICLES);

// In animation loop, only RENDER a subset
const particles = new THREE.Sprite(material);
particles.count = adaptiveManager.update(); // Dynamic!
```

**Note:** The compute shader still dispatches for `MAX_PARTICLES` threads. To also reduce compute work, you would need to recreate the compute node with a new count, or use a uniform to early-exit threads beyond the active count:

```ts
const activeCount = uniform(100000);

const computeUpdate = Fn(() => {
  If(instanceIndex.greaterThanEqual(int(activeCount)), () => {
    Return(); // Skip inactive particles
  });
  // ... physics ...
});
```

---

### 12.10 RenderPipeline API (REPLACED PostProcessing IN r183)

**`PostProcessing` is DEPRECATED since r183.** It is now a thin wrapper that emits a deprecation warning and delegates to `RenderPipeline`.

```ts
import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

// Create pipeline
const renderPipeline = new THREE.RenderPipeline(renderer);

// Create scene pass (renders scene to offscreen texture)
const scenePass = pass(scene, camera);
const sceneColor = scenePass.getTextureNode('output');

// Chain effects using TSL node composition
const bloomPass = bloom(sceneColor, 1.0, 0.4, 0.0);

// Assign final output
renderPipeline.outputNode = sceneColor.add(bloomPass);

// In animation loop: use renderPipeline.render() instead of renderer.render()
renderer.setAnimationLoop(() => {
  renderer.compute(computeNode);
  renderPipeline.render();  // NOT renderer.render()
});
```

**RenderPipeline constructor:**

```ts
new RenderPipeline(renderer, outputNode?)
```

| Property | Type | Default | Description |
|---|---|---|---|
| `renderer` | Renderer | required | The WebGPURenderer |
| `outputNode` | Node<vec4> | `vec4(0,0,1,1)` | Final output node |
| `outputColorTransform` | boolean | `true` | Auto tone mapping + color space |
| `needsUpdate` | boolean | false | Set `true` when changing `outputNode` |

**Methods:**

| Method | Description |
|---|---|
| `render()` | Renders the pipeline (call instead of `renderer.render()`) |
| `dispose()` | Cleans up |
| ~~`renderAsync()`~~ | **Deprecated since r181** -- just calls `renderer.init()` then `render()` |

**How passes work (node composition, NOT addPass):**

There is NO `addPass()` method. You compose effects as a TSL node graph:

```ts
const scenePass = pass(scene, camera);             // Scene -> texture
const sceneColor = scenePass.getTextureNode('output');  // Get color output
const bloomEffect = bloom(sceneColor);              // Apply bloom
const finalOutput = sceneColor.add(bloomEffect);    // Composite
renderPipeline.outputNode = finalOutput;            // Assign
```

**Changing the pipeline at runtime:**

```ts
renderPipeline.outputNode = newOutputNode;
renderPipeline.needsUpdate = true;  // MUST set this!
```

---

### 12.11 COMPLETE PARTICLE SYSTEM WITH BLOOM EXAMPLE

```ts
// === particle-scene.tsx ===
"use client";
import { useEffect, useRef } from 'react';
import * as THREE from 'three/webgpu';
import {
  Fn, If, uniform, float, vec3, hash, deltaTime, time,
  instancedArray, instanceIndex, shapeCircle, uv, pass
} from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

const MAX_PARTICLES = 200000;
const INITIAL_PARTICLES = 100000;

export default function ParticleScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let disposed = false;
    let renderer: THREE.WebGPURenderer;

    async function init() {
      const container = containerRef.current!;
      const width = container.clientWidth;
      const height = container.clientHeight;

      // --- Renderer ---
      renderer = new THREE.WebGPURenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.0;
      container.appendChild(renderer.domElement);

      await renderer.init();
      if (disposed) { renderer.dispose(); return; }

      // Detect backend
      const isWebGPU = 'configure' in renderer.getContext();
      console.log(`Running on ${isWebGPU ? 'WebGPU' : 'WebGL2'} backend`);

      // --- Scene ---
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
      camera.position.set(0, 10, 30);
      camera.lookAt(0, 0, 0);

      // --- GPU Storage Buffers ---
      const positions = instancedArray(MAX_PARTICLES, 'vec3');
      const velocities = instancedArray(MAX_PARTICLES, 'vec3');

      // --- Compute: Initialize particles ---
      const computeInit = Fn(() => {
        const pos = positions.element(instanceIndex);
        const vel = velocities.element(instanceIndex);

        // Sphere distribution
        const theta = hash(instanceIndex).mul(Math.PI * 2);
        const phi = hash(instanceIndex.add(1)).mul(Math.PI);
        const r = hash(instanceIndex.add(2)).mul(15);

        pos.x.assign(r.mul(phi.sin()).mul(theta.cos()));
        pos.y.assign(r.mul(phi.cos()));
        pos.z.assign(r.mul(phi.sin()).mul(theta.sin()));

        vel.assign(vec3(0, 0, 0));
      })().compute(MAX_PARTICLES);

      renderer.compute(computeInit);

      // --- Compute: Update particles each frame ---
      const gravity = uniform(-0.0005);
      const turbulence = uniform(0.002);
      const activeCount = uniform(INITIAL_PARTICLES);

      const computeUpdate = Fn(() => {
        // Early exit for inactive particles
        If(float(instanceIndex).greaterThanEqual(activeCount), () => { return; });

        const pos = positions.element(instanceIndex);
        const vel = velocities.element(instanceIndex);

        // Gravity
        vel.y.addAssign(gravity);

        // Turbulence (time-varying noise)
        const noiseX = hash(instanceIndex.add(time.mul(100))).sub(0.5).mul(turbulence);
        const noiseZ = hash(instanceIndex.add(time.mul(200))).sub(0.5).mul(turbulence);
        vel.x.addAssign(noiseX);
        vel.z.addAssign(noiseZ);

        // Integration
        pos.addAssign(vel);

        // Damping
        vel.mulAssign(0.995);

        // Floor bounce
        If(pos.y.lessThan(-10), () => {
          pos.y.assign(-10);
          vel.y.assign(vel.y.negate().mul(0.6));
        });

        // Re-emit particles that fall too far
        If(pos.y.lessThan(-15), () => {
          pos.y.assign(hash(instanceIndex.add(time)).mul(20));
          vel.assign(vec3(0, 0, 0));
        });
      });

      const computeParticles = computeUpdate().compute(MAX_PARTICLES);

      // --- Particle Material ---
      const material = new THREE.SpriteNodeMaterial();

      // Color: warm gradient based on height
      const heightFactor = positions.element(instanceIndex).y.div(20).add(0.5).clamp(0, 1);
      material.colorNode = vec3(
        heightFactor.mul(0.3).add(0.7),       // R: warm
        heightFactor.mul(0.5).add(0.2),       // G: varies
        float(1.0).sub(heightFactor).mul(0.8) // B: cool at bottom
      );

      material.positionNode = positions.toAttribute();
      material.scaleNode = uniform(0.15);
      material.opacityNode = shapeCircle().mul(0.8);
      material.transparent = true;
      material.depthWrite = false;
      material.blending = THREE.AdditiveBlending;

      // --- Particle Sprite ---
      const particles = new THREE.Sprite(material);
      particles.count = INITIAL_PARTICLES;
      particles.frustumCulled = false;
      scene.add(particles);

      // --- Post-Processing: Bloom ---
      const renderPipeline = new THREE.RenderPipeline(renderer);
      const scenePass = pass(scene, camera);
      const sceneColor = scenePass.getTextureNode('output');
      const bloomEffect = bloom(sceneColor, 0.8, 0.3, 0.1);
      renderPipeline.outputNode = sceneColor.add(bloomEffect);

      // --- FPS Monitoring ---
      let frameCount = 0;
      let lastFPSCheck = performance.now();
      let currentParticleCount = INITIAL_PARTICLES;

      // --- Animation Loop ---
      renderer.setAnimationLoop(() => {
        if (disposed) return;

        // FPS-based adaptive particle count
        frameCount++;
        const now = performance.now();
        if (now - lastFPSCheck > 1000) {
          const fps = (frameCount / (now - lastFPSCheck)) * 1000;
          frameCount = 0;
          lastFPSCheck = now;

          if (fps < 45 && currentParticleCount > 10000) {
            currentParticleCount = Math.floor(currentParticleCount * 0.8);
            particles.count = currentParticleCount;
            activeCount.value = currentParticleCount;
          } else if (fps > 58 && currentParticleCount < MAX_PARTICLES) {
            currentParticleCount = Math.min(MAX_PARTICLES, Math.floor(currentParticleCount * 1.1));
            particles.count = currentParticleCount;
            activeCount.value = currentParticleCount;
          }
        }

        // Slowly rotate camera
        camera.position.x = Math.sin(Date.now() * 0.0002) * 30;
        camera.position.z = Math.cos(Date.now() * 0.0002) * 30;
        camera.lookAt(0, 0, 0);

        renderer.compute(computeParticles);
        renderPipeline.render();
      });

      // --- Resize ---
      const onResize = () => {
        if (!containerRef.current) return;
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener('resize', onResize);
    }

    init();

    return () => {
      disposed = true;
      if (renderer) {
        renderer.setAnimationLoop(null);
        renderer.dispose();
        renderer.domElement.remove();
      }
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100vh', background: '#000' }} />;
}
```

---

### 12.12 NODE MATERIALS AVAILABLE IN r183

All exported from `three/webgpu`:

1. `NodeMaterial` (base)
2. `LineBasicNodeMaterial`
3. `LineDashedNodeMaterial`
4. `Line2NodeMaterial`
5. `MeshNormalNodeMaterial`
6. `MeshBasicNodeMaterial`
7. `MeshLambertNodeMaterial`
8. `MeshPhongNodeMaterial`
9. `MeshStandardNodeMaterial`
10. `MeshPhysicalNodeMaterial`
11. `MeshSSSNodeMaterial`
12. `MeshToonNodeMaterial`
13. `MeshMatcapNodeMaterial`
14. `PointsNodeMaterial`
15. `SpriteNodeMaterial`
16. `ShadowNodeMaterial`
17. `VolumeNodeMaterial`

---

### 12.13 KEY DIFFERENCES FROM OLD THREE.JS PATTERNS

| Old (WebGL / pre-r171) | New (r183 WebGPU) |
|---|---|
| `new THREE.WebGLRenderer()` | `new THREE.WebGPURenderer()` + `await renderer.init()` |
| `import * as THREE from 'three'` | `import * as THREE from 'three/webgpu'` |
| `ShaderMaterial` with GLSL strings | `SpriteNodeMaterial` / `MeshStandardNodeMaterial` with TSL nodes |
| `THREE.Points` + `BufferGeometry` | `THREE.Sprite` with `.count` property |
| `EffectComposer` + passes | `RenderPipeline` + TSL node composition |
| `PostProcessing` class | `RenderPipeline` (PostProcessing deprecated r183) |
| CPU particle updates in JS loop | `Fn(() => { ... })().compute(count)` on GPU |
| `uniforms: { time: { value: 0 } }` | `uniform(0)` from `three/tsl` |
| Manual GLSL vertex/fragment shaders | TSL: `material.colorNode = ...`, `material.positionNode = ...` |
| `geometry.setAttribute('position', ...)` | `instancedArray(count, 'vec3')` + `.toAttribute()` |

---

### 12.14 SOURCES

- Three.js r183 source: `src/Three.WebGPU.js` (verified all exports)
- Three.js r183 source: `src/renderers/webgpu/WebGPURenderer.js` (constructor, fallback)
- Three.js r183 source: `src/renderers/common/Renderer.js` (API surface, compute(), init())
- Three.js r183 source: `src/renderers/common/RenderPipeline.js` (full class)
- Three.js r183 source: `src/renderers/common/PostProcessing.js` (deprecation)
- Three.js r183 source: `src/renderers/webgl-fallback/WebGLBackend.js` (compute emulation)
- Three.js r183 source: `src/renderers/webgpu/WebGPUBackend.js` (feature detection)
- Three.js r183 source: `src/nodes/tsl/TSLCore.js` (Fn, If, float, vec3, etc.)
- Three.js r183 source: `src/nodes/TSL.js` (all TSL exports)
- Three.js r183 source: `src/nodes/accessors/Arrays.js` (instancedArray, attributeArray)
- Three.js r183 source: `src/nodes/gpgpu/ComputeNode.js` (compute dispatch)
- Three.js r183 source: `src/nodes/accessors/StorageBufferNode.js` (storage, toAttribute)
- Three.js r183 source: `src/nodes/display/PassNode.js` (pass function)
- Three.js r183 source: `src/nodes/utils/Timer.js` (time, deltaTime, frameId)
- Three.js r183 source: `src/nodes/shapes/Shapes.js` (shapeCircle)
- Three.js r183 source: `src/materials/nodes/NodeMaterials.js` (all node materials)
- Three.js r183 example: `examples/webgpu_compute_particles.html` (full working example)
- Three.js r183 example: `examples/webgpu_compute_particles_rain.html` (advanced example)
- Three.js r183 example: `examples/webgpu_tsl_compute_attractors_particles.html` (attractor pattern)
- Three.js r183 example: `examples/webgpu_postprocessing_bloom.html` (RenderPipeline + bloom)
- Three.js r183 addon: `examples/jsm/tsl/display/BloomNode.js` (bloom function)
- R3F v9.0.4 source: `packages/fiber/src/core/renderer.tsx` (GLProps, renderer creation)
- R3F v9.0.4 source: `packages/fiber/src/core/store.ts` (Renderer interface, RootState)
- R3F v10 alpha discussion: `github.com/pmndrs/react-three-fiber/discussions/3665`
- R3F WebGPU issues: #2853, #3352, #3568, #3677
- npm registry: @react-three/fiber versions and peer dependencies

---

## 13. Lenis 1.3.21 + GSAP 3.14.2 ScrollTrigger + Next.js 16 App Router + React 19 -- EXACT Setup

> Researched: 2026-04-02
> Sources: Lenis GitHub (main branch), Lenis React source code, GSAP docs, @gsap/react docs, darkroomengineering/satus (official Lenis Next.js 16 starter), Motion docs, React 19 docs
> All import paths and APIs verified against source code and official documentation.

---

### 13.1 INSTALLATION

```bash
npm install lenis@1.3.21 gsap@3.14.2 @gsap/react@2.1.2
```

**Package breakdown:**
| Package | Version | What it provides |
|---------|---------|-----------------|
| `lenis` | 1.3.21 | Core smooth scroll + `lenis/react` sub-package (ReactLenis, useLenis) |
| `gsap` | 3.14.2 | Core GSAP + ALL plugins including ScrollTrigger (now 100% free) |
| `@gsap/react` | 2.1.2 | `useGSAP` hook (peer deps: gsap ^3.12.5, react >=17) |

**Note:** The official Satus starter (darkroomengineering) does NOT use `@gsap/react`. They drive GSAP via their own `tempus` RAF manager. For most projects, `@gsap/react` with `useGSAP` is the recommended approach.

---

### 13.2 LENIS REACT INTEGRATION -- EXACT IMPORT PATHS

```ts
// Core Lenis
import Lenis from 'lenis'
import type { LenisOptions } from 'lenis'

// CSS (REQUIRED -- without this, Lenis won't work properly)
import 'lenis/dist/lenis.css'

// React integration
import { ReactLenis, useLenis } from 'lenis/react'
import type { LenisRef, LenisProps } from 'lenis/react'

// Also available (same component, different name):
import ReactLenis from 'lenis/react'  // default export
import { Lenis } from 'lenis/react'    // named alias
```

**What `lenis/react` exports:**
- `ReactLenis` (default export + named export)
- `Lenis` (alias for ReactLenis)
- `LenisContext` (React context)
- `useLenis` (hook)
- Types: `LenisRef`, `LenisProps`, `LenisContextValue`

---

### 13.3 LENIS PROVIDER SETUP IN NEXT.JS 16 APP ROUTER

**Critical: `ReactLenis` must be in a Client Component.** The Lenis React source does NOT include a `'use client'` directive, so YOU must add it to your wrapper component.

**File: `components/smooth-scroll.tsx`**
```tsx
'use client'

import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import type { LenisRef } from 'lenis/react'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(update)
    }
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
```

**File: `app/layout.tsx`**
```tsx
import { SmoothScroll } from '@/components/smooth-scroll'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
```

**ReactLenis `root` prop values:**
| Value | Behavior |
|-------|----------|
| `true` | Uses `<html>` as scroll container. No wrapper divs rendered. Lenis instance globally accessible via `useLenis` anywhere in app. |
| `'asChild'` | Renders wrapper/content divs AND makes instance globally accessible. |
| `false` (default) | Scoped to provider tree only. Renders wrapper/content divs. |

**For full-page smooth scrolling, use `root={true}`.**

---

### 13.4 SSR CONSIDERATIONS

1. **Lenis creates its instance inside `useEffect`** -- this only runs client-side, so it is implicitly SSR-safe. No `typeof window` checks needed in the provider itself.

2. **GSAP's `registerPlugin` DOES need a window guard** when called at module scope:
   ```ts
   if (typeof window !== 'undefined') {
     gsap.registerPlugin(ScrollTrigger)
   }
   ```
   The Satus starter uses this exact pattern in their `scroll-trigger.tsx`.

3. **The `'use client'` directive is mandatory** on any component that uses ReactLenis, useLenis, useGSAP, or any GSAP animation code.

4. **The `useGSAP` hook from `@gsap/react`** implements the `useIsomorphicLayoutEffect` technique internally -- it prefers `useLayoutEffect` but falls back to `useEffect` if `window` is undefined. This makes it SSR-safe.

5. **`lenis/dist/lenis.css` import** works fine in both server and client components in Next.js 16 (CSS imports are handled by the bundler).

---

### 13.5 GSAP 3.14.2 -- EXACT IMPORT PATHS AND REGISTRATION

```ts
// Core
import gsap from 'gsap'          // ESM (recommended)
import { gsap } from 'gsap'      // Named import (also works)

// ScrollTrigger
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Other common plugins (ALL FREE, all in the gsap package)
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { Flip } from 'gsap/Flip'
import { Draggable } from 'gsap/Draggable'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { Observer } from 'gsap/Observer'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'

// UMD (for build tools that don't understand ESM)
import gsap from 'gsap/dist/gsap'
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger'

// Eases
import { CustomEase } from 'gsap/CustomEase'
import { RoughEase, ExpoScaleEase, SlowMo } from 'gsap/EasePack'

// React hook
import { useGSAP } from '@gsap/react'

// Registration (call once, before any animations)
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(useGSAP)  // recommended to avoid React version conflicts
// Or register multiple at once:
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
```

**Registration is REQUIRED in build environments** -- tree shaking will remove unregistered plugins.

---

### 13.6 SYNCING LENIS WITH GSAP SCROLLTRIGGER

There are TWO approaches. Both are verified from official sources.

**Approach A: GSAP ticker drives Lenis (Recommended for most projects)**

This is the pattern from the official Lenis React README:

```tsx
'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ReactLenis } from 'lenis/react'
import { useEffect, useRef } from 'react'
import type { LenisRef } from 'lenis/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000) // GSAP ticker time is in SECONDS, Lenis expects MS
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0) // Prevent GSAP from adjusting time on lag

    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis ref={lenisRef} root options={{ autoRaf: false }}>
      {children}
    </ReactLenis>
  )
}
```

**Approach B: Lenis scroll event updates ScrollTrigger (Satus/darkroomengineering pattern)**

This is the pattern from darkroomengineering/satus (Next.js 16.2.0, React 19.2.4, lenis ^1.3.17, gsap ^3.14.2). It separates concerns into two components:

```tsx
// components/lenis-scroll-trigger-sync.tsx (dynamically imported, ssr: false)
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import { useLenis } from 'lenis/react'
import { useEffect, useEffectEvent } from 'react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function LenisScrollTriggerSync() {
  useEffect(() => {
    ScrollTrigger.update()
  }, [])

  const handleUpdate = useEffectEvent(() => {
    ScrollTrigger.update()
  })

  const handleRefresh = useEffectEvent(() => {
    ScrollTrigger.refresh()
  })

  const lenis = useLenis(handleUpdate)

  useEffect(() => {
    if (lenis) {
      handleRefresh()
    }
  }, [lenis])

  return null
}
```

Then in the Lenis provider, dynamically import with `ssr: false`:
```tsx
const LenisScrollTriggerSync = dynamic(
  () => import('./scroll-trigger').then((mod) => mod.LenisScrollTriggerSync),
  { ssr: false }
)

// Inside the Lenis component's return:
<ReactLenis ref={lenisRef} root options={{ autoRaf: false }}>
  {syncScrollTrigger && <LenisScrollTriggerSync />}
</ReactLenis>
```

**Key difference:**
- Approach A: GSAP's ticker is the single RAF source. Lenis piggybacks on GSAP's frame loop. Simpler.
- Approach B: Lenis runs its own RAF (via their `tempus` library), and just tells ScrollTrigger to update whenever Lenis scrolls. Uses `useEffectEvent` (React 19 stable API). More decoupled.

**Both approaches require `options={{ autoRaf: false }}` on ReactLenis when you're providing your own RAF.**

**The `lenis.on('scroll', ScrollTrigger.update)` pattern from the vanilla docs is equivalent to Approach B's `useLenis(handleUpdate)`.**

---

### 13.7 THE `useGSAP` HOOK -- COMPLETE API

```ts
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)
```

**Signature:**
```ts
useGSAP(
  callback: (context: gsap.Context, contextSafe: Function) => void | (() => void),
  config?: {
    dependencies?: unknown[] | null,
    scope?: React.RefObject<HTMLElement>,
    revertOnUpdate?: boolean
  }
)

// Returns:
{ context: gsap.Context, contextSafe: (fn: Function) => Function }
```

**Basic usage with ScrollTrigger:**
```tsx
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export function AnimatedSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to('.box', {
      x: 500,
      scrollTrigger: {
        trigger: '.box',
        start: 'top center',
        end: 'bottom center',
        scrub: true,
      }
    })
  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <div className="box">Animated</div>
    </div>
  )
}
```

**Key behaviors:**
- All GSAP animations, ScrollTriggers, Draggables created inside `useGSAP` are automatically tracked and reverted on unmount
- `scope` makes all CSS selector strings resolve only within that container's DOM subtree
- `contextSafe` wraps functions for animations created AFTER the hook runs (event handlers, setTimeout, etc.)
- `revertOnUpdate: true` reverts and re-runs on every dependency change (not just unmount)
- Implements `useIsomorphicLayoutEffect` internally (SSR-safe)

**Event handler pattern:**
```tsx
const { contextSafe } = useGSAP({ scope: containerRef })

const handleClick = contextSafe(() => {
  gsap.to('.box', { rotation: 360 })
})
```

---

### 13.8 SCROLL-TRIGGERED SECTION TRANSITIONS -- EXACT PATTERNS

**A) Pinning a section:**
```tsx
useGSAP(() => {
  gsap.to('.panel-content', {
    opacity: 1,
    y: 0,
    scrollTrigger: {
      trigger: '.panel',
      pin: true,            // pins .panel while animation plays
      start: 'top top',     // when top of .panel hits top of viewport
      end: '+=100%',        // for one viewport height of scrolling
      scrub: true,          // tie animation progress to scroll
      pinSpacing: true,     // add space so following content catches up
    }
  })
}, { scope: containerRef })
```

**B) Scrubbing animation to scroll position (multi-step timeline):**
```tsx
useGSAP(() => {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.section',
      start: 'top top',
      end: '+=3000',        // 3000px of scroll
      scrub: 1,             // 1 second smoothing (catch-up time)
      pin: true,
    }
  })

  tl.to('.heading', { opacity: 0, y: -100, duration: 1 })
    .to('.image', { scale: 1.5, duration: 2 })
    .to('.description', { opacity: 1, y: 0, duration: 1 })
  // durations are PROPORTIONAL when scrub is active (not absolute time)
}, { scope: containerRef })
```

**C) Triggering animations at specific scroll positions:**
```tsx
useGSAP(() => {
  // Method 1: toggleActions (play/pause/resume/reset at enter/leave/enterBack/leaveBack)
  gsap.from('.card', {
    y: 100,
    opacity: 0,
    stagger: 0.2,
    scrollTrigger: {
      trigger: '.cards-section',
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
    }
  })

  // Method 2: Callbacks
  ScrollTrigger.create({
    trigger: '.section-3',
    start: 'top center',
    end: 'bottom center',
    onEnter: () => console.log('entered'),
    onLeave: () => console.log('left'),
    onEnterBack: () => console.log('entered back'),
    onLeaveBack: () => console.log('left back'),
    markers: true, // visual debugging (remove in production)
  })

  // Method 3: Batch (coordinated group)
  ScrollTrigger.batch('.fade-in', {
    onEnter: (elements) => {
      gsap.to(elements, { opacity: 1, y: 0, stagger: 0.1 })
    },
    onLeave: (elements) => {
      gsap.to(elements, { opacity: 0, y: -20 })
    },
  })
}, { scope: containerRef })
```

**D) Responsive ScrollTrigger with gsap.matchMedia():**
```tsx
useGSAP(() => {
  const mm = gsap.matchMedia()

  mm.add('(min-width: 768px)', () => {
    // Desktop: horizontal scroll section
    gsap.to('.panels', {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: '.panels-container',
        pin: true,
        scrub: 1,
        end: () => '+=' + document.querySelector('.panels-container')!.scrollWidth,
      }
    })
  })

  mm.add('(max-width: 767px)', () => {
    // Mobile: vertical scroll, no pin
    gsap.from('.panels > *', {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      scrollTrigger: { trigger: '.panels-container', start: 'top 80%' }
    })
  })
}, { scope: containerRef })
```

**ScrollTrigger start/end syntax reference:**
| Value | Meaning |
|-------|---------|
| `'top top'` | Top of trigger hits top of viewport |
| `'top center'` | Top of trigger hits center of viewport |
| `'top 80%'` | Top of trigger hits 80% from top of viewport |
| `'bottom top'` | Bottom of trigger hits top of viewport |
| `'+=500'` | 500px beyond the start position |
| `'+=100%'` | One viewport height beyond start |
| `'top bottom-=100px'` | Top of trigger hits 100px above bottom of viewport |

---

### 13.9 KNOWN ISSUES AND GOTCHAS

**Lenis + GSAP + Next.js 16 + React 19:**

1. **DO NOT use both Lenis RAF and GSAP ticker simultaneously.** Set `autoRaf: false` on ReactLenis and let GSAP's ticker drive Lenis, OR use Lenis's own RAF and call `ScrollTrigger.update()` on scroll. Two competing RAF loops cause jank.

2. **GSAP ticker time is in SECONDS, Lenis expects MILLISECONDS.** Always multiply: `lenis.raf(time * 1000)`.

3. **`gsap.ticker.lagSmoothing(0)` is essential** when syncing with Lenis. Without it, GSAP may adjust time on lag spikes, causing Lenis and ScrollTrigger to desync.

4. **Route transitions in Next.js App Router:** Call `ScrollTrigger.refresh()` after route changes or layout shifts. ScrollTrigger caches element positions -- stale caches cause broken triggers.

5. **ScrollTrigger cleanup:** `useGSAP` handles cleanup automatically. Without it, you MUST kill ScrollTriggers on unmount: `ScrollTrigger.getAll().forEach(t => t.kill())`.

6. **Pinning with Lenis `root={true}`:** Since Lenis with `root` uses the native `<html>` scroll container, ScrollTrigger's default `pinType: "fixed"` works correctly. No `scrollerProxy` needed.

7. **`position: sticky` may lag on pre-M1 macOS Safari** with Lenis. This is a known Lenis limitation.

8. **Safari caps at 60fps** (30fps in low power mode). Lenis animations will appear choppier on Safari regardless of configuration.

9. **`syncTouch: true` is unstable on iOS < 16.** Avoid it unless your audience is primarily desktop.

10. **React 19 Strict Mode** double-fires Effects in development. `useGSAP` handles this correctly by reverting and re-creating animations. Manual `useEffect` with GSAP does NOT handle this -- animations will stack.

11. **`useEffectEvent` is now stable in React 19** (imported from `'react'`). The Satus starter uses it for the ScrollTrigger sync callback. It prevents the scroll callback from being a dependency of useEffect, avoiding unnecessary re-subscriptions.

12. **Lenis `autoRaf` prop on ReactLenis is DEPRECATED.** Use `options={{ autoRaf: false }}` instead of the top-level `autoRaf={false}` prop.

13. **CSS is required.** You MUST import `lenis/dist/lenis.css` for Lenis to work. The `autoToggle` feature specifically requires this CSS.

14. **No `scrollerProxy` needed with Lenis `root` mode.** Unlike older smooth scroll libraries that transform a content wrapper, Lenis with `root={true}` manipulates the native scroll position. ScrollTrigger works with it natively -- just sync the updates.

---

### 13.10 MOTION 12.38.0 SCROLL vs GSAP SCROLLTRIGGER -- CAN THEY COEXIST?

**Motion's scroll system:**
```ts
import { scroll } from 'motion'               // vanilla JS
import { useScroll } from 'motion/react'       // React hook
```

**How Motion scroll works:**
- Motion uses the native **`ScrollTimeline` API** when available (Chrome, Edge, Safari) for hardware-accelerated scroll animations
- Animations bound to `ScrollTimeline` run on the compositor thread -- they stay smooth even under heavy CPU load
- Fallback: JavaScript-driven scroll tracking when `ScrollTimeline` isn't available
- Returns `scrollX`, `scrollY`, `scrollXProgress`, `scrollYProgress` as motion values

**Can Motion scroll coexist with GSAP ScrollTrigger?**

YES, with caveats:

1. **They operate on different layers.** Motion's `ScrollTimeline`-based animations run on the GPU compositor thread. GSAP's ScrollTrigger runs on the main JS thread via requestAnimationFrame. They don't directly conflict.

2. **Both read scroll position independently.** Neither modifies the scroll position (that's Lenis's job). They both observe it.

3. **Recommended division of labor:**
   - **Motion `useScroll`**: Simple scroll-linked transforms (parallax, progress bars, opacity fades) -- gets hardware acceleration for free on `opacity`, `transform`, `clipPath`, `filter`
   - **GSAP ScrollTrigger**: Complex orchestration (pinning, timelines, scrubbing multi-step sequences, batch animations, snap)
   - **Lenis**: The actual smooth scrolling behavior

4. **Potential conflict: both responding to the same element's scroll position.** If you use Motion's `useScroll` AND GSAP's ScrollTrigger on the exact same element for the same property, they'll fight. Use one or the other per element/property.

5. **Lenis compatibility with Motion:**
   ```tsx
   // Motion's useScroll reads from the native scroll position
   // Lenis with root={true} manipulates the native scroll position
   // This works out of the box -- no sync needed
   const { scrollYProgress } = useScroll()
   ```

6. **Motion's hardware-accelerated scroll ONLY works for properties the compositor can handle:** `opacity`, `transform`, `clipPath`, `filter`. For anything else (color, width, SVG attributes), it falls back to JS.

**Bottom line:** Use Motion for simple scroll-linked visual transforms that benefit from hardware acceleration. Use GSAP ScrollTrigger for anything that needs pinning, scrubbing timelines, callbacks, or complex orchestration. They complement each other when used on different elements/properties.

---

### 13.11 COMPLETE SETUP RECIPE (COPY-PASTE)

**Step 1: Install**
```bash
npm install lenis@1.3.21 gsap@3.14.2 @gsap/react@2.1.2
```

**Step 2: `components/smooth-scroll.tsx`**
```tsx
'use client'

import type { LenisRef } from 'lenis/react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000)
    }
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)
    return () => gsap.ticker.remove(update)
  }, [])

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
```

**Step 3: `app/layout.tsx`**
```tsx
import { SmoothScroll } from '@/components/smooth-scroll'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  )
}
```

**Step 4: Use in any component**
```tsx
'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useLenis } from 'lenis/react'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  // Access Lenis instance if needed
  const lenis = useLenis()

  useGSAP(() => {
    // Pin the hero and fade content
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1,
      }
    })

    tl.to('.hero-title', { y: -100, opacity: 0, duration: 1 })
      .to('.hero-image', { scale: 1.2, duration: 2 }, '<')
      .from('.hero-subtitle', { y: 50, opacity: 0, duration: 1 })

  }, { scope: containerRef })

  return (
    <div ref={containerRef}>
      <section className="hero h-screen flex items-center justify-center">
        <h1 className="hero-title">Title</h1>
        <img className="hero-image" src="/hero.jpg" alt="" />
        <p className="hero-subtitle">Subtitle</p>
      </section>
    </div>
  )
}
```

---

### 13.12 `useLenis` HOOK API

```ts
const lenis = useLenis(callback?, deps?, priority?)
```

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `callback` | `(lenis: Lenis) => void` | undefined | Called on every scroll event |
| `deps` | `unknown[]` | `[]` | Re-subscribe when deps change |
| `priority` | `number` | `0` | Callback execution order (higher = earlier) |
| **Returns** | `Lenis \| undefined` | | The Lenis instance |

**Example: scroll direction detection**
```tsx
const [direction, setDirection] = useState<'up' | 'down'>('down')
useLenis((lenis) => {
  setDirection(lenis.direction === 1 ? 'down' : 'up')
})
```

**Example: scroll to element**
```tsx
const lenis = useLenis()
const scrollToSection = () => {
  lenis?.scrollTo('#contact', { offset: -100, duration: 1.2 })
}
```

---

### 13.13 GSAP TICKER TIME UNITS REFERENCE

| Source | Unit | Notes |
|--------|------|-------|
| `gsap.ticker.add(fn)` callback `time` param | **Seconds** | Must multiply by 1000 for Lenis |
| `gsap.ticker.add(fn)` callback `deltaTime` param | **Milliseconds** | Time since last tick |
| `gsap.ticker.lagSmoothing(threshold, adjustedLag)` | **Milliseconds** | Both params in ms |
| `lenis.raf(time)` | **Milliseconds** | Lenis always expects ms |
| Motion `frame.update(fn)` callback `data.timestamp` | **Milliseconds** | No conversion needed for Lenis |

---

### 13.14 LENIS FULL OPTIONS REFERENCE

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `wrapper` | HTMLElement / Window | `window` | Scroll container element |
| `content` | HTMLElement | `document.documentElement` | Content element |
| `smoothWheel` | boolean | `true` | Smooth wheel-initiated scroll |
| `lerp` | number | `0.1` | Linear interpolation intensity (0-1) |
| `duration` | number | `1.2` | Scroll animation duration in seconds (ignored if lerp set) |
| `easing` | function | exponential | Easing function (ignored if lerp set) |
| `orientation` | string | `'vertical'` | `'vertical'` or `'horizontal'` |
| `gestureOrientation` | string | `'vertical'` | `'vertical'`, `'horizontal'`, or `'both'` |
| `syncTouch` | boolean | `false` | Mimic touch scroll with sync (unstable iOS<16) |
| `wheelMultiplier` | number | `1` | Mouse wheel speed multiplier |
| `touchMultiplier` | number | `1` | Touch event speed multiplier |
| `infinite` | boolean | `false` | Infinite scrolling |
| `autoResize` | boolean | `true` | Auto-resize via ResizeObserver |
| `prevent` | function | undefined | Return true to prevent smoothing: `(node) => ...` |
| `overscroll` | boolean | `true` | Like CSS overscroll-behavior |
| `autoRaf` | boolean | `false` | Auto requestAnimationFrame loop |
| `anchors` | boolean / object | `false` | Enable anchor link scrolling |
| `autoToggle` | boolean | `false` | Auto start/stop based on overflow (requires CSS) |

---

### 13.15 SCROLLTRIGGER FULL CONFIG REFERENCE

| Property | Type | Description |
|----------|------|-------------|
| `trigger` | String/Element | Element whose position determines start |
| `endTrigger` | String/Element | Different element for end calculation |
| `start` | String/Number/Function | Start scroll position (default: `'top bottom'`) |
| `end` | String/Number/Function | End scroll position (default: `'bottom top'`) |
| `scrub` | Boolean/Number | Link animation to scroll; number = catch-up seconds |
| `pin` | Boolean/String/Element | Pin element during active state |
| `pinSpacing` | Boolean/String | Add padding for pinned content (`true`/`false`/`'margin'`) |
| `pinType` | String | `'fixed'` or `'transform'` (auto-detected) |
| `pinReparent` | Boolean | Reparent to body to escape containing blocks |
| `snap` | Number/Array/Function/Object | Snap to progress values |
| `toggleActions` | String | Four actions: `'play pause resume reset'` |
| `toggleClass` | String/Object | Add/remove CSS class when active |
| `markers` | Boolean/Object | Visual debugging markers |
| `id` | String | Unique identifier |
| `animation` | Tween/Timeline | GSAP animation to control |
| `horizontal` | Boolean | Horizontal scrolling |
| `once` | Boolean | Kill after reaching end once |
| `invalidateOnRefresh` | Boolean | Flush cached values on resize |
| `fastScrollEnd` | Boolean/Number | Force completion on fast scroll |
| `preventOverlaps` | Boolean/String | Force preceding animations to end |
| `onEnter` | Function | Scrolling forward past start |
| `onLeave` | Function | Scrolling forward past end |
| `onEnterBack` | Function | Scrolling backward past end |
| `onLeaveBack` | Function | Scrolling backward past start |
| `onUpdate` | Function | Every progress change |
| `onRefresh` | Function | On resize/refresh |
| `onToggle` | Function | Active state toggle |
| `onScrubComplete` | Function | Scrub finishes catching up |
| `onSnapComplete` | Function | Snap animation completes |

---

### 13.16 SOURCES

**Lenis:**
- [Lenis GitHub README](https://github.com/darkroomengineering/lenis/blob/main/README.md)
- [Lenis React README](https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md)
- [Lenis React source: provider.tsx](https://github.com/darkroomengineering/lenis/blob/main/packages/react/src/provider.tsx)
- [Lenis React source: use-lenis.ts](https://github.com/darkroomengineering/lenis/blob/main/packages/react/src/use-lenis.ts)
- [Lenis React source: types.ts](https://github.com/darkroomengineering/lenis/blob/main/packages/react/src/types.ts)
- [Lenis React entry: index.ts](https://github.com/darkroomengineering/lenis/blob/main/packages/react/index.ts)

**Satus (Official Lenis Next.js 16 Starter):**
- [Satus lenis component](https://github.com/darkroomengineering/satus/blob/main/components/layout/lenis/index.tsx)
- [Satus scroll-trigger sync](https://github.com/darkroomengineering/satus/blob/main/components/layout/lenis/scroll-trigger.tsx)
- [Satus GSAP runtime](https://github.com/darkroomengineering/satus/blob/main/components/effects/gsap.tsx)
- [Satus package.json](https://github.com/darkroomengineering/satus/blob/main/package.json) -- Next.js 16.2.0, React 19.2.4, gsap ^3.14.2, lenis ^1.3.17

**GSAP:**
- [GSAP Installation docs](https://gsap.com/docs/v3/Installation)
- [GSAP registerPlugin](https://gsap.com/docs/v3/GSAP/gsap.registerPlugin())
- [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP React guide](https://gsap.com/resources/React/)
- [GSAP ticker docs](https://gsap.com/docs/v3/GSAP/gsap.ticker)
- [GSAP matchMedia docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia())
- [@gsap/react on GitHub](https://github.com/greensock/react) -- v2.1.2, peer: react >=17

**Motion:**
- [Motion scroll() docs](https://motion.dev/docs/scroll)
- [Motion useScroll docs](https://motion.dev/docs/react-use-scroll)
- [Motion React scroll animations](https://motion.dev/docs/react-scroll-animations)

**React 19:**
- [useEffectEvent docs](https://react.dev/reference/react/useEffectEvent) -- stable in React 19
