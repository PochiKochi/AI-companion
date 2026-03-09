import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';

export default function PauseBreath() {
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState('inhale');
  const [counter, setCounter] = useState(4);

  const phases = { inhale: 4, hold: 4, exhale: 6 };
  const labels = { inhale: 'Breathe in', hold: 'Hold', exhale: 'Breathe out' };

  useEffect(() => {
    if (!active) return;
    const interval = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          setPhase(p => {
            const next = p === 'inhale' ? 'hold' : p === 'hold' ? 'exhale' : 'inhale';
            return next;
          });
          return phases[phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'inhale'];
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [active, phase]);

  const startBreathing = useCallback(() => {
    setActive(true);
    setPhase('inhale');
    setCounter(4);
    setTimeout(() => setActive(false), 42000);
  }, []);

  return (
    <>
      <button
        onClick={startBreathing}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-teal/60 text-teal-foreground hover:bg-teal transition-colors text-sm font-medium"
      >
        <Wind className="w-4 h-4" />
        Pause & Breathe
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl"
            onClick={() => setActive(false)}
          >
            <div className="flex flex-col items-center gap-8">
              <motion.div
                animate={{
                  scale: phase === 'inhale' ? 1.4 : phase === 'hold' ? 1.4 : 1,
                }}
                transition={{ duration: phases[phase], ease: 'easeInOut' }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-teal/30 flex items-center justify-center"
              >
                <motion.div
                  animate={{
                    scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 1,
                  }}
                  transition={{ duration: phases[phase], ease: 'easeInOut' }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-lavender/40"
                />
              </motion.div>
              <div className="text-center">
                <p className="text-2xl font-light text-foreground/80">{labels[phase]}</p>
                <p className="text-5xl font-light text-primary mt-2">{counter}</p>
              </div>
              <p className="text-sm text-muted-foreground">Tap anywhere to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}