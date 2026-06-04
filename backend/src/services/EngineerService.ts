import { IEngineerRepository } from '../repositories/IEngineerRepository';
import { Engineer } from '../types';

export class EngineerService {
  constructor(private readonly repo: IEngineerRepository) {}

  getAll(): Engineer[] {
    return this.repo.findAll();
  }

  getById(id: string): Engineer {
    const engineer = this.repo.findById(id);
    if (!engineer) {
      throw new Error(`Engineer ${id} not found`);
    }
    return engineer;
  }

  create(data: Omit<Engineer, 'id'>): Engineer {
    this.validateEngineer(data);
    return this.repo.create({
      ...data,
      name: data.name.trim(),
      team: data.team.trim(),
      role: data.role.trim()
    });
  }

  update(id: string, data: Partial<Omit<Engineer, 'id'>>): Engineer {
    if (data.name !== undefined && !data.name.trim()) {
      throw new Error('name is required');
    }
    if (data.team !== undefined && !data.team.trim()) {
      throw new Error('team is required');
    }
    if (data.role !== undefined && !data.role.trim()) {
      throw new Error('role is required');
    }
    if (data.skillLevels) {
      this.validateSkillLevels(data.skillLevels);
    }

    const updated = this.repo.update(id, {
      ...data,
      name: data.name?.trim(),
      team: data.team?.trim(),
      role: data.role?.trim()
    });

    if (!updated) {
      throw new Error(`Engineer ${id} not found`);
    }

    return updated;
  }

  updateSkillLevels(id: string, skillLevels: Record<string, number>): Engineer {
    this.validateSkillLevels(skillLevels);
    const engineer = this.repo.findById(id);
    if (!engineer) {
      throw new Error(`Engineer ${id} not found`);
    }

    const updated = this.repo.update(id, {
      skillLevels: {
        ...engineer.skillLevels,
        ...skillLevels
      }
    });

    if (!updated) {
      throw new Error(`Engineer ${id} not found`);
    }

    return updated;
  }

  delete(id: string): void {
    if (!this.repo.delete(id)) {
      throw new Error(`Engineer ${id} not found`);
    }
  }

  private validateEngineer(data: Omit<Engineer, 'id'>): void {
    if (!data.name?.trim()) {
      throw new Error('name is required');
    }
    if (!data.team?.trim()) {
      throw new Error('team is required');
    }
    if (!data.role?.trim()) {
      throw new Error('role is required');
    }
    this.validateSkillLevels(data.skillLevels);
  }

  private validateSkillLevels(levels: Record<string, number>): void {
    for (const [skillId, level] of Object.entries(levels)) {
      if (!Number.isInteger(level) || level < 1 || level > 5) {
        throw new Error(`Level for skill ${skillId} must be 1–5`);
      }
    }
  }
}
