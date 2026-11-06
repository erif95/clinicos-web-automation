/** YYYY-MM-DD in Europe/Berlin, independent of the machine's timezone. */
export function berlinDate(date: Date): string {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Berlin', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find(p => p.type === type)!.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function nextWeekday(iso: string, minDays = 1): string {
  let date = addDays(iso, minDays);
  while ([0, 6].includes(new Date(`${date}T12:00:00Z`).getUTCDay())) {
    date = addDays(date, 1);
  }
  return date;
}


/** Today's date according to the clinic's Europe/Berlin timezone. */
export function todayBerlin(): string {
  return berlinDate(new Date());
}

/** The upcoming Saturday (including today when it is Saturday). */
export function nextSaturday(iso: string = todayBerlin()): string {
  const day = new Date(`${iso}T12:00:00Z`).getUTCDay();
  return addDays(iso, (6 - day + 7) % 7);
}

export function isWeekend(iso: string): boolean {
  return [0, 6].includes(new Date(`${iso}T12:00:00Z`).getUTCDay());
}
