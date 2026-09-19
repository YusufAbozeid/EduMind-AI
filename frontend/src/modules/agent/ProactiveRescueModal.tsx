import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Bot, 
  X, 
  Sparkles, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  FileText, 
  Zap, 
  Trophy, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { ProactiveAgentService, type RescuePlan } from '../../services/proactiveAgentService';

interface ProactiveRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProactiveRescueModal: React.FC<ProactiveRescueModalProps> = ({ isOpen, onClose }) => {
  const { 
    topics, 
    activeTopicId, 
    setActiveModality, 
    addXP, 
    language, 
    themeMode,
    topicMastery,
    setTopicMastery
  } = useStore();

  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [, setIsPlanCompleted] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    setCurrentStepIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setIsPlanCompleted(false);
    setActionFeedback(null);
  }, [activeTopicId, isOpen]);

  const currentMastery = topicMastery ? topicMastery[activeTopic.id] : undefined;
  const plan: RescuePlan = ProactiveAgentService.getRescuePlanForTopic(activeTopic, currentMastery);
  const currentStep = plan.steps[currentStepIdx] || plan.steps[0];

  if (!isOpen) return null;

  // Execute Agent Tool Action
  const handleExecuteToolAction = () => {
    const act = currentStep.action;
    if (act.type === 'SWITCH_MODALITY' && act.payload.modality) {
      setActiveModality(act.payload.modality);
      setActionFeedback(isAr ? `✅ قام الوكيل بنقلك آلياً إلى النمط: ${act.payload.modality.toUpperCase()}` : `✅ Agent switched active modality to: ${act.payload.modality.toUpperCase()}`);
    } else if (act.type === 'OPEN_SLIDE') {
      setActionFeedback(isAr ? `✅ تم استخراج شريحة المحاضرة رقم (${act.payload.slideNumber}) وتثبيتها للفحص!` : `✅ Lecture Slide #${act.payload.slideNumber} extracted and spotlighted!`);
    } else {
      setActionFeedback(isAr ? '✅ تم تنفيذ الأداة بنجاح!' : '✅ Tool executed successfully!');
    }

    setTimeout(() => {
      setActionFeedback(null);
    }, 4000);
  };

  const handleNextStep = () => {
    if (currentStepIdx < plan.steps.length - 1) {
      setCurrentStepIdx(prev => prev + 1);
      setActionFeedback(null);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
      setActionFeedback(null);
    }
  };

  // Submit Micro-Quiz
  const handleQuizOptionSelect = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleCompletePlan = () => {
    setQuizSubmitted(true);
    setIsPlanCompleted(true);
    addXP(plan.rewardXP);

    const questions = currentStep.action.payload.quizQuestions || [];
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) {
        correctCount++;
      }
    });
    const computedScore = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    setTopicMastery(activeTopic.id, computedScore);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className={`relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
        isDark ? 'bg-slate-950 border-purple-500/40 text-slate-100 shadow-purple-950/40' : 'bg-white border-purple-200 text-slate-900'
      }`}>
        
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-600/10 via-indigo-600/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
              <Bot className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>{isAr ? 'الوكيل الذكي المستقل' : 'Autonomous AI Agent'}</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  +{plan.rewardXP} XP
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-white mt-0.5">
                {isAr ? 'خطة الإنقاذ الاستباقية المركزة (3 خطوات)' : 'Autonomous Proactive Rescue Plan'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Diagnostic Intelligence Alert Box */}
          <div className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-purple-500/5 to-transparent flex items-start gap-3.5 shadow-sm">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-xs font-bold text-amber-300">
                  {isAr ? 'تشخيص الثغرة المعرفية المستهدفة:' : 'Detected Concept Knowledge Gap:'}
                </h4>
                <span className="text-[11px] font-extrabold text-rose-400 bg-rose-500/10 border border-rose-500/30 px-2.5 py-0.5 rounded-full">
                  {isAr ? `نسبة الإتقان: ${plan.masteryScore}%` : `Mastery: ${plan.masteryScore}%`}
                </span>
              </div>
              <p className="text-xs font-bold text-white mt-1">
                {isAr ? plan.conceptNameAr : plan.conceptNameEn}
              </p>
              <p className="text-[11px] text-slate-300 dark:text-slate-400 mt-1 leading-relaxed">
                {isAr ? plan.detectedWeaknessReasonAr : plan.detectedWeaknessReasonEn}
              </p>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            {plan.steps.map((s, idx) => {
              const isActive = idx === currentStepIdx;
              const isPast = idx < currentStepIdx;
              return (
                <button
                  key={s.stepNumber}
                  onClick={() => setCurrentStepIdx(idx)}
                  className={`p-2.5 rounded-xl border text-right transition flex items-center justify-between gap-2 ${
                    isActive 
                      ? 'bg-purple-600/20 border-purple-500 text-purple-300 shadow-md shadow-purple-900/30' 
                      : isPast 
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold block opacity-75">
                      {isAr ? `خطوة ${s.stepNumber}` : `Step ${s.stepNumber}`}
                    </span>
                    <span className="text-[11px] font-extrabold truncate block">
                      {isAr ? s.duration : s.duration}
                    </span>
                  </div>
                  {isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isActive ? (
                    <Zap className="w-4 h-4 text-amber-400 animate-bounce shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 opacity-40 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Step Content */}
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] text-purple-400 font-extrabold uppercase block tracking-wider">
                  {isAr ? `الخطوة ${currentStep.stepNumber} من 3` : `Step ${currentStep.stepNumber} of 3`}
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-white mt-0.5">
                  {isAr ? currentStep.titleAr : currentStep.titleEn}
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-2.5 py-1 rounded-lg">
                ⏱️ {isAr ? currentStep.duration : currentStep.duration}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr ? currentStep.descAr : currentStep.descEn}
            </p>

            {/* STEP 1: MODALITY INTUITION */}
            {currentStep.action.type === 'SWITCH_MODALITY' && (
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <Eye className="w-4 h-4 text-purple-400" />
                  <span>{isAr ? 'الأداة التنفيذية: التحويل الآلي لنمط التعلم' : 'Autonomous Tool: Modality Switcher'}</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {isAr 
                    ? `سيقوم الوكيل الذكي الآن بضبط واجهة المنصة تلقائياً على النمط البصري لشرح وتثبيت: ${plan.conceptNameAr}.`
                    : `The agent will automatically switch your viewport to Visual modality to explain: ${plan.conceptNameEn}.`}
                </p>
                <button
                  onClick={handleExecuteToolAction}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.01]"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{isAr ? currentStep.action.labelAr : currentStep.action.labelEn}</span>
                </button>
              </div>
            )}

            {/* STEP 2: LECTURE SLIDE SPOTLIGHT */}
            {currentStep.action.type === 'OPEN_SLIDE' && (
              <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    <span>{isAr ? currentStep.action.payload.slideTitleAr : currentStep.action.payload.slideTitleEn}</span>
                  </div>
                  <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800">
                    Slide #{currentStep.action.payload.slideNumber}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
                  {isAr ? currentStep.action.payload.slideContentAr : currentStep.action.payload.slideContentEn}
                </div>

                <button
                  onClick={handleExecuteToolAction}
                  className="w-full py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isAr ? 'تأكيد قراءة الشريحة وتثبيتها' : 'Confirm Slide Reviewed'}</span>
                </button>
              </div>
            )}

            {/* STEP 3: MICRO-QUIZ VERIFICATION */}
            {currentStep.action.type === 'LAUNCH_MICRO_QUIZ' && currentStep.action.payload.quizQuestions && (
              <div className="space-y-4">
                {currentStep.action.payload.quizQuestions.map((q, qIdx) => {
                  const selected = quizAnswers[qIdx];
                  const isCorrect = selected === q.correct;
                  return (
                    <div key={qIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5 text-right">
                      <h5 className="text-xs font-bold text-white leading-relaxed">
                        {qIdx + 1}. {isAr ? q.qAr : q.qEn}
                      </h5>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {(isAr ? q.optionsAr : q.optionsEn).map((opt, optIdx) => {
                          const isOptSelected = selected === optIdx;
                          return (
                            <button
                              key={optIdx}
                              disabled={quizSubmitted}
                              onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                              className={`p-2.5 rounded-xl border text-[11px] font-bold text-right transition flex items-center justify-between ${
                                quizSubmitted
                                  ? optIdx === q.correct
                                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                                    : isOptSelected
                                    ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                                    : 'bg-slate-900/40 border-slate-800 text-slate-500'
                                  : isOptSelected
                                  ? 'bg-purple-600/30 border-purple-400 text-purple-200'
                                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                              }`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && optIdx === q.correct && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mr-1" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {quizSubmitted && (
                        <p className={`text-[10px] font-semibold pt-1 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                          💡 {isAr ? q.explanationAr : q.explanationEn}
                        </p>
                      )}
                    </div>
                  );
                })}

                {!quizSubmitted ? (
                  <button
                    disabled={Object.keys(quizAnswers).length < currentStep.action.payload.quizQuestions.length}
                    onClick={handleCompletePlan}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition disabled:opacity-50"
                  >
                    <Trophy className="w-4 h-4 text-amber-300" />
                    <span>{isAr ? 'اعتماد إجابات الكويز وحصد الـ XP' : 'Submit Quiz & Claim XP'}</span>
                  </button>
                ) : (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1.5 animate-bounce-short">
                    <span className="text-xs font-extrabold text-emerald-300 block">
                      🎉 {isAr ? `أحسنت! أتممت اختبار (${plan.conceptNameAr}) بنجاح!` : `Great job! (${plan.conceptNameEn}) challenge completed!`}
                    </span>
                    <span className="text-[11px] text-slate-300 block">
                      {isAr 
                        ? `حصلت على ${Object.values(quizAnswers).filter((ans, idx) => ans === currentStep.action.payload.quizQuestions?.[idx]?.correct).length} من ${currentStep.action.payload.quizQuestions?.length} إجابات صحيحة (نسبة الإتقان المحسوبة: ${topicMastery?.[activeTopic.id] ?? 100}%) وحصدت +${plan.rewardXP} XP!` 
                        : `Scored ${Object.values(quizAnswers).filter((ans, idx) => ans === currentStep.action.payload.quizQuestions?.[idx]?.correct).length}/${currentStep.action.payload.quizQuestions?.length} correct (${topicMastery?.[activeTopic.id] ?? 100}% mastery)! Awarded +${plan.rewardXP} XP!`}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Action Feedback Banner */}
            {actionFeedback && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold text-center animate-fade-in">
                {actionFeedback}
              </div>
            )}
          </div>

        </div>

        {/* Modal Bottom Footer Navigation */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <button
            onClick={handlePrevStep}
            disabled={currentStepIdx === 0}
            className="px-4 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition disabled:opacity-40 flex items-center gap-1.5"
          >
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
            <span>{isAr ? 'السابق' : 'Previous'}</span>
          </button>

          {currentStepIdx < plan.steps.length - 1 ? (
            <button
              onClick={handleNextStep}
              className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition hover:scale-105"
            >
              <span>{isAr ? 'الخطوة التالية' : 'Next Step'}</span>
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'إغلاق ومتابعة المذاكرة' : 'Done & Continue'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};