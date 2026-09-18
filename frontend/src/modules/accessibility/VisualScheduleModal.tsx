import React, { useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { X, Calendar, CheckCircle2, Clock, PlayCircle, Lock } from 'lucide-react';

export const VisualScheduleModal: React.FC = () => {
  const { 
    visualScheduleOpen, 
    setVisualScheduleOpen, 
    currentStep, 
    totalSteps, 
    language,
    topics,
    activeTopicId
  } = useStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && visualScheduleOpen) {
        setVisualScheduleOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visualScheduleOpen, setVisualScheduleOpen]);

  if (!visualScheduleOpen) return null;

  const isAr = language === 'ar';
  const activeTopic = topics?.find(t => t.id === activeTopicId) || topics?.[0];
  const topicTitle = activeTopic ? (isAr ? activeTopic.titleAr : activeTopic.titleEn) : '';

  const scheduleItems = Array.from({ length: totalSteps }, (_, i) => {
    const stepNum = i + 1;
    const isCompleted = stepNum < currentStep;
    const isCurrent = stepNum === currentStep;

    const titlesAr = [
      'المقومات الأساسية والمفاهيم الأولية',
      'التمرير الأمامي وحساب قيم الإشارات',
      'حساب نسبة الخطأ وتفادي الانحراف',
      'خوارزمية التمرير الخلفي وتحديث الأوزان',
      'التطبيق العملي والتجربة التفاعلية'
    ];

    const titlesEn = [
      'Core Fundamentals & Initial Setup',
      'Forward Signal Pass Calculation',
      'Error Measurement & Loss Evaluation',
      'Backpropagation Gradient Weight Updates',
      'Hands-On Interactive Simulation Lab'
    ];

    return {
      stepNum,
      title: isAr ? (titlesAr[i] || `الخطوة ${stepNum}`) : (titlesEn[i] || `Step ${stepNum}`),
      durationMinutes: 3,
      isCompleted,
      isCurrent
    };
  });

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) setVisualScheduleOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="schedule-modal-title"
    >
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 id="schedule-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'الجدول البصري وتوقعات الدرس (Predictability Schedule)' : 'Predictability & Lesson Timeline'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'خارطة طريق بصريّة لخطوات الدرس لتقليل القلق ووضوح التوقعات' : 'Visual sequence schedule providing complete predictability of lesson steps'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setVisualScheduleOpen(false)}
            aria-label="Close modal"
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Topic Title Banner */}
        <div className="px-6 py-4 bg-indigo-500/5 border-b border-indigo-500/10 flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {activeTopic?.moduleCode}
          </span>
          <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 truncate">
            {topicTitle}
          </h3>
        </div>

        {/* Schedule Step Timeline */}
        <div className="p-6 overflow-y-auto space-y-4">
          {scheduleItems.map((item) => (
            <div
              key={item.stepNum}
              className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                item.isCurrent
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-md ring-2 ring-indigo-500/20'
                  : item.isCompleted
                  ? 'border-emerald-500/30 bg-emerald-500/5 opacity-90'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                  item.isCurrent
                    ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                    : item.isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {item.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : item.isCurrent ? <PlayCircle className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                </div>

                <div className="text-start">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{item.durationMinutes} {isAr ? 'دقائق متوقعة' : 'mins expected'}</span>
                  </div>
                </div>
              </div>

              {item.isCurrent && (
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold text-xs rounded-full animate-pulse">
                  {isAr ? 'أنت هنا الآن' : 'You are here'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400">
          {isAr 
            ? `إجمالي الوقت المتوقع للدرس: ~${totalSteps * 3} دقيقة مقسمة على ${totalSteps} محطات هادئة.`
            : `Total estimated lesson duration: ~${totalSteps * 3} mins divided into ${totalSteps} calm checkpoints.`}
        </div>
      </div>
    </div>
  );
};
