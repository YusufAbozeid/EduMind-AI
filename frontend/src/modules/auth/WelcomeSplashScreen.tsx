import React from 'react';
import { useStore } from '../../store/useStore';
import logoImg from '../../assets/logo.png';
import { GraduationCap, ArrowLeft, Brain, Layers, Globe, Sun, Moon, Sliders, MessageSquare } from 'lucide-react';

interface WelcomeSplashScreenProps {
  onProceedToLogin: () => void;
}

export const WelcomeSplashScreen: React.FC<WelcomeSplashScreenProps> = ({ onProceedToLogin }) => {
  const { language, themeMode, setLanguage, toggleThemeMode } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen relative z-10 overflow-y-auto flex flex-col justify-between p-6 sm:p-10 transition-colors bg-slate-50 dark:bg-[#0A1128] text-slate-900 dark:text-slate-100"
    >
      
      {/* Top Header Bar */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-2xl bg-white dark:bg-transparent border border-slate-200 dark:border-[#FF4D2D]/30 shadow-md dark:shadow-none transition-all duration-300">
            <img src={logoImg} alt="SHAGHOOF AI Logo" className="h-10 w-auto rounded-xl object-contain" />
          </div>
          <div>
            <span className="font-black text-2xl tracking-wider text-[#FF4D2D] dark:text-[#FF7355]">
              SHAGHOOF AI
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              {isAr ? 'شَغَفٌ يُثْمِرُ عِلْماً • v2.0 Academic Platform' : 'Academic AI Learning Platform v2.0'}
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            aria-label={isAr ? "Switch language to English" : "تغيير اللغة إلى العربية"}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm hover:border-[#FF4D2D]/40 transition"
          >
            <Globe className="w-4 h-4 text-blue-800 dark:text-blue-400" />
            <span>{isAr ? 'English 🇬🇧' : 'العربية 🇸🇦'}</span>
          </button>

          <button
            type="button"
            onClick={toggleThemeMode}
            aria-label={isDark ? "Switch to soft light mode" : "Switch to dark mode"}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 shadow-sm hover:border-[#FF4D2D]/40 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-[#FF7355]" /> : <Moon className="w-4 h-4 text-blue-800" />}
            <span>{isDark ? (isAr ? 'نهار ☀️' : 'Light ☀️') : (isAr ? 'ليل 🌙' : 'Dark 🌙')}</span>
          </button>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 max-w-4xl mx-auto text-center space-y-8 my-auto py-8 px-4">
        
        {/* Universal Empowering Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF4D2D]/10 border border-[#FF4D2D]/30 text-[#FF4D2D] dark:text-[#FF7355] text-xs font-extrabold shadow-sm">
          <GraduationCap className="w-4 h-4 text-[#FF4D2D] dark:text-[#FF7355]" />
          <span>{isAr ? 'شَغَفٌ يُثْمِرُ عِلْماً • بيئة التعلم التكيفية الميسرة' : 'Adaptable & Inclusive Educational Engine'}</span>
        </div>

        {/* Hero Headline */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black leading-tight sm:leading-snug tracking-tight text-slate-900 dark:text-white">
            {isAr ? (
              <>
                مرحباً بك في <span className="text-[#FF4D2D] dark:text-[#FF7355] font-black">SHAGHOOF AI</span>
                <br />
                تجربة تعلم ذكية تتكيف مع نمط عقلك
              </>
            ) : (
              <>
                Welcome to <span className="text-[#FF4D2D] dark:text-[#FF7355] font-black">SHAGHOOF AI</span>
                <br />
                Adaptive Learning Engine Tailored to Your Mind
              </>
            )}
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
            {isAr
              ? 'المنصة التعليمية الذكية المصممة لتسهيل الاستيعاب وتوفير تجربة تعلم مريحة ومخصصة لجميع الطلاب وفقاً لأفضل الممارسات التعليمية الحديثة.'
              : 'Smart educational portal providing personalized visual, audio, and kinesthetic learning tools tailored for every student.'}
          </p>
        </div>

        {/* Universal Feature Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {[
            { icon: Brain, title: isAr ? 'الشرح الابتكاري' : 'Feynman & ELI5', desc: isAr ? 'أسلوب فاينمان وتبسيط المفاهيم' : 'Simplified concept breakdowns' },
            { icon: Layers, title: isAr ? 'أنماط VARK الـ 4' : 'VARK Modalities', desc: isAr ? 'بصري، سمعي، قرائي، تفاعلي' : 'Visual, Audio, Read, Kinesthetic' },
            { icon: Sliders, title: isAr ? 'أدوات القراءة والتركيز' : 'Focus & Reading Suite', desc: isAr ? 'تخصيص الواجهة لراحة العين' : 'Custom reading ruler & fonts' },
            { icon: MessageSquare, title: isAr ? 'صوت HD وعامية مصرية' : 'Egyptian Dialect 🇪🇬', desc: isAr ? 'تواصل بصوت طبيعي وميسر' : 'Natural voice TTS readout' },
          ].map((f, idx) => {
            const Icon = f.icon;
            return (
              <div
                key={idx}
                className="p-4 rounded-2xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-start space-y-1 shadow-sm transition hover:border-[#FF4D2D]/40"
              >
                <div className="w-8 h-8 rounded-xl bg-[#FF4D2D]/10 text-[#FF4D2D] dark:text-[#FF7355] flex items-center justify-center mb-2">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">{f.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Clean Balanced Get Started Button */}
        <div className="pt-4 flex justify-center">
          <button
            type="button"
            onClick={onProceedToLogin}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[#FF4D2D] hover:bg-[#E03E1C] text-white font-extrabold text-sm sm:text-base hover:scale-105 transition-all shadow-xl shadow-[#FF4D2D]/20"
          >
            <span>{isAr ? 'ابدأ رحلة التعلم الذكية' : 'Start Learning Journey'}</span>
            <ArrowLeft className={`w-5 h-5 transition-transform ${isAr ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'}`} />
          </button>
        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-4">
        <span>© 2026 SHAGHOOF AI • YusufAbozeid / EduMind-AI</span>
      </footer>

    </div>
  );
};
