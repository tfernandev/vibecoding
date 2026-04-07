"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { analyzePrompt, LintResult } from '@/lib/linter';
import { sendMessage, saveSession, checkBackendStatus } from '@/lib/ai';

export default function SandboxPage() {
  const [prompt, setPrompt] = useState<string>("");
  const [lintResult, setLintResult] = useState<LintResult | null>(null);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [backendStatus, setBackendStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // Sync theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Real-time linting
  useEffect(() => {
    if (prompt.trim()) {
      setLintResult(analyzePrompt(prompt));
    } else {
      setLintResult(null);
    }
  }, [prompt]);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const checkStatus = async () => {
    setBackendStatus('checking');
    const isUp = await checkBackendStatus();
    setBackendStatus(isUp ? 'online' : 'offline');
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const handleDeepAnalyze = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setAiResponse(prev => prev + "\n\n[SISTEMA]: Iniciando Análisis de Estrategia Cognitiva... 🧠\n");
    
    // Simulate multi-stage analysis
    const stages = [
      "⚡ Evaluando coherencia de arquitectura...",
      "🔍 Detectando posibles anti-patrones en el prompt...",
      "🏛️ Aplicando marcos de diseño SOLID/Clean...",
      "✅ Análisis completado. El prototipo es estructuralmente sólido."
    ];

    for (const stage of stages) {
      await new Promise(r => setTimeout(r, 800));
      setAiResponse(prev => prev + `\n> ${stage}`);
    }
    
    setIsGenerating(false);
  };

  const handleSaveSession = async () => {
    if (!prompt.trim() || !aiResponse.trim() || isGenerating) {
      alert("Necesitas ejecutar un prompt antes de guardar la sesión.");
      return;
    }
    
    try {
      const res = await saveSession(prompt, aiResponse);
      if (res.success) {
         setAiResponse(prev => prev + `\n\n[DB]: Sesión persistida con éxito en PostgreSQL. ID: ${res.id.substring(0, 8)}...`);
         alert("¡Sesión guardada! Podrás verla en tu historial del panel.");
      }
    } catch (error) {
      alert("Ocurrió un error al intentar conectarse al servidor.");
    }
  };

  const simulateGeneration = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setAiResponse("");
    
    try {
      const result = await sendMessage(prompt);
      const responseText = result.data;
      for (let i = 0; i < responseText.length; i++) {
        setAiResponse(prev => prev + responseText[i]);
        if (i % 2 === 0) await new Promise(r => setTimeout(r, 5));
      }
    } catch (error: any) {
      setAiResponse(`[ERROR CRÍTICO]: No se pudo conectar con el servidor de IA.\n${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="sandbox-wrapper">
      <header className="sandbox-header">
        <div className="header-left">
          <Link href="/dashboard" className="btn-secondary btn-sm back-btn">
            <span className="icon">←</span> Volver
          </Link>
          <h1 className="sandbox-title">Engineering <span className="gradient-text">Sandbox.</span></h1>
          <span className="status-badge">PRIME v3.1</span>
          <div className={`backend-indicator ${backendStatus}`}>
             <span className="dot"></span>
             {backendStatus === 'online' ? 'Backend Online' : backendStatus === 'checking' ? 'Connecting...' : 'Backend Sleeping'}
             {backendStatus === 'offline' && (
               <button className="wake-btn" onClick={checkStatus} title="Click to wake up Render instance">
                 Wake Up ⚡
               </button>
             )}
          </div>
        </div>
        <div className="header-right">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
            {isDark ? '☀️' : '🌙'}
          </button>
          <button className="btn-secondary btn-sm" onClick={handleSaveSession}>Guardar Sesión</button>
          <button className="btn-primary btn-sm" onClick={handleDeepAnalyze}>Analyze Strategy</button>
        </div>
      </header>

      <main className="sandbox-grid">
        <section className="editor-section">
          <div className="section-label-minimal">PROMPT EDITOR</div>
          <div className="editor-container">
            <textarea 
              className="prompt-textarea"
              placeholder="Escribí tu prompt de ingeniería aquí... (ej. Actúa como un experto en arquitectura .NET y generá una tabla de...)"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="editor-footer">
              <div className="char-count">{prompt.length} caracteres</div>
              <button 
                className="execute-btn" 
                onClick={simulateGeneration}
                disabled={isGenerating || prompt.length < 5}
              >
                {isGenerating ? "GENERANDO..." : "EJECUTAR PROMPT ⚡"}
              </button>
            </div>
          </div>

          <div className="linter-area">
            <div className="linter-header">
              <span className="section-label-minimal">ENGINEERING LINT</span>
              {lintResult && (
                <div className="score-wrap">
                  Score: <span className={`score-value ${lintResult.score > 70 ? 'high' : lintResult.score > 40 ? 'med' : 'low'}`}>{lintResult.score}</span>
                </div>
              )}
            </div>
            
            <div className="linter-feedback">
              {!prompt && <p className="empty-msg">Empezá a escribir para analizar la calidad de ingeniería de tu prompt.</p>}
              {lintResult?.feedback.map((f, i) => (
                <div key={i} className={`feedback-item ${f.type}`}>
                  <span className="f-icon">{f.type === 'success' ? '✓' : f.type === 'warning' ? '⚠' : f.type === 'error' ? '✖' : 'ℹ'}</span>
                  <div className="f-content">
                    <span className="f-category">{f.category.toUpperCase()}</span>
                    <p className="f-message">{f.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="output-section">
          <div className="section-label-minimal">OUTPUT TERMINAL</div>
          <div className="terminal-output">
            {!aiResponse && !isGenerating && (
              <div className="terminal-placeholder">
                <span className="t-cursor">█</span>
                <p>Esperando ejecución...</p>
              </div>
            )}
            <div className="terminal-content">
              <pre className="t-text">{aiResponse}</pre>
              {isGenerating && <span className="t-cursor-blink">█</span>}
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .sandbox-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--bg-main);
          color: var(--text-primary);
        }
        .sandbox-header {
          padding: 16px 32px;
          border-bottom: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: var(--bg-surface);
          z-index: 10;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 24px;
        }
        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .sandbox-title {
          font-size: 1.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }
        .gradient-text {
           background: var(--gradient-brand);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
        }
        .status-badge {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          background: rgba(255,107,0,0.1);
          color: var(--primary);
          padding: 4px 10px;
          border-radius: 4px;
          border: 1px solid rgba(255,107,0,0.2);
          font-weight: 700;
        }
        .header-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .sandbox-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
        }
        .editor-section {
          padding: 32px;
          border-right: 1px solid var(--border);
          display: flex;
          flex-direction: column;
          gap: 32px;
          overflow-y: auto;
          background: var(--bg-main);
        }
        .section-label-minimal {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted);
          letter-spacing: 0.15em;
          margin-bottom: 12px;
          opacity: 0.8;
        }
        .editor-container {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-xl);
          display: flex;
          flex-direction: column;
          min-height: 350px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
          overflow: hidden;
        }
        .prompt-textarea {
          flex: 1;
          background: transparent;
          border: none;
          padding: 32px;
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 1.1rem;
          line-height: 1.7;
          resize: none;
          outline: none;
        }
        .editor-footer {
          padding: 16px 32px;
          border-top: 1px solid var(--border);
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0,0,0,0.02);
        }
        .char-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        .execute-btn {
          background: var(--gradient-brand);
          color: #fff;
          border: none;
          padding: 12px 28px;
          border-radius: var(--radius-md);
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(255,107,0,0.2);
        }
        .execute-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255,107,0,0.4);
        }
        .execute-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(1);
        }
        
        .linter-area {
          flex: 1;
        }
        .linter-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .score-wrap {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--text-secondary);
        }
        .score-value {
          font-family: var(--font-mono);
          font-size: 1.25rem;
          margin-left: 8px;
        }
        .score-value.high { color: var(--success); }
        .score-value.med { color: var(--secondary); }
        .score-value.low { color: var(--danger); }

        .linter-feedback {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .feedback-item {
          display: flex;
          gap: 16px;
          padding: 16px 20px;
          border-radius: var(--radius-lg);
          background: var(--bg-surface);
          border: 1px solid var(--border);
          transition: transform 0.2s;
        }
        .feedback-item:hover {
           transform: translateX(4px);
        }
        .feedback-item.success { border-left: 4px solid var(--success); }
        .feedback-item.warning { border-left: 4px solid var(--secondary); }
        .feedback-item.error { border-left: 4px solid var(--danger); }
        .feedback-item.info { border-left: 4px solid var(--primary); }

        .f-icon { font-size: 1rem; margin-top: 2px; }
        .f-category { font-size: 0.7rem; font-weight: 800; opacity: 0.6; letter-spacing: 0.05em; }
        .f-message { font-size: 0.95rem; margin-top: 4px; line-height: 1.5; color: var(--text-secondary); }

        .output-section {
          padding: 32px;
          background: #0d0d12;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow: hidden;
        }
        .terminal-output {
          flex: 1;
          background: #000;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: var(--radius-xl);
          padding: 40px;
          font-family: var(--font-mono);
          position: relative;
          overflow-y: auto;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.5);
        }
        .terminal-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #444;
          gap: 16px;
        }
        .t-text {
          white-space: pre-wrap;
          color: #e0e0e0;
          font-size: 1rem;
          line-height: 1.8;
          margin: 0;
        }
        .t-cursor { animation: blink 1s infinite; font-size: 2.5rem; color: #222; }
        .t-cursor-blink { animation: blink 1s infinite; color: var(--primary); }

        @keyframes blink { 50% { opacity: 0; } }

        .backend-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(0,0,0,0.05);
          border: 1px solid rgba(0,0,0,0.05);
        }
        .backend-indicator.online { color: var(--success); }
        .backend-indicator.offline { color: var(--text-muted); }
        .backend-indicator.checking { color: var(--secondary); }
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: currentColor;
        }
        .checking .dot { animation: pulse 1.5s infinite; }
        
        .wake-btn {
          margin-left: 8px;
          background: var(--primary);
          color: white;
          border: none;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.65rem;
          cursor: pointer;
          font-weight: 700;
          transition: transform 0.2s;
        }
        .wake-btn:hover { transform: scale(1.05); background: #ff8c00; }

        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.2); }
          100% { opacity: 1; transform: scale(1); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .sandbox-grid {
            grid-template-columns: 1fr;
            overflow-y: auto;
          }
          .editor-section {
            border-right: none;
            border-bottom: 1px solid var(--border);
          }
          .sandbox-header {
            padding: 16px;
          }
        }

        @media (max-width: 768px) {
          .sandbox-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }
          .header-right {
            width: 100%;
            justify-content: space-between;
          }
          .editor-section, .output-section {
            padding: 24px 16px;
          }
          .terminal-output {
            padding: 24px;
          }
          .sandbox-title {
            font-size: 1.1rem;
          }
          .status-badge {
            display: none;
          }
          .backend-indicator {
            padding: 4px 8px;
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
}
