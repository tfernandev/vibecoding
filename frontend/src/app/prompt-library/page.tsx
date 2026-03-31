"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const PROMPTS = [
  {
    id: 1,
    title: "Contract Generator Architect",
    tag: "Arquitectura",
    desc: "Transforma requerimientos de negocio en un contrato de interface C# con validaciones SOLID.",
    content: `Actúa como un Arquitecto de Software Senior experto en .NET.
Tu objetivo es diseñar una interfaz C# que cumpla con los principios SOLID basándote en la siguiente intención del negocio.

[INTENCIÓN]: {Requerimiento}

Restricciones:
- No generes la implementación, solo la interfaz y los DTOs necesarios.
- Incluye comentarios XML detallados.
- Asegura que sea testeable mediante inyección de dependencias.

Formato: Bloque de código C#.`,
    usage: "Ideal para iniciar nuevas features sin ensuciar la mente con detalles de implementación."
  },
  {
    id: 2,
    title: "The Auditor Senior",
    tag: "Code Review",
    desc: "Analiza código generado por IA en busca de 'Copilot Spaghetti' y deuda técnica.",
    content: `Audita el siguiente código siguiendo los estándares de un Senior Tech Lead.
Identifica:
1. Complejidad innecesaria.
2. Violaciones de DRY y SOLID.
3. Posibles alucinaciones de librerías inexistentes.

CÓDIGO:
{Código Gen}

Salida: Lista de 'Red Flags' y sugerencias de refactorización.`,
    usage: "Usar después de que Copilot/Cursor genere un bloque de más de 50 líneas."
  },
  {
    id: 3,
    title: "Dual Mode Planner",
    tag: "Estrategia",
    desc: "Obliga al modelo a separar su fase de pensamiento de la de ejecución.",
    content: `[MODO DUAL ACTIVADO]
Paso 1: Analiza el problema planteado y desglosa 3 alternativas técnicas.
Paso 2: Evalúa los trade-offs de cada una (Rendimiento vs Mantenibilidad).
Paso 3: Selecciona la mejor opción.
Paso 4: Solo después de completar los pasos anteriores, procede a la implementación.

PROBLEMA: {Desafío Técnico}`,
    usage: "El prompt definitivo para evitar soluciones rápidas pero mediocres."
  }
];

export default function PromptLibrary() {
  const [selected, setSelected] = useState<any>(PROMPTS[0]);

  return (
    <div className="library-wrapper">
      <Navbar />
      
      <div className="library-layout">
        {/* Sidebar */}
        <aside className="lib-sidebar">
          <div className="sidebar-header">
             <Link href="/dashboard" className="btn-secondary btn-sm back-btn">
                <span className="icon">←</span> Volver
             </Link>
             <h2 className="sidebar-title">Prompt <span className="gradient-text">Library.</span></h2>
          </div>
          <div className="lib-list">
             {PROMPTS.map(p => (
               <button 
                 key={p.id} 
                 className={`lib-item ${selected.id === p.id ? 'active' : ''}`}
                 onClick={() => setSelected(p)}
               >
                 <span className="lib-tag">{p.tag}</span>
                 <span className="lib-title">{p.title}</span>
               </button>
             ))}
          </div>
        </aside>

        {/* Main Container */}
        <main className="lib-main">
          <header className="lib-header">
             <div className="lib-info">
               <span className="m-badge">Senior Pattern</span>
               <h1 className="title">{selected.title}</h1>
               <p className="subtitle">{selected.desc}</p>
             </div>
             <button className="btn-primary" onClick={() => {
                navigator.clipboard.writeText(selected.content);
                alert("Copiado al portapapeles");
             }}>Copiar Prompt ⚡</button>
          </header>

          <div className="lib-content-wrap">
             <div className="usage-card">
               <h3 className="section-label">MANUAL DE USO</h3>
               <p className="lib-usage">{selected.usage}</p>
             </div>
             
             <h3 className="section-label">CUERPO DEL PROMPT</h3>
             <div className="terminal-wrap">
               <pre className="lib-pre">
                 <code>{selected.content}</code>
               </pre>
             </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .library-wrapper {
          background: var(--bg-main);
          min-height: 100vh;
        }

        .library-layout {
          display: grid;
          grid-template-columns: 350px 1fr;
          height: calc(100vh - 80px); /* Adjust for navbar */
          margin-top: 80px;
          color: var(--text-primary);
        }

        .lib-sidebar {
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .sidebar-header {
           margin-bottom: 40px;
        }

        .back-btn {
           margin-bottom: 24px;
           display: inline-flex;
        }

        .sidebar-title {
           font-size: 1.5rem;
           font-weight: 800;
           letter-spacing: -0.02em;
        }

        .gradient-text {
           background: var(--gradient-brand);
           -webkit-background-clip: text;
           -webkit-text-fill-color: transparent;
           background-clip: text;
        }

        .lib-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .lib-item {
          background: transparent;
          border: 1px solid transparent;
          padding: 20px;
          border-radius: var(--radius-lg);
          text-align: left;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .lib-item:hover {
          background: rgba(255,107,0,0.04);
          transform: translateX(4px);
        }

        .lib-item.active {
          background: rgba(255,107,0,0.08);
          border-color: var(--primary);
          box-shadow: 0 4px 12px rgba(255, 107, 0, 0.05);
        }

        .lib-tag {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          text-transform: uppercase;
          color: var(--primary);
          display: block;
          margin-bottom: 6px;
          font-weight: 700;
          letter-spacing: 0.1em;
          opacity: 0.8;
        }

        .lib-title {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-primary);
        }

        .lib-main {
          padding: 60px 80px;
          overflow-y: auto;
          background: var(--bg-main);
        }

        .lib-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 60px;
        }

        .title {
          font-size: 3rem;
          font-weight: 900;
          margin: 16px 0;
          letter-spacing: -0.04em;
          line-height: 1.1;
        }

        .subtitle {
          color: var(--text-secondary);
          font-size: 1.15rem;
          max-width: 600px;
          line-height: 1.6;
        }

        .m-badge {
          background: rgba(255, 107, 0, 0.1);
          color: var(--primary);
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .section-label {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 20px;
          letter-spacing: 0.15em;
          font-weight: 700;
        }

        .usage-card {
          margin-bottom: 48px;
        }

        .lib-usage {
          background: var(--bg-surface);
          padding: 24px;
          border-radius: var(--radius-lg);
          border-left: 4px solid var(--primary);
          color: var(--text-secondary);
          font-size: 1.05rem;
          line-height: 1.6;
        }

        .terminal-wrap {
           background: #000;
           border-radius: var(--radius-xl);
           padding: 3px;
           background: linear-gradient(135deg, var(--border), transparent);
        }

        .lib-pre {
          background: #0d0d12;
          padding: 40px;
          border-radius: calc(var(--radius-xl) - 2px);
          font-family: var(--font-mono);
          font-size: 1rem;
          line-height: 1.7;
          color: #e0e0e0;
          overflow-x: auto;
          white-space: pre-wrap;
          max-height: 500px;
        }

        @media (max-width: 1100px) {
           .library-layout {
              grid-template-columns: 280px 1fr;
           }
           .lib-main {
              padding: 40px;
           }
        }
      `}</style>
    </div>
  );
}
