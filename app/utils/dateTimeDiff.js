export const dateTimeDiff = dateStr => {
  const [datePart, timePart] = dateStr.split(" ");
  const [day, month, year] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);

  const targetDate = new Date(year, month - 1, day, hour, minute);
  const now = new Date();

  let diffMs = targetDate - now;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  diffMs %= 1000 * 60 * 60 * 24;

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  diffMs %= 1000 * 60 * 60;

  const minutes = Math.floor(diffMs / (1000 * 60));

  return {
    days,
    hours,
    minutes
  };
}