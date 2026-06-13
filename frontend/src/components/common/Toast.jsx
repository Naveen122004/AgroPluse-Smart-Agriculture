export default function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div className={`toast-custom toast-${toast.type}`}>
      {toast.message}
    </div>
  );
}
