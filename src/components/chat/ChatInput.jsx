import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ChatInput({ onSend, disabled, placeholder }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-3 bg-card border border-border/50 rounded-2xl p-2 shadow-sm">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder={placeholder || "Share what's on your mind..."}
          rows={1}
          className="flex-1 resize-none bg-transparent border-none outline-none text-sm leading-relaxed px-3 py-2 placeholder:text-muted-foreground/50 max-h-32"
          style={{ minHeight: '40px' }}
        />
        <motion.button
          type="submit"
          disabled={!text.trim() || disabled}
          whileTap={{ scale: 0.92 }}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </form>
  );
}