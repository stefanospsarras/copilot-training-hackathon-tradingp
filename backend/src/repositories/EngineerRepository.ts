import { v4 as uuidv4 } from 'uuid';
import db from '../db/database';
import { Engineer } from '../types';
import { IEngineerRepository } from './IEngineerRepository';

export class EngineerRepository implements IEngineerRepository {
  findAll(): Engineer[] {
    return db.get('engineers').value();
  }

  findById(id: string): Engineer | undefined {
    return db.get('engineers').find({ id }).value();
  }

  create(data: Omit<Engineer, 'id'>): Engineer {
    const engineer: Engineer = { id: uuidv4(), ...data };
    db.get('engineers').push(engineer).write();
    return engineer;
  }

  update(id: string, data: Partial<Engineer>): Engineer | undefined {
    const existing = this.findById(id);
    if (!existing) {
      return undefined;
    }

    db.get('engineers').find({ id }).assign(data).write();
    return this.findById(id);
  }

  delete(id: string): boolean {
    const before = this.findAll().length;
    db.get('engineers').remove({ id }).write();
    return this.findAll().length < before;
  }
}
