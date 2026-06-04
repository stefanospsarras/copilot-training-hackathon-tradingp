import { Router } from 'express';
import { EngineerRepository } from '../repositories/EngineerRepository';
import { SkillRepository } from '../repositories/SkillRepository';

const router = Router();
const engineerRepository = new EngineerRepository();
const skillRepository = new SkillRepository();

router.get('/', (_req, res) => {
  res.json({
    skills: skillRepository.findAll(),
    engineers: engineerRepository.findAll()
  });
});

export default router;
