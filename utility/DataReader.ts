import fs from 'fs';
import path from 'path';
export class DataReader {
  private readonly data: Record<string, any>;
  constructor(fileName: string) {
    const filePath = path.resolve(process.cwd(), 'testdata', fileName);
    this.data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  get(key: string): string {
    const value = key.split('.').reduce<any>((current, part) => current?.[part], this.data);
    if (value === undefined) throw new Error(`Test data key not found: ${key}`);
    return String(value);
  }
}
