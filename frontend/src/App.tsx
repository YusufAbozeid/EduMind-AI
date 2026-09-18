import { useState } from 'react';
import { useStore } from './store/useStore';
import { Navbar } from './components/Navbar';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { LessonPlayerLayout } from './modules/lesson/LessonPlayerLayout';
import { VARKQuizModal } from './modules/integrations/VARKQuizModal';
import { TwoPassAssessment } from './modules/integrations/TwoPassAssessment';
import { TeacherDashboardPreview } from './modules/integrations/TeacherDashboardPreview';
import { CurriculumHubModal } from './modules/curriculum/CurriculumHubModal';
import { WelcomeSplashScreen } from './modules/auth/WelcomeSplashScreen';
import { LoginPageGate } from './modules/auth/LoginPageGate';
import { ErrorBoundary } from './components/ErrorBoundary';

// Extended Accessibility Components
import { AACBoardModal } from './modules/accessibility/AACBoardModal';
import { SignLanguagePresenter } from './modules/accessibility/SignLanguagePresenter';
import { VisualScheduleModal } from './modules/accessibility/VisualScheduleModal';
import { BrailleReaderOverlay } from './modules/accessibility/BrailleReaderOverlay';
import { SpeechNavController } from './modules/accessibility/SpeechNavController';
import { DwellClickSimulator } from './modules/accessibility/DwellClickSimulator';
import { LineFocusRuler } from './modules/accessibility/LineFocusRuler';
import { AmbientSoundGenerator } from './modules/accessibility/AmbientSoundGenerator';

// Championship Suite Components
import { PodcastGeneratorModal } from './modules/championship/PodcastGeneratorModal';
import { RAGBenchmarkModal } from './modules/championship/RAGBenchmarkModal';
import { KnowledgeGraphModal } from './modules/championship/KnowledgeGraphModal';
import { ReverseFeynmanModal } from './modules/championship/ReverseFeynmanModal';
import { SDGImpactModal } from './modules/championship/SDGImpactModal';

import { GraduationCap, CheckCircle2, Users, BookOpen, X } from 'lucide-react';

const BackgroundDecoration = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none" aria-hidden="true">
    {/* Subtle Grid Mesh Layer */}
    <div className="absolute inset-0 bg-grid-mesh opacity-40 dark:opacity-15" />
    
    {/* Soft Warm Ambient Backlights */}
    <div className="absolute -top-40 -right-40 w-[40rem] h-[40rem] rounded-full bg-orange-400/5 dark:bg-orange-500/5 blur-[140px] animate-ambient-soft" />
    <div className="absolute -bottom-40 -left-40 w-[40rem] h-[40rem] rounded-full bg-orange-300/5 dark:bg-slate-600/10 blur-[140px] animate-ambient-soft" />
  </div>
);

export function App() {
  const { authStep, setAuthStep, user, colorBlindMode, openDyslexicEnabled } = useStore();

  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isVARKOpen, setIsVARKOpen] = useState(false);
  const [isTwoPassOpen, setIsTwoPassOpen] = useState(false);
  const [isTeacherOpen, setIsTeacherOpen] = useState(false);
  const [isCurriculumHubOpen, setIsCurriculumHubOpen] = useState(false);
  const [isContractsBarOpen, setIsContractsBarOpen] = useState(false);

  // Championship Suite Modals State
  const [isPodcastOpen, setIsPodcastOpen] = useState(false);
  const [isRAGBenchmarkOpen, setIsRAGBenchmarkOpen] = useState(false);
  const [isKnowledgeGraphOpen, setIsKnowledgeGraphOpen] = useState(false);
  const [isFeynmanOpen, setIsFeynmanOpen] = useState(false);
  const [isSDGOpen, setIsSDGOpen] = useState(false);

  // Compute CSS filter for Color Blindness & High Contrast accommodations
  let containerFilter = '';
  if (colorBlindMode === 'protanopia') {
    containerFilter = 'url(#protanopia-filter)';
  } else if (colorBlindMode === 'deuteranopia') {
    containerFilter = 'url(#deuteranopia-filter)';
  } else if (colorBlindMode === 'tritanopia') {
    containerFilter = 'url(#tritanopia-filter)';
  } else if (colorBlindMode === 'high-contrast') {
    containerFilter = 'contrast(140%) brightness(110%) saturate(150%)';
  }

  const renderContent = () => {
    // 1. First-Load Cinematic Welcome Splash Screen
    if (authStep === 'welcome' && !user.isAuthenticated) {
      return <WelcomeSplashScreen onProceedToLogin={() => setAuthStep('login')} />;
    }

    // 2. Full-Screen Professional Login Gate Screen
    if (authStep === 'login' && !user.isAuthenticated) {
      return <LoginPageGate onBackToWelcome={() => setAuthStep('welcome')} />;
    }

    // 3. Authenticated Main Application Portal
    return (
      <>
        {/* Top Professional Navigation Bar */}
        <Navbar
          onOpenAccessibility={() => setIsAccessibilityOpen(true)}
          onOpenCurriculumHub={() => setIsCurriculumHubOpen(true)}
          onOpenPodcast={() => setIsPodcastOpen(true)}
          onOpenRAGBenchmark={() => setIsRAGBenchmarkOpen(true)}
          onOpenKnowledgeGraph={() => setIsKnowledgeGraphOpen(true)}
          onOpenFeynmanChallenge={() => setIsFeynmanOpen(true)}
          onOpenSDGImpact={() => setIsSDGOpen(true)}
        />

        {/* Main Lesson Player Layout */}
        <main className="flex-1 max-w-[1600px] w-full mx-auto p-3 sm:p-5 flex flex-col relative z-10">
          <LessonPlayerLayout onOpenVARK={() => setIsVARKOpen(true)} />
        </main>
      </>
    );
  };

  return (
    <ErrorBoundary>
      <div 
        className={`relative min-h-screen bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white animate-fade-in ${
          openDyslexicEnabled ? 'font-opendyslexic' : ''
        }`}
        style={containerFilter ? { filter: containerFilter } : undefined}
      >
        <BackgroundDecoration />
        
        {/* SVG Matrix Filters for Color Blindness Accommodations */}
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} aria-hidden="true">
          <defs>
            <filter id="protanopia-filter">
              <feColorMatrix type="matrix" values="0.56667 0.43333 0 0 0  0.55833 0.44167 0 0 0  0 0.24167 0.75833 0 0  0 0 0 1 0" />
            </filter>
            <filter id="deuteranopia-filter">
              <feColorMatrix type="matrix" values="0.625 0.375 0 0 0  0.7 0.3 0 0 0  0 0.3 0.7 0 0  0 0 0 1 0" />
            </filter>
            <filter id="tritanopia-filter">
              <feColorMatrix type="matrix" values="0.95 0.05 0 0 0  0 0.43333 0.56667 0 0  0 0.475 0.525 0 0  0 0 0 1 0" />
            </filter>
          </defs>
        </svg>

        {renderContent()}

        {/* Cross-Track Integration Contract Quick Bar (Collapsible to prevent covering Chat) */}
        {!isContractsBarOpen ? (
          <button
            onClick={() => setIsContractsBarOpen(true)}
            className="fixed bottom-3 right-4 z-40 hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-300 text-xs font-bold backdrop-blur-md shadow-lg transition hover:scale-105"
            title="فتح عقود التكامل التجريبية"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#FF4D2D]" />
            <span>عقود التكامل (Dev Contracts)</span>
          </button>
        ) : (
          <div className="fixed bottom-3 right-4 z-40 hidden md:flex items-center gap-2 bg-slate-900/95 border border-slate-700 p-2 rounded-2xl backdrop-blur-md shadow-2xl animate-fade-in">
            <span className="text-[10px] font-bold text-slate-400 px-2 uppercase">عقود التكامل:</span>
            
            <button
              onClick={() => setIsCurriculumHubOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs font-bold hover:bg-orange-500/25 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Curriculum Hub</span>
            </button>

            <button
              onClick={() => setIsVARKOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-bold hover:bg-amber-500/25 transition"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>VARK Quiz (Dev A)</span>
            </button>

            <button
              onClick={() => setIsTwoPassOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold hover:bg-emerald-500/25 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Two-Pass (Dev C)</span>
            </button>

            <button
              onClick={() => setIsTeacherOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/25 transition"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Teacher Roster (Dev D)</span>
            </button>

            <button
              onClick={() => setIsContractsBarOpen(false)}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition ms-1"
              title="إغلاق الشريط"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Accessibility Toolbar Drawer */}
        <AccessibilityToolbar
          isOpen={isAccessibilityOpen}
          onClose={() => setIsAccessibilityOpen(false)}
        />

        {/* Extended Accessibility Overlay Suites */}
        <AACBoardModal />
        <SignLanguagePresenter />
        <VisualScheduleModal />
        <BrailleReaderOverlay />
        <SpeechNavController />
        <DwellClickSimulator />
        <LineFocusRuler />
        <AmbientSoundGenerator />

        {/* Multi-Stage Curriculum & Textbook Hub Modal */}
        <CurriculumHubModal
          isOpen={isCurriculumHubOpen}
          onClose={() => setIsCurriculumHubOpen(false)}
        />

        {/* VARK Quiz Modal */}
        <VARKQuizModal
          isOpen={isVARKOpen}
          onClose={() => setIsVARKOpen(false)}
        />

        {/* Two-Pass Assessment Modal */}
        <TwoPassAssessment
          isOpen={isTwoPassOpen}
          onClose={() => setIsTwoPassOpen(false)}
        />

        {/* Teacher Dashboard Preview Modal */}
        <TeacherDashboardPreview
          isOpen={isTeacherOpen}
          onClose={() => setIsTeacherOpen(false)}
        />

        {/* 🏆 Championship Suite Modals */}
        <PodcastGeneratorModal
          isOpen={isPodcastOpen}
          onClose={() => setIsPodcastOpen(false)}
        />

        <RAGBenchmarkModal
          isOpen={isRAGBenchmarkOpen}
          onClose={() => setIsRAGBenchmarkOpen(false)}
        />

        <KnowledgeGraphModal
          isOpen={isKnowledgeGraphOpen}
          onClose={() => setIsKnowledgeGraphOpen(false)}
        />

        <ReverseFeynmanModal
          isOpen={isFeynmanOpen}
          onClose={() => setIsFeynmanOpen(false)}
        />

        <SDGImpactModal
          isOpen={isSDGOpen}
          onClose={() => setIsSDGOpen(false)}
        />

      </div>
    </ErrorBoundary>
  );
}

export default App;
