"use client";

import React, { useEffect, useRef } from 'react';

interface ParticleCanvasProps {
  id: string;
  count: number;
  maxDist: number;
}

const WARM_COLORS = [
  'rgba(255,107,0,', 'rgba(255,183,3,',
  'rgba(255,209,102,', 'rgba(255,140,66,', 'rgba(255,201,60,',
];

export default function ParticleCanvas({ id, count, maxDist }: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w: number, h: number;
    let animationFrameId: number;

    const resize = () => {
      w = canvas.width = canvas.offsetWidth || window.innerWidth;
      h = canvas.height = canvas.offsetHeight || window.innerHeight;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement || document.body);

    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2.2 + 0.8,
      colorBase: WARM_COLORS[Math.floor(Math.random() * WARM_COLORS.length)],
      alpha: Math.random() * 0.35 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const lm = isDark ? 1.3 : 0.6;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(255,140,66,${(1 - dist / maxDist) * 0.1 * lm})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.colorBase + p.alpha + ')';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ro.disconnect();
    };
  }, [count, maxDist]);

  return <canvas ref={canvasRef} id={id} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }} />;
}
