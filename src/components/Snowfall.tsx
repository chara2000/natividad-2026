import React, { useEffect, useRef } from 'react';
import { useChristmas } from '../context/ChristmasContext';

interface Flake {
  x: number;
  y: number;
  radius: number;
  density: number;
  opacity: number;
  speed: number;
  swing: number;
  swingSpeed: number;
}

export const Snowfall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { snowEnabled } = useChristmas();

  useEffect(() => {
    if (!snowEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Create 70 soft snowflakes
    const flakeCount = Math.min(80, Math.floor(window.innerWidth / 15));
    const flakes: Flake[] = [];

    for (let i = 0; i < flakeCount; i++) {
      flakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1,
        density: Math.random() * 1,
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.8 + 0.4,
        swing: 0,
        swingSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];
        f.swing += f.swingSpeed;
        f.y += f.speed;
        f.x += Math.sin(f.swing) * 0.6;

        // Wrap around
        if (f.y > height) {
          f.y = -5;
          f.x = Math.random() * width;
        }
        if (f.x > width) {
          f.x = 0;
        } else if (f.x < 0) {
          f.x = width;
        }

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = `rgba(255, 255, 255, ${f.opacity})`;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 3;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [snowEnabled]);

  if (!snowEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-700"
    />
  );
};
