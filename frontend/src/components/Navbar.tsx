"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Scroll listener
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    
    // Theme persistence
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
    document.documentElement.setAttribute('data-theme', savedTheme);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  return (
    <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <span className="logo-bracket">&lt;</span>AI.dev<span className="logo-bracket">/&gt;</span>
        </Link>
        <ul className="nav-links">
          <li><Link href="/#quiz">Diagnóstico</Link></li>
          <li><Link href="/modules">Módulos</Link></li>
          <li><Link href="/prompt-library">Biblioteca</Link></li>
          <li><Link href="/sandbox">Sandbox</Link></li>
        </ul>
        <Link href="/dashboard" className="nav-cta">Entrar al Panel</Link>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
