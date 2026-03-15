import React, { useState, useCallback, useEffect } from 'react';
import './Listening.css';

// Obtener una voz en inglés (en-US preferida) para pronunciación correcta
function getEnglishVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'en-US') ||
    voices.find((v) => v.lang === 'en-GB') ||
    voices.find((v) => v.lang.startsWith('en-'))
  );
}

/**
 * Módulo de Listening: reproduce en audio la pronunciación correcta en inglés (TTS).
 * Fuerza voz en-US/en-GB para que no suene en español.
 */
export default function Listening({ text, label = 'Escuchar' }) {
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  const doSpeak = useCallback((textToSpeak) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(textToSpeak);
    u.lang = 'en-US';
    u.rate = 0.85;
    const voice = getEnglishVoice();
    if (voice) u.voice = voice;
    u.onstart = () => setPlaying(true);
    u.onend = u.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(u);
  }, []);

  const speak = useCallback(() => {
    if (!text || !window.speechSynthesis) {
      setError('Tu navegador no soporta reproducción de audio.');
      return;
    }
    setError(null);
    if (getEnglishVoice()) {
      doSpeak(text);
    } else {
      const onVoices = () => {
        window.speechSynthesis.removeEventListener('voiceschanged', onVoices);
        doSpeak(text);
      };
      window.speechSynthesis.addEventListener('voiceschanged', onVoices);
      setTimeout(() => {
        if (window.speechSynthesis.getVoices().length > 0) doSpeak(text);
      }, 200);
    }
  }, [text, doSpeak]);

  return (
    <div className="listening-box">
      <button type="button" className="btn btn-primary listening-btn" onClick={speak} disabled={playing}>
        {playing ? 'Reproduciendo...' : `🔊 ${label}`}
      </button>
      {error && <p className="listening-error">{error}</p>}
    </div>
  );
}
