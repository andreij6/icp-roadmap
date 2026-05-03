const Hero = () => (
  <section style={{
    position: 'relative', padding: '96px 32px 80px',
    backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
    backgroundSize: '32px 32px',
    borderBottom: '1px solid #1F2228',
  }}>
    <div style={{ maxWidth: 1180, margin: '0 auto', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <span style={{
          alignSelf: 'flex-start', display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', height: 24, borderRadius: 999,
          background: 'rgba(123,127,255,0.10)', border: '1px solid rgba(123,127,255,0.30)',
          color: '#7B7FFF', fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 999, background: '#7B7FFF' }} />
          On the Internet Computer
        </span>
        <h1 style={{
          fontSize: 64, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.05,
          color: '#FFFFFF', margin: 0,
        }}>
          The roadmap belongs<br/>to whoever stakes it.
        </h1>
        <p style={{ fontSize: 17, color: '#9AA0AB', lineHeight: 1.55, maxWidth: 520, margin: 0 }}>
          Roadmap is a community-owned product backlog. Founders propose features, board members and backers vote with staked ICP, and the chain decides what ships next.
        </p>
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button style={{
            height: 40, padding: '0 18px', borderRadius: 6,
            background: '#7B7FFF', color: '#FFFFFF', border: '1px solid #7B7FFF',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>Start a project</button>
          <button style={{
            height: 40, padding: '0 18px', borderRadius: 6,
            background: '#1A1D23', color: '#E6E8EC', border: '1px solid #2A2F38',
            fontSize: 14, fontWeight: 500, cursor: 'pointer',
          }}>See live boards</button>
        </div>
        <div style={{ display: 'flex', gap: 24, marginTop: 12, fontSize: 12, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>
          <span>184 projects</span>
          <span>·</span>
          <span>12.4k voters</span>
          <span>·</span>
          <span>2,040 ICP staked</span>
        </div>
      </div>

      {/* Schematic visual — mini Kanban */}
      <div style={{
        background: '#0B0D11', border: '1px solid #1F2228', borderRadius: 12, padding: 14,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 11, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#F2C94C' }} />
          ICP Roadmap · live
          <span style={{ marginLeft: 'auto' }}>VP 12,480</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { c: '#7B7FFF', l: 'Voting',   n: 12, items: [
              { t: 'Gasless voting', f: 412, a: 88, p: 82 },
              { t: 'Vote weight breakdown', f: 184, a: 22, p: 89 },
            ]},
            { c: '#F2C94C', l: 'Dev', n: 4, items: [
              { t: 'Treasury dashboard', pr: '#PR-204' },
              { t: 'GH webhooks', pr: '#PR-198' },
            ]},
            { c: '#4ADE80', l: 'Done', n: 38, items: [
              { t: 'II sign-in', s: 'shipped' },
              { t: 'Stake-to-vote', s: 'shipped' },
            ]},
          ].map((col, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 600, color: '#E6E8EC' }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: col.c }} />
                {col.l}
                <span style={{ marginLeft: 'auto', color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>{col.n}</span>
              </div>
              {col.items.map((it, j) => (
                <div key={j} style={{ background: '#14161B', border: '1px solid #1F2228', borderRadius: 5, padding: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: '#E6E8EC', lineHeight: 1.3 }}>{it.t}</span>
                  {it.f != null ? (
                    <>
                      <div style={{ display: 'flex', gap: 6, fontSize: 9, fontFamily: 'JetBrains Mono, monospace' }}>
                        <span style={{ color: '#4ADE80' }}>{it.f}</span>
                        <span style={{ color: '#F26D9C' }}>{it.a}</span>
                        <span style={{ marginLeft: 'auto', color: '#E6E8EC' }}>{it.p}%</span>
                      </div>
                      <div style={{ height: 3, borderRadius: 999, background: 'rgba(242,109,156,0.18)', overflow: 'hidden' }}>
                        <div style={{ width: it.p + '%', height: '100%', background: '#4ADE80' }} />
                      </div>
                    </>
                  ) : it.pr ? (
                    <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: '#F2C94C' }}>{it.pr}</span>
                  ) : (
                    <span style={{ fontSize: 9, fontFamily: 'JetBrains Mono, monospace', color: '#4ADE80' }}>{it.s}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

Object.assign(window, { Hero });
