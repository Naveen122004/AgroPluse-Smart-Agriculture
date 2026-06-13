export const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const weatherIconUrl = (icon) =>
  icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : null;
