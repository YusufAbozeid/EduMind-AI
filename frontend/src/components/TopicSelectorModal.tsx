import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { BookOpen, X, Check, Brain, Sparkles, Eye, MessageCircle, Calculator, ChevronLeft, ChevronRight, FileText } from 'lucide-react';

interface TopicSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TopicSelectorModal: React.FC<TopicSelectorModalProps> = ({ isOpen, onClose }) => {
  const { topics, activeTopicId, setActiveTopicId, language, themeMode } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTopicIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain': return Brain;
      case 'Sparkles': return Sparkles;
      case 'Eye': return Eye;
      case 'MessageCircle': return MessageCircle;
      case 'Calculator': return Calculator;
      case 'FileText': return FileText;
      default: return BookOpen;
    }
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in p-3 sm:p-5 flex items-center justify-center min-h-screen"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="topic-selector-title"
    >
      <div className={`w-full max-w-3xl border rounded-3xl p-4 sm:p-5 shadow-2xl transition-colors flex flex-col gap-3 my-auto ${
        isDark ? 'bg-[#161C2C] border-amber-800/50 text-white' : 'bg-white border-amber-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FF4D2D] flex items-center justify-center text-white font-bold shadow-md shrink-0 shadow-[#FF4D2D]/20">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 id="topic-selector-title" className="text-sm sm:text-base font-extrabold leading-tight">
                {isAr ? 'كورس التدريب الصيفي: Summer Training (Su26 - TR333 - G2 - Pr)' : 'Summer Training Syllabus (Su26 - TR333 - G2 - Pr)'}
              </h3>
              <p className="text-[11px] text-[#FF4D2D] dark:text-[#FF7355] font-semibold">
                {isAr ? 'مستخرج ومسحوب مباشرة من منصة Moodle التعليمية 🎓' : 'Real Moodle ingested course syllabus 🎓'}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            aria-label="Close modal"
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold transition shrink-0"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Topics List with smooth scrolling */}
        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {topics.map((t) => {
            const IconComponent = getTopicIcon(t.icon);
            const isActive = activeTopicId === t.id;

            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setActiveTopicId(t.id);
                  onClose();
                }}
                className={`w-full text-start px-3.5 py-2.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isActive
                    ? isDark 
                      ? 'bg-[#FF4D2D]/15 border-[#FF4D2D] shadow-md shadow-[#FF4D2D]/10 ring-1 ring-[#FF4D2D]/50'
                      : 'bg-[#FF4D2D]/10 border-[#FF4D2D] shadow-sm ring-1 ring-[#FF4D2D]/50'
                    : isDark
                      ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                      : 'bg-slate-50 border-slate-200 hover:border-[#FF4D2D]/30 hover:bg-[#FF4D2D]/5'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${
                    isActive 
                      ? 'bg-[#FF4D2D] border-[#FF4D2D] text-white' 
                      : isDark ? 'bg-slate-800 border-slate-700 text-[#FF7355]' : 'bg-white border-slate-200 text-[#FF4D2D]'
                  }`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] font-extrabold border border-[#FF4D2D]/30 shrink-0">
                    {t.moduleCode}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {isAr ? t.titleAr : t.titleEn}
                    </h4>
                    <p className="text-[10.5px] text-slate-500 dark:text-slate-400 truncate">
                      {isAr ? t.descriptionAr : t.descriptionEn}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shrink-0 hidden md:inline-block">
                    {t.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {isActive ? (
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/30 text-[11px]">
                      <Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'الدرس الحالي' : 'Active'}</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 dark:text-amber-300 transition text-[11px] font-bold">
                      <span>{isAr ? 'بدء الدرس' : 'Start'}</span>
                      {isAr ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </span>
                  )}
                </div>

              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};
