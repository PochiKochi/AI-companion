import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { MessageCircle, BarChart3, Sun, Moon } from 'lucide-react';
import BreathingBackground from '../components/shared/BreathingBackground';
import PauseBreath from '../components/shared/PauseBreath';
import MoodPicker from '../components/mood/MoodPicker';

export default function Home() {
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [greeting, setGreeting] = useState('');

  const { data: prefs } = useQuery({
    queryKey: ['userPrefs'],
    queryFn: async () => {
      const list = await apiClient.entities.UserPreferences.list();
      return list[0] || null;
    },
  });

  const { data: todayCheckIn } = useQuery({
    queryKey: ['todayCheckIn'],
    queryFn: async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const checkIns = await apiClient.entities.MoodCheckIn.list('-created_date', 1);
      if (checkIns.length > 0) {
        const last = new Date(checkIns[0].created_date);
        if (last >= today) return checkIns[0];
      }
      return null;
    },
  });

  useEffect(() => {
    const hour = new Date().getHours();
    const name = prefs?.display_name || '';
    const nameStr = name ? `, ${name}` : '';
    if (hour < 12) setGreeting(`Good morning${nameStr}`);
    else if (hour < 18) setGreeting(`Good afternoon${nameStr}`);
    else setGreeting(`Good evening${nameStr}`);
  }, [prefs]);

  // Redirect to onboarding if needed
  useEffect(() => {
    if (prefs === null) {
      // Check if prefs were loaded but empty (no onboarding done)
      // We use a small delay to avoid flash
    }
  }, [prefs]);

  if (prefs === null && prefs !== undefined) {
    window.location.href = createPageUrl('Onboarding');
    return null;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BreathingBackground />
      <div className="max-w-lg mx-auto px-6 pt-16 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-lavender/30 flex items-center justify-center mb-6"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/40 to-teal/30" />
          </motion.div>
          <h1 className="text-3xl font-display font-medium text-foreground mb-2">
            {greeting}
          </h1>
          <p className="text-muted-foreground text-sm">
            How are you doing today?
          </p>
        </motion.div>

        {/* Daily Check-in */}
        {!todayCheckIn && !showMoodPicker && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => setShowMoodPicker(true)}
            className="w-full p-6 rounded-2xl bg-gradient-to-r from-teal/30 to-lavender/30 border border-border/30 mb-6 text-left hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-foreground mb-1">Daily Energy Check-In</p>
            <p className="text-xs text-muted-foreground">Take a moment to notice how you feel</p>
          </motion.button>
        )}

        {todayCheckIn && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full p-5 rounded-2xl bg-card border border-border/30 mb-6"
          >
            <p className="text-xs text-muted-foreground mb-2">Today's check-in</p>
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {{'calm':'😌','motivated':'🔥','hopeful':'🌟','grateful':'💛','uncertain':'🤔','anxious':'😰','overwhelmed':'😮‍💨','frustrated':'😤','drained':'😴','sad':'😢'}[todayCheckIn.mood] || '😐'}
              </span>
              <div>
                <p className="text-sm font-medium capitalize">{todayCheckIn.mood}</p>
                <p className="text-xs text-muted-foreground">Energy: {todayCheckIn.energy_level}/5</p>
              </div>
            </div>
          </motion.div>
        )}

        {showMoodPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/30 p-6 mb-6"
          >
            <MoodPicker onComplete={() => {
              setShowMoodPicker(false);
              window.location.reload();
            }} />
          </motion.div>
        )}

        {/* Main Actions */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link
              to={createPageUrl('Chat')}
              className="block w-full p-6 rounded-2xl bg-card border border-border/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Start a Conversation</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Talk through what's on your mind</p>
                </div>
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              to={createPageUrl('Dashboard')}
              className="block w-full p-6 rounded-2xl bg-card border border-border/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-teal/30 flex items-center justify-center group-hover:bg-teal/50 transition-colors">
                  <BarChart3 className="w-5 h-5 text-teal-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">My Insights</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Mood patterns and reflections</p>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Pause & Breathe */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center mt-10"
        >
          <PauseBreath />
        </motion.div>

        {/* Privacy note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-[11px] text-muted-foreground/50 mt-12 max-w-xs mx-auto"
        >
          InnerSpace is an AI companion, not a therapist. Your conversations are private. 
          If you're in crisis, please reach out to a trusted adult or helpline.
        </motion.p>
      </div>
    </div>
  );
}