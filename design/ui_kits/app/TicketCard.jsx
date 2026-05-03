/* Ticket card — variants by status */
const TicketCard = ({ ticket, onClick }) => {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: hover ? '#1A1D23' : '#14161B',
        border: `1px solid ${hover ? '#2A2F38' : '#1F2228'}`,
        borderRadius: 6, padding: 12,
        display: 'flex', flexDirection: 'column', gap: 8,
        boxShadow: '0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 2px rgba(0,0,0,0.4)',
        cursor: 'pointer', transition: 'all 150ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Head: ID + meta */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#61666F',
        textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 500,
      }}>
        <span>{ticket.id}</span>
        {ticket.boosted ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#F2C94C' }}>
            <IconZap size={10} />
            {ticket.boosted.toFixed(1)}
          </span>
        ) : null}
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          {ticket.status === 'voting' && <span style={{ color: '#7B7FFF' }}>{ticket.closesIn}</span>}
          {ticket.status === 'dev' && <span style={{ color: '#F2C94C' }}>{ticket.pr}</span>}
          {ticket.status === 'done' && <span style={{ color: '#4ADE80' }}>{ticket.shippedAt}</span>}
          {ticket.status === 'archived' && <span style={{ color: '#61666F' }}>{ticket.reason}</span>}
        </span>
      </div>

      {/* Title */}
      <div style={{ fontSize: 13, fontWeight: 500, color: '#E6E8EC', lineHeight: 1.35 }}>
        {ticket.title}
      </div>

      {/* Vote bar (voting only) */}
      {ticket.status === 'voting' ? (
        <VoteBar forCount={ticket.for} against={ticket.against} />
      ) : null}

      {/* Foot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#9AA0AB', marginTop: 2 }}>
        <AvatarStack items={ticket.avatars || []} extra={ticket.extra} size={18} />
        {ticket.status === 'dev' && (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#9AA0AB' }}>
            <IconBranch size={11} />
            {ticket.branch}
          </span>
        )}
        {ticket.comments ? (
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <IconMsg size={11} />
            {ticket.comments}
          </span>
        ) : null}
      </div>
    </div>
  );
};

Object.assign(window, { TicketCard });
