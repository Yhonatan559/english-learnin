import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import Listening from '../components/Listening';
import Speaking from '../components/Speaking';
import './LessonDetail.css';

export default function LessonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(() => Date.now());
  const [phraseResults, setPhraseResults] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.lessons.get(id).then(setLesson).catch(() => setLesson(null)).finally(() => setLoading(false));
  }, [id]);

  const handlePhraseResult = (index, { ok, score }) => {
    setPhraseResults((prev) => ({ ...prev, [index]: prev[index] ? Math.max(prev[index], score) : score }));
  };

  const completeLesson = async () => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const scores = Object.values(phraseResults);
    const avgScore = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const allOk = lesson.phrases.length === 0 || scores.length >= lesson.phrases.length;
    setSaving(true);
    try {
      await api.progress.save(id, {
        score: avgScore,
        completed: allOk ? 1 : 0,
        time_spent_seconds: timeSpent,
      });
      navigate('/lessons');
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !lesson) return <div className="app-layout">{loading ? 'Cargando...' : 'Lección no encontrada.'}</div>;

  const vocabulary = lesson.vocabulary || [];
  const vocabularyEs = lesson.vocabulary_es || [];
  const phrases = lesson.phrases || [];
  const phrasesEs = lesson.phrases_es || [];
  const completedCount = Object.keys(phraseResults).length;

  return (
    <div className="app-layout">
      <nav className="lesson-nav">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/lessons')}>← Lecciones</button>
      </nav>
      <header className="lesson-header card">
        <div className="lesson-header-badges">
          {lesson.stage != null && <span className="lesson-badge stage">Etapa {lesson.stage}</span>}
          <span className="lesson-badge">{lesson.level}</span>
        </div>
        <h1>{lesson.title}</h1>
        {lesson.stage_title && <p className="lesson-stage-desc">{lesson.stage_title}</p>}
      </header>

      {vocabulary.length > 0 && (
        <section className="lesson-section card">
          <h2>Vocabulario</h2>
          <ul className="vocab-list">
            {vocabulary.map((word, i) => (
              <li key={i} className="vocab-item">
                <span className="vocab-en-es">
                  <Listening text={word} label={word} />
                  {vocabularyEs[i] && <span className="vocab-es">{vocabularyEs[i]}</span>}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {phrases.length > 0 && (
        <section className="lesson-section card">
          <h2>Frases para practicar</h2>
          <p className="section-desc">Escucha la pronunciación y luego dilas en voz alta.</p>
          {phrases.map((phrase, i) => (
            <div key={i} className="phrase-block">
              <p className="phrase-text">{phrase}</p>
              {phrasesEs[i] && <p className="phrase-es">{phrasesEs[i]}</p>}
              <Listening text={phrase} label="Escuchar" />
              <Speaking
                expectedText={phrase}
                instruction="Di la frase en inglés."
                onResult={(r) => handlePhraseResult(i, r)}
              />
              {phraseResults[i] !== undefined && (
                <span className={`phrase-score ${phraseResults[i] >= 80 ? 'ok' : ''}`}>{phraseResults[i]}%</span>
              )}
            </div>
          ))}
        </section>
      )}

      <div className="lesson-actions">
        <button type="button" className="btn btn-primary" onClick={completeLesson} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar progreso y salir'}
        </button>
        <p className="lesson-meta">Frases practicadas: {completedCount} / {phrases.length}</p>
      </div>
    </div>
  );
}
