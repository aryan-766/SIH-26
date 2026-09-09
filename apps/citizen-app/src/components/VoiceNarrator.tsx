import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface VoiceNarratorProps {
  textToSpeak: string;
  language?: string;
  label?: string;
}

export const VoiceNarrator: React.FC<VoiceNarratorProps> = ({
  textToSpeak,
  language = 'hi-IN',
  label = 'सुनें'
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-Speech is not supported in this browser.");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any pending speech
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      type="button"
      onClick={speak}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
        isSpeaking
          ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
          : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
      }`}
      title="Listen to this explanation (TTS)"
    >
      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
      <span>{isSpeaking ? 'रुकें' : label}</span>
    </button>
  );
};
