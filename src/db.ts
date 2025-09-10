import Dexie, { Table } from 'dexie';
import type { Uma } from './schema';

// Update this to make actual sense or setup. Not even sure what I was doing
// with this two weeks ago, lol.
export class UmaDB extends Dexie {
  umas!: Table<Uma, string>;

  constructor() {
    super('uma-manual-db');
    this.version(1).stores({ umas: 'id, trainee, createdAt, updatedAt' });

    // add skills & umas reference hashes
    this.version(2).stores({
      umas: 'id, updatedAt',
    });
  }
}
export const db = new UmaDB();
