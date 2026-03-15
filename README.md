# English Learning — Plataforma de aprendizaje de inglés

Plataforma para aprender inglés de forma interactiva: **listening**, **speaking**, **vocabulario** y **conversación con IA**. Inspirada en Duolingo, Busuu y ELSA Speak.

## Arquitectura

- **Frontend**: React (Vite), JavaScript
- **Backend**: Node.js, Express
- **Base de datos**: JSON (en `backend/data/db.json`). Sin dependencias nativas; en producción se puede cambiar por PostgreSQL/MongoDB.

## Requisitos

- Node.js 18+
- Navegador con soporte para **Web Speech API** (Chrome recomendado para reconocimiento de voz)

## Instalación

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
node src/db/init.js   # opcional: crea data/db.json con lecciones por defecto
npm run dev
```

El servidor quedará en **http://localhost:4000**.

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

La app quedará en **http://localhost:3000**. El proxy de Vite redirige `/api` al backend.

## Módulos del sistema

| Módulo | Función |
|--------|--------|
| **Usuarios** | Registro, login, perfil e historial |
| **Lecciones** | Contenido por niveles (Beginner, Intermediate, Advanced) |
| **Audio (Listening)** | Reproducción de pronunciación (TTS en navegador) |
| **Reconocimiento de voz (Speaking)** | Evaluación de lo que dice el usuario |
| **Progreso** | Puntuación, tiempo de estudio, lecciones completadas |
| **Conversación IA** | Chat en inglés con respuestas automáticas y corrección |

## API (Backend)

- `POST /api/auth/register` — Registro
- `POST /api/auth/login` — Login
- `GET /api/users/profile` — Perfil (requiere token)
- `GET /api/users/history` — Historial (requiere token)
- `GET /api/lessons` — Lista de lecciones (opcional: `?level=Beginner`)
- `GET /api/lessons/:id` — Detalle de lección
- `POST /api/progress/lesson/:id` — Guardar progreso (requiere token)
- `GET /api/progress/summary` — Resumen de progreso (requiere token)
- `POST /api/chat/message` — Enviar mensaje al chat IA (requiere token)
- `GET /api/chat/history` — Historial del chat (requiere token)

## Gamificación

- **Puntos** por ejercicios y lecciones completadas
- **Rachas** de días de estudio
- **Progreso por lección** (porcentaje y tiempo)

## Chat con IA

Por defecto el chat usa respuestas locales. Para usar **OpenAI** (respuestas más naturales y corrección gramatical):

1. Crea una API key en [OpenAI](https://platform.openai.com/).
2. En `backend/.env` define: `OPENAI_API_KEY=sk-...`
3. Reinicia el backend.

## Escalabilidad

Para crecer en usuarios y tráfico se puede:

- Sustituir SQLite por **PostgreSQL** o **MongoDB**
- Añadir caché (Redis) para sesiones y progreso
- Servir el frontend con CDN y el API detrás de un balanceador
- Usar un servicio de TTS/Voice (p. ej. Google Cloud TTS) si se quiere voz de mayor calidad que la del navegador

## Licencia

Uso educativo / proyecto personal.
