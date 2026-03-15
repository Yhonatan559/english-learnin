import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import auth from './routes/auth.js';
import users from './routes/users.js';
import lessons from './routes/lessons.js';
import progress from './routes/progress.js';
import chat from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/lessons', lessons);
app.use('/api/progress', progress);
app.use('/api/chat', chat);

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
