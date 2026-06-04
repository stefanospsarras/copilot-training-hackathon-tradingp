import request from './client';
import { Engineer } from './types';

export const getEngineers = () => request<Engineer[]>('/engineers');
export const getEngineer = (id: string) => request<Engineer>(`/engineers/${id}`);
export const createEngineer = (data: Omit<Engineer, 'id'>) =>
  request<Engineer>('/engineers', { method: 'POST', body: JSON.stringify(data) });
export const updateEngineer = (id: string, data: Partial<Engineer>) =>
  request<Engineer>(`/engineers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const updateSkillLevels = (id: string, levels: Record<string, number>) =>
  request<Engineer>(`/engineers/${id}/skills`, { method: 'PUT', body: JSON.stringify(levels) });
export const deleteEngineer = (id: string) => request<void>(`/engineers/${id}`, { method: 'DELETE' });
