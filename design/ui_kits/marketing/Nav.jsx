const Nav = () => (
  <nav style={{
    position: 'sticky', top: 0, zIndex: 10,
    height: 56, padding: '0 32px',
    display: 'flex', alignItems: 'center', gap: 24,
    background: 'rgba(8,9,12,0.75)', backdropFilter: 'blur(8px)',
    borderBottom: '1px solid #1F2228',
  }}>
    <img src="../../assets/logo-wordmark.svg" height="28" alt="Roadmap" />
    <div style={{ marginLeft: 24, display: 'flex', gap: 18 }}>
      {['How it works', 'Projects', 'Docs', 'Changelog'].map(item => (
        <a key={item} href="#" style={{ fontSize: 13, color: '#9AA0AB', textDecoration: 'none' }}>{item}</a>
      ))}
    </div>
    <div style={{ marginLeft: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
      <a href="#" style={{ fontSize: 13, color: '#9AA0AB' }}>Sign in</a>
      <button style={{
        height: 30, padding: '0 12px', borderRadius: 6,
        background: '#7B7FFF', color: '#FFFFFF', border: '1px solid #7B7FFF',
        fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <IconKey size={13} />
        Connect Internet Identity
      </button>
    </div>
  </nav>
);

Object.assign(window, { Nav });
