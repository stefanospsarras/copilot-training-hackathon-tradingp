import { ISkillRepository } from '../repositories/ISkillRepository';
import { Skill } from '../types';

export class SkillService {
  constructor(private readonly repo: ISkillRepository) {}

  getAll(): Skill[] {
    return this.repo.findAll();
  }

  getById(id: string): Skill {
    const skill = this.repo.findById(id);
    if (!skill) {
      throw new Error(`Skill ${id} not found`);
    }
    return skill;
  }

  create(data: { name: string; category: string; targetLevel: number }): Skill {
    if (!data.name?.trim()) {
      throw new Error('name is required');
    }
    if (!data.category?.trim()) {
      throw new Error('category is required');
    }
    if (!Number.isInteger(data.targetLevel) || data.targetLevel < 1 || data.targetLevel > 5) {
      throw new Error('targetLevel must be 1–5');
    }

    return this.repo.create({
      name: data.name.trim(),
      category: data.category.trim(),
      targetLevel: data.targetLevel
    });
  }

  update(id: string, data: Partial<{ name: string; category: string; targetLevel: number }>): Skill {
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('name is required');
    }
    if (data.category !== undefined && !data.category.trim()) {
      throw new Error('category is required');
    }
    if (
      data.targetLevel !== undefined &&
      (!Number.isInteger(data.targetLevel) || data.targetLevel < 1 || data.targetLevel > 5)
    ) {
      throw new Error('targetLevel must be 1–5');
    }

    const updated = this.repo.update(id, {
      ...data,
      name: data.name?.trim(),
      category: data.category?.trim()
    });

    if (!updated) {
      throw new Error(`Skill ${id} not found`);
    }

    return updated;
  }

  delete(id: string): void {
    if (!this.repo.delete(id)) {
      throw new Error(`Skill ${id} not found`);
    }
  }
}
