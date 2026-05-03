# Roadmap: Decentralized Software Direction Platform

## 1. Project Overview

**Roadmap** is a community-driven software direction platform built on the Internet Computer Protocol (ICP). It allows developers (Founders) to align with their community (Board Members & Backers) by staking ICP tokens to propose, vote on, and track the progress of software features. The app mimics the sleek UI of modern productivity tools like Linear or Jira while utilizing on-chain governance.

## 2. Technical Stack

- **Blockchain:** Internet Computer Protocol (ICP).
- **Backend (Canisters):** Rust or Motoko (State management, Governance, Staking).
- **Frontend:** React with Tailwind CSS (Linear-style UI).
- **Authentication:** Internet Identity (II).
- **Storage:** On-chain via stable memory (assets and state).

## 3. User Roles & Governance

The system uses a tiered access model based on Principal IDs and staking/payment thresholds.

### 3.1 Founder

- **Definition:** The creator of the project.
- **Permissions:**
    - Initialize project metadata (Title, North Star, GitHub URL).
    - Manage ticket lifecycle (Move from Development to Done/Archived).
    - Integrate GitHub Webhooks for automated status updates.

### 3.2 Board Member

- **Requirement:** High staking threshold (e.g., 50+ ICP).
- **Permissions:**
    - Create new "Idea" tickets in the **Voting** column.
    - Propose direction changes.
    - Full voting rights on all tickets.

### 3.3 Backer

- **Requirement:** Stake to the platform wallet.
    
- **Influence Mechanics:** - Backers can pay an additional **0.1 to 10 ICP** to gain more voting influence on specific projects or globally (to be defined).
    
- **Permissions:**
    
    - Vote "For" or "Against" tickets in the **Voting** column.
    - View the project roadmap.

## 4. The Kanban Workflow

The Roadmap is visualized as a Kanban board with four primary states:

1. **Voting (The Backlog):** - Where new ideas from Board Members land.
    
    - Tickets display a "Vote Bar" showing current community sentiment.
        
2. **Development (Active):** - Ideas that have passed the voting threshold or were promoted by the Founder.
    
    - Displays linked GitHub Issue/PR status.
        
3. **Done:** - Completed features.
4. **Archived:** - Ideas that failed the vote or were deprecated by the Founder.

## 5. Staking & Influence Logic

- **Platform Wallet Staking:** Backers stake ICP into a central platform wallet to verify community membership.

- **Influence Multipliers:** - A base influence is granted for the initial stake.
    - Additional influence is purchased via a one-time payment or "boost" (0.1 - 10 ICP).
- **Voting Power Formula:** $VP = (\text{Staked Amount} \times \text{Base Weight}) + \text{Influence Boost}$.
- **Quorum:** A ticket moves to "Development" based on the total weighted influence of the votes cast.

## 6. UI/UX Requirements

- **Theme:** Dark-mode centric, high-contrast, minimal borders (Linear aesthetic).
- **Interactions:** Drag-and-drop ticket movement (Founder only).
- **Influencer Dashboard:** A dedicated UI section for Backers to manage their stake and purchase influence boosts.
- **Components:**
    - **Sidebar:** Project switcher and user profile (Principal ID/Influence Level).
    - **Header:** "North Star" mission statement display.
    - **Board:** Four-column responsive grid.
    - **Ticket Modal:** Detailed view with voting history and influence breakdowns.

## 7. Security & Privacy

- **Internet Identity:** Ensures anonymous yet secure user sessions.
- **Canister Access Control:** Strict checks on influence levels for voting actions.
- **Financial Integrity:** All ICP transactions (Staking and Influence Payments) are verified against the ICP Ledger canister.