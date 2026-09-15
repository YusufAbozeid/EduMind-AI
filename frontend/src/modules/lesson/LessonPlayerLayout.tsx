import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { ModalityTabs } from './ModalityTabs';
import { VisualRenderer } from './VisualRenderer';
import { AudioRenderer } from './AudioRenderer';
import { ReadWriteRenderer } from './ReadWriteRenderer';
import { KinestheticRenderer } from './KinestheticRenderer';
import { TutorChat } from '../chat/TutorChat';
import { TopicSelectorModal } from '../../components/TopicSelectorModal';
import { ChevronRight, ChevronLeft, RefreshCw, BookOpen } from 'lucide-react';

interface LessonPlayerLayoutProps {
  onOpenVARK: () => void;
}

export const LessonPlayerLayout: React.FC<LessonPlayerLayoutProps> = ({ onOpenVARK }) => {
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
    themeMode
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
      />

    </div>
  );
};
