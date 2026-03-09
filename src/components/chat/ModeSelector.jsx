import React from 'react';
import { MessageCircle, Compass, VolumeX, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

const modes = [
  { id: 'normal', label: 'Talk', icon: MessageCircle, color: 'from-primary/20 to-primary/5' },
  { id: 'reflection', label: 'Reflect', icon: Compass, color: 'from-teal/40 to-teal/10' },
  { id: 'silent', label: 'Silent', icon: VolumeX, color: 'from-lavender/60 to-lavender/20' },
  { id: 'perspective', label: 'Perspective', icon: RefreshCw, color: 'from-peach/60 to-peach/20' },
];

export default function ModeSelector({ activeMode, onModeChange }) {
  return (
    <div className="flex items-center gap-2">
      {modes.map(mode => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;
        return (
          <motion.button
            key={mode.id}
            whileTap={{ scale: 0.95 }}
            onClick={() => onModeChange(mode.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              isActive
                ? `bg-gradient-to-r ${mode.color} text-foreground border border-border/50 shadow-sm`
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{mode.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}