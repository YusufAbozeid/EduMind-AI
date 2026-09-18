import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X, Type, Volume2 } from 'lucide-react';

export const BrailleReaderOverlay: React.FC = () => {
  const { 
    brailleModeEnabled, 
    toggleBrailleMode, 
    language,
    topics,
    activeTopicId,
    currentStep,
    totalSteps,
    speakText,
    isSpeaking,
    stopSpeech
  } = useStore();

  const isAr = language === 'ar';

  const activeTopic = topics?.find(t => t.id === activeTopicId) || topics?.[0] || {
    id: 'topic_1',
    moduleCode: 'MODULE 1',
    titleAr: 'الشبكات العصبية والتمرير الخلفي',
    titleEn: 'Neural Networks & Backpropagation',
    descriptionAr: '',
    descriptionEn: '',
    totalSteps: 5,
    icon: 'Brain',
    badge: 'AI Core'
  };

  // Keyboard Escape listener to exit Braille mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && brailleModeEnabled) {
        if (isSpeaking) stopSpeech();
        toggleBrailleMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [brailleModeEnabled, toggleBrailleMode, isSpeaking, stopSpeech]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  if (!brailleModeEnabled) return null;

  const topicTitle = isAr ? activeTopic.titleAr : activeTopic.titleEn;
  const topicDesc = isAr ? activeTopic.descriptionAr : activeTopic.descriptionEn;

  const plainTextContentAr = `
====== منصة شغف ذكاء اصطناعي - عرض برايل الشامل ======

[الموضوع الحالي]: ${topicTitle}
[الوحدة الدراسية]: ${activeTopic.moduleCode} - خطوة ${currentStep} من ${totalSteps || activeTopic.totalSteps}

---------------------------------------------------
[نص الدرس الميسر]:
${topicDesc || 'تتكون الشبكة العصبية من ثلاث طبقات رئيسية: طبقة المدخلات Input Layer، والطبقات الخفية Hidden Layers، وطبقة المخرجات Output Layer.'}

1. طبقة المدخلات (Input Layer): تستقبل البيانات والميزات الرقمية.
2. الطبقات الخفية (Hidden Layers): تقوم بمعالجة الإشارات وضبط الأوزان (Weights) والمحاذاة (Biases).
3. طبقة المخرجات (Output Layer): تعرض النتيجة والتوقعات النهائية.

---------------------------------------------------
[التمرير الخلفي (Backpropagation)]:
هو الخوارزمية الأساسية المستعملة لتعديل وتحديث أوزان الروابط العصبية عن طريق حساب نسبة الخطأ (Loss Value) وإرجاع الإشارة للخلف.

===================================================
`.trim();

  const plainTextContentEn = `
====== SHAGHOOF AI - Accessible Braille Reader View ======

[Current Topic]: ${topicTitle}
[Module]: ${activeTopic.moduleCode} - Step ${currentStep} of ${totalSteps || activeTopic.totalSteps}

---------------------------------------------------
[Simplified Lesson Content]:
${topicDesc || 'Artificial Neural Networks mimic biological brain structures to process complex data patterns through interconnected layers.'}

1. Input Layer: Receives raw input features and digital signals.
2. Hidden Layers: Processes mathematical transformations and tunes weight parameters.
3. Output Layer: Displays the final prediction result.

---------------------------------------------------
[Backpropagation Algorithm]:
The core optimization algorithm used to calculate prediction loss and adjust neural connection weights backwards.

===================================================
`.trim();

  const textToDisplay = isAr ? plainTextContentAr : plainTextContentEn;

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      // Strip decorative ASCII art lines before passing to TTS synthesizer
      const cleanTextForSpeech = textToDisplay
        .replace(/={3,}/g, '')
        .replace(/-{3,}/g, '')
        .trim();
      speakText(cleanTextForSpeech);
    }
  };

  return (
    <div 
      role="region" 
      aria-label="Accessible Braille & Plain Text Reader" 
      className="fixed inset-0 z-50 bg-black text-amber-300 font-mono p-6 sm:p-10 overflow-y-auto flex flex-col justify-between select-text animate-fade-in"
    >
      {/* Accessibility Controls Header */}
      <div className="flex items-center justify-between border-b border-amber-500/40 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Type className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-xl font-bold tracking-widest text-amber-400 uppercase">
              {isAr ? 'عرض برايل الميسر وقارئ الشاشة' : 'Accessible Braille & Screen Reader Mode'}
            </h1>
            <p className="text-xs text-amber-500/80">
              {isAr ? 'بيئة نصية أحادية مخصصة لأجهزة برايل الإلكترونية وقارئات الشاشة (NVDA / JAWS)' : 'High contrast plain text for refreshable braille displays and screen readers'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleSpeak}
            className="px-4 py-2 bg-amber-400 text-black font-bold rounded-xl flex items-center gap-2 hover:bg-amber-300 transition-colors shadow-md"
          >
            <Volume2 className="w-5 h-5" />
            <span>{isSpeaking ? (isAr ? 'إيقاف الصوتي' : 'Stop Speech') : (isAr ? 'قراءة بصوت' : 'Read Aloud')}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (isSpeaking) stopSpeech();
              toggleBrailleMode();
            }}
            className="p-2 text-amber-400 border border-amber-400/40 hover:bg-amber-400/20 rounded-xl transition-colors"
            title={isAr ? "إغلاق العرض (ESC)" : "Close Braille Mode (ESC)"}
            aria-label="Close Braille Mode"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Braille Monospace Text Container */}
      <pre 
        tabIndex={0}
        aria-live="polite" 
        className="flex-1 bg-zinc-950 p-6 rounded-2xl border border-amber-500/30 text-amber-300 text-base sm:text-lg leading-relaxed whitespace-pre-wrap overflow-y-auto tracking-widest"
      >
        {textToDisplay}
      </pre>

      {/* Footer Navigation Hint */}
      <div className="mt-6 pt-4 border-t border-amber-500/40 flex items-center justify-between text-xs text-amber-500">
        <span>{isAr ? 'اضغط ESC للعودة إلى العرض البصري الأساسي' : 'Press ESC to exit Braille Mode'}</span>
        <span>SHAGHOOF AI Accessible Braille Protocol v2.4</span>
      </div>
    </div>
  );
};
