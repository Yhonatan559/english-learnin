import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import './Lessons.css';

const LEVELS = ['Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced'];

const VOCAB_SUBTITLES = { Alphabet: 'Alfabeto', Numbers: 'Números', Fruits: 'Frutas', Vegetables: 'Verduras', Animals: 'Animales', Colors: 'Colores', Food: 'Comida', Objects: 'Objetos', Family: 'Familia' };

export default function Lessons() {
  const [lessons, setLessons] = useState([]);
  const [summary, setSummary] = useState(null);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.lessons.list(), api.progress.summary()])
      .then(([list, sum]) => {
        setLessons(list);
        setSummary(sum);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  }, []);

  const progressByLesson = (summary?.byLesson || []).reduce((acc, p) => {
    acc[p.lesson_id] = p;
    return acc;
  }, {});

  const stageLessons = lessons.filter((l) => (l.category || 'stage') === 'stage');
  const vocabLessons = lessons.filter((l) => l.category === 'vocabulary');
  const filtered = filter ? stageLessons.filter((l) => l.level === filter) : stageLessons;

  if (loading) return <div className="app-layout">Cargando lecciones...</div>;

  return (
    <div className="app-layout">
      <h1 className="page-title">Curso de inglés por etapas</h1>
      <p className="lessons-intro">Sigue el orden pedagógico: familiarización → pronombres → verbo to be → oraciones → preguntas y respuestas → vocabulario → verbos → presente simple → diálogos → pronunciación → conversación libre.</p>
      <div className="level-tabs">
        <button type="button" className={!filter ? 'active' : ''} onClick={() => setFilter('')}>Todas</button>
        {LEVELS.map((l) => (
          <button key={l} type="button" className={filter === l ? 'active' : ''} onClick={() => setFilter(l)}>{l}</button>
        ))}
      </div>
      <ul className="lessons-list">
        {filtered.map((lesson) => {
          const prog = progressByLesson[lesson.id];
          const pct = prog ? (prog.completed ? 100 : Math.min(100, prog.score)) : 0;
          const stageLabel = lesson.stage != null ? `Etapa ${lesson.stage}` : null;
          return (
            <li key={lesson.id}>
              <Link to={`/lessons/${lesson.id}`} className="lesson-card card">
                <div className="lesson-card-head">
                  {stageLabel && <span className="lesson-stage">{stageLabel}</span>}
                  <span className="lesson-level">{lesson.level}</span>
                </div>
                <h3 className="lesson-title">{lesson.title}</h3>
                {lesson.stage_title && <p className="lesson-stage-title">{lesson.stage_title}</p>}
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="lesson-progress-label">{pct}%</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <section className="vocabulary-section">
        <h2 className="vocabulary-section-title">Vocabulario</h2>
        <p className="vocabulary-section-desc">Temas de vocabulario para quienes empiezan: alfabeto, números, frutas, verduras, animales, colores, comida, objetos y familia.</p>
        <ul className="lessons-list vocabulary-list">
          {vocabLessons.map((lesson, index) => {
            const prog = progressByLesson[lesson.id];
            const pct = prog ? (prog.completed ? 100 : Math.min(100, prog.score)) : 0;
            return (
              <li key={lesson.id}>
                <Link to={`/lessons/${lesson.id}`} className="lesson-card card vocabulary-card">
                  <span className="lesson-stage">Lesson {index + 1}</span>
                  <h3 className="lesson-title">{lesson.title}</h3>
                  {VOCAB_SUBTITLES[lesson.title] && <p className="vocabulary-subtitle">{VOCAB_SUBTITLES[lesson.title]}</p>}
                  <div className="progress-bar">
                    <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="lesson-progress-label">{pct}%</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
