import Dexie, { Table } from 'dexie';
import type { Uma } from './schema';

export class UmaDB extends Dexie {
  umas!: Table<Uma, string>;
  constructor() {
    super('uma-manual-db');
    this.version(1).stores({ umas: 'id, trainee, createdAt, updatedAt' });
  }
}
export const db = new UmaDB();
