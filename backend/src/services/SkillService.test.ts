import { ISkillRepository } from '../repositories/ISkillRepository';
import { Skill } from '../types';
import { SkillService } from './SkillService';

const mockRepo = (): jest.Mocked<ISkillRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

describe('SkillService', () => {
  it('returns all skills', () => {
    const repo = mockRepo();
    const skills: Skill[] = [{ id: '1', name: 'TypeScript', category: 'Languages', targetLevel: 4 }];
    repo.findAll.mockReturnValue(skills);

    expect(new SkillService(repo).getAll()).toEqual(skills);
  });

  it('throws when skill is not found', () => {
    const repo = mockRepo();
    repo.findById.mockReturnValue(undefined);

    expect(() => new SkillService(repo).getById('missing')).toThrow('Skill missing not found');
  });

  it('requires name on create', () => {
    const repo = mockRepo();

    expect(() => new SkillService(repo).create({ name: ' ', category: 'Languages', targetLevel: 3 })).toThrow(
      'name is required'
    );
  });

  it('requires category on create', () => {
    const repo = mockRepo();

    expect(() => new SkillService(repo).create({ name: 'TypeScript', category: ' ', targetLevel: 3 })).toThrow(
      'category is required'
    );
  });

  it('validates target level on create', () => {
    const repo = mockRepo();

    expect(() => new SkillService(repo).create({ name: 'TypeScript', category: 'Languages', targetLevel: 6 })).toThrow(
      'targetLevel must be 1–5'
    );
  });

  it('creates a skill', () => {
    const repo = mockRepo();
    const created: Skill = { id: '1', name: 'TypeScript', category: 'Languages', targetLevel: 3 };
    repo.create.mockReturnValue(created);

    expect(new SkillService(repo).create({ name: ' TypeScript ', category: ' Languages ', targetLevel: 3 })).toEqual(
      created
    );
    expect(repo.create).toHaveBeenCalledWith({ name: 'TypeScript', category: 'Languages', targetLevel: 3 });
  });

  it('updates a skill', () => {
    const repo = mockRepo();
    const updated: Skill = { id: '1', name: 'React', category: 'Frontend', targetLevel: 4 };
    repo.update.mockReturnValue(updated);

    expect(new SkillService(repo).update('1', { name: ' React ' })).toEqual(updated);
    expect(repo.update).toHaveBeenCalledWith('1', { name: 'React', category: undefined });
  });

  it('throws when updating a missing skill', () => {
    const repo = mockRepo();
    repo.update.mockReturnValue(undefined);

    expect(() => new SkillService(repo).update('missing', { targetLevel: 4 })).toThrow('Skill missing not found');
  });

  it('deletes an existing skill', () => {
    const repo = mockRepo();
    repo.delete.mockReturnValue(true);

    expect(() => new SkillService(repo).delete('1')).not.toThrow();
  });

  it('throws when deleting a missing skill', () => {
    const repo = mockRepo();
    repo.delete.mockReturnValue(false);

    expect(() => new SkillService(repo).delete('missing')).toThrow('Skill missing not found');
  });
});
