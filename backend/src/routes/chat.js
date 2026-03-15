import { Router } from 'express';
import store from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

function getAIResponse(userMessage) {
  const lower = userMessage.toLowerCase();
  if (lower.includes('name') && (lower.includes('my') || lower.includes('i am') || lower.includes("i'm"))) {
    return { message: "Nice to meet you! Where are you from?", correction: null };
  }
  if (lower.includes('from')) {
    return { message: "That's interesting! What do you like to do in your free time?", correction: null };
  }
  if (lower.includes('good') && lower.includes('morning')) {
    return { message: "Good morning! How are you today?", correction: null };
  }
  if (lower.includes('goed')) {
    return { message: "I'm here to help! Keep practicing.", correction: "The correct sentence is: I went (past of 'go' is 'went', not 'goed')." };
  }
  return {
    message: "That's good! Try to use full sentences. What did you do yesterday?",
    correction: null,
  };
}

router.post('/message', async (req, res) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Mensaje requerido.' });
  }
  const userId = req.userId;
  store.chat_messages.insert({ user_id: userId, role: 'user', content: message.trim() });
  let aiReply;
  if (process.env.OPENAI_API_KEY) {
    try {
      const { default: fetch } = await import('node-fetch');
      const history = store.chat_messages.byUser(userId).slice(-10).map((m) => ({ role: m.role, content: m.content }));
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are an English teacher. Reply only in English. If the student makes a grammar mistake, give a short correction in a "correction" field. Keep answers short and conversational.' },
            ...history,
            { role: 'user', content: message.trim() },
          ],
        }),
      });
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      aiReply = { message: content, correction: null };
    } catch (e) {
      aiReply = getAIResponse(message);
    }
  } else {
    aiReply = getAIResponse(message);
  }
  store.chat_messages.insert({ user_id: userId, role: 'assistant', content: aiReply.message });
  res.json(aiReply);
});

router.get('/history', (req, res) => {
  const rows = store.chat_messages.byUser(req.userId).map((m) => ({ role: m.role, content: m.content, created_at: m.created_at }));
  res.json(rows);
});

export default router;
