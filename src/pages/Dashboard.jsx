import React, { useState } from 'react';
import { apiClient } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Sparkles, Loader2 } from 'lucide-react';
import BreathingBackground from '../components/shared/BreathingBackground';
import MoodTimeline from '../components/dashboard/MoodTimeline';
import EmotionMap from '../components/dashboard/EmotionMap';
import InsightCard from '../components/dashboard/InsightCard';

export default function Dashboard() {
  const [insights, setInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);

  const { data: checkIns, isLoading: loadingMoods } = useQuery({
    queryKey: ['moodCheckIns'],
    queryFn: () => apiClient.entities.MoodCheckIn.list('-created_date', 50),
    initialData: [],
  });

  const { data: conversations, isLoading: loadingConvos } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => apiClient.entities.Conversation.list('-created_date', 20),
    initialData: [],
  });

  const generateInsights = async () => {
    if (checkIns.length < 2) return;
    setLoadingInsights(true);
    const moodData = checkIns.map(c => ({
      mood: c.mood,
      energy: c.energy_level,
      date: c.created_date,
      note: c.note,
    }));

    const result = await apiClient.integrations.Core.InvokeLLM({
      prompt: `Analyze these mood check-ins and provide 3-4 short, thoughtful insights about emotional patterns. Be specific and helpful, not generic. Focus on patterns, triggers, and positive observations.

Mood data: ${JSON.stringify(moodData)}

Keep each insight to 1-2 sentences. Be warm and insightful, like a thoughtful friend noticing patterns.`,
      response_json_schema: {
        type: 'object',
        properties: {
          insights: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
    });

    setInsights(result.insights || []);
    setLoadingInsights(false);
  };

  return (
    <div className="min-h-screen relative">
      <BreathingBackground />
      <div className="max-w-lg mx-auto px-6 pt-6 pb-24">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link
            to={createPageUrl('Home')}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-2xl font-display font-medium">My Insights</h1>
        </div>

        {/* Mood Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl border border-border/30 p-6 mb-6"
        >
          <h2 className="text-sm font-medium text-foreground mb-4">Mood Over Time</h2>
          <MoodTimeline checkIns={checkIns} />
        </motion.div>

        {/* Emotion Map */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl border border-border/30 p-6 mb-6"
        >
          <h2 className="text-sm font-medium text-foreground mb-4">Emotion Map</h2>
          <EmotionMap checkIns={checkIns} />
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl border border-border/30 p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-foreground">Emotional Insights</h2>
            {!insights && (
              <button
                onClick={generateInsights}
                disabled={loadingInsights || checkIns.length < 2}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-lavender/50 text-lavender-foreground text-xs font-medium hover:bg-lavender/70 transition-colors disabled:opacity-40"
              >
                {loadingInsights ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3" />
                )}
                {loadingInsights ? 'Analyzing...' : 'Generate Insights'}
              </button>
            )}
          </div>

          {checkIns.length < 2 && !insights && (
            <p className="text-sm text-muted-foreground text-center py-6">
              Check in at least 2 times to unlock AI insights
            </p>
          )}

          {insights && (
            <div className="space-y-3">
              {insights.map((insight, i) => (
                <InsightCard key={i} insight={insight} index={i} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Conversations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl border border-border/30 p-6"
        >
          <h2 className="text-sm font-medium text-foreground mb-4">Recent Conversations</h2>
          {conversations.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No conversations yet. Start one to see them here.
            </p>
          ) : (
            <div className="space-y-3">
              {conversations.slice(0, 5).map((conv, i) => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo/40 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs">💭</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{conv.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(conv.created_date).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric'
                      })}
                      {conv.mode !== 'normal' && ` · ${conv.mode}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}