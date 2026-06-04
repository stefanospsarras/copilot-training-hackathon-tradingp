import request from './client';
import { SkillGap } from './types';

export const getGapAnalysis = () => request<SkillGap[]>('/gap-analysis');
