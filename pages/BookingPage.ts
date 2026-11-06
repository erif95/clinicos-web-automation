import { expect, type Page } from '@playwright/test';
import { AppointmentPage } from './AppointmentPage';
import { BookingLocators as L } from '../locators/BookingLocators';
import type { BookingData } from '../types/Appointment';
import { DataReader } from '../utility/DataReader';
export class BookingPage extends AppointmentPage {
  private readonly data = new DataReader('testdata.json');

  constructor(page: Page) { 
    super(page); 
  }

  async open() { 
    await this.navigate(''); await this.click(L.reset(this.page)); 
  }
  
  async book(data: BookingData) {
    await this.fill(L.name(this.page), data.name);
    await this.fill(L.dob(this.page), data.dob ?? this.data.get('defaults.dob'));
    await this.fill(L.email(this.page), data.email ?? this.data.get('defaults.email'));
    await L.doctor(this.page).selectOption(data.doctor ?? this.data.get('defaults.doctor'));
    await L.reason(this.page).selectOption(data.reason ?? this.data.get('defaults.reason'));
    await this.fill(L.date(this.page), data.date);
    await L.time(this.page).selectOption(data.time);
    await this.click(L.submit(this.page));
  }
  async expectFieldError(field: 'name'|'email'|'date'|'time', message?: string) {
    if (message !== undefined) {
      await expect(L.error(this.page, field)).toHaveText(message);
    } else {
      await expect(L.error(this.page, field)).not.toBeEmpty();
    }
  }
  async expectNoFieldError(field: 'name'|'email'|'date'|'time') {
    await expect(L.error(this.page, field)).toBeEmpty();
  }
  async expectRejected(field: 'name'|'email'|'date'|'time', patient: string) {
    await this.expectFieldError(field);
    await this.expectAbsent(patient);
  }
}
