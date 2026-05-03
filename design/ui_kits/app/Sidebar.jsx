/* Sidebar */
const Sidebar = ({ projects, activeProject, onSelectProject, user }) => (
  <aside style={{
    width: 240, flexShrink: 0, background: '#0B0D11', borderRight: '1px solid #1F2228',
    display: 'flex', flexDirection: 'column', height: '100%',
  }}>
    {/* Workspace switcher */}
    <div style={{
      height: 48, padding: '0 12px', display: 'flex', alignItems: 'center', gap: 10,
      borderBottom: '1px solid #1F2228',
    }}>
      <img src="../../assets/logo-mark.svg" width="22" height="22" alt="" />
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#E6E8EC' }}>Roadmap</span>
        <span style={{ fontSize: 10, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>2vxsx-fae…icp</span>
      </div>
      <IconChevD size={12} style={{ marginLeft: 'auto', color: '#61666F' }} />
    </div>

    {/* Search */}
    <div style={{ padding: '10px 10px 6px' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, height: 28, padding: '0 10px',
        background: '#14161B', border: '1px solid #1F2228', borderRadius: 6,
        color: '#61666F', fontSize: 12,
      }}>
        <IconSearch size={13} />
        <span>Search</span>
        <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 10 }}>⌘K</span>
      </div>
    </div>

    {/* Section: My Work */}
    <SidebarSection label="My work">
      <SidebarItem icon={IconCircleDot} label="Voting" count={12} />
      <SidebarItem icon={IconBranch} label="Development" count={4} />
      <SidebarItem icon={IconStar} label="Boosted" count={3} />
    </SidebarSection>

    {/* Section: Projects */}
    <SidebarSection label="Projects" actionIcon={IconPlus}>
      {projects.map(p => (
        <SidebarItem
          key={p.id}
          dot={p.color}
          label={p.name}
          active={p.id === activeProject}
          onClick={() => onSelectProject(p.id)}
        />
      ))}
    </SidebarSection>

    {/* Footer: User */}
    <div style={{ marginTop: 'auto', borderTop: '1px solid #1F2228', padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
      <Avatar color="#7B7FFF" label="N" size={26} />
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: '#E6E8EC' }}>{user.name}</span>
        <span style={{ fontSize: 10, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>VP {user.vp.toLocaleString()} · {user.staked.toFixed(1)} ICP</span>
      </div>
      <IconMore size={14} style={{ color: '#61666F' }} />
    </div>
  </aside>
);

const SidebarSection = ({ label, children, actionIcon: Action }) => (
  <div style={{ padding: '10px 0 4px' }}>
    <div style={{
      padding: '0 14px 4px', display: 'flex', alignItems: 'center',
      fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em',
      color: '#61666F',
    }}>
      <span>{label}</span>
      {Action ? <Action size={12} style={{ marginLeft: 'auto', cursor: 'pointer' }} /> : null}
    </div>
    {children}
  </div>
);

const SidebarItem = ({ icon: Icon, dot, label, count, active, onClick }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        height: 28, margin: '0 6px', padding: '0 8px',
        display: 'flex', alignItems: 'center', gap: 8,
        background: active ? '#1A1D23' : (hover ? '#14161B' : 'transparent'),
        borderRadius: 5, cursor: 'pointer',
        color: active ? '#E6E8EC' : '#9AA0AB',
        fontSize: 13, fontWeight: active ? 500 : 400,
      }}
    >
      {Icon ? <Icon size={14} style={{ color: active ? '#E6E8EC' : '#61666F' }} /> : null}
      {dot ? <span style={{ width: 6, height: 6, borderRadius: 999, background: dot }} /> : null}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      {count != null ? <span style={{ marginLeft: 'auto', fontSize: 11, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>{count}</span> : null}
    </div>
  );
};

Object.assign(window, { Sidebar });
