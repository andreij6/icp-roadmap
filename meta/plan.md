# ICP Roadmap — MVP Build Plan

> Goal: a usable, on-chain governance app where Founders create projects, Board Members propose features, and Backers stake ICP to vote. Kanban board reflects live on-chain state. Deployable to ICP mainnet.

---

## MVP Scope

**In scope**
- Internet Identity authentication
- ICP Ledger staking to earn roles (Backer / Board Member / Founder)
- Project creation and metadata (name, North Star)
- Ticket lifecycle: Voting → Development → Done → Archived
- Weighted voting with influence boost payments (0.1–10 ICP)
- Quorum detection and auto-promotion to Development
- Kanban board UI (design system port)
- Ticket modal with vote actions
- Influence/stake dashboard panel
- Canister deployed on ICP mainnet (ic network)

**Explicitly out of scope for MVP**
- GitHub webhook integration (Founder can manually move to Dev)
- Drag-and-drop reordering within columns
- Multi-project governance (start with one active project per canister)
- Mobile-responsive layout
- Notification system
- Full marketing site (ship a minimal landing → app redirect)

---

## Phase 0 — Project Scaffold & Toolchain

*Everything needed before writing a line of product code.*

### 0.1 ICP / DFX setup
- [ ] Install `dfx` (stable release, pin version in `mise.toml` or `.tool-versions`)
- [ ] `dfx new icp-roadmap --type=rust` scaffold in project root; commit generated skeleton
- [ ] Add `dfx.json` with two canisters: `roadmap_backend` (Rust) and `roadmap_frontend` (asset canister)
- [ ] Configure local replica network in `dfx.json`; verify `dfx start` and `dfx deploy` work locally

### 0.2 Rust canister workspace
- [ ] Set up `Cargo.toml` workspace with `src/roadmap_backend/` crate
- [ ] Add canister dependencies: `ic-cdk`, `ic-cdk-macros`, `ic-stable-structures`, `candid`, `serde`
- [ ] Wire `wasm32-unknown-unknown` target in toolchain config
- [ ] Confirm `cargo build --target wasm32-unknown-unknown` compiles cleanly

### 0.3 Frontend scaffold
- [ ] Init Vite + React 18 + TypeScript project in `src/roadmap_frontend/`
- [ ] Install Tailwind CSS; configure to consume `design/colors_and_type.css` tokens as CSS variables
- [ ] Install `@dfinity/agent`, `@dfinity/auth-client`, `@dfinity/candid`, `@dfinity/principal`
- [ ] Add `@dfinity/identity-provider` dev dependency for local II testing
- [ ] Configure Vite proxy to forward `/api` to local replica (`http://localhost:4943`)
- [ ] Set up path aliases (`@/` → `src/`)

### 0.4 CI & repo hygiene
- [ ] Add `.gitignore` entries: `.dfx/`, `node_modules/`, `target/`, `dist/`, `*.wasm`
- [ ] GitHub Actions workflow: `cargo test` + `dfx build` on push to main
- [ ] Add `Makefile` with targets: `dev`, `build`, `deploy-local`, `deploy-mainnet`, `test`

---

## Phase 1 — Canister Data Model & Stable Memory

*Define the on-chain types and storage before any business logic.*

### 1.1 Core types (Candid + Rust structs)
- [ ] Define `Principal`-keyed user record: `{ stake_e8s: u64, role: Role, vp: u64 }`
- [ ] Define `Role` enum: `Founder | BoardMember | Backer | Observer`
- [ ] Define `Project` struct: `{ id, name, north_star, founder: Principal, created_at }`
- [ ] Define `Ticket` struct: `{ id, project_id, title, description, status: TicketStatus, author: Principal, created_at, closed_at, github_pr: Option<String> }`
- [ ] Define `TicketStatus` enum: `Voting | Development | Done | Archived`
- [ ] Define `Vote` struct: `{ voter: Principal, direction: VoteDirection, vp: u64, boost_e8s: u64, timestamp }`
- [ ] Define `BoostRecord` struct: `{ ticket_id, amount_e8s: u64, payer: Principal, timestamp }`
- [ ] Generate `.did` Candid file from types; commit to repo

### 1.2 Stable memory storage
- [ ] Set up `ic_stable_structures::StableBTreeMap` for: `users`, `projects`, `tickets`, `votes`, `boosts`
- [ ] Initialize stable memory in `#[init]` and restore in `#[post_upgrade]`
- [ ] Write memory layout constants for each map's memory ID
- [ ] Add upgrade guard: canister rejects upgrade if memory version mismatch

### 1.3 ID generation
- [ ] Implement monotonic `TicketId` counter (stored in stable memory)
- [ ] Ticket IDs formatted as `ROAD-{n}` (zero-padded to 3 digits minimum)
- [ ] Project IDs as slugs derived from name + random suffix

### 1.4 Canister tests (Rust unit)
- [ ] Unit tests for type serialization / Candid round-trip
- [ ] Unit tests for ID generation monotonicity
- [ ] Unit tests for role threshold logic (see Phase 2)

---

## Phase 2 — Auth & Role System

*Internet Identity integration and stake-derived roles.*

### 2.1 Internet Identity (canister side)
- [ ] Accept `caller()` principal as user identity on every update call
- [ ] Auto-create user record on first interaction (with `stake_e8s: 0`, role `Observer`)
- [ ] `query: get_me() -> UserRecord` — returns caller's current record

### 2.2 ICP Ledger integration
- [ ] Add ICP Ledger canister ID to `dfx.json` (use local mock for dev, mainnet `ryjl3-tyaaa-aaaaa-aaaba-cai` for prod)
- [ ] Implement `stake(amount_e8s: u64)` update:
  - Transfer `amount_e8s` from caller to canister's subaccount via `icrc1_transfer` (Ledger call)
  - Credit caller's `stake_e8s` in user record on success
  - Recompute role and VP
- [ ] Implement `unstake(amount_e8s: u64)` update:
  - Verify remaining stake doesn't drop below locked amounts (future: locked votes)
  - Transfer back via `icrc1_transfer`
  - Recompute role and VP
- [ ] Role thresholds as canister constants (updateable by Founder):
  - `BOARD_MEMBER_THRESHOLD_E8S = 50 * 100_000_000` (50 ICP)
  - `BACKER_THRESHOLD_E8S = 0` (any stake)

### 2.3 Voting power formula
- [ ] `base_vp = stake_e8s / 1_000_000` (1 VP per 0.01 ICP staked)
- [ ] Stored on user record; recomputed on every stake/unstake
- [ ] Boost VP: applied per-ticket at vote-cast time, not stored on user record

### 2.4 Access control guards
- [ ] `require_founder(caller)` — panics with `AccessDenied` if not Founder
- [ ] `require_board_member(caller)` — panics if role < BoardMember
- [ ] `require_backer(caller)` — panics if role < Backer (any stake)
- [ ] Apply guards to every relevant update call

---

## Phase 3 — Project & Ticket Management

*Founder creates the project; Board Members propose tickets.*

### 3.1 Project management (Founder only)
- [ ] `create_project(name, north_star) -> Project` — guarded by `require_founder`
- [ ] `update_project(id, patch) -> Project` — update name / North Star
- [ ] `query: get_project(id) -> Project`
- [ ] `query: list_projects() -> Vec<ProjectSummary>`
- [ ] MVP: one active project per canister (enforced by canister constant); future: multi-project

### 3.2 Ticket creation (Board Member)
- [ ] `create_ticket(project_id, title, description) -> Ticket` — guarded by `require_board_member`
- [ ] Ticket created in `Voting` status with empty vote tally
- [ ] Default voting window: 7 days (stored as `closes_at: u64` timestamp)
- [ ] `query: get_ticket(ticket_id) -> TicketDetail` — includes votes and boost total
- [ ] `query: list_tickets(project_id, status_filter: Option<TicketStatus>) -> Vec<TicketSummary>`

### 3.3 Ticket lifecycle (Founder)
- [ ] `move_ticket(ticket_id, new_status: TicketStatus) -> Ticket` — guarded by `require_founder`
- [ ] Founder can move: `Voting → Development`, `Development → Done`, any → `Archived`
- [ ] Auto-move on quorum reached (see Phase 4)
- [ ] `set_github_pr(ticket_id, pr_url: String)` — guarded by `require_founder`; sets linked PR

### 3.4 Ticket expiry (heartbeat)
- [ ] Register `#[heartbeat]` function to run expiry sweep
- [ ] Sweep checks `closes_at` on all `Voting` tickets
- [ ] Expired tickets that did NOT reach quorum → move to `Archived` automatically
- [ ] Expired tickets that DID reach quorum but Founder hasn't moved → leave in Voting (do not auto-promote; Founder must act)

---

## Phase 4 — Voting & Influence Boost

*The core governance loop.*

### 4.1 Casting votes
- [ ] `vote(ticket_id, direction: VoteDirection) -> VoteResult` — guarded by `require_backer`
- [ ] Reject double-vote: each principal can vote once per ticket
- [ ] Record `Vote { voter, direction, vp: caller.vp, boost_e8s: 0, timestamp }`
- [ ] Recompute ticket tally after each vote; return updated `VoteResult { for_vp, against_vp, pct, quorum_reached }`
- [ ] `query: get_ticket_votes(ticket_id) -> Vec<VoteRecord>`

### 4.2 Influence boost
- [ ] `boost_vote(ticket_id, amount_e8s: u64)` — guarded by `require_backer`
- [ ] Validate `amount_e8s` in range `[10_000_000, 1_000_000_000]` (0.1–10 ICP)
- [ ] Transfer `amount_e8s` from caller to canister treasury subaccount via Ledger
- [ ] On success: record `BoostRecord`, add `amount_e8s / 1_000_000` VP to caller's vote on this ticket (or create a "for" vote if none exists)
- [ ] Caller's existing vote VP is updated in place (not a second vote)
- [ ] `query: get_boosts(ticket_id) -> Vec<BoostRecord>`

### 4.3 Quorum logic
- [ ] Quorum = `total_for_vp >= QUORUM_THRESHOLD` (canister constant, default `1000 VP`)
- [ ] AND `for_vp / (for_vp + against_vp) >= 0.50` (simple majority)
- [ ] Check quorum after every `vote` and `boost_vote`; if reached, emit log + optionally notify (future: SNS proposal)
- [ ] `query: quorum_status(ticket_id) -> QuorumStatus { threshold, current_vp, reached, pct }`

### 4.4 Treasury
- [ ] `query: treasury_balance() -> u64` — returns canister's ICP balance (stake deposits + boost fees)
- [ ] `withdraw_treasury(to: Principal, amount_e8s: u64)` — Founder only; moves ICP out

---

## Phase 5 — Frontend: Design System Port

*Translate the prototype components into production React + TypeScript.*

### 5.1 Token integration
- [ ] Import `design/colors_and_type.css` as global stylesheet (or re-export as Tailwind preset)
- [ ] Configure Tailwind to map all `--var` tokens to utility classes where convenient
- [ ] Typography: apply `font-sans` (Inter) and `font-mono` (JetBrains Mono) via Tailwind config
- [ ] Verify scrollbar styling and `::selection` tokens apply globally

### 5.2 Primitive components (`src/components/ui/`)
- [ ] `Pill` — status badge (voting / dev / done / archived / iris / citrine)
- [ ] `Button` — variants: primary, secondary, ghost, stake, danger, success; sizes: sm, md, lg
- [ ] `Avatar` / `AvatarStack` — principal-colored circle, stack with overflow count
- [ ] `VoteBar` — for/against counts, percentage, quorum marker line
- [ ] `Mono` / `ICP` — monospace number helpers
- [ ] `Field` — label + content layout (used in modal sidebar)

### 5.3 Icon set (`src/components/ui/Icons.tsx`)
- [ ] Port all inline SVG icons from `design/ui_kits/app/Icons.jsx` to typed React components
- [ ] Ensure all icons accept `size`, `style`, `className` props
- [ ] Icons needed: Search, Plus, ArrowUp, ArrowDown, Check, X, Archive, Zap, Coins, Key, Star, Branch, PR, CircleDot, ChevDown, ChevRight, More, Clock, Message, Filter, Kbd, Lock

### 5.4 App shell
- [ ] `AppShell` layout: `<Sidebar /> + <main>` with `flex` full-height, no overflow
- [ ] `Header` — project name breadcrumb, North Star pill (citrine), filter + search + new-idea buttons
- [ ] Wire active project from URL param or global state (Zustand or React context)

---

## Phase 6 — Frontend: Core App Screens

### 6.1 Auth flow
- [ ] `AuthProvider` wrapping root — holds `AuthClient`, `identity`, `principal`, `isAuthenticated`
- [ ] `LoginScreen` — full-page: logo, tagline, `Connect Internet Identity` button (iris)
- [ ] On login success: fetch `get_me()` from canister; store user record in context
- [ ] `useActor()` hook — returns typed canister actor bound to current identity
- [ ] Handle session expiry: detect `AnonymousPrincipal` and redirect to login

### 6.2 Kanban board (`src/pages/Board.tsx`)
- [ ] Fetch `list_tickets(project_id)` on mount; poll every 30s for live updates
- [ ] Four columns: Voting, Development, Done, Archived — from `COLUMNS` config
- [ ] Column header: status icon (colored), label, count, "+" button (Board Member only)
- [ ] `TicketCard` component:
  - Ticket ID (mono, muted), boost indicator (citrine zap + ICP amount) if boosted
  - Title (semi, fg)
  - `VoteBar` (Voting column only)
  - Footer: avatar stack, branch name (Dev column), shipped date (Done), archive reason (Archived)
  - Hover: surface-2 bg, border-strong
- [ ] Empty column state: dashed border card, `"No ideas yet."` copy
- [ ] Click card → open `TicketModal`

### 6.3 Ticket modal (`src/components/TicketModal.tsx`)
- [ ] Open as centered overlay with `rgba(8,9,12,0.75)` scrim + `backdrop-blur(8px)`
- [ ] Header: ticket ID (mono), status pill, close (X) button
- [ ] Body left: title (h2), description, vote action block (Voting tickets only)
  - Vote action block: `VoteBar`, VP display, "Vote for" (aurora) + "Vote against" (magenta) + "Boost" (citrine) buttons
  - Role guard: hide vote actions if user is Observer (not staked)
- [ ] Body left continued: Activity feed — list of votes/boosts with avatar, principal, action, VP/ICP, relative time
- [ ] Body right sidebar: Author, Influence total, Quorum progress bar, Closes in, Linked GitHub (or `—`)
- [ ] Founder-only footer bar: move-ticket actions (Voting → Dev, Dev → Done, any → Archive), set GitHub PR

### 6.4 New ticket form
- [ ] Triggered by "New idea" button in Header or "+" in Voting column header
- [ ] Modal or slide-in sheet (right side, 420px wide matching InfluencePanel)
- [ ] Fields: Title (required), Description (textarea, optional)
- [ ] Board Member guard: show `"You need 50+ ICP staked to propose ideas."` with stake CTA if role < BoardMember
- [ ] Submit → `create_ticket(...)` → optimistic UI update → close

---

## Phase 7 — Frontend: Stake & Influence UI

### 7.1 Influence panel (`src/components/InfluencePanel.tsx`)
- [ ] Right-side drawer (420px), triggered from staking button in subheader
- [ ] Stake summary card: staked ICP (citrine, mono 28px), role pill, VP display
- [ ] Stake / Unstake action: amount input + "Stake" button (citrine); confirmation step showing ICP transfer
- [ ] Boost section: amount input with preset chips (0.1 / 0.5 / 1.0 / 5.0 ICP), "Apply boost" button (disabled if no ticket selected in context)
- [ ] Recent boosts history: ticket ID (mono), amount (citrine), relative time
- [ ] Wire to `stake()`, `unstake()`, `boost_vote()` canister methods
- [ ] Show pending transaction state (loading spinner in button) during in-flight Ledger calls

### 7.2 Role-gating across the UI
- [ ] Observer (no stake): can view board, cannot vote, cannot propose; CTA to stake
- [ ] Backer: can vote, can boost; cannot propose
- [ ] Board Member: can vote, boost, and propose tickets
- [ ] Founder: all of above + ticket lifecycle management + treasury
- [ ] Role badge visible in Sidebar footer next to user's VP

### 7.3 Stake onboarding
- [ ] First-time user (Observer) sees inline nudge on empty Influence panel: `"Stake to vote."` + amount input
- [ ] After first stake: panel refreshes with new role + VP; toast notification (simple, no library — a positioned `div` with the Roadmap token styling)

---

## Phase 8 — Deploy & Hardening

### 8.1 Canister hardening
- [ ] Audit all `update` methods: confirm access guards are applied
- [ ] Confirm all Ledger inter-canister calls handle `Err` variants (no silent failures)
- [ ] Add per-principal rate limiting on `vote` and `boost_vote` (max 1 vote per ticket, max 10 boosts per day)
- [ ] Set canister controller to a multi-sig principal before mainnet deploy
- [ ] Test upgrade path: deploy v1, populate data, upgrade to v2 with schema change, verify no data loss

### 8.2 Frontend build hardening
- [ ] Configure `dfx.json` asset canister with `source: ["dist"]` pointing to Vite output
- [ ] Set `Content-Security-Policy` in asset canister config to allow ICP agent XHR only
- [ ] Verify canister ID env vars are injected at build time (no hardcoded IDs)
- [ ] Build output < 5MB (split code if needed)

### 8.3 Local E2E testing
- [ ] Write Playwright tests for critical paths:
  - Login with Internet Identity (local II canister)
  - Stake ICP → role updates to Backer
  - Create ticket (as Board Member)
  - Vote for ticket
  - Boost ticket
  - Founder moves ticket to Development
- [ ] Run against local replica (`dfx start --background`)

### 8.4 Mainnet deploy
- [ ] Acquire cycles (convert ICP via NNS or faucet)
- [ ] `dfx deploy --network ic` — deploy both canisters
- [ ] Verify canister IDs in Candid UI
- [ ] Smoke test: login with real Internet Identity, stake real ICP (0.1 ICP), verify VP, create a ticket
- [ ] Set `dfx.json` `canister_id` fields with mainnet IDs; commit

---

## Phase 9 — MVP Polish (ship-gate)

*The minimum bar before calling this usable.*

- [ ] Empty states for all four Kanban columns (copy from design system README)
- [ ] Error states: failed Ledger transfer, canister rejection, network timeout — all surface as readable messages, not raw errors
- [ ] Loading states: skeleton cards while `list_tickets` is in flight
- [ ] Relative timestamps everywhere (`12m`, `4d`, `2w`)
- [ ] Ticket IDs in mono throughout (`ROAD-001`)
- [ ] ICP amounts always to 1 decimal (`52.0 ICP`, not `52 ICP`)
- [ ] Quorum threshold visible on board subheader (design: `"Quorum: 1,000 VP"`)
- [ ] Founder principal is clearly identified in UI (labeled in sidebar or project header)
- [ ] `dfx.json` README section: how to run locally, how to deploy, how to create Founder account

---

## Dependency Map

```
Phase 0 (toolchain)
  └─ Phase 1 (data model)
       ├─ Phase 2 (auth + roles)
       │    └─ Phase 3 (projects + tickets)
       │         └─ Phase 4 (voting + boost)
       └─ Phase 5 (design system port)
            └─ Phase 6 (board + modal)
                 ├─ Phase 7 (stake UI)        ← needs Phase 4
                 └─ Phase 8 (deploy)          ← needs Phase 4 + Phase 7
                      └─ Phase 9 (polish)
```

Phases 1–4 (canister) and Phases 5–7 (frontend) can proceed in parallel once Phase 0 is done. Phase 8 requires both tracks complete.

---

## Open Questions (resolve before Phase 2)

1. **Founder designation** — how is the initial Founder principal set? Options: (a) canister `--argument` at deploy time, (b) first caller after deploy, (c) hardcoded principal. Recommend (a).
2. **Quorum threshold** — is `1,000 VP` the right default? Should it be configurable per-project by the Founder?
3. **Voting window** — 7 days default. Is this fixed or Founder-configurable per ticket?
4. **Boost directionality** — spec says boost adds influence; design shows it as "for"-aligned. Can a backer boost against a ticket? Clarify before implementing Phase 4.
5. **Treasury disposition** — where do boost fees go? Stay in canister forever? Used to pay cycles? Paid out to Founder? Needs a policy.
6. **Multi-project** — MVP scopes to one project per canister. Is that acceptable or must one canister host many projects?
