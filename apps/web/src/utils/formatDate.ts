export function formatDate(date: Date): string {
  const day = date.getDate();
  const month = getMonthName(date);
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function getMonthName(date: Date) {
  return date.toLocaleString('en-US', { month: 'long' });
}
