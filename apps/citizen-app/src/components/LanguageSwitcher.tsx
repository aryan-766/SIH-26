import React from 'react';
import { Globe } from 'lucide-react';
import { Language } from '../locales';

interface LanguageSwitcherProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLang,
  onLanguageChange
}) => {
  const languages: { code: Language; label: string; script: string }[] = [
    { code: 'hi', label: 'Hindi', script: 'हिन्दी' },
    { code: 'en', label: 'English', script: 'English' },
    { code: 'mr', label: 'Marathi', script: 'मराठी' },
    { code: 'ta', label: 'Tamil', script: 'தமிழ்' },
    { code: 'te', label: 'Telugu', script: 'తెలుగు' }
  ];

  return (
    <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full border border-slate-200 shadow-sm text-xs">
      <Globe className="w-3.5 h-3.5 text-slate-500" />
      <div className="flex gap-1">
        {languages.map((l) => (
          <button
            key={l.code}
            onClick={() => onLanguageChange(l.code)}
            className={`px-2 py-0.5 rounded-full font-medium transition-all ${
              currentLang === l.code
                ? 'bg-rural-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {l.script}
          </button>
        ))}
      </div>
    </div>
  );
};
