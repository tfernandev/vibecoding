"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface ModuleData {
  id: string;
  title: string;
  description: string;
  order: number;
}

const STATIC_MODULES: ModuleData[] = [
  { id: "11111111-1111-1111-1111-111111111101", title: "Fundamentos de AI Engineering", description: "Aprende los conceptos básicos de LLMs, tokens y ventanas de contexto. El cambio de paradigma de dev a AI-First Developer.", order: 1 },
  { id: "11111111-1111-1111-1111-111111111102", title: "Diseño de Prompts", description: "Estructuras eficientes para controlar el comportamiento del modelo. El prompt como contrato de ejecución.", order: 2 },
  { id: "11111111-1111-1111-1111-111111111103", title: "Prompt Patterns Pro", description: "Domina el patrón Dual Mode, la descomposición y el encadenamiento de tareas complejas.", order: 3 },
  { id: "11111111-1111-1111-1111-111111111104", title: "Eficiencia y Ownership", description: "Mantén el control del código y evita la deuda técnica invisible. El arquitecto como Tech Lead de IAs.", order: 4 },
  { id: "11111111-1111-1111-1111-111111111105", title: "Validación y Testing de IA", description: "Asegura la calidad con Evals, Golden Sets, y Unit Testing para prompts en tu pipeline de CI/CD.", order: 5 },
];

export default function ModulesPage() {
  const [modules, setModules] = useState<ModuleData[]>(STATIC_MODULES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchModules() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5054/api';
        const res = await fetch(`${baseUrl}/Dashboard/data`);
        if (res.ok) {
          const data = await res.json();
          if (data.modules && data.modules.length > 0) {
            setModules(data.modules);
          }
        }
      } catch {
        // Use static fallback silently
      }
    }
    fetchModules();
  }, []);

  return (
    <div className="modules-page">
       <Navbar />
       
       <header className="page-header">
          <div className="container">
             <div className="header-nav">
                <Link href="/dashboard" className="btn-secondary btn-sm back-btn">
                   <span className="icon">←</span> Volver al Panel
                </Link>
             </div>
             <div className="header-content">
                <h1 className="title">Currículum <span className="gradient-text">Vibe Coding.</span></h1>
                <p className="subtitle">Explora los módulos críticos diseñados para elevar tu seniority y ownership en la era de la IA.</p>
             </div>
          </div>
       </header>

       <main className="container">
          {loading ? (
             <div className="loading-state">
                <div className="loader-ring"></div>
                <span>Interpretando arquitectura...</span>
             </div>
          ) : (
             <div className="modules-grid-full">
                {modules.map(m => (
                   <div key={m.id} className="module-card-full">
                      <div className="m-card-glow"></div>
                      <div className="m-card-header">
                         <span className="m-number">0{m.order}</span>
                         <span className="m-badge">Módulo Senior</span>
                      </div>
                      <div className="m-card-body">
                         <h2 className="m-title">{m.title}</h2>
                         <p className="m-desc">{m.description}</p>
                         <div className="m-card-footer">
                            <Link href={`/courses/${m.id}`} className="btn-primary">
                               Entrar al Módulo <span className="btn-icon">→</span>
                            </Link>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          )}
       </main>

       <style jsx>{`
          .modules-page {
             background: var(--bg-main);
             min-height: 100vh;
             color: var(--text-primary);
             padding-top: 80px; /* navbar offset */
             padding-bottom: 120px;
             transition: background 0.4s ease, color 0.4s ease;
             position: relative;
             overflow: hidden;
          }

          /* Ambient Glow */
          .modules-page::after {
             content: '';
             position: fixed;
             top: -10%;
             right: -10%;
             width: 50%;
             height: 50%;
             background: radial-gradient(circle, rgba(255, 107, 0, 0.05) 0%, transparent 70%);
             z-index: 0;
             pointer-events: none;
          }

          .container {
             max-width: 1240px;
             margin: 0 auto;
             padding: 0 32px;
             position: relative;
             z-index: 1;
          }

          .page-header {
             padding: 60px 0 80px;
          }

          .header-nav {
             margin-bottom: 32px;
          }

          .back-btn {
             display: inline-flex;
             align-items: center;
             gap: 10px;
             cursor: pointer;
             z-index: 10;
          }

          .icon {
             font-size: 1.1rem;
             transition: transform 0.2s;
          }

          .back-btn:hover .icon {
             transform: translateX(-4px);
          }

          .title {
             font-size: clamp(2.5rem, 6vw, 4rem);
             font-weight: 900;
             margin-bottom: 20px;
             letter-spacing: -0.04em;
             line-height: 1.1;
          }

          .gradient-text {
             background: var(--gradient-brand);
             -webkit-background-clip: text;
             -webkit-text-fill-color: transparent;
             background-clip: text;
          }

          .subtitle {
             font-size: 1.25rem;
             color: var(--text-secondary);
             max-width: 650px;
             line-height: 1.6;
             opacity: 0.85;
          }

          .loading-state {
             display: flex;
             flex-direction: column;
             align-items: center;
             justify-content: center;
             padding: 120px 0;
             gap: 20px;
             color: var(--primary);
             font-family: var(--font-mono);
          }

          .loader-ring {
             width: 40px;
             height: 40px;
             border: 3px solid rgba(255, 107, 0, 0.1);
             border-top-color: var(--primary);
             border-radius: 50%;
             animation: spin 1s linear infinite;
          }

          @keyframes spin {
             to { transform: rotate(360deg); }
          }

          .modules-grid-full {
             display: grid;
             grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
             gap: 32px;
          }

          .module-card-full {
             background: var(--bg-surface);
             border: 1px solid var(--border);
             border-radius: var(--radius-xl);
             padding: 40px;
             transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
             position: relative;
             overflow: hidden;
             display: flex;
             flex-direction: column;
             justify-content: space-between;
             box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          }

          .m-card-glow {
             position: absolute;
             top: 0;
             left: 0;
             right: 0;
             height: 100%;
             background: radial-gradient(circle at top right, rgba(255, 107, 0, 0.03), transparent 60%);
             opacity: 0;
             transition: opacity 0.4s;
          }

          .module-card-full:hover {
             transform: translateY(-8px);
             border-color: var(--border-hover);
             box-shadow: var(--shadow-card);
          }

          .module-card-full:hover .m-card-glow {
             opacity: 1;
          }

          .m-card-header {
             display: flex;
             justify-content: space-between;
             align-items: center;
             margin-bottom: 32px;
             position: relative;
             z-index: 1;
          }

          .m-number {
             font-family: var(--font-mono);
             font-size: 2rem;
             font-weight: 900;
             color: var(--primary);
             opacity: 0.15;
             transition: opacity 0.3s;
          }

          .module-card-full:hover .m-number {
             opacity: 0.3;
          }

          .m-badge {
             font-size: 0.7rem;
             text-transform: uppercase;
             letter-spacing: 0.1em;
             background: rgba(255,107,0,0.08);
             color: var(--primary);
             padding: 6px 14px;
             border-radius: 100px;
             font-weight: 700;
             border: 1px solid rgba(255,107,0,0.1);
          }

          .m-card-body {
             position: relative;
             z-index: 1;
          }

          .m-title {
             font-size: 1.75rem;
             margin-bottom: 20px;
             font-weight: 800;
             letter-spacing: -0.02em;
             line-height: 1.2;
          }

          .m-desc {
             color: var(--text-secondary);
             line-height: 1.7;
             margin-bottom: 40px;
             font-size: 1.05rem;
             min-height: 5em;
          }

          .m-card-footer {
             margin-top: auto;
          }

          .btn-icon {
             transition: transform 0.2s;
          }

          .btn-primary:hover .btn-icon {
             transform: translateX(4px);
          }

          @media (max-width: 768px) {
             .modules-grid-full {
                grid-template-columns: 1fr;
             }
             .page-header {
                padding: 40px 0 60px;
             }
             .title {
                font-size: 2.5rem;
             }
          }
       `}</style>
    </div>
  );
}
