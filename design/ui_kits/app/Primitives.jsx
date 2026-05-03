/* Pill / Badge */
const Pill = ({ status, children }) => {
  const colors = {
    voting:    { fg: '#7B7FFF', bg: 'rgba(123,127,255,0.10)', bd: 'rgba(123,127,255,0.30)' },
    dev:       { fg: '#F2C94C', bg: 'rgba(242,201,76,0.10)',  bd: 'rgba(242,201,76,0.30)' },
    done:      { fg: '#4ADE80', bg: 'rgba(74,222,128,0.10)',  bd: 'rgba(74,222,128,0.30)' },
    archived:  { fg: '#61666F', bg: 'rgba(255,255,255,0.03)', bd: '#2A2F38' },
    iris:      { fg: '#7B7FFF', bg: 'rgba(123,127,255,0.10)', bd: 'rgba(123,127,255,0.30)' },
    citrine:   { fg: '#F2C94C', bg: 'rgba(242,201,76,0.10)',  bd: 'rgba(242,201,76,0.30)' },
  }[status] || { fg: '#9AA0AB', bg: '#1A1D23', bd: '#2A2F38' };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      height: 22, padding: '0 8px', borderRadius: 999,
      fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em',
      color: colors.fg, background: colors.bg, border: `1px solid ${colors.bd}`,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: colors.fg }} />
      {children}
    </span>
  );
};

/* Button */
const Button = ({ variant = 'secondary', size = 'md', children, icon: Icon, onClick, style }) => {
  const sizes = {
    sm: { h: 24, px: 8, fs: 12, rd: 4, gap: 5 },
    md: { h: 30, px: 12, fs: 13, rd: 6, gap: 6 },
    lg: { h: 36, px: 14, fs: 14, rd: 6, gap: 8 },
  }[size];
  const variants = {
    primary:   { bg: '#7B7FFF', fg: '#FFFFFF', bd: '#7B7FFF', hbg: '#9498FF' },
    secondary: { bg: '#1A1D23', fg: '#E6E8EC', bd: '#2A2F38', hbg: '#22262E' },
    ghost:     { bg: 'transparent', fg: '#E6E8EC', bd: 'transparent', hbg: '#1A1D23' },
    stake:     { bg: 'rgba(242,201,76,0.10)', fg: '#F2C94C', bd: 'rgba(242,201,76,0.30)', hbg: 'rgba(242,201,76,0.16)' },
    danger:    { bg: 'transparent', fg: '#F26D9C', bd: 'rgba(242,109,156,0.30)', hbg: 'rgba(242,109,156,0.10)' },
    success:   { bg: 'rgba(74,222,128,0.10)', fg: '#4ADE80', bd: 'rgba(74,222,128,0.30)', hbg: 'rgba(74,222,128,0.16)' },
  }[variant];
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: sizes.gap,
        height: sizes.h, padding: `0 ${sizes.px}px`, borderRadius: sizes.rd,
        fontFamily: 'inherit', fontSize: sizes.fs, fontWeight: 500,
        color: variants.fg, background: hover ? variants.hbg : variants.bg,
        border: `1px solid ${variants.bd}`, cursor: 'pointer',
        transition: 'all 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        ...style,
      }}
    >
      {Icon ? <Icon size={sizes.fs + 1} /> : null}
      {children}
    </button>
  );
};

/* Avatar */
const Avatar = ({ color = '#7B7FFF', size = 20, label }) => (
  <div style={{
    width: size, height: size, borderRadius: 999, background: color,
    border: '1px solid #1F2228', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    color: '#08090C', fontSize: size * 0.45, fontWeight: 600, flexShrink: 0,
  }}>{label}</div>
);

const AvatarStack = ({ items = [], extra = 0, size = 20 }) => (
  <div style={{ display: 'flex' }}>
    {items.map((it, i) => (
      <div key={i} style={{ marginLeft: i === 0 ? 0 : -6 }}>
        <Avatar {...it} size={size} />
      </div>
    ))}
    {extra > 0 ? <span style={{ marginLeft: 8, fontSize: 11, color: '#9AA0AB' }}>+{extra}</span> : null}
  </div>
);

/* Vote bar */
const VoteBar = ({ forCount, against, quorumPct = 60 }) => {
  const total = forCount + against;
  const pct = total ? Math.round((forCount / total) * 100) : 0;
  const passing = pct >= 50;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#9AA0AB' }}>
        <span style={{ color: '#4ADE80' }}>{forCount}</span>
        <span style={{ color: '#F26D9C' }}>{against}</span>
        <span style={{ marginLeft: 'auto', color: passing ? '#E6E8EC' : '#F26D9C', fontWeight: 500 }}>{pct}%</span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: 'rgba(242,109,156,0.18)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: pct + '%', background: '#4ADE80', borderRadius: 999 }} />
        <div style={{ position: 'absolute', top: -2, bottom: -2, left: quorumPct + '%', width: 1, background: '#61666F' }} />
      </div>
    </div>
  );
};

/* Mono helpers */
const Mono = ({ children, color, style }) => (
  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontVariantNumeric: 'tabular-nums', color, ...style }}>{children}</span>
);

const ICP = ({ amount }) => (
  <Mono color="#F2C94C" style={{ fontWeight: 500 }}>{Number(amount).toFixed(1)} ICP</Mono>
);

Object.assign(window, { Pill, Button, Avatar, AvatarStack, VoteBar, Mono, ICP });
