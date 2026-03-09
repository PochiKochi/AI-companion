import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

const moodValues = {
  calm: 8, motivated: 9, hopeful: 8, grateful: 9,
  uncertain: 5, anxious: 3, overwhelmed: 2, frustrated: 3,
  drained: 2, sad: 1,
};

const moodEmojis = {
  calm: '😌', motivated: '🔥', hopeful: '🌟', grateful: '💛',
  uncertain: '🤔', anxious: '😰', overwhelmed: '😮‍💨', frustrated: '😤',
  drained: '😴', sad: '😢',
};

export default function MoodTimeline({ checkIns }) {
  if (!checkIns || checkIns.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
        No mood data yet. Check in to start tracking.
      </div>
    );
  }

  const data = checkIns
    .slice()
    .sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime())
    .map(c => ({
      date: c.created_date,
      value: moodValues[c.mood] || 5,
      mood: c.mood,
      energy: c.energy_level,
      emoji: moodEmojis[c.mood] || '😐',
    }));

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.[0]) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card border border-border/50 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs text-muted-foreground">{format(new Date(d.date), 'MMM d, h:mm a')}</p>
        <p className="text-sm font-medium mt-1">{d.emoji} {d.mood}</p>
        <p className="text-xs text-muted-foreground">Energy: {d.energy}/5</p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(245 40% 60%)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="hsl(245 40% 60%)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tickFormatter={v => format(new Date(v), 'MMM d')}
          tick={{ fontSize: 11, fill: 'hsl(240 10% 50%)' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          domain={[0, 10]}
          tick={false}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={CustomTooltip} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="hsl(245 40% 60%)"
          strokeWidth={2}
          fill="url(#moodGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}