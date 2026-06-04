import request from './client';
import { Skill } from './types';

export const getSkills = () => request<Skill[]>('/skills');
export const getSkill = (id: string) => request<Skill>(`/skills/${id}`);
export const createSkill = (data: Omit<Skill, 'id'>) =>
  request<Skill>('/skills', { method: 'POST', body: JSON.stringify(data) });
export const updateSkill = (id: string, data: Partial<Skill>) =>
  request<Skill>(`/skills/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteSkill = (id: string) => request<void>(`/skills/${id}`, { method: 'DELETE' });
