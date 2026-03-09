import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { ArrowRight, Heart, Compass, Lightbulb } from 'lucide-react';
import { createPageUrl } from '@/utils';
import BreathingBackground from '../components/shared/BreathingBackground';

const steps = [
  {
    id: 'welcome',
    title: 'Welcome to InnerSpace',
    subtitle: 'A quiet place to think, feel, and reflect',
    content: null,
  },
  {
    id: 'name',
    title: 'What should I call you?',
    subtitle: "Just a name you're comfortable with",
    field: 'display_name',
    type: 'text',
    placeholder: 'Your name or nickname',
  },
  {
    id: 'stress',
    title: 'How do you usually deal with stress?',
    subtitle: 'There\'s no right answer',
    field: 'stress_style',
    type: 'choice',
    options: [
      { label: 'I talk it through with someone', icon: '💬' },
      { label: 'I keep it to myself and process alone', icon: '🧘' },
      { label: 'I distract myself until it passes', icon: '🎮' },
      { label: 'I write or journal about it', icon: '📝' },
      { label: "I'm not sure yet", icon: '🤷' },
    ],
  },
  {
    id: 'reason',
    title: 'What brings you here today?',
    subtitle: 'This helps me understand how to support you',
    field: 'reason_here',
    type: 'choice',
    options: [
      { label: 'I need someone to listen', icon: '👂' },
      { label: 'I want to understand my feelings better', icon: '🔍' },
      { label: 'I\'m going through something tough', icon: '🌧️' },
      { label: 'I\'m curious about self-reflection', icon: '✨' },
      { label: 'Just exploring', icon: '🗺️' },
    ],
  },
  {
    id: 'preference',
    title: 'How would you like me to be?',
    subtitle: 'I\'ll adjust my style to what works for you',
    field: 'preference',
    type: 'style',
    options: [
      { value: 'listening', label: 'Mostly listen', desc: 'Minimal responses, space to think', icon: Heart },
      { value: 'reflection', label: 'Help me reflect', desc: 'Ask thoughtful questions', icon: Compass },
      { value: 'problem-solving', label: 'Help me think through things', desc: 'Active problem-solving support', icon: Lightbulb },
    ],
  },
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [saving, setSaving] = useState(false);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  const handleNext = async () => {
    if (isLast) {
      setSaving(true);
      await apiClient.entities.UserPreferences.create({
        ...data,
        onboarding_complete: true,
      });
      setSaving(false);
      window.location.href = createPageUrl('Home');
      return;
    }
    setStep(s => s + 1);
  };

  const canProceed = () => {
    if (current.id === 'welcome') return true;
    if (current.field) return !!data[current.field];
    return true;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      <BreathingBackground />
      <div className="w-full max-w-lg">
        {/* Progress */}
        <div className="flex gap-1.5 mb-12 justify-center">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-500 ${
                i <= step ? 'w-8 bg-primary' : 'w-4 bg-muted'
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-display font-medium text-foreground mb-3">
                {current.title}
              </h1>
              <p className="text-muted-foreground">{current.subtitle}</p>
            </div>

            {/* Welcome step */}
            {current.id === 'welcome' && (
              <div className="text-center space-y-6">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-lavender/30 flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-teal/20 flex items-center justify-center">
                    <div className="w-4 h-4 rounded-full bg-primary/50" />
                  </div>
                </motion.div>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  I'm not a therapist or a doctor. I'm an AI companion designed for honest, 
                  reflective conversations. Think of me as a thoughtful space to process your thoughts.
                </p>
              </div>
            )}

            {/* Text input */}
            {current.type === 'text' && (
              <input
                autoFocus
                value={data[current.field] || ''}
                onChange={e => setData({ ...data, [current.field]: e.target.value })}
                placeholder={current.placeholder}
                className="w-full bg-card border border-border/50 rounded-2xl px-6 py-4 text-lg text-center outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/40"
              />
            )}

            {/* Choice options */}
            {current.type === 'choice' && (
              <div className="space-y-3">
                {current.options.map(opt => (
                  <motion.button
                    key={opt.label}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setData({ ...data, [current.field]: opt.label })}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all flex items-center gap-3 ${
                      data[current.field] === opt.label
                        ? 'bg-primary/10 border-primary/30 shadow-sm'
                        : 'bg-card border-border/50 hover:bg-muted/30'
                    }`}
                  >
                    <span className="text-xl">{opt.icon}</span>
                    <span className="text-sm font-medium">{opt.label}</span>
                  </motion.button>
                ))}
              </div>
            )}

            {/* Style preference */}
            {current.type === 'style' && (
              <div className="space-y-3">
                {current.options.map(opt => {
                  const Icon = opt.icon;
                  return (
                    <motion.button
                      key={opt.value}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setData({ ...data, [current.field]: opt.value })}
                      className={`w-full text-left px-5 py-5 rounded-xl border transition-all flex items-start gap-4 ${
                        data[current.field] === opt.value
                          ? 'bg-primary/10 border-primary/30 shadow-sm'
                          : 'bg-card border-border/50 hover:bg-muted/30'
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-lavender/40 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-lavender-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{opt.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-10 flex justify-center">
          <Button
            onClick={handleNext}
            disabled={!canProceed() || saving}
            className="px-8 py-3 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-sm"
          >
            {saving ? 'Setting up...' : isLast ? 'Start My Space' : 'Continue'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(s => s - 1)}
            className="block mx-auto mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}