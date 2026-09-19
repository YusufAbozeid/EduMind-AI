import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ModalityTabs } from './ModalityTabs';
import { VisualRenderer } from './VisualRenderer';
import { AudioRenderer } from './AudioRenderer';
import { ReadWriteRenderer } from './ReadWriteRenderer';
import { KinestheticRenderer } from './KinestheticRenderer';
import { TutorChat } from '../chat/TutorChat';
import { TopicSelectorModal } from '../../components/TopicSelectorModal';
import { ProactiveAgentBanner } from '../agent/ProactiveAgentBanner';
import { ProactiveRescueModal } from '../agent/ProactiveRescueModal';
import { ChevronRight, ChevronLeft, RefreshCw, BookOpen, Sparkles, FileUp, GraduationCap } from 'lucide-react';

interface LessonPlayerLayoutProps {
  onOpenVARK: () => void;
  onOpenCurriculumHub?: (tab?: 'textbooks' | 'upload_pdf' | 'moodle_scraper') => void;
}

export const LessonPlayerLayout: React.FC<LessonPlayerLayoutProps> = ({ onOpenVARK, onOpenCurriculumHub }) => {
  const { 
    topics,
    activeTopicId,
    activeModality, 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep,
    lineFocusEnabled,
    lineFocusY,
    setLineFocusY,
    activeGlossaryTerm,
    setActiveGlossaryTerm,
    language,
    themeMode,
    isRescueModalOpen,
    setIsRescueModalOpen
  } = useStore();

  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];

  const handleMouseMove = (e: React.MouseEvent) => {
    if (lineFocusEnabled) {
      setLineFocusY(e.clientY);
    }
  };

  // If no topics enrolled yet (Fresh Clean Account) -> Render Inspiring Onboarding Hub
  if (!activeTopic) {
    return (
      <div className="relative min-h-[calc(100vh-65px)] p-4 sm:p-6" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Main 70% Area: Fresh Account Onboarding Hub */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Welcome Banner Card */}
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-lg relative overflow-hidden transition-all ${
              isDark 
                ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-purple-950/40 border-purple-500/30' 
                : 'bg-gradient-to-br from-white via-orange-50/40 to-purple-50/50 border-slate-200'
            }`}>
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#FF4D2D]/15 to-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] border border-[#FF4D2D]/30 text-xs font-extrabold uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حسابك جديد ونظيف 🚀 مرحباً بك في شغوف AI' : 'Fresh Account 🚀 Welcome to SHAGHOOF AI'}</span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                  {isAr 
                    ? 'ابدأ رحلتك التعليمية المخصصة الآن ✨' 
                    : 'Start Your Adaptive AI Learning Journey ✨'}
                </h1>

                <p className="text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {isAr 
                    ? 'حسابك جاهز وبداية جديدة تماماً دون أي مقررات سابقة. اختر كيف تفضل بدء دراستك اليوم عبر المسارات التالية:' 
                    : 'Your account is fresh with zero preloaded topics. Choose how you want to begin your personalized learning journey today:'}
                </p>
              </div>
            </div>

            {/* 3 Interactive Onboarding Pathway Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Card 1: Curriculum Hub */}
              <div 
                onClick={() => onOpenCurriculumHub?.('textbooks')}
                className={`p-5 rounded-3xl border cursor-pointer group hover:scale-[1.02] transition-all flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isDark 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/60 hover:bg-slate-900' 
                    : 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-indigo-100/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-indigo-400 transition">
                      {isAr ? 'مجمع المناهج والكتب' : 'Curriculum Hub'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {isAr 
                        ? 'تصفح كتب المعاصر والوزارة المعتمدة للمدارس، أو كورس تدريب Route Summer 2026 للجامعة.' 
                        : 'Explore accredited textbooks for schools (El-Moasser, Ministry) or Route Summer AI training.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-indigo-500 dark:text-indigo-400 font-extrabold text-xs">
                  <span>{isAr ? 'تصفح المناهج 📚' : 'Browse Courses 📚'}</span>
                  {isAr ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>

              {/* Card 2: PDF Upload */}
              <div 
                onClick={() => onOpenCurriculumHub?.('upload_pdf')}
                className={`p-5 rounded-3xl border cursor-pointer group hover:scale-[1.02] transition-all flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isDark 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-[#FF4D2D]/60 hover:bg-slate-900' 
                    : 'bg-white border-slate-200 hover:border-[#FF4D2D]/40 hover:shadow-orange-100/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#FF4D2D]/15 text-[#FF4D2D] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-[#FF4D2D] transition">
                      {isAr ? 'رفع ملف PDF للمحاضرة' : 'Upload Lecture PDF'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {isAr 
                        ? 'ارفع أي كتاب أو سلايدات PDF، وسيقوم الوكيل الذكي بتحليله وتوليد دروس تفاعلية بـ 4 أنماط فوراً.' 
                        : 'Upload any lecture PDF or slides, and the AI agent extracts structured interactive lessons.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[#FF4D2D] dark:text-[#FF7355] font-extrabold text-xs">
                  <span>{isAr ? 'رفع ملف PDF 📤' : 'Upload PDF 📤'}</span>
                  {isAr ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>

              {/* Card 3: Moodle LMS Integration */}
              <div 
                onClick={() => onOpenCurriculumHub?.('moodle_scraper')}
                className={`p-5 rounded-3xl border cursor-pointer group hover:scale-[1.02] transition-all flex flex-col justify-between shadow-sm hover:shadow-xl ${
                  isDark 
                    ? 'bg-slate-900/80 border-slate-800 hover:border-emerald-500/60 hover:bg-slate-900' 
                    : 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-emerald-100/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-emerald-400 transition">
                      {isAr ? 'الربط مع Moodle LMS' : 'Connect Moodle LMS'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {isAr 
                        ? 'سجل بحسابك الجامعي في Moodle لسحب المقررات والمحاضرات والتكليفات الرسمية آلياً.' 
                        : 'Connect your university Moodle account to automatically ingest lectures and assignments.'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-emerald-600 dark:text-emerald-400 font-extrabold text-xs">
                  <span>{isAr ? 'ربط Moodle 🎓' : 'Sync Moodle 🎓'}</span>
                  {isAr ? <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>

            </div>

            {/* VARK Multi-modal Info Box */}
            <div className={`p-4.5 rounded-2xl border flex items-center justify-between gap-4 ${
              isDark ? 'bg-slate-900/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <p className="text-xs leading-relaxed font-medium">
                  {isAr 
                    ? '💡 بمجرد اختيارك لأي مقرر، ستقوم المنصة بتكييف المحتوى تلقائياً وفق نمط تعلمك المفضل (بصري، سمعي، قراءة/كتابة، حركي).'
                    : '💡 Once you enroll in a topic, content will adapt seamlessly to your VARK preference (Visual, Audio, Read, Kinesthetic).'}
                </p>
              </div>

              <button
                onClick={onOpenVARK}
                className="px-3.5 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-xs font-bold shrink-0 transition"
              >
                {isAr ? 'تحديد نمط VARK 🎯' : 'Configure VARK 🎯'}
              </button>
            </div>

          </div>

          {/* Right Column: AI Tutor Chat (30%) */}
          <div className="lg:col-span-3 h-[750px] lg:h-[calc(100vh-110px)] sticky top-20">
            <TutorChat />
          </div>

        </div>

        {/* Modals available in onboarding view */}
        <TopicSelectorModal
          isOpen={isTopicModalOpen}
          onClose={() => setIsTopicModalOpen(false)}
          onOpenCurriculumHub={onOpenCurriculumHub ? () => onOpenCurriculumHub('textbooks') : undefined}
        />
        <ProactiveRescueModal
          isOpen={isRescueModalOpen}
          onClose={() => setIsRescueModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-65px)]" onMouseMove={handleMouseMove}>
      
      {/* Line Focus Mode Overlay */}
      {lineFocusEnabled && (
        <div className="line-focus-overlay">
          <div className="line-focus-mask-top" style={{ height: `${Math.max(0, lineFocusY - 40)}px` }} />
          <div 
            className="line-focus-window" 
            style={{ top: `${lineFocusY - 40}px`, height: '80px' }} 
          />
          <div className="line-focus-mask-bottom" style={{ top: `${lineFocusY + 40}px` }} />
        </div>
      )}

      {/* Main 70/30 Split Screen Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-10 gap-6">
        
        {/* Left/Center Column (70% Content Area = 7/10 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Autonomous Proactive Study Agent Banner */}
          <ProactiveAgentBanner onOpenRescuePlan={() => setIsRescueModalOpen(true)} />

          {/* Top Bar: Course Title & Step Progress Stepper */}
          <div className={`border rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm transition-colors ${
            isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => setIsTopicModalOpen(true)}
                  className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] border border-[#FF4D2D]/30 font-bold uppercase hover:bg-[#FF4D2D]/20 transition flex items-center gap-1 shadow-xs shrink-0"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>{activeTopic.moduleCode}</span>
                </button>
                <span className={`text-[11px] font-semibold shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {isAr ? `الخطوة ${currentStep} من ${totalSteps}` : `Step ${currentStep} of ${totalSteps}`}
                </span>
              </div>
              
              <h2 
                onClick={() => setIsTopicModalOpen(true)}
                className={`text-base font-extrabold cursor-pointer hover:text-[#FF4D2D] transition flex flex-wrap items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}
                title={isAr ? 'اضغط لتغيير موضوع المنهج' : 'Click to change curriculum topic'}
              >
                <span>{isAr ? activeTopic.titleAr : activeTopic.titleEn}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-semibold shrink-0 whitespace-nowrap">
                  {isAr ? 'تغيير الموضوع 🔄' : 'Switch Topic 🔄'}
                </span>
              </h2>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`w-9 h-9 rounded-xl border flex items-center justify-center disabled:opacity-30 transition ${
                  isDark ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                {isAr ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalSteps }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-2 rounded-full transition-all ${
                      idx + 1 === currentStep
                        ? 'w-6 bg-[#FF4D2D] shadow-sm shadow-[#FF4D2D]/50'
                        : idx + 1 < currentStep
                        ? 'w-2.5 bg-[#FF4D2D]/50'
                        : isDark ? 'w-2.5 bg-slate-800' : 'w-2.5 bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                disabled={currentStep === totalSteps}
                className="w-9 h-9 rounded-xl bg-[#FF4D2D] hover:bg-[#E03E1C] text-white font-bold disabled:opacity-30 hover:scale-105 transition flex items-center justify-center shadow-md shadow-[#FF4D2D]/20"
              >
                {isAr ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Modality Tabs Selector */}
          <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-3 p-3 rounded-2xl border transition-colors ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-100/70 border-slate-200'
          }`}>
            <div className="overflow-x-auto max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <ModalityTabs />
            </div>

            <button
              onClick={onOpenVARK}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] border border-[#FF4D2D]/30 text-xs font-bold hover:bg-[#FF4D2D]/20 transition shrink-0 whitespace-nowrap shadow-xs self-end md:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isAr ? 'إعادة معايرة VARK' : 'Recalibrate VARK'}</span>
            </button>
          </div>

          {/* Active Modality Renderer Component */}
          <div className="transition-all duration-300">
            {activeModality === 'visual' && <VisualRenderer />}
            {activeModality === 'audio' && <AudioRenderer />}
            {activeModality === 'read' && <ReadWriteRenderer />}
            {activeModality === 'kinesthetic' && <KinestheticRenderer />}
          </div>

        </div>

        {/* Right Column (30% Tutor Chat Area = 3/10 cols) */}
        <div className="lg:col-span-3 h-[750px] lg:h-[calc(100vh-110px)] sticky top-20">
          <TutorChat />
        </div>

      </div>

      {/* Click-to-Define Glossary Term Popup Modal */}
      {activeGlossaryTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`w-full max-w-md border rounded-3xl p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-card border-cyan-500/40 text-white' : 'bg-white border-purple-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-sky-600 font-bold block uppercase">{isAr ? 'قاموس المصطلحات الشامل' : 'Visual Glossary'}</span>
                <h3 className="text-base font-extrabold">{activeGlossaryTerm.word} ({activeGlossaryTerm.arabic})</h3>
              </div>
              <button
                onClick={() => setActiveGlossaryTerm(null)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 text-xs font-bold"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {activeGlossaryTerm.definition}
            </p>

            {activeGlossaryTerm.culturalNote && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold block mb-0.5">{isAr ? 'التشابه الثقافي الميسر:' : 'Cultural Adaptation Note:'}</span>
                {activeGlossaryTerm.culturalNote}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Topic Selector Modal */}
      <TopicSelectorModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onOpenCurriculumHub={onOpenCurriculumHub ? () => onOpenCurriculumHub('textbooks') : undefined}
      />

      {/* Proactive Rescue Plan Modal */}
      <ProactiveRescueModal
        isOpen={isRescueModalOpen}
        onClose={() => setIsRescueModalOpen(false)}
      />

    </div>
  );
};
