import { Router } from 'express';
import { SkillRepository } from '../repositories/SkillRepository';
import { SkillService } from '../services/SkillService';
import { getErrorStatus } from './utils';

const router = Router();
const service = new SkillService(new SkillRepository());

router.get('/', (_req, res) => {
  res.json(service.getAll());
});

router.get('/:id', (req, res) => {
  try {
    res.json(service.getById(req.params.id));
  } catch (error) {
    res.status(getErrorStatus(error, 404)).json({ error: (error as Error).message });
  }
});

router.post('/', (req, res) => {
  try {
    res.status(201).json(service.create(req.body));
  } catch (error) {
    res.status(getErrorStatus(error, 400)).json({ error: (error as Error).message });
  }
});

router.put('/:id', (req, res) => {
  try {
    res.json(service.update(req.params.id, req.body));
  } catch (error) {
    res.status(getErrorStatus(error, 400)).json({ error: (error as Error).message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    service.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(getErrorStatus(error, 404)).json({ error: (error as Error).message });
  }
});

export default router;
