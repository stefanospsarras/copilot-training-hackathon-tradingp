import { Engineer } from '../types';

export interface IEngineerRepository {
  findAll(): Engineer[];
  findById(id: string): Engineer | undefined;
  create(data: Omit<Engineer, 'id'>): Engineer;
  update(id: string, data: Partial<Engineer>): Engineer | undefined;
  delete(id: string): boolean;
}
