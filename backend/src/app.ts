import cors from 'cors';
import express from 'express';
import engineersRouter from './routes/engineers';
import gapAnalysisRouter from './routes/gapAnalysis';
import heatmapRouter from './routes/heatmap';
import skillsRouter from './routes/skills';
import trainingRouter from './routes/training';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/skills', skillsRouter);
app.use('/api/engineers', engineersRouter);
app.use('/api/heatmap', heatmapRouter);
app.use('/api/gap-analysis', gapAnalysisRouter);
app.use('/api/training', trainingRouter);

app.use((err: Error, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  void next;
  res.status(500).json({ error: err.message });
});

export default app;
