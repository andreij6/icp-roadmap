/* Ticket modal — detail sheet */
const TicketModal = ({ ticket, onClose, onVote }) => {
  if (!ticket) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(8,9,12,0.75)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        animation: 'fadeIn 150ms ease-out',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 720, maxHeight: '85vh', background: '#0B0D11',
          border: '1px solid #2A2F38', borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div style={{
          padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 10,
          borderBottom: '1px solid #1F2228',
        }}>
          <Mono color="#61666F" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500 }}>
            {ticket.id}
          </Mono>
          <Pill status={ticket.status === 'dev' ? 'dev' : ticket.status === 'done' ? 'done' : ticket.status === 'archived' ? 'archived' : 'voting'}>
            {ticket.status === 'dev' ? 'Development' : ticket.status === 'done' ? 'Done' : ticket.status === 'archived' ? 'Archived' : 'Voting'}
          </Pill>
          <button onClick={onClose} style={{
            marginLeft: 'auto', background: 'transparent', border: 'none', cursor: 'pointer',
            color: '#9AA0AB', padding: 4, borderRadius: 4, display: 'flex',
          }}>
            <IconX size={16} />
          </button>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
          {/* Main */}
          <div style={{ flex: 1, padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {ticket.title}
            </h2>
            <p style={{ fontSize: 14, color: '#9AA0AB', lineHeight: 1.55, margin: 0 }}>
              {ticket.description || `Pay cycles from the project canister so backers can vote without holding ICP. Reduces friction for new community members and increases voting participation across long-tail proposals.`}
            </p>

            {/* Vote actions */}
            {ticket.status === 'voting' ? (
              <div style={{ background: '#14161B', border: '1px solid #1F2228', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, color: '#E6E8EC' }}>Cast your vote</span>
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>
                    Your VP: 1,240
                  </span>
                </div>
                <VoteBar forCount={ticket.for} against={ticket.against} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="success" size="md" icon={IconArrowU} onClick={() => onVote('for')} style={{ flex: 1 }}>Vote for</Button>
                  <Button variant="danger"  size="md" icon={IconArrowD} onClick={() => onVote('against')} style={{ flex: 1 }}>Vote against</Button>
                  <Button variant="stake"   size="md" icon={IconZap}>Boost</Button>
                </div>
              </div>
            ) : null}

            {/* Activity */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61666F' }}>Activity</div>
              <Activity items={[
                { who: 'nina.icp', color: '#7B7FFF', what: 'voted for', when: '12m', detail: 'VP 320' },
                { who: 'dom.icp',  color: '#F2C94C', what: 'boosted',   when: '34m', detail: '0.4 ICP' },
                { who: 'kai.icp',  color: '#4ADE80', what: 'voted for', when: '1h',  detail: 'VP 180' },
                { who: 'ari.icp',  color: '#F26D9C', what: 'voted against', when: '2h', detail: 'VP 80' },
              ]} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{
            width: 240, flexShrink: 0, borderLeft: '1px solid #1F2228', padding: '18px 16px',
            display: 'flex', flexDirection: 'column', gap: 14, background: '#08090C',
          }}>
            <Field label="Author">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Avatar color="#7B7FFF" label="N" size={18} />
                <span style={{ fontSize: 12, color: '#E6E8EC' }}>nina.icp</span>
              </div>
            </Field>
            <Field label="Influence">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconZap size={12} style={{ color: '#F2C94C' }} />
                <Mono style={{ fontSize: 12, color: '#F2C94C', fontWeight: 500 }}>2.4 ICP boosted</Mono>
              </div>
            </Field>
            <Field label="Quorum">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Mono style={{ fontSize: 12, color: '#E6E8EC' }}>820 / 1000 VP</Mono>
                <div style={{ height: 4, background: '#1A1D23', borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{ width: '82%', height: '100%', background: '#4ADE80' }} />
                </div>
              </div>
            </Field>
            <Field label="Closes">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <IconClock size={12} style={{ color: '#9AA0AB' }} />
                <span style={{ fontSize: 12, color: '#E6E8EC' }}>in 4 days</span>
              </div>
            </Field>
            <Field label="Linked GitHub">
              <span style={{ fontSize: 12, color: '#61666F' }}>—</span>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
    <span style={{ fontSize: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#61666F' }}>{label}</span>
    {children}
  </div>
);

const Activity = ({ items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {items.map((it, i) => (
      <div key={i} style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 8px', background: '#14161B', borderRadius: 4,
        fontSize: 12, color: '#9AA0AB',
      }}>
        <Avatar color={it.color} label={it.who[0].toUpperCase()} size={16} />
        <span style={{ color: '#E6E8EC' }}>{it.who}</span>
        <span>{it.what}</span>
        <Mono style={{ color: '#9AA0AB', fontSize: 11 }}>{it.detail}</Mono>
        <span style={{ marginLeft: 'auto', color: '#61666F', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{it.when}</span>
      </div>
    ))}
  </div>
);

Object.assign(window, { TicketModal });
