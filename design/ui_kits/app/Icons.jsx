// Inline SVG icons — Lucide-compatible, 1.5px stroke
const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

const Ic = ({ size = 16, children, style }) => (
  <svg {...baseProps} width={size} height={size} style={{ flexShrink: 0, ...style }}>
    {children}
  </svg>
);

const IconSearch  = (p) => <Ic {...p}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></Ic>;
const IconPlus    = (p) => <Ic {...p}><path d="M12 5v14M5 12h14"/></Ic>;
const IconArrowU  = (p) => <Ic {...p}><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></Ic>;
const IconArrowD  = (p) => <Ic {...p}><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></Ic>;
const IconCheck   = (p) => <Ic {...p}><path d="M20 6 9 17l-5-5"/></Ic>;
const IconX       = (p) => <Ic {...p}><path d="M18 6 6 18M6 6l12 12"/></Ic>;
const IconArchive = (p) => <Ic {...p}><rect x="3" y="3" width="18" height="4" rx="1"/><path d="M5 7v13h14V7"/><path d="M10 12h4"/></Ic>;
const IconZap     = (p) => <Ic {...p}><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></Ic>;
const IconCoins   = (p) => <Ic {...p}><circle cx="8" cy="8" r="6"/><circle cx="16" cy="16" r="6"/></Ic>;
const IconKey     = (p) => <Ic {...p}><circle cx="8" cy="15" r="4"/><path d="m10.85 12.15 8.65-8.65"/><path d="m18 5 3 3"/><path d="m15 8 3 3"/></Ic>;
const IconStar    = (p) => <Ic {...p}><path d="M12 2 14.2 9.8 22 12 14.2 14.2 12 22 9.8 14.2 2 12 9.8 9.8 Z"/></Ic>;
const IconBranch  = (p) => <Ic {...p}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/></Ic>;
const IconPR      = (p) => <Ic {...p}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"/></Ic>;
const IconCircle  = (p) => <Ic {...p}><circle cx="12" cy="12" r="10"/></Ic>;
const IconCircleDot = (p) => <Ic {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/></Ic>;
const IconChevD   = (p) => <Ic {...p}><path d="m6 9 6 6 6-6"/></Ic>;
const IconChevR   = (p) => <Ic {...p}><path d="m9 6 6 6-6 6"/></Ic>;
const IconMore    = (p) => <Ic {...p}><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></Ic>;
const IconClock   = (p) => <Ic {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></Ic>;
const IconMsg     = (p) => <Ic {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></Ic>;
const IconFilter  = (p) => <Ic {...p}><path d="M22 3H2l8 9.5V19l4 2v-8.5L22 3z"/></Ic>;
const IconKbd     = (p) => <Ic {...p}><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h12"/></Ic>;
const IconLock    = (p) => <Ic {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></Ic>;

Object.assign(window, {
  IconSearch, IconPlus, IconArrowU, IconArrowD, IconCheck, IconX,
  IconArchive, IconZap, IconCoins, IconKey, IconStar, IconBranch,
  IconPR, IconCircle, IconCircleDot, IconChevD, IconChevR, IconMore,
  IconClock, IconMsg, IconFilter, IconKbd, IconLock,
});
