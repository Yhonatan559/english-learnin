import { Router } from 'express';
import store from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', (req, res) => {
  const level = req.query.level;
  const category = req.query.category;
  const lessons = store.lessons.all(level, category).map((l) => ({
    id: l.id,
    category: l.category || 'stage',
    level: l.level,
    title: l.title,
    sort_order: l.sort_order,
    stage: l.stage,
    stage_title: l.stage_title,
  }));
  res.json(lessons);
});

router.get('/:id', (req, res) => {
  const lesson = store.lessons.get(req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lección no encontrada.' });
  const out = {
    ...lesson,
    vocabulary: JSON.parse(lesson.vocabulary || '[]'),
    phrases: JSON.parse(lesson.phrases || '[]'),
    vocabulary_es: JSON.parse(lesson.vocabulary_es || '[]'),
    phrases_es: JSON.parse(lesson.phrases_es || '[]'),
  };
  res.json(out);
});

router.get('/:id/progress', requireAuth, (req, res) => {
  const p = store.progress.get(req.userId, req.params.id);
  res.json(p || { score: 0, completed: 0, time_spent_seconds: 0 });
});

export default router;
