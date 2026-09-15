import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export const SpeechNavController: React.FC = () => {
  const { 
    speechNavActive, 
    toggleSpeechNav, 
    language,
    nextStep,
    prevStep,
    setVisualScheduleOpen,
    setAACBoardOpen,
    setSignLanguageTerm,
    setSignLanguageModalOpen,
    speakText
  } = useStore();

  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [unsupportedError, setUnsupportedError] = useState<boolean>(false);
  const isAr = language === 'ar';
  const isListeningRef = useRef(false);

  useEffect(() => {
    if (!speechNavActive) {
      isListeningRef.current = false;
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported in this browser environment.');
      setUnsupportedError(true);
      return;
    }

    setUnsupportedError(false);
    isListeningRef.current = true;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = isAr ? 'ar-EG' : 'en-US';

    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript.trim().toLowerCase();
      setLastCommand(transcript);

      if (transcript.includes('التالي') || transcript.includes('next')) {
        nextStep();
        speakText(isAr ? 'تم الانتقال للخطوة التالية' : 'Moved to next step');
      } else if (transcript.includes('السابق') || transcript.includes('previous') || transcript.includes('back')) {
        prevStep();
        speakText(isAr ? 'تم الرجوع للخطوة السابقة' : 'Moved to previous step');
      } else if (transcript.includes('جدول') || transcript.includes('schedule')) {
        setVisualScheduleOpen(true);
        speakText(isAr ? 'تم فتح الجدول البصري' : 'Visual schedule opened');
      } else if (transcript.includes('تواصل') || transcript.includes('رموز') || transcript.includes('aac')) {
        setAACBoardOpen(true);
        speakText(isAr ? 'تم فتح لوحة التواصل' : 'AAC board opened');
      } else if (transcript.includes('إشارة') || transcript.includes('sign')) {
        setSignLanguageTerm(isAr ? 'مرحباً بك في مترجم لغة الإشارة الذكي' : 'Welcome to Sign Language Presenter');
        setSignLanguageModalOpen(true);
        speakText(isAr ? 'تم فتح مساعد لغة الإشارة' : 'Sign language helper opened');
      } else if (transcript.includes('اقرأ') || transcript.includes('read')) {
        speakText(isAr ? 'أهلاً بك في منصة شغف ذكاء اصطناعي التعليمية الميسرة' : 'Welcome to SHAGHOOF AI inclusive learning platform');
      }
    };

    // Auto-restart on silent disconnection if still active
    recognition.onend = () => {
      if (isListeningRef.current && speechNavActive) {
        try {
          recognition.start();
        } catch (e) {
          console.warn('Speech recognition auto-restart failed:', e);
        }
      }
    };

    recognition.onerror = (err: any) => {
      console.warn('Speech recognition error:', err);
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn('Failed to start speech recognition:', e);
    }

    return () => {
      isListeningRef.current = false;
      try {
        recognition.stop();
      } catch (e) {}
    };
  }, [speechNavActive, isAr, nextStep, prevStep, setVisualScheduleOpen, setAACBoardOpen, setSignLanguageTerm, setSignLanguageModalOpen, speakText]);

  if (!speechNavActive) return null;

  if (unsupportedError) {
    return (
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className="fixed bottom-20 left-6 z-40 bg-rose-950/90 text-white p-3.5 rounded-2xl border border-rose-500/40 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fade-in"
      >
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
        <div className="text-xs">
          <span className="font-bold text-rose-300 block">
            {isAr ? 'التعرف الصوتي غير مدعوم' : 'Speech Engine Unsupported'}
          </span>
          <span className="text-[11px] text-rose-200">
            {isAr ? 'متصفحك الحالي لا يدعم Web Speech API' : 'Your browser does not support Web Speech API'}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleSpeechNav}
          aria-label="Close voice navigation alert"
          className="p-1 text-rose-300 hover:text-white rounded-lg transition"
        >
          <MicOff className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed bottom-20 left-6 z-40 bg-slate-900/90 dark:bg-slate-950/90 text-white p-4 rounded-3xl border border-cyan-500/40 shadow-2xl backdrop-blur-md flex items-center gap-4 animate-fade-in"
    >
      <div className="relative">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-slate-950 font-bold animate-pulse">
          <Mic className="w-5 h-5" />
        </div>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-900 rounded-full" />
      </div>

      <div className="text-xs space-y-0.5 text-start">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-cyan-400">
            {isAr ? 'التحكم بالصوت نشط' : 'Voice Command Active'}
          </span>
          <span className="px-1.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-mono rounded font-bold">
            {isAr ? 'استماع...' : 'Listening...'}
          </span>
        </div>
        <p className="text-slate-300 text-[11px]">
          {lastCommand 
            ? (isAr ? `الأمر الأخير: "${lastCommand}"` : `Last command: "${lastCommand}"`)
            : (isAr ? 'قل: "التالي"، "السابق"، "جدول"، "تواصل"' : 'Say: "Next", "Previous", "Schedule", "AAC"')}
        </p>
      </div>

      <button
        type="button"
        onClick={toggleSpeechNav}
        aria-label="Deactivate voice navigation"
        className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        title={isAr ? "إيقاف المساعد الصوتي" : "Turn off voice assistant"}
      >
        <MicOff className="w-4 h-4" />
      </button>
    </div>
  );
};
