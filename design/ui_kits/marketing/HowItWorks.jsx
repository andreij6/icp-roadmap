const HowItWorks = () => (
  <section style={{ padding: '80px 32px', borderBottom: '1px solid #1F2228' }}>
    <div style={{ maxWidth: 1180, margin: '0 auto' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 40 }}>
        <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#7B7FFF' }}>How it works</span>
        <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', color: '#FFFFFF', margin: 0, maxWidth: 600 }}>
          Three steps from idea to canister.
        </h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { n: '01', icon: IconCoins, color: '#F2C94C', t: 'Stake ICP', d: 'Deposit ICP into the platform canister to verify community membership. 50+ to become a Board Member, any amount to back.' },
          { n: '02', icon: IconCircleDot, color: '#7B7FFF', t: 'Vote on ideas', d: 'Board members propose features. Backers vote for or against. Spend 0.1–10 ICP to boost your weight on proposals you care about.' },
          { n: '03', icon: IconBranch, color: '#4ADE80', t: 'Watch it ship', d: 'When a ticket passes quorum, the Founder moves it into Development. Linked GitHub PRs flow status back on-chain until done.' },
        ].map((s, i) => (
          <div key={i} style={{
            background: '#14161B', border: '1px solid #1F2228', borderRadius: 8, padding: 24,
            display: 'flex', flexDirection: 'column', gap: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Mono color="#61666F" style={{ fontSize: 12, fontWeight: 500 }}>{s.n}</Mono>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 600, color: '#FFFFFF', margin: 0, letterSpacing: '-0.015em' }}>{s.t}</h3>
            <p style={{ fontSize: 14, color: '#9AA0AB', lineHeight: 1.55, margin: 0 }}>{s.d}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

Object.assign(window, { HowItWorks });
