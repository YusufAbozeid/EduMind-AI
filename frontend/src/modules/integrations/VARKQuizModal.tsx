import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import type { Modality } from '../../store/useStore';
import { X, Eye, Headphones, BookOpen, Sliders, CheckCircle2, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';

interface VARKQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VARKQuizModal: React.FC<VARKQuizModalProps> = ({ isOpen, onClose }) => {
  const { setActiveModality, updateVarkScores, addXP, language } = useStore();
  const isAr = language === 'ar';

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, Modality>>({});

  // Reset quiz state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setSelectedAnswers({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const questions = [
    {
      id: 1,
      question: isAr ? 'عند استيعاب مفهوم برمجي جديد، أي طريقة تُفضل لمراجعة الشرح؟' : 'When understanding a new programming concept, how do you prefer to review it?',
      options: [
        { modality: 'visual' as Modality, label: isAr ? 'رسم مخطط هيكلي ورسم بياني للعلاقات' : 'Diagrams, flowcharts, & visual mappings', icon: Eye },
        { modality: 'audio' as Modality, label: isAr ? 'الاستماع إلى شرح صووتي ميسر مع أمثلة حية' : 'Listening to clear voice explanations', icon: Headphones },
        { modality: 'read' as Modality, label: isAr ? 'قراءة وثائق الكود والمستندات بتمعّن' : 'Reading documentation & code texts carefully', icon: BookOpen },
        { modality: 'kinesthetic' as Modality, label: isAr ? 'تعديل السلايدرات وتجربة الكود بنفسي في مختبر تفاعلي' : 'Interactive sliders & hands-on trial', icon: Sliders },
      ]
    },
    {
      id: 2,
      question: isAr ? 'كيف تتعامل مع المسائل المعقدة في البرمجة والرياضيات؟' : 'How do you approach complex problems in programming or math?',
      options: [
        { modality: 'visual' as Modality, label: isAr ? 'تخيل سريان البيانات بصرياً في عقلي' : 'Visualizing data flow internally', icon: Eye },
        { modality: 'audio' as Modality, label: isAr ? 'مناقشة المشكلة شفهياً مع زميل أو مساعد صوتي' : 'Discussing out loud with AI/peers', icon: Headphones },
        { modality: 'read' as Modality, label: isAr ? 'كتابة خطوات الحل تدريجياً في نقاط منظمّة' : 'Writing down step-by-step notes', icon: BookOpen },
        { modality: 'kinesthetic' as Modality, label: isAr ? 'محاكاة المسألة بتغيير المتغيرات ومشاهدة النتائج المباشرة' : 'Simulating live by tweaking parameters', icon: Sliders },
      ]
    },
    {
      id: 3,
      question: isAr ? 'ما الذي يساعدك أكثر للتركيز وتذكر المعلومات أثناء الدرس؟' : 'What helps you retain information best during a lesson?',
      options: [
        { modality: 'visual' as Modality, label: isAr ? 'الألوان المتباينة والمخططات التفاعلية' : 'Color coding & animated diagrams', icon: Eye },
        { modality: 'audio' as Modality, label: isAr ? 'السرعة الصوتية المناسبة والنطق التلقائي' : 'Optimal speech pace & audio narration', icon: Headphones },
        { modality: 'read' as Modality, label: isAr ? 'النصوص المنسقة بعناية وقاموس المصطلحات' : 'Bullet points & glossary terms', icon: BookOpen },
        { modality: 'kinesthetic' as Modality, label: isAr ? 'التجربة العملية السريعة والألعاب التفاعلية' : 'Gamified challenges & interactive labs', icon: Sliders },
      ]
    }
  ];

  const handleSelectOption = (modality: Modality) => {
    setSelectedAnswers({ ...selectedAnswers, [currentStep]: modality });
  };

  const handleFinish = () => {
    // Count occurrences of each modality
    const counts: Record<Modality, number> = { visual: 0, audio: 0, read: 0, kinesthetic: 0 };
    Object.values(selectedAnswers).forEach((m) => {
      counts[m] = (counts[m] || 0) + 1;
    });

    // Find highest count modality
    let dominant: Modality = 'visual';
    let maxCount = -1;
    (Object.keys(counts) as Modality[]).forEach((m) => {
      if (counts[m] > maxCount) {
        maxCount = counts[m];
        dominant = m;
      }
    });

    // Calculate percentages for VARK score object
    const total = Object.keys(selectedAnswers).length || 1;
    const scores = {
      visual: Math.round(((counts.visual || 0) / total) * 100),
      audio: Math.round(((counts.audio || 0) / total) * 100),
      read: Math.round(((counts.read || 0) / total) * 100),
      kinesthetic: Math.round(((counts.kinesthetic || 0) / total) * 100),
    };

    updateVarkScores(scores);
    setActiveModality(dominant);
    addXP(30);
    onClose();
  };

  const currentQ = questions[currentStep - 1];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-lg bg-card border border-accent-purple/40 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-purple/20 border border-accent-purple/50 flex items-center justify-center text-accent-cyan font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{isAr ? 'اختبار نمط التعلم VARK 4.0' : 'VARK 4.0 Assessment'}</h3>
              <p className="text-xs text-slate-400">{isAr ? 'حدد تفضيلك لمعايرة الواجهة التكيفية التلقائية' : 'Personalize your adaptive learning interface'}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Question Text */}
        <div className="space-y-4">
          <div className="flex justify-between text-xs font-bold text-slate-400">
            <span>{isAr ? `السؤال ${currentStep} من ${questions.length}` : `Question ${currentStep} of ${questions.length}`}</span>
            <span className="text-accent-cyan">{isAr ? 'تجهيز النمط التكيفي' : 'Adaptive Assessment'}</span>
          </div>

          <h4 className="text-sm font-bold text-white leading-relaxed">
            {currentQ.question}
          </h4>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, idx) => {
              const Icon = opt.icon;
              const isSelected = selectedAnswers[currentStep] === opt.modality;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(opt.modality)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-xs font-bold text-right transition ${
                    isSelected
                      ? 'bg-accent-purple/20 border-accent-cyan text-white shadow-lg shadow-purple-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-accent-cyan' : 'text-slate-400'}`} />
                    <span>{opt.label}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-accent-cyan shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div>
            {currentStep > 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1"
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{isAr ? 'السابق' : 'Previous'}</span>
              </button>
            ) : (
              <span className="text-[11px] text-slate-400">+30 XP {isAr ? 'عند الإكمال' : 'upon completion'}</span>
            )}
          </div>

          {currentStep < questions.length ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!selectedAnswers[currentStep]}
              className="px-5 py-2 rounded-xl bg-accent-purple hover:bg-purple-600 disabled:opacity-40 text-white font-bold text-xs shadow-md"
            >
              {isAr ? 'السؤال التالي' : 'Next Question'}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={!selectedAnswers[currentStep]}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-accent-purple to-accent-cyan text-slate-950 font-extrabold text-xs shadow-lg"
            >
              {isAr ? 'تطبيق النمط على الواجهة (+30 XP)' : 'Apply to Interface (+30 XP)'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
