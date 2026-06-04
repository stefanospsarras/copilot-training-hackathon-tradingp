import { Engineer, Skill } from '../types';

export interface SkillGap {
  skillId: string;
  skillName: string;
  category: string;
  targetLevel: number;
  teamAverage: number;
  gap: number;
}

export class GapAnalysisService {
  analyze(skills: Skill[], engineers: Engineer[]): SkillGap[] {
    return skills
      .map((skill) => {
        const ratings = engineers
          .map((engineer) => engineer.skillLevels[skill.id])
          .filter((level): level is number => level !== undefined);

        if (ratings.length === 0) {
          return null;
        }

        const average = ratings.reduce((sum, level) => sum + level, 0) / ratings.length;
        return {
          skillId: skill.id,
          skillName: skill.name,
          category: skill.category,
          targetLevel: skill.targetLevel,
          teamAverage: Math.round(average * 100) / 100,
          gap: Math.round((skill.targetLevel - average) * 100) / 100
        };
      })
      .filter((gap): gap is SkillGap => gap !== null)
      .sort((left, right) => right.gap - left.gap);
  }
}
