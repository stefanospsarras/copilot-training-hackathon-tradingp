import { Router } from 'express';
import { EngineerRepository } from '../repositories/EngineerRepository';
import { SkillRepository } from '../repositories/SkillRepository';
import { TrainingService } from '../services/TrainingService';
import { getErrorStatus } from './utils';

const router = Router();
const engineerRepository = new EngineerRepository();
const skillRepository = new SkillRepository();
const trainingService = new TrainingService();

router.get('/:id', (req, res) => {
  try {
    const engineer = engineerRepository.findById(req.params.id);
    if (!engineer) {
      throw new Error(`Engineer ${req.params.id} not found`);
    }

    res.json(trainingService.recommend(engineer, skillRepository.findAll()));
  } catch (error) {
    res.status(getErrorStatus(error, 404)).json({ error: (error as Error).message });
  }
});

export default router;
