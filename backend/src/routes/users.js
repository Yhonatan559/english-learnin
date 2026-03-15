import { Router } from 'express';
import store from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/profile', (req, res) => {
  const user = store.users.getById(req.userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado.' });
  const stats = store.user_stats.get(req.userId);
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    stats: stats || { points: 0, streak_days: 0, level_name: 'Beginner', badges: [] },
  });
});

router.get('/history', (req, res) => {
  const progress = store.progress.byUser(req.userId);
  const lessons = store.lessons.all();
  const byId = lessons.reduce((acc, l) => { acc[l.id] = l; return acc; }, {});
  const rows = progress.map((p) => ({
    lesson_id: p.lesson_id,
    score: p.score,
    completed: p.completed,
    time_spent_seconds: p.time_spent_seconds,
    updated_at: p.updated_at,
    title: byId[p.lesson_id]?.title,
    level: byId[p.lesson_id]?.level,
  })).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  res.json(rows);
});

export default router;
