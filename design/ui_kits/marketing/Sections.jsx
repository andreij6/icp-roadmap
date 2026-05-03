const Showcase = () => {
  const projects = [
    { name: 'OpenChat',   color: '#F26D9C', voters: '4.2k', staked: 624.0,  active: 18, ns: 'Decentralised group chat for everyone' },
    { name: 'Oisy Wallet',color: '#F2C94C', voters: '2.8k', staked: 412.0,  active: 12, ns: 'A wallet anyone can audit' },
    { name: 'Caffeine.ai',color: '#4ADE80', voters: '3.1k', staked: 380.0,  active: 22, ns: 'Vibe-code on-chain apps' },
    { name: 'ICP Hub',    color: '#7B7FFF', voters: '1.4k', staked: 220.0,  active: 8,  ns: 'A canister-first developer portal' },
  ];

  return (
    <section style={{ padding: '80px 32px', borderBottom: '1px solid #1F2228' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 32 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#F2C94C' }}>Live boards</span>
            <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0 }}>Projects shipping on-chain.</h2>
          </div>
          <a href="#" style={{ marginLeft: 'auto', fontSize: 13, color: '#7B7FFF' }}>Browse all 184 →</a>
        </div>

        <div style={{ border: '1px solid #1F2228', borderRadius: 8, overflow: 'hidden', background: '#0B0D11' }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr',
            padding: '10px 16px', borderBottom: '1px solid #1F2228',
            fontSize: 11, fontWeight: 500, color: '#61666F', textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <span>Project</span>
            <span>North star</span>
            <span style={{ textAlign: 'right' }}>Voters</span>
            <span style={{ textAlign: 'right' }}>Staked</span>
            <span style={{ textAlign: 'right' }}>Active</span>
          </div>
          {projects.map((p, i) => (
            <div key={i} style={{
              display: 'grid', gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr',
              padding: '14px 16px', borderBottom: i < projects.length - 1 ? '1px solid #1F2228' : 'none',
              alignItems: 'center', fontSize: 13,
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
                <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{p.name}</span>
              </span>
              <span style={{ color: '#9AA0AB' }}>{p.ns}</span>
              <Mono style={{ textAlign: 'right', color: '#E6E8EC' }}>{p.voters}</Mono>
              <Mono style={{ textAlign: 'right', color: '#F2C94C' }}>{p.staked.toFixed(1)} ICP</Mono>
              <Mono style={{ textAlign: 'right', color: '#9AA0AB' }}>{p.active}</Mono>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer style={{ padding: '48px 32px 56px' }}>
    <div style={{ maxWidth: 1180, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 24 }}>
      <img src="../../assets/logo-wordmark.svg" height="24" alt="Roadmap" />
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 18, fontSize: 12, color: '#61666F' }}>
        {['Docs', 'Canister source', 'Privacy', 'Terms'].map(l => <a key={l} href="#" style={{ color: '#9AA0AB' }}>{l}</a>)}
      </div>
      <Mono style={{ fontSize: 11, color: '#61666F' }}>v0.4.2 · canister rrkah-fqaaa</Mono>
    </div>
  </footer>
);

Object.assign(window, { Showcase, Footer });
