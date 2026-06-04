import { Engineer, Skill } from '../types';
import { TrainingService } from './TrainingService';

const skills: Skill[] = [
  { id: 's1', name: 'React', category: 'Frontend', targetLevel: 5 },
  { id: 's2', name: 'Node.js', category: 'Backend', targetLevel: 4 },
  { id: 's3', name: 'Docker', category: 'DevOps', targetLevel: 3 }
];

describe('TrainingService', () => {
  it('only includes skills with positive gaps', () => {
    const engineer: Engineer = {
      id: 'e1',
      name: 'Alice',
      team: 'Platform',
      role: 'Engineer',
      skillLevels: { s1: 4, s2: 4, s3: 5 }
    };

    const result = new TrainingService().recommend(engineer, skills);

    expect(result).toEqual([
      {
        skillId: 's1',
        skillName: 'React',
        category: 'Frontend',
        currentLevel: 4,
        targetLevel: 5,
        gap: 1
      }
    ]);
  });

  it('sorts by gap descending', () => {
    const engineer: Engineer = {
      id: 'e1',
      name: 'Alice',
      team: 'Platform',
      role: 'Engineer',
      skillLevels: { s1: 2, s2: 3, s3: 1 }
    };

    const result = new TrainingService().recommend(engineer, skills);

    expect(result.map((recommendation) => recommendation.skillId)).toEqual(['s1', 's3', 's2']);
  });

  it('respects the topN limit', () => {
    const engineer: Engineer = {
      id: 'e1',
      name: 'Alice',
      team: 'Platform',
      role: 'Engineer',
      skillLevels: { s1: 1, s2: 1, s3: 1 }
    };

    const result = new TrainingService().recommend(engineer, skills, 2);

    expect(result).toHaveLength(2);
  });

  it('returns an empty array when all skills meet or exceed target', () => {
    const engineer: Engineer = {
      id: 'e1',
      name: 'Alice',
      team: 'Platform',
      role: 'Engineer',
      skillLevels: { s1: 5, s2: 5, s3: 3 }
    };

    expect(new TrainingService().recommend(engineer, skills)).toEqual([]);
  });
});
