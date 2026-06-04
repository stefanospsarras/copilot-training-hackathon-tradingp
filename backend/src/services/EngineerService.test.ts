import { IEngineerRepository } from '../repositories/IEngineerRepository';
import { Engineer } from '../types';
import { EngineerService } from './EngineerService';

const mockRepo = (): jest.Mocked<IEngineerRepository> => ({
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

const engineer: Engineer = {
  id: 'e1',
  name: 'Alice',
  team: 'Platform',
  role: 'Engineer',
  skillLevels: { s1: 3, s2: 4 }
};

describe('EngineerService', () => {
  it('returns all engineers', () => {
    const repo = mockRepo();
    repo.findAll.mockReturnValue([engineer]);

    expect(new EngineerService(repo).getAll()).toEqual([engineer]);
  });

  it('throws when engineer is not found', () => {
    const repo = mockRepo();
    repo.findById.mockReturnValue(undefined);

    expect(() => new EngineerService(repo).getById('missing')).toThrow('Engineer missing not found');
  });

  it('validates required fields on create', () => {
    const repo = mockRepo();
    const service = new EngineerService(repo);

    expect(() => service.create({ name: ' ', team: 'Platform', role: 'Engineer', skillLevels: {} })).toThrow(
      'name is required'
    );
    expect(() => service.create({ name: 'Alice', team: ' ', role: 'Engineer', skillLevels: {} })).toThrow(
      'team is required'
    );
    expect(() => service.create({ name: 'Alice', team: 'Platform', role: ' ', skillLevels: {} })).toThrow(
      'role is required'
    );
  });

  it('validates skill levels on create', () => {
    const repo = mockRepo();

    expect(() =>
      new EngineerService(repo).create({
        name: 'Alice',
        team: 'Platform',
        role: 'Engineer',
        skillLevels: { s1: 0 }
      })
    ).toThrow('Level for skill s1 must be 1–5');
  });

  it('creates an engineer', () => {
    const repo = mockRepo();
    repo.create.mockReturnValue(engineer);

    expect(
      new EngineerService(repo).create({
        name: ' Alice ',
        team: ' Platform ',
        role: ' Engineer ',
        skillLevels: { s1: 3, s2: 4 }
      })
    ).toEqual(engineer);
    expect(repo.create).toHaveBeenCalledWith({
      name: 'Alice',
      team: 'Platform',
      role: 'Engineer',
      skillLevels: { s1: 3, s2: 4 }
    });
  });

  it('updates an engineer', () => {
    const repo = mockRepo();
    repo.update.mockReturnValue({ ...engineer, team: 'Growth' });

    expect(new EngineerService(repo).update('e1', { team: ' Growth ' })).toEqual({ ...engineer, team: 'Growth' });
    expect(repo.update).toHaveBeenCalledWith('e1', { team: 'Growth', name: undefined, role: undefined });
  });

  it('throws when updating a missing engineer', () => {
    const repo = mockRepo();
    repo.update.mockReturnValue(undefined);

    expect(() => new EngineerService(repo).update('missing', { role: 'Lead' })).toThrow('Engineer missing not found');
  });

  it('merges skill levels when updating skills', () => {
    const repo = mockRepo();
    repo.findById.mockReturnValue(engineer);
    repo.update.mockReturnValue({ ...engineer, skillLevels: { s1: 5, s2: 4 } });

    const result = new EngineerService(repo).updateSkillLevels('e1', { s1: 5 });

    expect(result.skillLevels).toEqual({ s1: 5, s2: 4 });
    expect(repo.update).toHaveBeenCalledWith('e1', { skillLevels: { s1: 5, s2: 4 } });
  });

  it('throws when updating skills for a missing engineer', () => {
    const repo = mockRepo();
    repo.findById.mockReturnValue(undefined);

    expect(() => new EngineerService(repo).updateSkillLevels('missing', { s1: 3 })).toThrow(
      'Engineer missing not found'
    );
  });

  it('throws when deleting a missing engineer', () => {
    const repo = mockRepo();
    repo.delete.mockReturnValue(false);

    expect(() => new EngineerService(repo).delete('missing')).toThrow('Engineer missing not found');
  });
});
