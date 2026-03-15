import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import './Dashboard.css';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.progress.summary()
      .then(setSummary)
      .catch(() => setSummary({ stats: {}, byLesson: [] }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="app-layout">Cargando...</div>;

  const stats = summary?.stats || {};
  const points = stats.points ?? 0;
  const streak = stats.streak_days ?? 0;
  const byLesson = summary?.byLesson || [];

  return (
    <div className="app-layout">
      <h1 className="page-title">Tu progreso</h1>
      <div className="dashboard-stats">
        <div className="stat-card card">
          <span className="stat-value">{points}</span>
          <span className="stat-label">Puntos</span>
        </div>
        <div className="stat-card card">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Racha (días)</span>
        </div>
        <div className="stat-card card">
          <span className="stat-value">{byLesson.filter((l) => l.completed).length}</span>
          <span className="stat-label">Lecciones completadas</span>
        </div>
      </div>
      <section className="dashboard-section">
        <h2>Progreso por lección</h2>
        {byLesson.length === 0 ? (
          <p className="muted">Aún no tienes progreso. <Link to="/lessons">Empieza una lección</Link>.</p>
        ) : (
          <ul className="progress-list">
            {byLesson.map((p) => (
              <li key={p.lesson_id} className="card progress-item">
                <div className="progress-item-head">
                  <span>{p.title}</span>
                  <span className="badge">{p.level}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${p.completed ? 100 : Math.min(100, (p.score || 0))}%` }} />
                </div>
                <span className="progress-meta">{p.completed ? 'Completado' : `${p.score || 0}%`} · {Math.round((p.time_spent_seconds || 0) / 60)} min</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="dashboard-actions">
        <Link to="/lessons" className="btn btn-primary">Ver lecciones</Link>
        <Link to="/conversation" className="btn btn-ghost">Practicar conversación con IA</Link>
      </div>
    </div>
  );
}
