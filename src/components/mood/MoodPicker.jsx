import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/api/base44Client";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Check } from "lucide-react";

const moods = [
  { id: "calm", emoji: "😌", label: "Calm", color: "bg-teal/60" },
  { id: "motivated", emoji: "🔥", label: "Motivated", color: "bg-peach/60" },
  { id: "hopeful", emoji: "🌟", label: "Hopeful", color: "bg-lavender/60" },
  { id: "grateful", emoji: "💛", label: "Grateful", color: "bg-peach/40" },
  { id: "uncertain", emoji: "🤔", label: "Uncertain", color: "bg-indigo/60" },
  { id: "anxious", emoji: "😰", label: "Anxious", color: "bg-lavender/40" },
  { id: "overwhelmed", emoji: "😮‍💨", label: "Overwhelmed", color: "bg-primary/20" },
  { id: "frustrated", emoji: "😤", label: "Frustrated", color: "bg-peach/80" },
  { id: "drained", emoji: "😴", label: "Drained", color: "bg-muted" },
  { id: "sad", emoji: "😢", label: "Sad", color: "bg-indigo/40" },
];

export const MoodPicker = ({ onComplete }) => {
  const [selected, setSelected] = useState(null);
  const [energy, setEnergy] = useState([3]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      await apiClient.entities.MoodCheckIn.create({
        mood: selected,
        energy_level: energy[0],
        note: note || undefined,
      });
      setDone(true);
      setTimeout(() => onComplete?.(), 1500);
    } catch (err) {
      console.error("Error saving mood:", err);
    } finally {
      setSaving(false);
    }
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-16 h-16 rounded-full bg-teal/40 flex items-center justify-center mx-auto mb-4"
        >
          <Check className="w-8 h-8 text-teal-foreground" />
        </motion.div>
        <p className="text-foreground font-medium">Checked in</p>
        <p className="text-sm text-muted-foreground mt-1">
          Thanks for sharing how you're feeling
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-foreground mb-3">
          How are you feeling right now?
        </p>
        <div className="grid grid-cols-5 gap-2">
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelected(mood.id)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                selected === mood.id
                  ? `${mood.color} ring-2 ring-primary/30 shadow-sm`
                  : "hover:bg-muted/50"
              }`}
            >
              <span className="text-xl">{mood.emoji}</span>
              <span className="text-[10px] font-medium text-foreground/70">
                {mood.label}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-5"
          >
            <div>
              <p className="text-sm font-medium text-foreground mb-3">
                Energy level
              </p>
              <div className="px-2">
                <Slider value={energy} onValueChange={setEnergy} min={1} max={5} />
                <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
                  <span>Low</span>
                  <span>High</span>
                </div>
              </div>
            </div>

            <div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Anything on your mind? (optional)"
                className="w-full bg-muted/30 border border-border/50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/40"
              />
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full rounded-xl bg-primary hover:bg-primary/90"
            >
              {saving ? "Saving..." : "Check In"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};