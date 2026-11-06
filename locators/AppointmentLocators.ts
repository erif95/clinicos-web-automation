import type { Page } from '@playwright/test';
export class AppointmentLocators {
  static rows(page: Page) { 
    return page.getByTestId('appointment-row'); 
  }
  static patient(page: Page, name: string) {
    return this.rows(page).filter({has: page.getByTestId('appt-patient').getByText(name, {exact: true})});
  }
  static cancel(page: Page, name: string) { 
    return this.patient(page, name).getByTestId('cancel-appointment'); 
  }
  static doctor(page: Page, name: string) {
    return this.patient(page, name).getByTestId('appt-doctor');
  }
  static time(page: Page, name: string) {
    return this.patient(page, name).getByTestId('appt-time');
  }
}

