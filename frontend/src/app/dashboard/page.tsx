"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Types representing DB response
interface ModuleData {
  id: string;
  title: string;
  description: string;
  order: number;
  status: "Completed" | "InProgress" | "NotStarted";
}

interface StatsData {
  progressPct: number;
  sandboxSessions: number;
  patternsMastered: number;
  totalPatterns: number;
  linterScore: string;
}

const STATIC_MODULES: ModuleData[] = [
  { id: "11111111-1111-1111-1111-111111111101", title: "Fundamentos de AI Engineering", description: "Aprende los conceptos básicos de LLMs y tokens.", order: 1, status: "InProgress" },
  { id: "11111111-1111-1111-1111-111111111102", title: "Diseño de Prompts", description: "Estructuras eficientes para controlar el comportamiento del modelo.", order: 2, status: "InProgress" },
  { id: "11111111-1111-1111-1111-111111111103", title: "Prompt Patterns Pro", description: "Domina la descomposición y el encadenamiento de tareas complejas.", order: 3, status: "InProgress" },
  { id: "11111111-1111-1111-1111-111111111104", title: "Eficiencia y Ownership", description: "Mantén el control del código y evita la deuda técnica invisible.", order: 4, status: "InProgress" },
  { id: "11111111-1111-1111-1111-111111111105", title: "Validación y Testing de IA", description: "Asegura la calidad y estabilidad de las soluciones generadas por IA.", order: 5, status: "InProgress" },
];

const STATIC_STATS: StatsData = { progressPct: 25, sandboxSessions: 12, patternsMastered: 1, totalPatterns: 5, linterScore: "B+" };

export default function DashboardPage() {
  const [isDark, setIsDark] = useState(false);
  const [modules, setModules] = useState<ModuleData[]>(STATIC_MODULES);
  const [stats, setStats] = useState<StatsData | null>(STATIC_STATS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5054/api';
        const res = await fetch(`${baseUrl}/Dashboard/data`, {
           headers: { 'X-Tenant': 'google' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data.stats) setStats(data.stats);
          if (data.modules?.length > 0) setModules(data.modules);
        }
      } catch {
        // Use static fallback silently
      }
    }
    fetchDashboard();
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  };

  return (
    <main className={`dashboard-layout ${isDark ? 'dark' : ''}`}>
      {/* Sidebar navigation */}
      <aside className="dashboard-sidebar">
        <div className="nav-logo">
          <span className="logo-bracket">&lt;</span>AI.dev<span className="logo-bracket">/&gt;</span>
        </div>
        <nav className="side-nav">
          <Link href="/dashboard" className="nav-item active">
            <span className="nav-icon">📊</span> Panel de Control
          </Link>
          <Link href="/modules" className="nav-item">
            <span className="nav-icon">📚</span> Mis Módulos
          </Link>
          <Link href="/prompt-library" className="nav-item">
            <span className="nav-icon">🧱</span> Prompt Library
          </Link>
          <Link href="/sandbox" className="nav-item">
            <span className="nav-icon">🔧</span> Sandbox
          </Link>
          <a href="#" className="nav-item">
            <span className="nav-icon">👥</span> Comunidad
          </a>
        </nav>
        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={toggleTheme}>
            {isDark ? '☀️' : '🌙'}
          </button>
          <div className="user-profile">
            <div className="avatar-sm">UX</div>
            <div className="user-info">
              <span className="user-name">Vibe Coder</span>
              <span className="user-plan">Comunidad AI.dev</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <section className="dashboard-content">
        <header className="content-header">
          <div className="greeting-wrap">
            <h1 className="greeting">Vibe <span className="gradient-text">Coding.</span></h1>
            <p className="subtitle">Explora el poder de la Ingeniería de Prompts.</p>
          </div>
          <div className="profile-badge">
            <span className="badge-dot" style={{ background: '#00ff88' }}></span>
            Estado: Máxima Libertad
          </div>
        </header>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Progreso General</span>
            <div className="stat-value">{stats ? `${stats.progressPct}%` : '...'}</div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: stats ? `${stats.progressPct}%` : '0%' }}></div>
            </div>
          </div>
          <div className="stat-card">
            <span className="stat-label">Sesiones Sandbox</span>
            <div className="stat-value">{stats ? stats.sandboxSessions : '...'}</div>
            <span className="stat-desc">Histórico en la BD</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Patrones Dominados</span>
            <div className="stat-value">{stats ? `${stats.patternsMastered}/${stats.totalPatterns}` : '...'}</div>
            <span className="stat-desc">Último: Dual Mode</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Linter Score Promedio</span>
            <div className="stat-value">{stats ? stats.linterScore : '...'}</div>
            <span className="stat-desc">Mejorando precisión</span>
          </div>
        </div>

        {/* Modules Section */}
        <div id="modules" className="modules-section">
          <div className="section-header-row">
            <h2 className="section-title">Continuar aprendizaje</h2>
            <Link href="/modules" className="text-link">Ver todos →</Link>
          </div>
          <div className="dashboard-modules-grid">
            {loading ? (
               <p>Cargando módulos desde PostgreSQL Server...</p>
            ) : modules.map((m) => (
              <div key={m.id} className={`d-module-card ${m.status === 'InProgress' ? 'active' : ''}`}>
                <div className="d-module-header">
                  <span className="d-module-num">0{m.order}</span>
                  <span className={`tag ${m.status === 'Completed' ? 'success' : 'active'}`}>
                     {m.status === 'Completed' ? 'Completado' : 'En curso'}
                  </span>
                </div>
                <h3 className="d-module-title">{m.title}</h3>
                <p className="d-module-desc">{m.description}</p>
                <Link href={`/courses/${m.id}`} className={m.status === 'InProgress' ? "btn-primary btn-sm" : "btn-secondary btn-sm"}>
                   {m.status === 'Completed' ? 'Repasar Lección' : 'Continuar lección'}
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Sandbox Preview */}
        <div className="sandbox-preview-card">
          <div className="sp-header">
            <h3>Terminal de Ingeniería</h3>
            <span className="badge">Linter Activo</span>
          </div>
          <div className="sp-body">
            <div className="sp-terminal">
              <code>
                <span className="t-comment">// Probando patrón Contract Generator...</span><br/>
                $ ai-dev lint prompt_v1.txt<br/>
                <span className="t-str">✓ Contract explicitly defined</span><br/>
                <span className="t-str">⚠ Context window usage: 84%</span><br/>
                <span className="t-var">Refina el output deseado para mejorar precisión.</span>
              </code>
            </div>
            <div className="sp-cta">
              <p>¿Tenés una idea nueva? Probala en tu entorno controlado.</p>
              <Link href="/sandbox" className="btn-primary">Abrir Sandbox →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
