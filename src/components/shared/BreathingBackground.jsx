import React from 'react';

export default function BreathingBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full animate-breathe"
        style={{ background: 'radial-gradient(circle, hsl(245 40% 60% / 0.08), transparent 70%)' }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[50%] rounded-full animate-breathe"
        style={{
          background: 'radial-gradient(circle, hsl(175 35% 60% / 0.08), transparent 70%)',
          animationDelay: '2s',
        }}
      />
      <div
        className="absolute top-[30%] right-[20%] w-[30%] h-[30%] rounded-full animate-breathe"
        style={{
          background: 'radial-gradient(circle, hsl(270 30% 70% / 0.06), transparent 70%)',
          animationDelay: '1s',
        }}
      />
    </div>
  );
}