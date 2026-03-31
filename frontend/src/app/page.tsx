"use client";

import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Quiz from '@/components/Quiz';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Quiz />
        
        {/* Modules Preview */}
        <section id="modulos" className="container" style={{ padding: '100px 0' }}>
          <div className="section-header">
            <span className="section-label">El programa</span>
            <h2>8 módulos que te convierten en un dev que domina la IA</h2>
            <p className="section-desc">Sin tips genéricos. Patrones reales, errores documentados, casos de uso de backend senior.</p>
          </div>
          
          <div className="modules-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(m => (
              <div key={m} className="module-card visible">
                <div className="module-header">
                  <div className="module-number">0{m}</div>
                  <div className="module-badge system">Módulo</div>
                </div>
                <h3 className="module-title">
                  {m === 1 && "Fundamentos Reales"}
                  {m === 2 && "Prompt engineering como Diseño"}
                  {m === 3 && "Patterns Profesionales"}
                  {m === 4 && "Eficiencia y Ownership"}
                  {m === 5 && "Multi-Tool Strategy"}
                  {m === 6 && "IA + Arquitectura"}
                  {m === 7 && "Anti-Patterns Seniors"}
                  {m === 8 && "Orquestación Avanzada"}
                </h3>
                <p className="module-desc">Contenido técnico avanzado diseñado para perfiles con 3+ años de experiencia.</p>
              </div>
            ))}
          </div>
        </section>

        {/* Open Call to Action */}
        <section id="open" style={{ padding: '100px 0', background: 'var(--bg-alt)', textAlign: 'center' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Plataforma Abierta</span>
              <h2>Aprender Ingeniería de IA es para todos.</h2>
              <p className="section-desc">Accedé a todos los módulos, la sandbox y las herramientas de diagnóstico de forma gratuita.</p>
            </div>
            <Link href="/dashboard" className="btn-primary" style={{ padding: '18px 40px', fontSize: '1.2rem' }}>
              Entrar al Panel de Control
            </Link>
          </div>
        </section>
      </main>
      
      <footer id="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-logo">&lt;AI.dev/&gt;</div>
            <p className="footer-tagline">Ingeniería con IA. No magia.</p>
            <p className="footer-copy">© 2026 AI Engineering for Devs. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
