import { Router } from 'express';
import { EngineerRepository } from '../repositories/EngineerRepository';
import { SkillRepository } from '../repositories/SkillRepository';
import { EngineerService } from '../services/EngineerService';
import { TrainingService } from '../services/TrainingService';
import { getErrorStatus } from './utils';

const router = Router();
const engineerRepository = new EngineerRepository();
const skillRepository = new SkillRepository();
const engineerService = new EngineerService(engineerRepository);
const trainingService = new TrainingService();

router.get('/', (_req, res) => {
  res.json(engineerService.getAll());
});

router.get('/:id/training', (req, res) => {
  try {
    const engineer = engineerService.getById(req.params.id);
    res.json(trainingService.recommend(engineer, skillRepository.findAll()));
  } catch (error) {
    res.status(getErrorStatus(error, 404)).json({ error: (error as Error).message });
  }
});

router.put('/:id/skills', (req, res) => {
  try {
    res.json(engineerService.updateSkillLevels(req.params.id, req.body));
  } catch (error) {
    res.status(getErrorStatus(error, 400)).json({ error: (error as Error).message });
  }
});

router.get('/:id', (req, res) => {
  try {
    res.json(engineerService.getById(req.params.id));
  } catch (error) {
    res.status(getErrorStatus(error, 404)).json({ error: (error as Error).message });
  }
});

router.post('/', (req, res) => {
  try {
    res.status(201).json(engineerService.create(req.body));
  } catch (error) {
    res.status(getErrorStatus(error, 400)).json({ error: (error as Error).message });
  }
});

router.put('/:id', (req, res) => {
  try {
    res.json(engineerService.update(req.params.id, req.body));
  } catch (error) {
    res.status(getErrorStatus(error, 400)).json({ error: (error as Error).message });
  }
});

router.delete('/:id', (req, res) => {
  try {
    engineerService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(getErrorStatus(error, 404)).json({ error: (error as Error).message });
  }
});

export default router;
