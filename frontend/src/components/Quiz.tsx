"use client";

import React, { useState } from 'react';
import ParticleCanvas from './ParticleCanvas';

const TOTAL_STEPS = 5;
const CIRC = 113.1;

const PROFILES = {
  director: {
    orb: 'director',
    emoji: '🟠',
    title: 'Director Técnico Potencial',
    desc: 'Tenés el criterio. Solo necesitás sistematizarlo. Este programa te da los frameworks para supervisar IA con autoridad y diseñar workflows que tu equipo pueda replicar.',
  },
  tactico: {
    orb: 'tactico',
    emoji: '🟡',
    title: 'Usuario Táctico de IA',
    desc: 'Usás IA pero de forma reactiva. Estás a pocos pasos de convertirte en quien dirige la IA, en lugar de quien la sigue. El módulo de supervisión y el Prompt Linter cambian todo.',
  },
  riesgo: {
    orb: 'riesgo',
    emoji: '🔴',
    title: 'Riesgo de Delegación Crítica',
    desc: 'Tu equipo delega sin criterio. Eso genera deuda técnica invisible y pérdida de ownership. Este programa es exactamente lo que necesitás para tomar el control.',
  },
};

const MODULE_RECS = {
  director: [
    { num: '01', name: 'Fundamentos de AI Engineering' },
    { num: '04', name: 'Eficiencia y Ownership' },
    { num: '05', name: 'Validación y Testing de IA' },
  ],
  tactico: [
    { num: '02', name: 'Diseño de Prompts' },
    { num: '03', name: 'Prompt Patterns Pro' },
    { num: '05', name: 'Validación y Testing de IA' },
  ],
  riesgo: [
    { num: '01', name: 'Fundamentos de AI Engineering' },
    { num: '02', name: 'Diseño de Prompts' },
    { num: '04', name: 'Eficiencia y Ownership' },
  ],
};

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<any>({});
  const [showResult, setShowResult] = useState(false);
  const [evalFeedback, setEvalFeedback] = useState<{ correct: boolean; message: string } | null>(null);

  const handleOptionSelect = (key: string, value: string) => {
    setAnswers({ ...answers, [key]: value });
    if (currentStep < TOTAL_STEPS - 1) {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    } else {
      setTimeout(() => setCurrentStep(prev => prev + 1), 400);
    }
  };

  const handleEvalSelect = (value: string, isCorrect: boolean) => {
    setAnswers({ ...answers, eval: value, evalCorrect: isCorrect });
    setEvalFeedback({
      correct: isCorrect,
      message: isCorrect 
        ? "Correcto. Un prompt sin rol, contexto ni output esperado produce resultados genéricos e impredecibles." 
        : "No exactamente. Sin contrato cognitivo (rol, contexto, output), el modelo no puede producir resultados confiables."
    });
    setTimeout(() => setShowResult(true), 1800);
  };

  const calcProfile = () => {
    let score = 0;
    if (['techlead', 'arquitecto', 'founder'].includes(answers.rol)) score += 2;
    if (answers.rol === 'senior') score += 1;
    if (['intensivo', 'algunos'].includes(answers.equipo)) score += 1;
    if (['criterio', 'arquitectura', 'deuda'].includes(answers.dolor)) score += 2;
    if (['arquitectura', 'brainstorm'].includes(answers.uso)) score += 2;
    if (answers.evalCorrect) score += 2;

    if (score >= 7) return 'director';
    if (score >= 4) return 'tactico';
    return 'riesgo';
  };

  const profileKey = showResult ? calcProfile() : 'tactico';
  const profile = PROFILES[profileKey as keyof typeof PROFILES];
  const modules = MODULE_RECS[profileKey as keyof typeof MODULE_RECS];

  const pct = currentStep / TOTAL_STEPS;
  const dashOffset = CIRC * (1 - (showResult ? 1 : pct));

  return (
    <section id="quiz">
      <div className="quiz-shell">
        <ParticleCanvas id="quiz-canvas" count={35} maxDist={100} />
        
        <div className="quiz-inner">
          <div className="quiz-progress-wrap">
            <svg className="quiz-ring" viewBox="0 0 44 44">
              <circle className="quiz-ring-bg" cx="22" cy="22" r="18" />
              <circle 
                className="quiz-ring-fill" 
                cx="22" cy="22" r="18" 
                style={{ strokeDashoffset: dashOffset }}
              />
            </svg>
            <span className="quiz-step-label">{showResult ? '✓' : `${currentStep} / ${TOTAL_STEPS}`}</span>
          </div>

          {!showResult ? (
            <div className="quiz-steps">
              {currentStep === 1 && (
                <div className="quiz-step active">
                  <p className="quiz-eyebrow">Paso 1 de 5</p>
                  <h2 className="quiz-question">¿Qué rol cumplís hoy?</h2>
                  <div className="quiz-options">
                    {['senior', 'techlead', 'arquitecto', 'founder'].map(val => (
                      <button key={val} className="quiz-opt" onClick={() => handleOptionSelect('rol', val)}>
                        {val === 'senior' ? '👨‍💻 Senior Dev' : val === 'techlead' ? '🧭 Tech Lead' : val === 'arquitecto' ? '🏛️ Arquitecto' : '🚀 Founder técnico'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="quiz-step active">
                   <p className="quiz-eyebrow">Paso 2 de 5</p>
                   <h2 className="quiz-question">¿Tu equipo usa IA para programar?</h2>
                   <div className="quiz-options">
                    {['intensivo', 'algunos', 'poco', 'nodesa'].map(val => (
                      <button key={val} className="quiz-opt" onClick={() => handleOptionSelect('equipo', val)}>
                        {val === 'intensivo' ? '🔥 Sí, intensivamente' : val === 'algunos' ? '⚡ Algunos sí' : val === 'poco' ? '💤 Casi no' : '🤷 No lo sé'}
                      </button>
                    ))}
                   </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="quiz-step active">
                   <p className="quiz-eyebrow">Paso 3 de 5</p>
                   <h2 className="quiz-question">¿Qué te preocupa más de IA en tu equipo?</h2>
                   <div className="quiz-options">
                      {['comprension', 'deuda', 'criterio', 'arquitectura', 'seniority'].map(val => (
                        <button key={val} className="quiz-opt" onClick={() => handleOptionSelect('dolor', val)}>
                          {val === 'comprension' ? '🧠 Código sin comprensión' : val === 'deuda' ? '🕳️ Deuda técnica invisible' : val === 'criterio' ? '🎯 Falta de criterio' : val === 'arquitectura' ? '🏗️ Arquitectura inconsistente' : '📉 Pérdida de seniority'}
                        </button>
                      ))}
                   </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="quiz-step active">
                   <p className="quiz-eyebrow">Paso 4 de 5</p>
                   <h2 className="quiz-question">Cuando usás IA, normalmente…</h2>
                   <div className="quiz-options">
                      {['copio', 'brainstorm', 'arquitectura', 'desconfio'].map(val => (
                        <button key={val} className="quiz-opt" onClick={() => handleOptionSelect('uso', val)}>
                          {val === 'copio' ? '📋 Copio y ajusto' : val === 'brainstorm' ? '💡 La uso como brainstorming' : val === 'arquitectura' ? '📐 La uso para arquitectura' : '🔒 No confío mucho'}
                        </button>
                      ))}
                   </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="quiz-step active">
                  <p className="quiz-eyebrow">Paso 5 de 5 — Mini evaluación</p>
                  <h2 className="quiz-question">¿Qué está mal en este prompt?</h2>
                  <div className="quiz-prompt-example">
                    <code>"Escribime código para un sistema que maneje usuarios."</code>
                  </div>
                  <div className="quiz-options">
                    <button className="quiz-opt" onClick={() => handleEvalSelect('a', false)}>A. Es muy corto</button>
                    <button className="quiz-opt" onClick={() => handleEvalSelect('b', true)}>B. No tiene contexto, rol ni output esperado</button>
                    <button className="quiz-opt" onClick={() => handleEvalSelect('c', false)}>C. Debería ser en inglés</button>
                  </div>
                  {evalFeedback && (
                    <div className={`quiz-feedback ${evalFeedback.correct ? 'correct' : 'wrong'}`}>
                      <strong>{evalFeedback.correct ? '✅' : '❌'} {evalFeedback.correct ? 'Correcto' : 'No exactamente'}</strong>
                      {evalFeedback.message}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="quiz-result">
              <div className="result-profile">
                <div className={`result-orb ${profile.orb}`}></div>
                <h2 className="result-title">{profile.emoji} {profile.title}</h2>
                <p className="result-desc">{profile.desc}</p>
              </div>
              <div className="result-modules">
                <p className="result-modules-label">Según tus respuestas, estos módulos son críticos para vos:</p>
                <div className="result-module-list">
                  {modules.map(m => (
                    <div key={m.num} className="result-module-item">
                      <span className="rmi-num">{m.num}</span>
                      <span className="rmi-name">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="result-ctas">
                <button className="btn-primary" onClick={() => window.location.href = '/dashboard'}>Ver programa completo</button>
                <button className="btn-ghost" onClick={() => { setShowResult(false); setCurrentStep(1); setEvalFeedback(null); }}>Repetir diagnóstico</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
