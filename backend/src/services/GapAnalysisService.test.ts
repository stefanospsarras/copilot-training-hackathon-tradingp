import { Engineer, Skill } from '../types';
import { GapAnalysisService } from './GapAnalysisService';

const skills: Skill[] = [
  { id: 's1', name: 'React', category: 'Frontend', targetLevel: 4 },
  { id: 's2', name: 'Node.js', category: 'Backend', targetLevel: 3 },
  { id: 's3', name: 'GraphQL', category: 'Backend', targetLevel: 5 }
];

describe('GapAnalysisService', () => {
  it('sorts skills by gap descending', () => {
    const engineers: Engineer[] = [
      { id: 'e1', name: 'A', team: 'T', role: 'R', skillLevels: { s1: 2, s2: 3, s3: 3 } },
      { id: 'e2', name: 'B', team: 'T', role: 'R', skillLevels: { s1: 3, s2: 3, s3: 4 } }
    ];

    const result = new GapAnalysisService().analyze(skills, engineers);

    expect(result.map((gap) => gap.skillId)).toEqual(['s1', 's3', 's2']);
  });

  it('excludes skills with no ratings', () => {
    const engineers: Engineer[] = [{ id: 'e1', name: 'A', team: 'T', role: 'R', skillLevels: { s1: 4 } }];

    const result = new GapAnalysisService().analyze(skills, engineers);

    expect(result.map((gap) => gap.skillId)).toEqual(['s1']);
  });

  it('returns zero gap when average is at target', () => {
    const engineers: Engineer[] = [
      { id: 'e1', name: 'A', team: 'T', role: 'R', skillLevels: { s1: 4 } },
      { id: 'e2', name: 'B', team: 'T', role: 'R', skillLevels: { s1: 4 } }
    ];

    const [gap] = new GapAnalysisService().analyze([skills[0]], engineers);

    expect(gap.teamAverage).toBe(4);
    expect(gap.gap).toBe(0);
  });

  it('calculates mixed ratings correctly', () => {
    const engineers: Engineer[] = [
      { id: 'e1', name: 'A', team: 'T', role: 'R', skillLevels: { s1: 2 } },
      { id: 'e2', name: 'B', team: 'T', role: 'R', skillLevels: { s1: 5 } },
      { id: 'e3', name: 'C', team: 'T', role: 'R', skillLevels: { s1: 4 } }
    ];

    const [gap] = new GapAnalysisService().analyze([skills[0]], engineers);

    expect(gap.teamAverage).toBe(3.67);
    expect(gap.gap).toBe(0.33);
  });
});
