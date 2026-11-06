import type { Page, Locator } from '@playwright/test';
export class BasePage {
  
  constructor(protected readonly page: Page) {}
  async navigate(url: string): Promise<void> { 
    await this.page.goto(url, {waitUntil: 'domcontentloaded'}); 
  }
  async fill(locator: Locator, value: string): Promise<void> { 
    await locator.fill(value); 
  }
  async click(locator: Locator): Promise<void> { 
    await locator.click(); }
}
