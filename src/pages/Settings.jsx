import React, { useState } from 'react';
import { apiClient } from '@/api/base44Client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft, Trash2, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import BreathingBackground from '../components/shared/BreathingBackground';

export default function Settings() {
  const queryClient = useQueryClient();
  const [deleting, setDeleting] = useState(false);

  const { data: prefs = {} } = useQuery({
    queryKey: ['userPrefs'],
    queryFn: async () => {
      const list = await apiClient.entities.UserPreferences.list();
      return list[0] || {};
    },
  });

  const handleDeleteHistory = async () => {
    setDeleting(true);
    try {
      const [conversations, checkIns] = await Promise.all([
        apiClient.entities.Conversation.list(),
        apiClient.entities.MoodCheckIn.list(),
      ]);

      await Promise.all(conversations.map((c) =>
        apiClient.entities.Conversation.delete(c.id)
      ));
      await Promise.all(checkIns.map((ci) =>
        apiClient.entities.MoodCheckIn.delete(ci.id)
      ));

      queryClient.invalidateQueries({ queryKey: ['userPrefs'] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['moodCheckIns'] });
    } finally {
      setDeleting(false);
    }
  };

  const handleLogout = () => {
    apiClient.auth.logout();
  };

  return (
    <div className="min-h-screen relative">
      <BreathingBackground />
      {/* …the rest of the JSX is unchanged… */}
    </div>
  );
}