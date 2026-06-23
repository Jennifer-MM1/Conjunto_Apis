import React, { useRef, useState } from 'react';

export const Card3D = ({ children, className = '', onClick }) => {
  const cardRef = useRef(null);
  const [style, setStyle] = useState({});
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse position inside card
    const y = e.clientY - rect.top;

    // Calculate rotation angles (-15 to 15 degrees)
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 12;
    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 12;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'transform 0.1s ease-out'
    });

    // Dynamic reflection position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setGlareStyle({
      opacity: 0.45,
      background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 60%)`,
      transition: 'opacity 0.1s ease-out'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
      transition: 'transform 0.5s ease-out'
    });
    setGlareStyle({
      opacity: 0,
      transition: 'opacity 0.5s ease-out'
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      className={`relative preserve-3d glass-panel rounded-2xl overflow-hidden cursor-pointer p-6 transition-all duration-300 ${className}`}
    >
      {/* Glare effect */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={glareStyle}
      />
      {/* Actual Content Wrapper */}
      <div className="relative z-0 h-full w-full">
        {children}
      </div>
    </div>
  );
};
