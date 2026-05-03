/* Influence panel — backer's stake & boost dashboard */
const InfluencePanel = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(8,9,12,0.75)', backdropFilter: 'blur(8px)',
      display: 'flex', justifyContent: 'flex-end', zIndex: 100,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: 420, height: '100%', background: '#0B0D11',
        borderLeft: '1px solid #2A2F38', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: '1px solid #1F2228', display: 'flex', alignItems: 'center', gap: 10 }}>
          <IconZap size={14} style={{ color: '#F2C94C' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#E6E8EC' }}>Influence</span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#9AA0AB', cursor: 'pointer', padding: 4 }}>
            <IconX size={16} />
          </button>
        </div>

        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
          {/* Stake summary */}
          <div style={{ background: '#14161B', border: '1px solid #1F2228', borderRadius: 8, padding: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61666F', marginBottom: 6 }}>Staked</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <Mono style={{ fontSize: 28, fontWeight: 600, color: '#F2C94C' }}>52.0</Mono>
              <span style={{ color: '#9AA0AB', fontSize: 13 }}>ICP</span>
              <Pill status="iris" style={{ marginLeft: 'auto' }}>Board Member</Pill>
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: '#9AA0AB' }}>
              Voting power: <Mono style={{ color: '#E6E8EC', fontWeight: 500 }}>VP 1,240</Mono>
            </div>
          </div>

          {/* Boost */}
          <div style={{ background: '#14161B', border: '1px solid #1F2228', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: '#E6E8EC' }}>Buy a boost</span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#61666F' }}>0.1 – 10.0 ICP</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, height: 36, border: '1px solid #2A2F38', borderRadius: 6, background: '#08090C', padding: '0 12px 0 0' }}>
              <input defaultValue="0.5" style={{ flex: 1, height: '100%', background: 'transparent', border: 'none', outline: 'none', color: '#E6E8EC', padding: '0 12px', font: '500 14px JetBrains Mono, monospace' }} />
              <span style={{ color: '#F2C94C', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 500 }}>ICP</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0.1, 0.5, 1.0, 5.0].map(v => (
                <button key={v} style={{
                  flex: 1, height: 26, background: '#1A1D23', border: '1px solid #2A2F38',
                  borderRadius: 4, color: '#9AA0AB', fontFamily: 'JetBrains Mono, monospace',
                  fontSize: 11, cursor: 'pointer',
                }}>{v.toFixed(1)}</button>
              ))}
            </div>
            <Button variant="stake" size="md" icon={IconZap}>Apply boost</Button>
          </div>

          {/* History */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61666F', marginBottom: 8 }}>Recent boosts</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {[
                { id: 'ROAD-142', amount: 2.4, when: '2h' },
                { id: 'ROAD-118', amount: 0.5, when: '1d' },
                { id: 'ROAD-091', amount: 1.0, when: '4d' },
              ].map(b => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', background: '#14161B', border: '1px solid #1F2228', borderRadius: 4 }}>
                  <Mono style={{ fontSize: 11, color: '#61666F', textTransform: 'uppercase' }}>{b.id}</Mono>
                  <Mono style={{ marginLeft: 'auto', fontSize: 12, color: '#F2C94C', fontWeight: 500 }}>+{b.amount.toFixed(1)} ICP</Mono>
                  <span style={{ fontSize: 11, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>{b.when}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { InfluencePanel });
