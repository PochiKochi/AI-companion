import React, { useState } from "react";
import { MoodPicker } from "@/components/mood/MoodPicker";
import { Intro } from "@/components/Intro";

export default function App() {
  const [step, setStep] = useState(0); // 0 = intro, 1 = MoodPicker

  return (
    <div className="p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4">Base44Emotrack</h1>

      {step === 0 && <Intro onNext={() => setStep(1)} />}
      {step === 1 && <MoodPicker onComplete={() => setStep(2)} />}
    </div>
  );
}