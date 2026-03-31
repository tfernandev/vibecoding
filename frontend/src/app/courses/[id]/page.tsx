"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Lesson {
  title: string;
  completed: boolean;
  content: string;
}

interface CourseData {
  id: string;
  title: string;
  content: string;
  lessons: Lesson[];
}

export default function CoursePage() {
  const params = useParams();
  const id = params?.id as string;
  
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [currentModule, setCurrentModule] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourse() {
      if (!id) return;
      try {
        const res = await fetch(`http://localhost:5054/api/Dashboard/course/${id}`, {
          headers: { 'X-Tenant': 'google' }
        });
        if (res.ok) {
           const data = await res.json();
           setCourseData(data);
           // Simple progress math based on completed lessons
           const comp = data.lessons.filter((l: Lesson) => l.completed).length;
           setProgress(Math.floor((comp / data.lessons.length) * 100));
        }
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourse();
  }, [id]);

  const handleComplete = () => {
    if (courseData && currentModule < courseData.lessons.length - 1) {
      setCurrentModule(currentModule + 1);
      setProgress(prev => Math.min(prev + (100 / courseData.lessons.length), 100));
    }
  };

  if (loading) return <div className="course-layout"><div style={{padding: '40px'}}>Cargando módulo desde PostgreSQL...</div></div>;
  if (!courseData) return <div className="course-layout"><div style={{padding: '40px'}}>Módulo no encontrado.</div></div>;

  return (
    <div className="course-layout">
      {/* Course Sidebar */}
      <aside className="course-sidebar">
        <div className="course-nav-header">
          <Link href="/dashboard" className="back-link">← Volver al Panel</Link>
          <h2 className="course-title">{courseData.title}</h2>
          <div className="course-overall-progress">
            <div className="progress-text">Progreso: {progress}%</div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        </div>
        <nav className="module-list">
          {courseData.lessons.map((mod, idx) => (
            <button 
              key={idx} 
              className={`module-item ${idx === currentModule ? 'active' : ''} ${idx < currentModule ? 'completed' : ''}`}
              onClick={() => setCurrentModule(idx)}
            >
              <span className="mod-status">{idx < currentModule ? '✓' : (idx === currentModule ? '●' : '○')}</span>
              <span className="mod-title">{mod.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="course-content">
        <header className="lesson-header">
          <span className="lesson-eyebrow">Lección {currentModule + 1}</span>
          <h1 className="lesson-title">{courseData.lessons[currentModule].title}</h1>
        </header>

        <article className="lesson-body" dangerouslySetInnerHTML={{ __html: courseData.lessons[currentModule].content }} />

        <footer className="lesson-footer">
          <button className="btn-secondary" disabled={currentModule === 0} onClick={() => setCurrentModule(currentModule - 1)}>Anterior</button>
          <button className="btn-primary" onClick={handleComplete}>
            {currentModule === courseData.lessons.length - 1 ? 'Finalizar Curso' : 'Siguiente Lección →'}
          </button>
        </footer>
      </main>

      <style jsx>{`
        .course-layout {
          display: grid;
          grid-template-columns: 320px 1fr;
          height: 100vh;
          background: var(--bg-main);
          color: var(--text-primary);
        }
        .course-sidebar {
          background: var(--bg-surface);
          border-right: 1px solid var(--border);
          padding: 40px 24px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .back-link {
          font-size: 0.85rem;
          color: var(--text-muted);
          text-decoration: none;
          margin-bottom: 20px;
          display: block;
        }
        .course-title {
          font-size: 1.25rem;
          margin-bottom: 16px;
        }
        .progress-text {
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 8px;
          color: var(--primary);
        }
        .module-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .module-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: var(--radius-md);
          background: none;
          border: 1px solid transparent;
          color: var(--text-secondary);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
        }
        .module-item:hover {
          background: rgba(255, 107, 0, 0.05);
        }
        .module-item.active {
          background: rgba(255, 107, 0, 0.08);
          border-color: var(--primary);
          color: var(--primary);
          font-weight: 700;
        }
        .module-item.completed {
          color: var(--success);
        }
        .mod-status {
          font-family: var(--font-mono);
          font-size: 1.1rem;
        }
        .course-content {
          padding: 80px 120px;
          overflow-y: auto;
          max-width: 1000px;
        }
        .lesson-header {
          margin-bottom: 48px;
        }
        .lesson-eyebrow {
          text-transform: uppercase;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--primary);
          letter-spacing: 0.1em;
        }
        .lesson-title {
          font-size: 2.5rem;
          margin-top: 8px;
        }
        .lesson-body {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }
        .lesson-footer {
          margin-top: 60px;
          display: flex;
          gap: 16px;
          padding-top: 40px;
          border-top: 1px solid var(--border);
        }
        .terminal-style {
          background: var(--t-bg);
          color: #d4d4d4;
          padding: 24px;
          border-radius: var(--radius-md);
          font-family: var(--font-mono);
          font-size: 0.9rem;
          margin: 24px 0;
          border: 1px solid var(--t-border);
        }
      `}</style>
    </div>
  );
}
