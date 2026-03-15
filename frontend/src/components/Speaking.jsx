import React, { useState, useCallback, useEffect } from 'react';
import './Speaking.css';

/**
 * Módulo de Speaking: reconoce la voz del usuario (Web Speech API) y compara con la frase esperada.
 * Evalúa coincidencia y opcionalmente da feedback de pronunciación.
 */
export default function Speaking({ expectedText, onResult, instruction = 'Di la frase en voz alta' }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState(null); // 'correct' | 'retry' | null
  const [error, setError] = useState(null);

  const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

  const checkMatch = useCallback((said) => {
    const expected = normalize(expectedText);
    const saidNorm = normalize(said);
    if (!expected) return { ok: false, message: 'Intenta nuevamente.' };
    if (saidNorm === expected) return { ok: true, message: '¡Correcto!' };
    if (expected.includes(saidNorm) || saidNorm.includes(expected)) return { ok: true, message: '¡Muy bien!' };
    return { ok: false, message: 'Intenta nuevamente. Escucha la pronunciación e imita.' };
  }, [expectedText]);

  const startListening = useCallback(() => {
    setError(null);
    setResult(null);
    setTranscript('');
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setError('El reconocimiento de voz no está disponible en tu navegador. Prueba Chrome.');
      return;
    }
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Recognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.interimResults = false;
    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onresult = (e) => {
      const said = e.results[0][0].transcript;
      setTranscript(said);
      const { ok, message } = checkMatch(said);
      setResult(ok ? 'correct' : 'retry');
      onResult?.({ said, ok, message, score: ok ? 100 : 0 });
    };
    rec.onerror = (e) => {
      setListening(false);
      setError(e.error === 'not-allowed' ? 'Permiso de micrófono denegado.' : 'Error de reconocimiento.');
    };
    rec.start();
  }, [checkMatch, onResult]);

  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="speaking-box">
      <p className="speaking-instruction">{instruction}</p>
      <button type="button" className={`btn speaking-btn ${listening ? 'listening' : ''}`} onClick={startListening} disabled={listening}>
        {listening ? 'Escuchando... Habla ahora.' : '🎤 Hablar'}
      </button>
      {transcript && (
        <p className="speaking-transcript">Dijiste: &quot;{transcript}&quot;</p>
      )}
      {result === 'correct' && <p className="speaking-feedback correct">¡Correcto!</p>}
      {result === 'retry' && <p className="speaking-feedback retry">Intenta nuevamente. Escucha e imita la pronunciación.</p>}
      {error && <p className="speaking-error">{error}</p>}
    </div>
  );
}
