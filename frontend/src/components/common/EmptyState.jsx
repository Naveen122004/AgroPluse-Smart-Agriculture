export default function EmptyState({ icon = '📭', title = 'No data found', message }) {
  return (
    <div className="empty-state">
      <div style={{ fontSize: '2.5rem' }}>{icon}</div>
      <h5 className="mt-3">{title}</h5>
      {message && <p className="text-muted-custom">{message}</p>}
    </div>
  );
}
