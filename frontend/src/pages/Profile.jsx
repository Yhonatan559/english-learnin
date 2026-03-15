import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import './Profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.users.profile(), api.users.history()])
      .then(([p, h]) => {
        setProfile(p);
        setHistory(h);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="app-layout">Cargando perfil...</div>;

  const stats = profile?.stats || {};

  return (
    <div className="app-layout">
      <h1 className="page-title">Perfil</h1>
      <div className="profile-grid">
        <div className="card profile-card">
          <h2>Datos</h2>
          <p><strong>Nombre:</strong> {user?.name}</p>
          <p><strong>Correo:</strong> {user?.email}</p>
        </div>
        <div className="card profile-card">
          <h2>Estadísticas</h2>
          <p><strong>Puntos:</strong> {stats.points ?? 0}</p>
          <p><strong>Racha:</strong> {stats.streak_days ?? 0} días</p>
          <p><strong>Nivel:</strong> {stats.level_name ?? 'Beginner'}</p>
        </div>
      </div>
      <section className="profile-history">
        <h2>Historial de aprendizaje</h2>
        {history.length === 0 ? (
          <p className="muted">Aún no hay actividad.</p>
        ) : (
          <ul className="history-list">
            {history.slice(0, 20).map((item, i) => (
              <li key={i} className="card history-item">
                <span className="history-lesson">{item.title}</span>
                <span className="history-meta">{item.completed ? 'Completado' : `${item.score}%`} · {new Date(item.updated_at).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
