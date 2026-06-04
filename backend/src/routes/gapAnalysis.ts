import { Router } from 'express';
import { EngineerRepository } from '../repositories/EngineerRepository';
import { SkillRepository } from '../repositories/SkillRepository';
import { GapAnalysisService } from '../services/GapAnalysisService';

const router = Router();
const engineerRepository = new EngineerRepository();
const skillRepository = new SkillRepository();
const gapAnalysisService = new GapAnalysisService();

router.get('/', (_req, res) => {
  res.json(gapAnalysisService.analyze(skillRepository.findAll(), engineerRepository.findAll()));
});

export default router;
