import { Skill } from '../types';

export interface ISkillRepository {
  findAll(): Skill[];
  findById(id: string): Skill | undefined;
  create(data: Omit<Skill, 'id'>): Skill;
  update(id: string, data: Partial<Skill>): Skill | undefined;
  delete(id: string): boolean;
}
