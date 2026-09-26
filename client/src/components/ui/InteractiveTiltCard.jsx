import { useState, useRef } from 'react';

/**
 * InteractiveTiltCard
 * Provides realistic, visible 3D perspective tilt, translateZ lift, and dynamic shadow.
 * Disabled on touch/reduced-motion.
 */
export const InteractiveTiltCard = ({
  children,
  className = '',
  maxTilt = 8,
  scale = 1.02,
  translateZ = 12,
  onClick
}) => {
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)');
  const [shadow, setShadow] = useState('');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransform(
      `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(${scale}, ${scale}, 1) translateZ(${translateZ}px)`
    );

    // Dynamic 3D shadow that casts realistically based on card tilt
    const shadowX = (-rotateY * 2.5).toFixed(1);
    const shadowY = (rotateX * 2.5 + 14).toFixed(1);
    setShadow(`${shadowX}px ${shadowY}px 36px -6px rgba(59, 143, 131, 0.22), 0 8px 16px -4px rgba(16, 42, 42, 0.08)`);

    setGlare({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.16
    });
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0px)');
    setShadow('');
    setGlare({ x: 50, y: 50, opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        transform,
        boxShadow: shadow || undefined,
        transition: 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d'
      }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {/* Light reflection glare overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300 overflow-hidden"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.8), transparent 65%)`,
          opacity: glare.opacity
        }}
      />
    </div>
  );
};

export default InteractiveTiltCard;
