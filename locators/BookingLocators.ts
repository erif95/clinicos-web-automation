import type { Page } from '@playwright/test';
export class BookingLocators {
  static name(page: Page) { return page.getByTestId('patient-name'); }
  static dob(page: Page) { return page.getByTestId('dob'); }
  static email(page: Page) { return page.getByTestId('email'); }
  static doctor(page: Page) { return page.getByTestId('doctor'); }
  static reason(page: Page) { return page.getByTestId('reason'); }
  static date(page: Page) { return page.getByTestId('date'); }
  static time(page: Page) { return page.getByTestId('time'); }
  static submit(page: Page) { return page.getByTestId('book-button'); }
  static error(page: Page, field: string) { return page.getByTestId(`error-${field}`); }
  static reset(page: Page) { return page.getByTestId('reset-demo'); }
}
