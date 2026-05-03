# Roadmap App — UI Kit

The on-chain governance product itself. A Kanban board where Founders, Board Members, and Backers steer software with staked ICP.

## Screens
- **Sidebar + Header** — project switcher, principal display, North Star
- **Kanban board** — four columns: Voting / Development / Done / Archived
- **Ticket card** — compact card with vote bar
- **Ticket modal** — full detail view with voting history + influence breakdown
- **Influence panel** — stake balance, boost purchasing

## Components
- `Sidebar.jsx` — left nav with project list + user
- `Header.jsx` — top bar with North Star + actions
- `KanbanBoard.jsx` — four-column board
- `TicketCard.jsx` — voting + development variants
- `TicketModal.jsx` — detail sheet
- `VoteBar.jsx` — sentiment indicator
- `Pill.jsx` — status / role pills
- `Button.jsx` — all button variants
- `Icons.jsx` — Lucide-style inline SVGs
