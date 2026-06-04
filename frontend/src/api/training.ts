import request from './client';
import { TrainingRecommendation } from './types';

export const getTrainingRecommendations = (engineerId: string) =>
  request<TrainingRecommendation[]>(`/training/${engineerId}`);
