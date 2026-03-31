"use client";

import React, { useEffect, useState } from 'react';
import ParticleCanvas from './ParticleCanvas';

export default function Hero() {
  const [terminalText, setTerminalText] = useState("");
  const fullText = `// Prompt con contrato explícito
const prompt = {
  role: "arquitecto de software senior",
  context: "sistema DDD con CQRS en .NET",
  task: "evaluar trade-offs del patrón Saga",
  constraints: [
    "sin cambiar bounded contexts",
    "máximo 3 alternativas",
  ],
  output: "tabla comparativa + recomendación"
};

// Resultado: ingeniería, no magia ✓`;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      setTerminalText(fullText.slice(0, current));
      current++;
      if (current > fullText.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="hero">
      <ParticleCanvas id="particles-canvas" count={55} maxDist={140} />
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Para Senior Devs · Tech Leads · Arquitectos
        </div>
        <h1 className="hero-title">
          La IA no debería<br />
          <span className="gradient-text">reemplazarte.</span><br />
          Debería amplificarte.
        </h1>
        <p className="hero-subtitle">
          Si sos senior, la IA no reemplaza tu criterio. Lo amplifica.
          Si sos tech lead, <strong>necesitás entender cómo tus juniors la están usando.</strong>
        </p>
        <div className="hero-ctas">
          <a href="#quiz" className="btn-primary">Hacé el diagnóstico →</a>
          <a href="#modulos" className="btn-secondary">Ver el programa</a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="terminal-window">
          <div className="terminal-header">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
            <span className="terminal-title">prompt.engineer.ts</span>
          </div>
          <div className="terminal-body">
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {terminalText}
              <span className="terminal-cursor">█</span>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
