#!/usr/bin/env python3
"""
Seed Linear with all ICP Roadmap MVP tasks.
Usage: LINEAR_API_KEY=lin_api_xxx python3 meta/seed_linear.py
"""

import os, sys, json, time
import urllib.request, urllib.error

API_KEY = os.environ.get("LINEAR_API_KEY", "")
PROJECT_SLUG = "roadmap-icp-ef7f871dc1cd"
ENDPOINT = "https://api.linear.app/graphql"


# ---------------------------------------------------------------------------
# GraphQL helpers
# ---------------------------------------------------------------------------

def gql(query, variables=None):
    payload = json.dumps({"query": query, "variables": variables or {}}).encode()
    req = urllib.request.Request(
        ENDPOINT,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": API_KEY,
        },
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP {e.code}: {e.read().decode()}")
        sys.exit(1)
    if "errors" in data:
        print("GraphQL errors:", json.dumps(data["errors"], indent=2))
        sys.exit(1)
    return data["data"]


def create_issue(team_id, project_id, title, description, state_id, label_ids=None):
    mutation = """
    mutation CreateIssue($input: IssueCreateInput!) {
      issueCreate(input: $input) {
        success
        issue { id identifier title }
      }
    }
    """
    inp = {
        "teamId": team_id,
        "projectId": project_id,
        "title": title,
        "description": description,
        "stateId": state_id,
    }
    if label_ids:
        inp["labelIds"] = label_ids
    result = gql(mutation, {"input": inp})
    issue = result["issueCreate"]["issue"]
    print(f"  ✓ {issue['identifier']}  {title}")
    time.sleep(0.3)  # be polite to the API
    return issue["id"], issue["identifier"]


def add_relation(blocking_id, blocked_id):
    """Mark blocked_id as blockedBy blocking_id."""
    mutation = """
    mutation AddRelation($input: IssueRelationCreateInput!) {
      issueRelationCreate(input: $input) {
        success
      }
    }
    """
    gql(mutation, {"input": {
        "issueId": blocked_id,
        "relatedIssueId": blocking_id,
        "type": "blocks",
    }})


# ---------------------------------------------------------------------------
# Fetch team + project + states
# ---------------------------------------------------------------------------

def bootstrap():
    q = """
    query {
      projects(filter: { slugId: { eq: "%s" } }) {
        nodes {
          id
          name
          teams { nodes { id name } }
        }
      }
    }
    """ % PROJECT_SLUG
    data = gql(q)
    nodes = data["projects"]["nodes"]
    if not nodes:
        print(f"Project not found: {PROJECT_SLUG}")
        sys.exit(1)
    project = nodes[0]
    project_id = project["id"]
    team_id = project["teams"]["nodes"][0]["id"]
    print(f"Project: {project['name']}  ({project_id})")
    print(f"Team:    {project['teams']['nodes'][0]['name']}  ({team_id})")

    # Fetch workflow states
    sq = """
    query States($teamId: String!) {
      team(id: $teamId) {
        states { nodes { id name type } }
      }
    }
    """
    sdata = gql(sq, {"teamId": team_id})
    states = {s["name"]: s["id"] for s in sdata["team"]["states"]["nodes"]}
    print(f"States: {list(states.keys())}")

    backlog_id = states.get("Backlog")
    todo_id    = states.get("Todo")
    if not backlog_id or not todo_id:
        print("Could not find Backlog or Todo states — check your Linear workflow states.")
        sys.exit(1)
    return team_id, project_id, backlog_id, todo_id


# ---------------------------------------------------------------------------
# Issue definitions
# Each entry: (section_key, title, description_markdown, phase, state)
# state: "todo" for Phase 0, "backlog" for everything else
# ---------------------------------------------------------------------------

ISSUES = [
    # ---- PHASE 0 ----
    ("p0_1", "Phase 0.1 — ICP / DFX setup", """\
Set up the dfx toolchain and verify the local replica works.

## Tasks
- [ ] Install `dfx` (stable release); pin version in `mise.toml` or `.tool-versions`
- [ ] `dfx new icp-roadmap --type=rust` scaffold in project root; commit generated skeleton
- [ ] Add `dfx.json` with two canisters: `roadmap_backend` (Rust) and `roadmap_frontend` (asset canister)
- [ ] Configure local replica network in `dfx.json`; verify `dfx start` and `dfx deploy` work locally

## Acceptance Criteria
- [ ] `dfx start --background && dfx deploy` succeeds with no errors on a clean checkout
""", 0, "todo"),

    ("p0_2", "Phase 0.2 — Rust canister workspace", """\
Set up the Rust workspace and confirm the canister compiles to Wasm.

## Tasks
- [ ] Set up `Cargo.toml` workspace with `src/roadmap_backend/` crate
- [ ] Add canister dependencies: `ic-cdk`, `ic-cdk-macros`, `ic-stable-structures`, `candid`, `serde`
- [ ] Wire `wasm32-unknown-unknown` target in toolchain config
- [ ] Confirm `cargo build --target wasm32-unknown-unknown` compiles cleanly

## Acceptance Criteria
- [ ] `cargo build --target wasm32-unknown-unknown -p roadmap_backend` exits 0
""", 0, "todo"),

    ("p0_3", "Phase 0.3 — Frontend scaffold", """\
Bootstrap the React + TypeScript frontend wired to the design system and ICP SDK.

## Tasks
- [ ] Init Vite + React 18 + TypeScript project in `src/roadmap_frontend/`
- [ ] Install Tailwind CSS; configure to consume `design/colors_and_type.css` tokens as CSS variables
- [ ] Install `@dfinity/agent`, `@dfinity/auth-client`, `@dfinity/candid`, `@dfinity/principal`
- [ ] Add `@dfinity/identity-provider` dev dependency for local II testing
- [ ] Configure Vite proxy to forward `/api` to local replica (`http://localhost:4943`)
- [ ] Set up path aliases (`@/` → `src/`)

## Acceptance Criteria
- [ ] `npm run dev` starts without errors and renders a blank page with the canvas background colour (`#08090C`)
""", 0, "todo"),

    ("p0_4", "Phase 0.4 — CI & repo hygiene", """\
Add .gitignore, GitHub Actions CI, and a Makefile for common dev tasks.

## Tasks
- [ ] Add `.gitignore` entries: `.dfx/`, `node_modules/`, `target/`, `dist/`, `*.wasm`
- [ ] GitHub Actions workflow: `cargo test` + `dfx build` on push to main
- [ ] Add `Makefile` with targets: `dev`, `build`, `deploy-local`, `deploy-mainnet`, `test`

## Acceptance Criteria
- [ ] CI passes on a clean push to main
- [ ] `make build` produces both Wasm and frontend dist
""", 0, "todo"),

    # ---- PHASE 1 ----
    ("p1_1", "Phase 1.1 — Core Candid types & Rust structs", """\
Define all on-chain types and generate the Candid interface file.

## Tasks
- [ ] Define `Principal`-keyed user record: `{ stake_e8s: u64, role: Role, vp: u64 }`
- [ ] Define `Role` enum: `Founder | BoardMember | Backer | Observer`
- [ ] Define `Project` struct: `{ id, name, north_star, founder: Principal, created_at }`
- [ ] Define `Ticket` struct: `{ id, project_id, title, description, status: TicketStatus, author: Principal, created_at, closed_at, github_pr: Option<String> }`
- [ ] Define `TicketStatus` enum: `Voting | Development | Done | Archived`
- [ ] Define `Vote` struct: `{ voter: Principal, direction: VoteDirection, vp: u64, boost_e8s: u64, timestamp }`
- [ ] Define `BoostRecord` struct: `{ ticket_id, amount_e8s: u64, payer: Principal, timestamp }`
- [ ] Generate `.did` Candid file from types; commit to repo

## Acceptance Criteria
- [ ] `roadmap_backend.did` is committed and matches Rust structs
- [ ] All types implement `CandidType`, `Serialize`, `Deserialize`
""", 1, "backlog"),

    ("p1_2", "Phase 1.2 — Stable memory storage", """\
Wire up ic-stable-structures for all persistent maps with upgrade safety.

## Tasks
- [ ] Set up `ic_stable_structures::StableBTreeMap` for: `users`, `projects`, `tickets`, `votes`, `boosts`
- [ ] Initialize stable memory in `#[init]` and restore in `#[post_upgrade]`
- [ ] Write memory layout constants for each map's memory ID
- [ ] Add upgrade guard: canister rejects upgrade if memory version mismatch

## Acceptance Criteria
- [ ] Deploy v1, populate data locally, `dfx deploy` again — data survives upgrade
""", 1, "backlog"),

    ("p1_3", "Phase 1.3 — ID generation", """\
Implement monotonic ticket ID counter stored in stable memory.

## Tasks
- [ ] Implement monotonic `TicketId` counter (stored in stable memory)
- [ ] Ticket IDs formatted as `ROAD-{n}` (zero-padded to 3 digits minimum)
- [ ] Project IDs as slugs derived from name + random suffix

## Acceptance Criteria
- [ ] IDs are unique and monotonically increasing across upgrades
""", 1, "backlog"),

    ("p1_4", "Phase 1.4 — Canister unit tests", """\
Rust unit tests for serialization, ID generation, and role thresholds.

## Tasks
- [ ] Unit tests for type serialization / Candid round-trip
- [ ] Unit tests for ID generation monotonicity
- [ ] Unit tests for role threshold logic (see Phase 2)

## Acceptance Criteria
- [ ] `cargo test` passes with all tests green
""", 1, "backlog"),

    # ---- PHASE 2 ----
    ("p2_1", "Phase 2.1 — Internet Identity (canister side)", """\
Accept Internet Identity principals and auto-provision user records.

## Tasks
- [ ] Accept `caller()` principal as user identity on every update call
- [ ] Auto-create user record on first interaction (with `stake_e8s: 0`, role `Observer`)
- [ ] `query: get_me() -> UserRecord` — returns caller's current record

## Acceptance Criteria
- [ ] Calling any update method with a new principal creates a user record
- [ ] `get_me()` returns correct role and VP for caller
""", 2, "backlog"),

    ("p2_2", "Phase 2.2 — ICP Ledger integration (stake / unstake)", """\
Integrate with the ICP Ledger canister to accept and return stake deposits.

## Tasks
- [ ] Add ICP Ledger canister ID to `dfx.json` (local mock for dev, `ryjl3-tyaaa-aaaaa-aaaba-cai` for mainnet)
- [ ] Implement `stake(amount_e8s: u64)` — transfer from caller to canister subaccount, credit stake, recompute role + VP
- [ ] Implement `unstake(amount_e8s: u64)` — verify balance, transfer back, recompute role + VP
- [ ] Role thresholds as canister constants: `BOARD_MEMBER_THRESHOLD_E8S = 50 * 100_000_000`, `BACKER_THRESHOLD_E8S = 0`

## Acceptance Criteria
- [ ] Staking 50 ICP locally bumps role to Board Member
- [ ] Unstaking below threshold drops role back to Backer/Observer
- [ ] Failed Ledger transfer does not credit stake
""", 2, "backlog"),

    ("p2_3", "Phase 2.3 — Voting power formula", """\
Implement and store the VP formula on user records.

## Tasks
- [ ] `base_vp = stake_e8s / 1_000_000` (1 VP per 0.01 ICP staked)
- [ ] VP stored on user record; recomputed on every stake/unstake
- [ ] Boost VP: applied per-ticket at vote-cast time, not stored on user record

## Acceptance Criteria
- [ ] Staking 10 ICP → VP 1000; staking 50 ICP → VP 5000
""", 2, "backlog"),

    ("p2_4", "Phase 2.4 — Access control guards", """\
Implement role guards applied to every restricted update call.

## Tasks
- [ ] `require_founder(caller)` — traps with `AccessDenied` if not Founder
- [ ] `require_board_member(caller)` — traps if role < BoardMember
- [ ] `require_backer(caller)` — traps if role < Backer
- [ ] Apply guards to every relevant update call

## Acceptance Criteria
- [ ] Calling a guarded method as Observer returns an error, not a panic
- [ ] All update calls have guards applied — verified by code review
""", 2, "backlog"),

    # ---- PHASE 3 ----
    ("p3_1", "Phase 3.1 — Project management (Founder)", """\
Founder can create and update project metadata on-chain.

## Tasks
- [ ] `create_project(name, north_star) -> Project` — guarded by `require_founder`
- [ ] `update_project(id, patch) -> Project` — update name / North Star
- [ ] `query: get_project(id) -> Project`
- [ ] `query: list_projects() -> Vec<ProjectSummary>`
- [ ] MVP: one active project per canister enforced by constant

## Acceptance Criteria
- [ ] Founder can create a project; non-Founder call returns AccessDenied
- [ ] `get_project` returns correct metadata after update
""", 3, "backlog"),

    ("p3_2", "Phase 3.2 — Ticket creation (Board Member)", """\
Board Members can propose new tickets into the Voting column.

## Tasks
- [ ] `create_ticket(project_id, title, description, voting_days: Option<u8>) -> Ticket` — guarded by `require_board_member`
- [ ] Ticket created in `Voting` status with empty vote tally
- [ ] Default voting window from project config (7 days); override via `voting_days`
- [ ] `query: get_ticket(ticket_id) -> TicketDetail` — includes votes and boost total
- [ ] `query: list_tickets(project_id, status_filter: Option<TicketStatus>) -> Vec<TicketSummary>`

## Acceptance Criteria
- [ ] Observer / Backer calls return AccessDenied
- [ ] Created ticket appears in `list_tickets` with status Voting
- [ ] `closes_at` is set correctly from voting window
""", 3, "backlog"),

    ("p3_3", "Phase 3.3 — Ticket lifecycle (Founder)", """\
Founder can move tickets between Kanban states and link GitHub PRs.

## Tasks
- [ ] `move_ticket(ticket_id, new_status: TicketStatus) -> Ticket` — guarded by `require_founder`
- [ ] Allowed moves: Voting → Development, Development → Done, any → Archived
- [ ] `set_github_pr(ticket_id, pr_url: String)` — guarded by `require_founder`

## Acceptance Criteria
- [ ] Founder can move a ticket through all states
- [ ] Invalid state transition returns an error
- [ ] `github_pr` field is returned in `get_ticket` after being set
""", 3, "backlog"),

    ("p3_4", "Phase 3.4 — Ticket expiry heartbeat", """\
Register a heartbeat to automatically archive expired tickets that failed quorum.

## Tasks
- [ ] Register `#[heartbeat]` to run expiry sweep
- [ ] Sweep checks `closes_at` on all Voting tickets
- [ ] Expired + did NOT reach quorum → move to Archived automatically
- [ ] Expired + reached quorum but Founder hasn't moved → leave in Voting

## Acceptance Criteria
- [ ] A ticket with `closes_at` in the past and no quorum is archived on next heartbeat tick
- [ ] A quorum-reached expired ticket remains in Voting
""", 3, "backlog"),

    # ---- PHASE 4 ----
    ("p4_1", "Phase 4.1 — Casting votes", """\
Backers and Board Members can cast a single weighted vote per ticket.

## Tasks
- [ ] `vote(ticket_id, direction: VoteDirection) -> VoteResult` — guarded by `require_backer`
- [ ] Reject double-vote: each principal votes once per ticket
- [ ] Record `Vote { voter, direction, vp: caller.vp, boost_e8s: 0, timestamp }`
- [ ] Recompute ticket tally; return `VoteResult { for_vp, against_vp, pct, quorum_reached }`
- [ ] `query: get_ticket_votes(ticket_id) -> Vec<VoteRecord>`

## Acceptance Criteria
- [ ] Second vote call returns error, not silent overwrite
- [ ] `VoteResult.quorum_reached` is true when threshold met
- [ ] VP is correctly attributed from staker's record
""", 4, "backlog"),

    ("p4_2", "Phase 4.2 — Influence boost", """\
Backers can pay ICP to boost their vote weight on a specific ticket. 3% platform fee applies.

## Tasks
- [ ] `boost_vote(ticket_id, amount_e8s: u64)` — guarded by `require_backer`
- [ ] Validate `amount_e8s` in range `[10_000_000, 1_000_000_000]` (0.1–10 ICP)
- [ ] Compute fee: `fee = amount_e8s * 300 / 10_000` (3%)
- [ ] Transfer `fee` → `PLATFORM_TREASURY` principal via Ledger
- [ ] Transfer `amount_e8s - fee` → project canister treasury subaccount
- [ ] Record `BoostRecord`; add `(amount_e8s - fee) / 1_000_000` VP to caller's for-vote on this ticket
- [ ] Rollback (refund caller) if either Ledger transfer fails
- [ ] Boosts are always "for" — no against-boost
- [ ] `query: get_boosts(ticket_id) -> Vec<BoostRecord>`

## Acceptance Criteria
- [ ] 1.0 ICP boost: 0.03 ICP to platform treasury, 0.97 ICP to project treasury, +97 VP added to ticket
- [ ] Failed platform transfer → caller refunded, no boost recorded
- [ ] Amount outside range returns validation error
""", 4, "backlog"),

    ("p4_3", "Phase 4.3 — Quorum logic", """\
Detect quorum after every vote and boost; expose status query.

## Tasks
- [ ] Quorum = `total_for_vp >= QUORUM_THRESHOLD` AND `for_vp / total >= 0.50`
- [ ] Default threshold: 1,000 VP; Founder-configurable via `set_quorum_threshold(vp: u64)` (min 100)
- [ ] Check quorum after every `vote` and `boost_vote`; emit canister log when reached
- [ ] `query: quorum_status(ticket_id) -> QuorumStatus { threshold, current_vp, reached, pct }`

## Acceptance Criteria
- [ ] Quorum reached correctly when for_vp ≥ threshold AND majority
- [ ] Quorum NOT reached when majority not met, even if VP threshold crossed
- [ ] `set_quorum_threshold(50)` returns error (below min 100)
""", 4, "backlog"),

    ("p4_4", "Phase 4.4 — Treasury queries & withdrawal", """\
Expose treasury balance and allow Founder to withdraw project funds.

## Tasks
- [ ] `query: treasury_balance() -> u64` — returns canister ICP subaccount balance
- [ ] `query: get_cycle_balance() -> u64` — returns remaining canister cycles
- [ ] `withdraw_treasury(to: Principal, amount_e8s: u64)` — Founder only
- [ ] Log warning in query responses when cycles < 1T

## Acceptance Criteria
- [ ] Treasury balance increases after boost payment (97% portion)
- [ ] Founder can withdraw to any principal
- [ ] Non-Founder withdrawal returns AccessDenied
""", 4, "backlog"),

    # ---- PHASE 5 ----
    ("p5_1", "Phase 5.1 — Design token integration", """\
Wire the design system CSS tokens into the Tailwind + Vite build.

## Tasks
- [ ] Import `design/colors_and_type.css` as global stylesheet
- [ ] Configure Tailwind to map `--var` tokens to utility classes
- [ ] Apply `font-sans` (Inter) and `font-mono` (JetBrains Mono) via Tailwind config
- [ ] Verify scrollbar styling and `::selection` tokens apply globally

## Acceptance Criteria
- [ ] All CSS variables from `colors_and_type.css` resolve in the browser
- [ ] Page background is `#08090C`; primary text is `#E6E8EC`
""", 5, "backlog"),

    ("p5_2", "Phase 5.2 — Primitive UI components", """\
Build the base component library from the design system prototypes.

## Tasks
- [ ] `Pill` — status badge (voting / dev / done / archived / iris / citrine)
- [ ] `Button` — variants: primary, secondary, ghost, stake, danger, success; sizes: sm, md, lg
- [ ] `Avatar` / `AvatarStack` — principal-coloured circle, stack with overflow count
- [ ] `VoteBar` — for/against counts, percentage, quorum marker line
- [ ] `Mono` / `ICP` — monospace number helpers
- [ ] `Field` — label + content layout (used in modal sidebar)

## Acceptance Criteria
- [ ] All components render pixel-accurately against `design/ui_kits/app/Primitives.jsx` reference
- [ ] All components are typed with TypeScript props
""", 5, "backlog"),

    ("p5_3", "Phase 5.3 — Icon set (TypeScript)", """\
Port the inline SVG icon set from the design prototype to typed React components.

## Tasks
- [ ] Port all icons from `design/ui_kits/app/Icons.jsx` to `src/components/ui/Icons.tsx`
- [ ] All icons accept `size`, `style`, `className` props
- [ ] Icons: Search, Plus, ArrowUp, ArrowDown, Check, X, Archive, Zap, Coins, Key, Star, Branch, PR, CircleDot, ChevDown, ChevRight, More, Clock, Message, Filter, Kbd, Lock

## Acceptance Criteria
- [ ] Every icon renders at 14/16/20/24px with 1.5px stroke
- [ ] Icons inherit `currentColor`
""", 5, "backlog"),

    ("p5_4", "Phase 5.4 — App shell (Sidebar + Header)", """\
Implement the full-height app layout with Sidebar and Header.

## Tasks
- [ ] `AppShell` layout: `<Sidebar /> + <main>` flex full-height, no overflow
- [ ] `Sidebar`: workspace switcher, search, My Work section, Projects section, user footer with VP + role
- [ ] `Header`: project breadcrumb, North Star pill (citrine), filter + search + new-idea buttons
- [ ] Wire active project from URL param or React context

## Acceptance Criteria
- [ ] Layout matches `design/ui_kits/app/index.html` visual reference
- [ ] Sidebar collapses cleanly; header is sticky
""", 5, "backlog"),

    # ---- PHASE 6 ----
    ("p6_1", "Phase 6.1 — Auth flow (Internet Identity)", """\
Implement login/logout with Internet Identity and wire identity to canister calls.

## Tasks
- [ ] `AuthProvider` wrapping root — holds `AuthClient`, `identity`, `principal`, `isAuthenticated`
- [ ] `LoginScreen` — full-page: logo, tagline, `Connect Internet Identity` button (iris)
- [ ] On login success: fetch `get_me()` from canister; store user record in context
- [ ] `useActor()` hook — returns typed canister actor bound to current identity
- [ ] Handle session expiry: detect `AnonymousPrincipal` and redirect to login

## Acceptance Criteria
- [ ] User can log in with local II canister and land on the board
- [ ] Unauthenticated users are redirected to login
- [ ] `useActor()` returns an actor that successfully calls `get_me()`
""", 6, "backlog"),

    ("p6_2", "Phase 6.2 — Kanban board", """\
Render the four-column Kanban board with live ticket data from the canister.

## Tasks
- [ ] Fetch `list_tickets(project_id)` on mount; poll every 30s
- [ ] Four columns: Voting, Development, Done, Archived
- [ ] Column header: status icon (coloured), label, count, "+" button (Board Member only)
- [ ] `TicketCard`: ID (mono), boost indicator, title, VoteBar (Voting only), avatar stack, footer meta
- [ ] Hover: surface-2 bg, border-strong
- [ ] Empty column: dashed border card, `"No ideas yet."`
- [ ] Click card → open TicketModal

## Acceptance Criteria
- [ ] Board renders seed tickets matching design reference
- [ ] Polling updates board without full page refresh
- [ ] "+" button hidden from Backers and Observers
""", 6, "backlog"),

    ("p6_3", "Phase 6.3 — Ticket modal", """\
Full-detail ticket view with voting actions, activity feed, and Founder controls.

## Tasks
- [ ] Centered overlay: `rgba(8,9,12,0.75)` scrim + `backdrop-blur(8px)`
- [ ] Header: ticket ID (mono), status pill, close button
- [ ] Body left: title, description, vote action block (Voting only) with VoteBar + Vote for/against/Boost buttons
- [ ] Role guard: hide vote actions for Observers
- [ ] Activity feed: votes/boosts with avatar, principal, action, VP/ICP, relative time
- [ ] Body right: Author, Influence total, Quorum progress bar, Closes in, Linked GitHub
- [ ] Founder footer bar: move-ticket actions, set GitHub PR input

## Acceptance Criteria
- [ ] Modal matches `design/ui_kits/app/TicketModal.jsx` reference
- [ ] Vote for / Vote against calls `vote()` on canister and updates VoteBar
- [ ] Founder controls visible only to Founder principal
""", 6, "backlog"),

    ("p6_4", "Phase 6.4 — New ticket form", """\
Board Members can propose new tickets via a slide-in sheet.

## Tasks
- [ ] Triggered by "New idea" in Header or "+" in Voting column header
- [ ] Right-side sheet (420px): Title (required), Description (optional textarea)
- [ ] Board Member guard: show `"You need 50+ ICP staked to propose ideas."` with stake CTA
- [ ] Submit → `create_ticket(...)` → optimistic UI insert → close sheet

## Acceptance Criteria
- [ ] Observer / Backer sees the gate message, not the form
- [ ] Submitted ticket appears in Voting column immediately
- [ ] Empty title is prevented client-side
""", 6, "backlog"),

    # ---- PHASE 7 ----
    ("p7_1", "Phase 7.1 — Influence panel (stake + boost UI)", """\
Right-side drawer for staking, unstaking, and buying boosts.

## Tasks
- [ ] Right-side drawer (420px) triggered from staking button in subheader
- [ ] Stake summary: staked ICP (citrine), role pill, VP display
- [ ] Stake / Unstake: amount input + button; confirmation step showing ICP transfer
- [ ] Boost section: amount input + preset chips (0.1 / 0.5 / 1.0 / 5.0 ICP); disabled if no ticket in context
- [ ] Recent boosts history: ticket ID (mono), amount (citrine), relative time
- [ ] Wire to `stake()`, `unstake()`, `boost_vote()` canister calls
- [ ] Loading state in button during in-flight Ledger calls

## Acceptance Criteria
- [ ] Staking 50 ICP updates role pill to Board Member without page refresh
- [ ] Boost button is disabled when no ticket modal is open
- [ ] In-flight state shows spinner; success updates VP immediately
""", 7, "backlog"),

    ("p7_2", "Phase 7.2 — Role-gating across the UI", """\
Apply role-based visibility rules consistently across all UI surfaces.

## Tasks
- [ ] Observer: view board only; CTA to stake visible everywhere
- [ ] Backer: vote + boost; no propose access
- [ ] Board Member: vote + boost + propose tickets
- [ ] Founder: all of above + lifecycle controls + treasury
- [ ] Role badge visible in Sidebar footer next to VP

## Acceptance Criteria
- [ ] Logged-in Observer cannot see vote buttons or new-ticket form
- [ ] Switching role via stake updates UI without reload
""", 7, "backlog"),

    ("p7_3", "Phase 7.3 — Stake onboarding", """\
First-time user nudge for Observers, and toast feedback after staking.

## Tasks
- [ ] Observer sees inline nudge: `"Stake to vote."` + amount input in Influence panel
- [ ] After first stake: panel refreshes with new role + VP
- [ ] Toast notification: positioned `div` using Roadmap tokens (no external library)

## Acceptance Criteria
- [ ] New user sees the nudge on first open of Influence panel
- [ ] Toast appears and disappears within 4s after staking
""", 7, "backlog"),

    # ---- PHASE 8 ----
    ("p8_1", "Phase 8.1 — Canister hardening", """\
Audit, rate-limit, and upgrade-test the canister before mainnet deploy.

## Tasks
- [ ] Audit all `update` methods: confirm access guards applied to every one
- [ ] Confirm all Ledger inter-canister calls handle `Err` variants (no silent failures)
- [ ] Add per-principal rate limiting: max 1 vote per ticket, max 10 boosts per day
- [ ] Set canister controller to a multi-sig principal
- [ ] Test upgrade path: deploy v1, populate data, upgrade to v2, verify no data loss

## Acceptance Criteria
- [ ] No update method lacks an access guard (grep check)
- [ ] Rapid vote spam returns rate-limit error after threshold
- [ ] Data survives a canister upgrade cycle locally
""", 8, "backlog"),

    ("p8_2", "Phase 8.2 — Frontend build hardening", """\
Harden the asset canister config and build pipeline for production.

## Tasks
- [ ] Configure `dfx.json` asset canister with `source: ["dist"]`
- [ ] Set `Content-Security-Policy` to allow ICP agent XHR only
- [ ] Verify canister ID env vars injected at build time (no hardcoded IDs)
- [ ] Build output < 5MB; split code if needed

## Acceptance Criteria
- [ ] `dfx deploy --network ic` deploys frontend without errors
- [ ] CSP header present in asset canister response
- [ ] `dist/` total size < 5MB
""", 8, "backlog"),

    ("p8_3", "Phase 8.3 — Local E2E test suite", """\
Playwright tests covering all critical user flows against local replica.

## Tasks
- [ ] Login with Internet Identity (local II canister)
- [ ] Stake ICP → role updates to Backer
- [ ] Create ticket (as Board Member)
- [ ] Vote for ticket
- [ ] Boost ticket (verify 3% fee routing)
- [ ] Founder moves ticket to Development
- [ ] Run against `dfx start --background`

## Acceptance Criteria
- [ ] All 6 Playwright tests pass locally
- [ ] Tests runnable via `make test`
""", 8, "backlog"),

    ("p8_4", "Phase 8.4 — Mainnet deploy", """\
Deploy both canisters to ICP mainnet and smoke test with real ICP.

## Tasks
- [ ] Acquire cycles (convert ICP via NNS or cycles faucet)
- [ ] `dfx deploy --network ic` — deploy `roadmap_backend` and `roadmap_frontend`
- [ ] Verify canister IDs in Candid UI
- [ ] Smoke test: login with real Internet Identity, stake 0.1 ICP, verify VP, create a ticket
- [ ] Commit mainnet canister IDs to `dfx.json`

## Acceptance Criteria
- [ ] App is live and accessible via `https://<canister-id>.icp0.io`
- [ ] Smoke test completes without errors
- [ ] Mainnet canister IDs committed to repo
""", 8, "backlog"),

    # ---- PHASE 9 ----
    ("p9", "Phase 9 — MVP Polish", """\
The minimum quality bar before calling the MVP usable.

## Tasks
- [ ] Empty states for all four Kanban columns
- [ ] Error states: Ledger failure, canister rejection, network timeout — all show readable messages
- [ ] Loading states: skeleton cards while `list_tickets` in flight
- [ ] Relative timestamps everywhere (`12m`, `4d`, `2w`)
- [ ] Ticket IDs in mono throughout (`ROAD-001`)
- [ ] ICP amounts always to 1 decimal (`52.0 ICP`)
- [ ] Quorum threshold visible on board subheader
- [ ] Founder principal clearly labeled in sidebar / project header
- [ ] README: how to run locally, deploy, create Founder account

## Acceptance Criteria
- [ ] No raw errors surface to users under any flow
- [ ] App passes a manual walkthrough of all role flows without visual regressions
""", 9, "backlog"),
]


# ---------------------------------------------------------------------------
# Blocker relationships
# key → list of keys that must be done first
# ---------------------------------------------------------------------------

BLOCKERS = {
    "p0_2": ["p0_1"],
    "p0_3": ["p0_1"],
    "p0_4": ["p0_1", "p0_2", "p0_3"],
    # Phase 1 blocked by Phase 0
    "p1_1": ["p0_2"],
    "p1_2": ["p1_1"],
    "p1_3": ["p1_1"],
    "p1_4": ["p1_1", "p1_2", "p1_3"],
    # Phase 2 blocked by Phase 1
    "p2_1": ["p1_2"],
    "p2_2": ["p2_1"],
    "p2_3": ["p2_2"],
    "p2_4": ["p2_1"],
    # Phase 3 blocked by Phase 2
    "p3_1": ["p2_4"],
    "p3_2": ["p3_1"],
    "p3_3": ["p3_2"],
    "p3_4": ["p3_2"],
    # Phase 4 blocked by Phase 3
    "p4_1": ["p3_2", "p2_4"],
    "p4_2": ["p4_1"],
    "p4_3": ["p4_1", "p4_2"],
    "p4_4": ["p4_2"],
    # Phase 5 blocked by Phase 0.3 (parallel to canister work)
    "p5_1": ["p0_3"],
    "p5_2": ["p5_1"],
    "p5_3": ["p5_1"],
    "p5_4": ["p5_2", "p5_3"],
    # Phase 6 blocked by Phase 5 + relevant canister phases
    "p6_1": ["p5_4", "p2_1"],
    "p6_2": ["p6_1", "p3_2"],
    "p6_3": ["p6_2", "p4_1"],
    "p6_4": ["p6_1", "p3_2"],
    # Phase 7 blocked by Phase 6 + Phase 4
    "p7_1": ["p6_1", "p4_2"],
    "p7_2": ["p6_1", "p2_4"],
    "p7_3": ["p7_1", "p7_2"],
    # Phase 8 blocked by Phase 7 + Phase 4
    "p8_1": ["p4_4", "p3_3"],
    "p8_2": ["p7_3"],
    "p8_3": ["p8_1", "p8_2"],
    "p8_4": ["p8_3"],
    # Phase 9 blocked by Phase 8
    "p9":   ["p8_4"],
}


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if not API_KEY:
        print("Set LINEAR_API_KEY environment variable and re-run.")
        sys.exit(1)

    print("=== Bootstrapping Linear project ===\n")
    team_id, project_id, backlog_id, todo_id = bootstrap()
    print()

    # Create all issues
    key_to_id = {}   # section key → Linear issue UUID
    key_to_identifier = {}

    print("=== Creating issues ===\n")
    for (key, title, desc, phase, state) in ISSUES:
        state_id = todo_id if state == "todo" else backlog_id
        issue_id, identifier = create_issue(team_id, project_id, title, desc, state_id)
        key_to_id[key] = issue_id
        key_to_identifier[key] = identifier

    print()
    print("=== Wiring blockedBy relationships ===\n")
    for blocked_key, blocking_keys in BLOCKERS.items():
        blocked_id = key_to_id[blocked_key]
        for blocking_key in blocking_keys:
            blocking_id = key_to_id[blocking_key]
            add_relation(blocking_id, blocked_id)
            print(f"  {key_to_identifier[blocking_key]} blocks {key_to_identifier[blocked_key]}")
            time.sleep(0.2)

    print()
    print("=== Done ===")
    print(f"Created {len(ISSUES)} issues with {sum(len(v) for v in BLOCKERS.values())} blocker relationships.")
    print("Phase 0 tickets are in Todo. All others are in Backlog.")


if __name__ == "__main__":
    main()
