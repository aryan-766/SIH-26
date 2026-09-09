import React, { useState } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';

interface VoiceMicButtonProps {
  onTranscript: (text: string) => void;
  language?: string;
  placeholder?: string;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  onTranscript,
  language = 'hi-IN',
  placeholder = 'बोलकर खोजें...'
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const toggleListening = () => {
    // Check Web Speech API support
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Simulate voice input for environments where mic is unavailable
      const mockPhrases = [
        "Mere paas 80 hazaar rupaye hain, dairy business karna chahta hoon",
        "Mini atta chakkki aur tel expeller ki scheme batao",
        "Pichhle hafte ka chara kharcha badh gaya hai, kya karoon?",
        "Sahjanwa block mein sabse achha business kaunsa hai?"
      ];
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      setTranscript(randomPhrase);
      onTranscript(randomPhrase);
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setTranscript('सुन रहा हूँ... बोलिए');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const text = event.results[current][0].transcript;
        setTranscript(text);
        if (event.results[current].isFinal) {
          onTranscript(text);
          setIsListening(false);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn('SpeechRecognition error:', err);
      setIsListening(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={toggleListening}
        className={`p-3 rounded-full flex items-center justify-center transition-all shadow-md ${
          isListening
            ? 'bg-red-500 text-white mic-active ring-4 ring-red-200'
            : 'bg-rural-600 hover:bg-rural-700 text-white'
        }`}
        title="Voice Input (STT)"
      >
        {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
      </button>
      {transcript && (
        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md max-w-[200px] truncate border border-slate-200">
          "{transcript}"
        </span>
      )}
    </div>
  );
};
