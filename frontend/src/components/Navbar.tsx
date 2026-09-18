import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { TopicSelectorModal } from './TopicSelectorModal';
import { AuthModal } from '../modules/auth/AuthModal';
import { SHAGHOOF_LOGO_BASE64 } from '../assets/logoData';
import { 
  Maximize2, 
  Settings, 
  Flame, 
  Leaf, 
  Clock,
  Globe,
  MessageCircle,
  Sun,
  Moon,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Radio,
  Trophy,
  Network,
  ShieldCheck,
  BrainCircuit,
  Globe2
} from 'lucide-react';

interface NavbarProps {
  onOpenAccessibility: () => void;
  onOpenCurriculumHub?: () => void;
  onOpenPodcast?: () => void;
  onOpenRAGBenchmark?: () => void;
  onOpenKnowledgeGraph?: () => void;
  onOpenFeynmanChallenge?: () => void;
  onOpenSDGImpact?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAccessibility, 
  onOpenCurriculumHub,
  onOpenPodcast,
  onOpenRAGBenchmark,
  onOpenKnowledgeGraph,
  onOpenFeynmanChallenge,
  onOpenSDGImpact
}) => {
  const { 
    xp, 
    zenMode, 
    toggleZenMode, 
    sensoryLoadLevel, 
    setSensoryLoadLevel,
    microQuestMode,
    microQuestSeconds,
    egyptianDialect,
    toggleEgyptianDialect,
    language,
    setLanguage,
    themeMode,
    toggleThemeMode,
    user,
    logout
  } = useStore();

  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const sensoryLabel = isAr
    ? sensoryLoadLevel === 'low'
      ? 'حمل حسي: منخفض'
      : sensoryLoadLevel === 'medium'
      ? 'حمل حسي: متوسط'
      : 'حمل حسي: مرتفع'
    : `Sensory: ${sensoryLoadLevel === 'low' ? 'Low' : sensoryLoadLevel === 'medium' ? 'Medium' : 'High'}`;

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isChampionshipMenuOpen, setIsChampionshipMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const championshipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (championshipRef.current && !championshipRef.current.contains(event.target as Node)) {
        setIsChampionshipMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (zenMode) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          type="button"
          onClick={toggleZenMode}
          aria-label="Exit Zen Mode"
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl text-xs font-semibold backdrop-blur-md transition shadow-lg flex items-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          <span>{isAr ? 'إلغاء وضع التركيز الصارم (Exit Zen Mode)' : 'Exit Zen Mode'}</span>
        </button>
      </div>
    );
  }

  return (
    <header 
      dir={isAr ? 'rtl' : 'ltr'}
      className={`sticky top-0 z-40 backdrop-blur-xl border-b px-4 sm:px-6 py-3 transition-colors ${
        isDark 
          ? 'bg-slate-900/95 border-slate-700/60 text-slate-100' 
          : 'bg-white/95 border-slate-200 text-slate-800 shadow-sm'
      }`}
    >
      <div className="max-w-[1600px] w-full mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
        
        {/* Brand Logo & Course Selector Button */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center p-1.5 border shadow-md transition-all duration-300 hover:scale-105 shrink-0 ${
              isDark 
                ? 'bg-slate-900 border-[#FF4D2D]/40 shadow-lg shadow-[#FF4D2D]/10 ring-1 ring-[#FF4D2D]/20' 
                : 'bg-white border-slate-200/90 shadow-md shadow-slate-200/60 ring-1 ring-[#FF4D2D]/15'
            }`}>
              <img 
                src={SHAGHOOF_LOGO_BASE64} 
                alt="SHAGHOOF AI Logo" 
                className="w-full h-full object-contain drop-shadow-sm"
                loading="eager"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-black text-lg sm:text-xl tracking-wider text-[#FF4D2D] dark:text-[#FF7355] drop-shadow-xs whitespace-nowrap">
                  SHAGHOOF AI
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] border border-[#FF4D2D]/30 font-extrabold shadow-xs shrink-0">
                  v2.0
                </span>
              </div>
              <p className={`text-[10.5px] font-semibold hidden xl:flex items-center gap-1.5 whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="w-2 h-2 rounded-full bg-[#FF4D2D] inline-block animate-pulse shrink-0" />
                <span>{isAr ? 'شَغَفٌ يُثْمِرُ عِلْماً • منصة التعلم التكيّفي' : 'Adaptable & Inclusive Educational Engine'}</span>
              </p>
            </div>
          </div>

          {/* Curriculum Hub Launcher (El-Moasser, Ministry, PDF, Moodle) */}
          <button
            type="button"
            onClick={onOpenCurriculumHub}
            aria-label="Open Multi-Stage Curriculum & Textbook Hub"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm shrink-0 whitespace-nowrap ${
              isDark 
                ? 'bg-[#FF4D2D]/10 hover:bg-[#FF4D2D]/20 border-[#FF4D2D]/30 text-[#FF7355]' 
                : 'bg-orange-50 hover:bg-orange-100 border-orange-200 text-[#FF4D2D]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
            <span>{isAr ? '📚 مجمع الكتب والمناهج' : '📚 Curriculum Hub'}</span>
          </button>

          {/* AI Educational Podcast Button */}
          <button
            type="button"
            onClick={onOpenPodcast}
            aria-label="Open AI Educational Podcast Deep-Dive"
            className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm shrink-0 whitespace-nowrap ${
              isDark 
                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400 ring-1 ring-amber-500/20' 
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span>{isAr ? '🎙️ كبسولة البودكاست' : '🎙️ AI Podcast'}</span>
          </button>

          {/* Championship Suite Dropdown */}
          <div className="relative hidden xl:block" ref={championshipRef}>
            <button
              type="button"
              onClick={() => setIsChampionshipMenuOpen(!isChampionshipMenuOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition shadow-sm shrink-0 whitespace-nowrap ${
                isDark 
                  ? 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-purple-300' 
                  : 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-purple-500" />
              <span>{isAr ? '🏆 أدوات البطولة والتفوق' : '🏆 Championship Suite'}</span>
              <ChevronDown className="w-3 h-3 text-purple-500" />
            </button>

            {isChampionshipMenuOpen && (
              <div 
                className={`absolute top-full mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 animate-fade-in ${
                  isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => { setIsChampionshipMenuOpen(false); onOpenRAGBenchmark?.(); }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold hover:bg-emerald-500/10 hover:text-emerald-500 transition text-right rtl:text-right ltr:text-left"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <div>
                    <div className="font-extrabold">{isAr ? 'معايير دقة RAG' : 'RAG Benchmark'}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{isAr ? 'مقاييس Ragas وانعدام الهلوسة' : '98.4% Faithfulness verified'}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setIsChampionshipMenuOpen(false); onOpenKnowledgeGraph?.(); }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold hover:bg-blue-500/10 hover:text-blue-500 transition text-right rtl:text-right ltr:text-left"
                >
                  <Network className="w-4 h-4 text-blue-500" />
                  <div>
                    <div className="font-extrabold">{isAr ? 'خريطة المفاهيم 3D' : '3D Knowledge Graph'}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{isAr ? 'شبكة الترابط المفاهيمي التفاعلية' : 'Topological concept network'}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setIsChampionshipMenuOpen(false); onOpenFeynmanChallenge?.(); }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold hover:bg-purple-500/10 hover:text-purple-500 transition text-right rtl:text-right ltr:text-left"
                >
                  <BrainCircuit className="w-4 h-4 text-purple-500" />
                  <div>
                    <div className="font-extrabold">{isAr ? 'تحدي فاينمان العكسي' : 'Reverse Feynman'}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{isAr ? 'اشرح المفهوم لجدتك أو لطفل' : 'Active Recall & Grandma Test'}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setIsChampionshipMenuOpen(false); onOpenSDGImpact?.(); }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-bold hover:bg-teal-500/10 hover:text-teal-500 transition text-right rtl:text-right ltr:text-left"
                >
                  <Globe2 className="w-4 h-4 text-teal-500" />
                  <div>
                    <div className="font-extrabold">{isAr ? 'أثر التنمية المستدامة' : 'UN SDG 4 & 10 Matrix'}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{isAr ? 'منظومة الشمول والتعليم المنصف' : 'Inclusive education impact'}</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Middle Controls: Theme Switcher, Egyptian Dialect & Global Language */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          {microQuestMode && (
            <div className={`flex items-center gap-2 border px-2.5 py-1.5 rounded-xl shrink-0 whitespace-nowrap ${
              isDark ? 'bg-amber-950/30 border-amber-500/30' : 'bg-amber-50 border-amber-200'
            }`}>
              <Clock className="w-3.5 h-3.5 text-sky-600 animate-pulse shrink-0" />
              <div className="text-xs font-bold">
                <span className="text-sky-600">{formatTimer(microQuestSeconds)}</span>
              </div>
            </div>
          )}

          {/* Theme Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleThemeMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm shrink-0 whitespace-nowrap ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-amber-300 hover:text-amber-200'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 shrink-0" /> : <Moon className="w-3.5 h-3.5 text-slate-600 shrink-0" />}
            <span>{isDark ? (isAr ? 'نهار ☀️' : 'Light ☀️') : (isAr ? 'ليل 🌙' : 'Dark 🌙')}</span>
          </button>

          {/* Egyptian Dialect Toggle */}
          {isAr && (
            <button
              type="button"
              onClick={toggleEgyptianDialect}
              aria-label="Toggle Egyptian Dialect voice and responses"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shrink-0 whitespace-nowrap ${
                egyptianDialect
                  ? 'bg-amber-100 border-amber-300 text-amber-800 shadow-sm'
                  : isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{egyptianDialect ? 'عامية 🇪🇬' : 'فصحى 📖'}</span>
            </button>
          )}

          {/* Global AR / EN Language Selector Toggle */}
          <button
            type="button"
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            aria-label={isAr ? "Switch to English language" : "التغيير للغة العربية"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm shrink-0 whitespace-nowrap ${
              isDark ? 'bg-slate-900 border-slate-700 text-[#FF7355]' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <Globe className="w-3.5 h-3.5 shrink-0" />
            <span>{isAr ? 'EN 🇬🇧' : 'العربية 🇸🇦'}</span>
          </button>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">

          {/* User Profile Badge or Sign In CTA Button */}
          {user.isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="menu"
                aria-label="User profile menu"
                className={`flex items-center gap-2 p-1.5 rounded-xl border transition shadow-sm ${
                  isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-[#FF4D2D] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user.name ? user.name.charAt(0) : 'U'}
                </div>
                <div className="text-start hidden sm:block">
                  <span className="text-xs font-bold block leading-tight">{user.name}</span>
                  <span className="text-[9.5px] text-[#FF4D2D] dark:text-[#FF7355] font-semibold block uppercase">
                    {user.role === 'teacher' ? (isAr ? 'معلم / محاضر 👨‍🏫' : 'Teacher 👨‍🏫') : (isAr ? 'طالب مجتهد 🎓' : 'Student 🎓')}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className={`absolute ${isAr ? 'left-0' : 'right-0'} mt-2 w-56 border rounded-2xl p-2 shadow-2xl z-50 animate-fade-in ${
                  isDark ? 'bg-[#121827] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                }`}>
                  <div className="p-2.5 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold block">{user.name}</span>
                    <span className="text-[11px] text-slate-400 block truncate">{user.email}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] my-1 transition"
                  >
                    <span>{isAr ? 'تبديل الحساب / وضع المعلم 🔄' : 'Switch Account / Demo Role'}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-start px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
                  >
                    <span>{isAr ? 'تسجيل الخروج (Sign Out)' : 'Sign Out'}</span>
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsAuthModalOpen(true)}
              aria-label="Open authentication modal"
              className="flex items-center gap-1.5 bg-[#FF4D2D] hover:bg-[#E03E1C] text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#FF4D2D]/20"
            >
              <User className="w-4 h-4" />
              <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            </button>
          )}

          {/* XP Badge */}
          <div className={`hidden sm:flex items-center gap-1.5 border px-2.5 py-1.5 rounded-xl shadow-sm shrink-0 whitespace-nowrap ${
            isDark ? 'bg-slate-900 border-[#FF4D2D]/30' : 'bg-[#FF4D2D]/5 border-[#FF4D2D]/20'
          }`}>
            <Flame className="w-3.5 h-3.5 text-[#FF4D2D] animate-bounce shrink-0" />
            <span className="text-xs font-black text-[#FF4D2D] dark:text-[#FF7355]">{xp} XP</span>
          </div>

          {/* Sensory Load Indicator (Available on wide screens; also inside Accessibility Drawer) */}
          <button
            type="button"
            onClick={() => {
              const next = sensoryLoadLevel === 'low' ? 'medium' : sensoryLoadLevel === 'medium' ? 'high' : 'low';
              setSensoryLoadLevel(next);
            }}
            aria-label={`Sensory load level: ${sensoryLoadLevel}`}
            className={`hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition shrink-0 whitespace-nowrap ${
              sensoryLoadLevel === 'low'
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                : sensoryLoadLevel === 'medium'
                ? 'bg-[#FF4D2D]/10 border-[#FF4D2D]/40 text-[#FF4D2D] dark:text-[#FF7355]'
                : 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400'
            }`}
          >
            <Leaf className="w-3.5 h-3.5 shrink-0" />
            <span>
              {sensoryLabel}
            </span>
          </button>

          {/* Accessibility Settings Drawer Button (Never cut off) */}
          <button
            type="button"
            onClick={onOpenAccessibility}
            aria-label="Open Inclusive Accessibility Accommodations Drawer"
            className="flex items-center gap-1.5 bg-[#FF4D2D] hover:bg-[#E03E1C] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-md shadow-[#FF4D2D]/20 shrink-0 whitespace-nowrap"
          >
            <Settings className="w-4 h-4 shrink-0" />
            <span>
              {isAr ? 'أدوات التيسير' : 'Accessibility'}
            </span>
          </button>

        </div>
      </div>

      {/* Topic Selector Modal */}
      <TopicSelectorModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </header>
  );
};
