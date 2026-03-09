import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function InsightCard({ insight, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-lavender/30 to-transparent border border-border/30"
    >
      <div className="w-8 h-8 rounded-full bg-lavender/50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4 text-lavender-foreground" />
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{insight}</p>
    </motion.div>
  );
}