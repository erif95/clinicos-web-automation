import { expect, type Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { AppointmentLocators as L } from '../locators/AppointmentLocators';

export class AppointmentPage extends BasePage {

  constructor(page: Page) { 
    super(page); 
  }

  row(name: string) {
    return L.patient(this.page, name); 
  }

  async cancel(name: string) { 
      await this.click(L.cancel(this.page, name)); 
    }
  async expectPresent(name: string) { 
      await expect(this.row(name)).toHaveCount(1); 
    }
  async expectAbsent(name: string) { 
      await expect(this.row(name)).toHaveCount(0); 
    }
  async expectAppointmentDetails(name: string, doctor: string, time: string) {
    await this.expectPresent(name);
    await expect(L.doctor(this.page, name)).toHaveText(doctor);
    await expect(L.time(this.page, name)).toHaveText(time);
  }
  async expectAppointmentTime(name: string, time: string) {
    await expect(L.time(this.page, name)).toHaveText(time);
  }
}

