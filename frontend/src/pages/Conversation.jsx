import React, { useState, useEffect, useRef } from 'react';
import { api } from '../api/client';
import Listening from '../components/Listening';
import './Conversation.css';

/**
 * Chat conversacional con IA. El usuario puede escribir o (en navegadores compatibles) hablar.
 * La IA responde en inglés y puede corregir gramática.
 */
export default function Conversation() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    api.chat.history().then((list) => setMessages(list)).catch(() => setMessages([]));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: trimmed }]);
    setLoading(true);
    setError(null);
    try {
      const { message, correction } = await api.chat.message(trimmed);
      setMessages((m) => [...m, { role: 'assistant', content: message, correction }]);
    } catch (e) {
      setError(e.message);
      setMessages((m) => m.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const startVoice = () => {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      setError('Reconocimiento de voz no disponible. Escribe tu respuesta.');
      return;
    }
    setError(null);
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Recognition();
    rec.lang = 'en-US';
    rec.continuous = false;
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
      setListening(false);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  };

  const stopVoice = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  };

  return (
    <div className="app-layout conversation-page">
      <h1 className="page-title">Conversación con el profesor IA</h1>
      <p className="conversation-desc">Practica inglés escribiendo o hablando. La IA te responderá y puede corregir errores.</p>
      <div className="chat-card card">
        <div className="chat-messages">
          {messages.length === 0 && (
            <p className="chat-placeholder">¡Hola! Escribe o di algo en inglés para empezar. Por ejemplo: &quot;Hello, my name is...&quot;</p>
          )}
          {messages.map((msg, i) => (
            <div key={i} className={`chat-msg ${msg.role}`}>
              <span className="chat-role">{msg.role === 'user' ? 'Tú' : 'IA'}</span>
              <p className="chat-content">{msg.content}</p>
              {msg.role === 'assistant' && msg.content && <Listening text={msg.content} label="Escuchar" />}
              {msg.correction && <p className="chat-correction">Corrección: {msg.correction}</p>}
            </div>
          ))}
          {loading && <div className="chat-msg assistant"><span className="chat-role">IA</span><p className="chat-content">...</p></div>}
          <div ref={bottomRef} />
        </div>
        {error && <p className="chat-error">{error}</p>}
        <div className="chat-input-row">
          <input
            type="text"
            className="chat-input"
            placeholder="Escribe en inglés..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <button type="button" className="btn btn-ghost chat-voice" onClick={listening ? stopVoice : startVoice} title="Hablar">
            {listening ? '⏹' : '🎤'}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            Enviar
          </button>
        </div>
      </div>
      <div className="conversation-tip">
        <strong>Tip:</strong> Escucha la respuesta de la IA con el botón 🔊 para practicar listening.
      </div>
    </div>
  );
}
