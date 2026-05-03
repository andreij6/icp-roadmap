/* Kanban board — 4 columns */
const COLUMNS = [
  { id: 'voting',    label: 'Voting',      status: 'voting',   icon: IconCircleDot, color: '#7B7FFF' },
  { id: 'dev',       label: 'Development', status: 'dev',      icon: IconBranch,    color: '#F2C94C' },
  { id: 'done',      label: 'Done',        status: 'done',     icon: IconCheck,     color: '#4ADE80' },
  { id: 'archived',  label: 'Archived',    status: 'archived', icon: IconArchive,   color: '#61666F' },
];

const KanbanBoard = ({ tickets, onOpenTicket, onNewIdea }) => {
  const grouped = COLUMNS.map(col => ({
    ...col,
    tickets: tickets.filter(t => t.status === col.status),
  }));

  return (
    <div style={{
      flex: 1, minHeight: 0, display: 'grid',
      gridTemplateColumns: 'repeat(4, minmax(280px, 1fr))',
      gap: 16, padding: 16, overflow: 'auto',
    }}>
      {grouped.map(col => (
        <KanbanColumn key={col.id} column={col} onOpenTicket={onOpenTicket} onNewIdea={onNewIdea} />
      ))}
    </div>
  );
};

const KanbanColumn = ({ column, onOpenTicket, onNewIdea }) => {
  const Icon = column.icon;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 0 }}>
      {/* Column header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '0 4px', height: 28,
      }}>
        <Icon size={14} style={{ color: column.color }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: '#E6E8EC' }}>{column.label}</span>
        <span style={{ fontSize: 12, color: '#61666F', fontFamily: 'JetBrains Mono, monospace' }}>{column.tickets.length}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          {column.status === 'voting' && (
            <button onClick={onNewIdea} style={{
              width: 22, height: 22, padding: 0, background: 'transparent',
              border: 'none', borderRadius: 4, cursor: 'pointer', color: '#9AA0AB',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}><IconPlus size={13} /></button>
          )}
          <button style={{
            width: 22, height: 22, padding: 0, background: 'transparent',
            border: 'none', borderRadius: 4, cursor: 'pointer', color: '#9AA0AB',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          }}><IconMore size={14} /></button>
        </span>
      </div>

      {/* Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 0, overflow: 'auto', paddingBottom: 8 }}>
        {column.tickets.map(t => (
          <TicketCard key={t.id} ticket={t} onClick={() => onOpenTicket(t)} />
        ))}
        {column.tickets.length === 0 ? (
          <div style={{
            padding: '20px 12px', textAlign: 'center',
            border: '1px dashed #1F2228', borderRadius: 6,
            color: '#61666F', fontSize: 12,
          }}>No ideas yet.</div>
        ) : null}
      </div>
    </div>
  );
};

Object.assign(window, { KanbanBoard });
