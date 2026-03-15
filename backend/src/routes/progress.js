import { Router } from 'express';
import store from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

function updateStreak(userId) {
  const stats = store.user_stats.get(userId);
  if (!stats) return;
  const today = new Date().toISOString().slice(0, 10);
  if (stats.last_study_date === today) return;
  const yesterday = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  const newStreak = stats.last_study_date === yesterday ? (stats.streak_days || 0) + 1 : 1;
  store.user_stats.update(userId, { streak_days: newStreak, last_study_date: today });
}

router.post('/lesson/:lessonId', (req, res) => {
  const lessonId = req.params.lessonId;
  const { score, completed, time_spent_seconds } = req.body;
  const userId = req.userId;
  const pointsToAdd = Math.min(100, Math.round((score || 0) / 100 * 50) + (completed ? 20 : 0));
  const existing = store.progress.get(userId, lessonId);
  const newScore = Math.max(existing?.score ?? 0, score ?? 0);
  const newCompleted = (existing?.completed || completed) ? 1 : 0;
  const newTime = (existing?.time_spent_seconds ?? 0) + (time_spent_seconds || 0);
  const row = {
    user_id: userId,
    lesson_id: Number(lessonId),
    score: newScore,
    completed: newCompleted,
    time_spent_seconds: newTime,
  };
  store.progress.upsert(row);
  const stats = store.user_stats.get(userId);
  const currentPoints = stats?.points ?? 0;
  store.user_stats.update(userId, { points: currentPoints + pointsToAdd });
  updateStreak(userId);
  const updated = store.progress.get(userId, lessonId);
  res.json(updated);
});

router.get('/summary', (req, res) => {
  const stats = store.user_stats.get(req.userId);
  const byLesson = store.progress.byUser(req.userId).map((p) => {
    const l = store.lessons.get(p.lesson_id);
    return {
      lesson_id: p.lesson_id,
      title: l?.title,
      level: l?.level,
      score: p.score,
      completed: p.completed,
      time_spent_seconds: p.time_spent_seconds,
    };
  });
  res.json({ stats: stats || { points: 0, streak_days: 0, level_name: 'Beginner', badges: '[]' }, byLesson });
});

export default router;
