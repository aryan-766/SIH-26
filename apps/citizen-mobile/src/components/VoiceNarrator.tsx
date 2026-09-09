/**
 * GramUdyam — Voice Narrator (Text to Speech) Component
 * Supports Web SpeechSynthesis and fallback narration across HI, EN, MR, TA
 */
import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS } from '../theme';
import { Language } from '../locales';

interface Props {
  textToSpeak: string;
  lang?: Language;
  label?: string;
}

export const VoiceNarrator: React.FC<Props> = ({
  textToSpeak,
  lang = 'hi',
  label
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getLanguageCode = (l: Language) => {
    switch (l) {
      case 'hi': return 'hi-IN';
      case 'mr': return 'mr-IN';
      case 'ta': return 'ta-IN';
      case 'en': return 'en-IN';
      default: return 'hi-IN';
    }
  };

  const speak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = getLanguageCode(lang);
      utterance.rate = 0.95;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback toggle for non-web environments
      setIsSpeaking(!isSpeaking);
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const defaultLabel = isSpeaking
    ? (lang === 'en' ? 'Stop' : 'रोकें')
    : label || (lang === 'en' ? 'Listen' : lang === 'mr' ? 'ऐका' : lang === 'ta' ? 'கேளுங்கள்' : 'सुनें');

  return (
    <TouchableOpacity
      onPress={speak}
      style={[styles.btn, isSpeaking && styles.btnSpeaking]}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isSpeaking ? 'volume-mute' : 'volume-high'}
        size={14}
        color={isSpeaking ? '#b45309' : '#047857'}
      />
      <Text style={[styles.text, isSpeaking && styles.textSpeaking]}>
        {defaultLabel}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  btnSpeaking: {
    backgroundColor: '#fef3c7',
    borderColor: '#fcd34d',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    color: '#047857',
  },
  textSpeaking: {
    color: '#b45309',
  },
});
