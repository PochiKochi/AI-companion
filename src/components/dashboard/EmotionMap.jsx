import React from 'react';
import { motion } from 'framer-motion';

const moodConfig = {
  calm: { emoji: '😌', color: 'bg-teal/60' },
  motivated: { emoji: '🔥', color: 'bg-peach/60' },
  hopeful: { emoji: '🌟', color: 'bg-lavender/60' },
  grateful: { emoji: '💛', color: 'bg-peach/40' },
  uncertain: { emoji: '🤔', color: 'bg-indigo/60' },
  anxious: { emoji: '😰', color: 'bg-lavender/40' },
  overwhelmed: { emoji: '😮‍💨', color: 'bg-primary/20' },
  frustrated: { emoji: '😤', color: 'bg-peach/80' },
  drained: { emoji: '😴', color: 'bg-muted' },
  sad: { emoji: '😢', color: 'bg-indigo/40' },
};

export default function EmotionMap({ checkIns }) {
  if (!checkIns || checkIns.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
        No emotions tracked yet
      </div>
    );
  }

  const counts = {};
  checkIns.forEach(c => {
    counts[c.mood] = (counts[c.mood] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort(([,a], [,b]) => b - a);
  const maxCount = sorted[0]?.[1] || 1;

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {sorted.map(([mood, count], i) => {
        const config = moodConfig[mood] || { emoji: '😐', color: 'bg-muted' };
        const scale = 0.6 + (count / maxCount) * 0.4;
        return (
          <motion.div
            key={mood}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`${config.color} rounded-full flex items-center justify-center transition-all`}
              style={{
                width: `${scale * 64}px`,
                height: `${scale * 64}px`,
              }}
            >
              <span style={{ fontSize: `${scale * 24}px` }}>{config.emoji}</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium capitalize">{mood}</span>
            <span className="text-[10px] text-muted-foreground/60">{count}x</span>
          </motion.div>
        );
      })}
    </div>
  );
}