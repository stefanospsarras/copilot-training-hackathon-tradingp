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

export interface DatabaseSchema {
  skills: Skill[];
  engineers: Engineer[];
}
