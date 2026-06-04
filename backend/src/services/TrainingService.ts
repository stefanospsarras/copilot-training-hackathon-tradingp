import { Engineer, Skill } from '../types';

export interface TrainingRecommendation {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
}

export class TrainingService {
  recommend(engineer: Engineer, skills: Skill[], topN = 5): TrainingRecommendation[] {
    return skills
      .filter((skill) => engineer.skillLevels[skill.id] !== undefined)
      .map((skill) => ({
        skillId: skill.id,
        skillName: skill.name,
        category: skill.category,
        currentLevel: engineer.skillLevels[skill.id],
        targetLevel: skill.targetLevel,
        gap: skill.targetLevel - engineer.skillLevels[skill.id]
      }))
      .filter((recommendation) => recommendation.gap > 0)
      .sort((left, right) => right.gap - left.gap)
      .slice(0, topN);
  }
}
