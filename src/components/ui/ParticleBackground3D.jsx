import React, { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export const ParticleBackground3D = () => {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 70;
    const maxDistance = 120;

    // Mouse coordinates tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

    // Generate particles in 3D coordinate space
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 1.5,
        y: (Math.random() - 0.5) * height * 1.5,
        z: Math.random() * width,
        baseX: (Math.random() - 0.5) * width * 1.5,
        baseY: (Math.random() - 0.5) * height * 1.5,
        size: Math.random() * 2 + 1,
        color: isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(109, 40, 217, 0.25)',
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left - width / 2;
      mouse.targetY = e.clientY - rect.top - height / 2;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Speed of rotation
    let angleY = 0.0005;
    let angleX = 0.0003;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      const dynamicAngleY = angleY + (mouse.active ? mouse.x * 0.000005 : 0);
      const dynamicAngleX = angleX + (mouse.active ? mouse.y * 0.000005 : 0);

      const cosY = Math.cos(dynamicAngleY);
      const sinY = Math.sin(dynamicAngleY);
      const cosX = Math.cos(dynamicAngleX);
      const sinX = Math.sin(dynamicAngleX);

      // Projects 3D to 2D
      const fov = 400;
      const centerX = width / 2;
      const centerY = height / 2;

      // Draw lines between particles if close
      ctx.lineWidth = 0.5;

      const projected = [];

      particles.forEach((p) => {
        // Rotate around Y axis
        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.z * cosY + p.x * sinY;

        // Rotate around X axis
        let y2 = p.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + p.y * sinX;

        // Perspective projection
        const scale = fov / (fov + z2);
        const projX = x1 * scale + centerX;
        const projY = y2 * scale + centerY;

        p.x = x1;
        p.y = y2;
        p.z = z2;

        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          projected.push({ x: projX, y: projY, scale, size: p.size * scale, color: p.color });
        }
      });

      // Draw links
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.15 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = isDark
              ? `rgba(6, 182, 212, ${alpha})`
              : `rgba(109, 40, 217, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Draw points
      projected.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.size), 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
