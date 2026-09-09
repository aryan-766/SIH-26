/**
 * GramUdyam — Voice Mic Button (Speech Recognition) Component
 * Supports Web SpeechRecognition with smart fallback phrases in Hindi/English
 */
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../theme';
import { Language } from '../locales';

interface Props {
  onTranscript: (text: string) => void;
  lang?: Language;
  size?: number;
}

export const VoiceMicButton: React.FC<Props> = ({
  onTranscript,
  lang = 'hi',
  size = 36
}) => {
  const [isListening, setIsListening] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const getLanguageCode = (l: Language) => {
    switch (l) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'ta': return 'ta-IN';
      case 'en': return 'en-IN';
      default: return 'hi-IN';
    }
  };

  const handleMicPress = () => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        // High quality simulated phrases for environments without active mic permission
        const phrases = lang === 'en' ? [
          "What is the subsidy under PMEGP for dairy farming?",
          "How much capital do I need for cold press oil expeller?",
          "Check MUDRA loan eligibility for my village",
          "Schedule a site inspection with VDO Sanjay Verma"
        ] : [
          "डेयरी फार्मिंग के लिए PMEGP सब्सिडी कितनी है?",
          "मिनी तेल एक्सपेलर यूनिट के लिए कितना लोन मिलेगा?",
          "मेरे गाँव भीटी रावत के लिए सरकारी योजनाएं बताएं",
          "VDO अधिकारी से भौतिक सत्यापन का अनुरोध करें"
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        setStatusText(lang === 'en' ? 'Simulating speech...' : 'ध्वनि इनपुट प्राप्त...');
        setIsListening(true);
        setTimeout(() => {
          onTranscript(randomPhrase);
          setIsListening(false);
          setStatusText(null);
        }, 800);
        return;
      }

      if (isListening) {
        setIsListening(false);
        setStatusText(null);
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = getLanguageCode(lang);
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
          setIsListening(true);
          setStatusText(lang === 'en' ? 'Listening...' : 'सुन रहा हूँ...');
        };

        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          onTranscript(text);
          setIsListening(false);
          setStatusText(null);
        };

        recognition.onerror = () => {
          setIsListening(false);
          setStatusText(null);
        };

        recognition.onend = () => {
          setIsListening(false);
          setStatusText(null);
        };

        recognition.start();
      } catch (e) {
        setIsListening(false);
        setStatusText(null);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        onPress={handleMicPress}
        style={[
          styles.micBtn,
          { width: size, height: size, borderRadius: size / 2 },
          isListening && styles.micBtnListening,
        ]}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isListening ? 'mic-off' : 'mic'}
          size={size * 0.52}
          color={COLORS.white}
        />
      </TouchableOpacity>
      {statusText && (
        <Text style={styles.statusLabel}>{statusText}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  micBtn: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  micBtnListening: {
    backgroundColor: '#ef4444',
  },
  statusLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#ef4444',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
  },
});
