import { test } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';
import { nextWeekday, todayBerlin, nextSaturday, addDays } from '../utility/berlinDates';

// Normal tests use real Berlin dates. Only time-sensitive scenarios mock the clock.

test('BUG-01 rejects overlapping appointments for the same doctor', async ({ page }) => {
  const app = new BookingPage(page);
  await app.open();
  const date = nextWeekday(todayBerlin());
  await app.book({ name: 'Overlap First', date, time: '10:00' });
  await app.expectPresent('Overlap First');
  // 10:15-10:45 overlaps existing 10:00-10:30.
  await app.book({ name: 'Overlap Second', date, time: '10:15' });
  await app.expectRejected('time', 'Overlap Second');
  await app.expectAppointmentDetails('Overlap First', 'Dr. Anna Weber', '10:00');
});

test('BUG-02 cancelling a selected booking does not remove another patient', async ({ page }) => {
  const app = new BookingPage(page);
  await app.open();
  const date = nextWeekday(todayBerlin());
  // Seeded bookings exist at 10:00 next weekday and 14:30 three weekdays later.
  // An 08:00 booking sorts to the first table row but is last in storage.
  await app.book({ name: 'Cancellation Target', date, time: '08:00' });
  await app.expectPresent('Cancellation Target');
  await app.cancel('Cancellation Target');
  await app.expectAbsent('Cancellation Target');
  await app.expectAppointmentDetails('Lena Hoffmann', 'Dr. Anna Weber', '10:00');
  await app.expectAppointmentDetails('Tobias Krüger', 'Dr. Murat Yılmaz', '14:30');
});

test('BUG-03 rejects a date that has already passed', async ({ page }) => {
  const app = new BookingPage(page);
  await app.open();
  await app.book({ name: 'Past Date Patient', date: addDays(todayBerlin(), -7), time: '11:00' });
  await app.expectRejected('date', 'Past Date Patient');
});

test('BUG-04 rejects a time that has already passed today', async ({ page }) => {
  // Fixed Monday in CET: 09:30 UTC = 10:30 Berlin.
  await page.clock.install({ time: new Date('2027-03-15T09:30:00Z') });
  const app = new BookingPage(page);
  await app.open();
  await app.book({ name: 'Past Time Patient', date: '2027-03-15', time: '08:00' });
  await app.expectRejected('time', 'Past Time Patient');
});

test('BUG-05 preserves Berlin wall-clock appointment time during DST', async ({ page }) => {
  // Fixed clock only for this DST boundary test, ensuring the date stays bookable.
  await page.clock.install({ time: new Date('2027-03-01T09:30:00Z') });
  const app = new BookingPage(page);
  await app.open();
  // Berlin switches to CEST on March 28, 2027; March 29 is a weekday.
  await app.book({ name: 'DST Patient', date: '2027-03-29', time: '10:00' });
  await app.expectPresent('DST Patient');
  await app.expectAppointmentTime('DST Patient', '10:00');
});

test('BUG-06 rejects appointments that finish after closing time', async ({ page }) => {
  const app = new BookingPage(page);
  await app.open();
  const date = nextWeekday(todayBerlin());
  // 17:45 + 30-minute consultation = 18:15, beyond 18:00 closing.
  await app.book({ name: 'After Closing Patient', date, time: '17:45' });
  await app.expectRejected('time', 'After Closing Patient');
});

test('BUG-07 rejects malformed email addresses', async ({ page }) => {
  const app = new BookingPage(page);
  await app.open();
  const date = nextWeekday(todayBerlin());
  await app.book({ name: 'Bad Email Patient', date, time: '11:00', email: 'patient@domain..com' });
  await app.expectRejected('email', 'Bad Email Patient');
});

test('BUG-08 accepts patient names containing apostrophes', async ({ page }) => {
  const app = new BookingPage(page);
  await app.open();
  const date = nextWeekday(todayBerlin());
  await app.book({ name: "Anne O'Connor", date, time: '11:00' });
  await app.expectPresent("Anne O'Connor");
  await app.expectNoFieldError('name');
});

test('BUG-09 accepts patient names containing German characters', async ({ page }) => {
  const app = new BookingPage(page);
  await app.open();
  const date = nextWeekday(todayBerlin());
  await app.book({ name: 'Jürgen Müller', date, time: '11:00' });
  await app.expectPresent('Jürgen Müller');
  await app.expectNoFieldError('name');
});