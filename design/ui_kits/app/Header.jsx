/* Header — North Star + actions */
const Header = ({ project, onNewIdea }) => (
  <header style={{
    height: 48, flexShrink: 0,
    borderBottom: '1px solid #1F2228', background: 'rgba(8,9,12,0.75)', backdropFilter: 'blur(8px)',
    display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#9AA0AB' }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: project.color }} />
      <span style={{ color: '#E6E8EC', fontWeight: 500 }}>{project.name}</span>
      <IconChevR size={12} style={{ color: '#61666F' }} />
      <span>Roadmap</span>
    </div>

    {/* North Star */}
    <div style={{
      marginLeft: 16, display: 'flex', alignItems: 'center', gap: 8,
      padding: '0 12px', height: 28, background: 'rgba(242,201,76,0.06)',
      border: '1px solid rgba(242,201,76,0.20)', borderRadius: 6,
      color: '#F2C94C', fontSize: 12,
    }}>
      <IconStar size={12} />
      <span style={{ color: '#E6E8EC' }}>North Star</span>
      <span style={{ color: '#61666F' }}>·</span>
      <span style={{ color: '#9AA0AB' }}>{project.northStar}</span>
    </div>

    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
      <Button variant="ghost" size="sm" icon={IconFilter}>Filter</Button>
      <Button variant="ghost" size="sm" icon={IconKbd}>⌘K</Button>
      <Button variant="primary" size="sm" icon={IconPlus} onClick={onNewIdea}>New idea</Button>
    </div>
  </header>
);

Object.assign(window, { Header });
