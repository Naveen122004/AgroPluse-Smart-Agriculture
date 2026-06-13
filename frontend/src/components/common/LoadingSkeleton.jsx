export default function LoadingSkeleton({ rows = 3, height = 20 }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton mb-2" style={{ height, width: `${90 - i * 10}%` }} />
      ))}
    </div>
  );
}
