import { Router } from 'express';
import bcrypt from 'bcryptjs';
import store from '../db/store.js';
import { signToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'Faltan email, contraseña o nombre.' });
  }
  if (store.users.getByEmail(email)) {
    return res.status(409).json({ error: 'El correo ya está registrado.' });
  }
  const password_hash = bcrypt.hashSync(password, 10);
  const { lastInsertRowid: userId } = store.users.insert({
    email: email.toLowerCase().trim(),
    password_hash,
    name: name.trim(),
  });
  store.user_stats.insert({ user_id: userId });
  const token = signToken(userId, email);
  return res.status(201).json({
    token,
    user: { id: userId, email: email.toLowerCase().trim(), name: name.trim() },
  });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos.' });
  }
  const user = store.users.getByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Credenciales incorrectas.' });
  }
  const token = signToken(user.id, user.email);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
});

export default router;
