import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, MessageSquare, HelpCircle, FastForward, Rewind, 
  Smile, Coffee, Sparkles, CheckCircle2, RotateCcw
} from 'lucide-react';

interface AACSymbol {
  id: string;
  icon: React.ReactNode;
  labelAr: string;
  labelEn: string;
  textToSendAr: string;
  textToSendEn: string;
  category: 'questions' | 'speed' | 'break' | 'clarification';
  color: string;
}

export const AACBoardModal: React.FC = () => {
  const { 
    aacBoardOpen, 
    setAACBoardOpen, 
    language, 
    addMessage, 
    addXP 
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && aacBoardOpen) {
        setAACBoardOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aacBoardOpen, setAACBoardOpen]);

  if (!aacBoardOpen) return null;

  const isAr = language === 'ar';

  const symbols: AACSymbol[] = [
    {
      id: 'dont_understand',
      icon: <HelpCircle className="w-7 h-7 text-amber-500" />,
      labelAr: 'لم أفهم النقطة',
      labelEn: "I don't understand",
      textToSendAr: 'لم أفهم هذه النقطة جيدا، هل يمكنك شرحها بأسلوب أبسط وأكثر وضوحاً؟',
      textToSendEn: "I didn't quite understand this point. Could you explain it in simpler terms?",
      category: 'questions',
      color: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
    },
    {
      id: 'give_example',
      icon: <Sparkles className="w-7 h-7 text-amber-500" />,
      labelAr: 'أعطني مثالاً عملياً',
      labelEn: 'Give me an example',
      textToSendAr: 'هل يمكنك إعطائي مثالاً من الحياة اليومية لتوضيح هذا المفهوم؟',
      textToSendEn: 'Can you give me a practical real-world example to illustrate this concept?',
      category: 'clarification',
      color: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10'
    },
    {
      id: 'explain_slower',
      icon: <Rewind className="w-7 h-7 text-cyan-500" />,
      labelAr: 'اشرح أبطأ',
      labelEn: 'Explain slower',
      textToSendAr: 'رجاءً اشرح لي بخطوات أبطأ وأقصر لتسهيل الاستيعاب.',
      textToSendEn: 'Please explain in slower, smaller steps for easier understanding.',
      category: 'speed',
      color: 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10'
    },
    {
      id: 'explain_faster',
      icon: <FastForward className="w-7 h-7 text-indigo-500" />,
      labelAr: 'انتقل للنقطة التالية',
      labelEn: 'Move next',
      textToSendAr: 'فهمت هذه الجزئية! لننتقل إلى الجزء التالي من الدرس.',
      textToSendEn: 'I understand this part! Let us move to the next section of the lesson.',
      category: 'speed',
      color: 'border-indigo-500/30 bg-indigo-500/5 hover:bg-indigo-500/10'
    },
    {
      id: 'take_break',
      icon: <Coffee className="w-7 h-7 text-emerald-500" />,
      labelAr: 'أحتاج استراحة قصيرة',
      labelEn: 'Need a break',
      textToSendAr: 'اشعر ببعض الإجهاد الذهني، هل يمكننا أخذ استراحة قصيرة لدقيقة؟',
      textToSendEn: 'I feel a bit mentally tired, can we take a short 1-minute pause?',
      category: 'break',
      color: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10'
    },
    {
      id: 'summarize_points',
      icon: <CheckCircle2 className="w-7 h-7 text-blue-500" />,
      labelAr: 'خص لي النقاط المهمة',
      labelEn: 'Summarize key points',
      textToSendAr: 'هل يمكنك تلخيص النقاط الأساسية التي تعلمناها في سطرين فقط؟',
      textToSendEn: 'Can you summarize the main key points we learned in just two bullet points?',
      category: 'clarification',
      color: 'border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10'
    },
    {
      id: 'feeling_great',
      icon: <Smile className="w-7 h-7 text-rose-500" />,
      labelAr: 'أنا سعيد وفهمت المفهوم!',
      labelEn: 'I feel confident!',
      textToSendAr: 'ممتاز! الشرح ممتع جداً والمفهوم أصبح واضحاً للغاية بالنسبة لي.',
      textToSendEn: 'Awesome! The explanation is really helpful and clear to me now.',
      category: 'questions',
      color: 'border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10'
    },
    {
      id: 'repeat_last',
      icon: <RotateCcw className="w-7 h-7 text-teal-500" />,
      labelAr: 'أعد الجزئية الأخيرة',
      labelEn: 'Repeat last part',
      textToSendAr: 'هل يمكنك إعادة صياغة الجزئية الأخيرة بطريقة مختلفة؟',
      textToSendEn: 'Could you rephrase the last part in a different way?',
      category: 'clarification',
      color: 'border-teal-500/30 bg-teal-500/5 hover:bg-teal-500/10'
    }
  ];

  const handleSelectSymbol = (sym: AACSymbol) => {
    const text = isAr ? sym.textToSendAr : sym.textToSendEn;
    addMessage({
      sender: 'user',
      text: text
    });
    addXP(10);
    setAACBoardOpen(false);
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setAACBoardOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="aac-modal-title"
    >
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 dark:text-amber-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h2 id="aac-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'لوحة التواصل البصري والرموز (AAC Board)' : 'Augmentative AAC Symbol Board'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'انقر على أي رمز للتعبير والتواصل المباشر مع المعلم الذكي' : 'Tap any visual icon to express thoughts or ask the AI tutor directly'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAACBoardOpen(false)}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Symbol Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {symbols.map((sym) => (
            <button
              key={sym.id}
              type="button"
              onClick={() => handleSelectSymbol(sym)}
              className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-3 transition-all transform hover:scale-[1.03] active:scale-[0.98] ${sym.color}`}
            >
              <div className="p-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-sm">
                {sym.icon}
              </div>
              <span className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">
                {isAr ? sym.labelAr : sym.labelEn}
              </span>
            </button>
          ))}
        </div>

        {/* Footer Note */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400">
          {isAr 
            ? 'تتيح هذه اللوحة للطلاب غير الناطقين أو من يفضلون التواصل السريع المشاركة الفعالة بسهولة.' 
            : 'Designed for non-verbal learners and quick expression without typing.'}
        </div>
      </div>
    </div>
  );
};
