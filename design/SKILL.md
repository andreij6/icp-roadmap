---
name: roadmap-design
description: Use this skill to generate well-branded interfaces and assets for Roadmap, the on-chain decentralized software direction platform built on Internet Computer Protocol (ICP), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

- Tokens: `colors_and_type.css` — import this first; it gives you all CSS variables (surfaces, accents, type scale, spacing, radii, shadows, motion).
- Logo: `assets/logo-mark.svg` and `assets/logo-wordmark.svg` (placeholders).
- Icons: Lucide via CDN. 1.5px stroke. Sizes 14/16/20/24.
- Fonts: Inter (UI), JetBrains Mono (numerics, principals, IDs).
- UI kit React components: `ui_kits/app/*.jsx`, `ui_kits/marketing/*.jsx`.
- Demo app: `ui_kits/app/index.html`.
- Demo site: `ui_kits/marketing/index.html`.

## Aesthetic anchors

Dark, dense, fast. Linear-inspired, no gradient bg, no emoji, no bouncy motion. Color is reserved for state — Iris (action/on-chain), Citrine (ICP/staking), Aurora (for-vote/done), Magenta (against/archive). Numbers and IDs are always mono. Sentence case. Direct, declarative copy. Never first person ("we") in product UI.
