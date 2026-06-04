import { v4 as uuidv4 } from 'uuid';
import db from '../db/database';
import { Skill } from '../types';
import { ISkillRepository } from './ISkillRepository';

export class SkillRepository implements ISkillRepository {
  findAll(): Skill[] {
    return db.get('skills').value();
  }

  findById(id: string): Skill | undefined {
    return db.get('skills').find({ id }).value();
  }

  create(data: Omit<Skill, 'id'>): Skill {
    const skill: Skill = { id: uuidv4(), ...data };
    db.get('skills').push(skill).write();
    return skill;
  }

  update(id: string, data: Partial<Skill>): Skill | undefined {
    const existing = this.findById(id);
    if (!existing) {
      return undefined;
    }

    db.get('skills').find({ id }).assign(data).write();
    return this.findById(id);
  }

  delete(id: string): boolean {
    const before = this.findAll().length;
    db.get('skills').remove({ id }).write();
    return this.findAll().length < before;
  }
}
