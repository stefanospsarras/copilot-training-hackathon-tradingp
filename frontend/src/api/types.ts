export interface Skill {
  id: string;
  name: string;
  category: string;
  targetLevel: number;
}

export interface Engineer {
  id: string;
  name: string;
  team: string;
  role: string;
  skillLevels: Record<string, number>;
}

export interface HeatmapData {
  skills: Skill[];
  engineers: Engineer[];
}

export interface SkillGap {
  skillId: string;
  skillName: string;
  category: string;
  targetLevel: number;
  teamAverage: number;
  gap: number;
}

export interface TrainingRecommendation {
  skillId: string;
  skillName: string;
  category: string;
  currentLevel: number;
  targetLevel: number;
  gap: number;
}
