import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { SHAGHOOF_LOGO_BASE64 } from '../../assets/logoData';
import { 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  BookOpen, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Building2,
  CheckCircle2,
  Globe,
  Sun,
  Moon
} from 'lucide-react';

interface LoginPageGateProps {
  onBackToWelcome: () => void;
}

export const LoginPageGate: React.FC<LoginPageGateProps> = ({ onBackToWelcome }) => {
  const { login, language, themeMode, setLanguage, toggleThemeMode } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const authTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  const handleQuickDemo = (demoRole: 'student' | 'teacher') => {
    if (demoRole === 'student') {
      setEmail('yusuf.student@shaghoof.ai');
      setPassword('demo123456');
      setName(isAr ? 'يوسف أبوزيد' : 'Yusuf Abozeid');
      setRole('student');
    } else {
      setEmail('dr.ahmed@shaghoof.ai');
      setPassword('teacher123456');
      setName(isAr ? 'د. أحمد العوضي' : 'Dr. Ahmed El-Awady');
      setRole('teacher');
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(isAr ? 'تم التحقق من بياناتك بنجاح! جاري دخول المنصة...' : 'Authentication successful! Entering portal...');

    authTimeoutRef.current = setTimeout(() => {
      login({
        name: name || (role === 'student' ? (isAr ? 'يوسف أبوزيد' : 'Yusuf Abozeid') : (isAr ? 'د. أحمد العوضي' : 'Dr. Ahmed El-Awady')),
        email: email || 'student@shaghoof.ai',
        role: role
      });
    }, 700);
  };

  return (
    <div 
      dir={isAr ? 'rtl' : 'ltr'}
      className="min-h-screen relative z-10 flex flex-col items-center justify-between p-4 sm:p-6 transition-colors overflow-y-auto bg-transparent text-slate-900 dark:text-slate-100"
    >
      
      {/* Top Navigation Bar */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between gap-4 py-2">
        <button
          type="button"
          onClick={onBackToWelcome}
          aria-label="Back to welcome screen"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 backdrop-blur-md shadow-sm hover:border-amber-300 transition"
        >
          <ArrowLeft className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
          <span>{isAr ? 'الرجوع للشاشة الرئيسية' : 'Back to Welcome'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage(isAr ? 'en' : 'ar')}
            aria-label={isAr ? "Switch language to English" : "تغيير اللغة إلى العربية"}
            className="flex items-center gap-1 px-3 py-2 rounded-xl border text-xs font-bold bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 transition"
          >
            <Globe className="w-3.5 h-3.5 text-blue-700 dark:text-blue-400" />
            <span>{isAr ? 'English 🇬🇧' : 'العربية 🇸🇦'}</span>
          </button>

          <button
            type="button"
            onClick={toggleThemeMode}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="p-2 rounded-xl border bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-amber-300 transition"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Main Authentication Card */}
      <main className={`relative z-10 w-full max-w-md border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-auto backdrop-blur-xl transition-colors ${
        isDark ? 'bg-[#0F1A30]/90 border-slate-700' : 'bg-white/95 border-slate-200'
      }`}>
        
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 p-2 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-[#FF4D2D]/40 shadow-lg shadow-[#FF4D2D]/10 ring-1 ring-[#FF4D2D]/20 transition-all duration-300 hover:scale-105 shrink-0">
              <img 
                src={SHAGHOOF_LOGO_BASE64} 
                alt="SHAGHOOF AI Logo" 
                className="w-full h-full object-contain drop-shadow-md" 
                loading="eager"
              />
            </div>
            <div className="text-start">
              <span className="font-black text-3xl tracking-wider text-[#FF4D2D] dark:text-[#FF7355] block drop-shadow-sm">
                SHAGHOOF AI
              </span>
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block tracking-wide">
                شَغَفٌ يُثْمِرُ عِلْماً • Educational Engine
              </span>
            </div>
          </div>

          <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' 
              ? (isAr ? 'تسجيل الدخول للمنصة التعليمية' : 'Sign In to Portal')
              : (isAr ? 'إنشاء حساب جديد' : 'Create New Account')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'ادخل بياناتك للوصول إلى بيئة التعلم التكيفية والمساعد الذكي' : 'Authenticate to access your inclusive AI learning portal'}
          </p>
        </div>

        {/* Quick Demo Pill Selector */}
        <div className="p-3 rounded-2xl bg-[#FF4D2D]/10 border border-[#FF4D2D]/30 flex items-center justify-between text-xs">
          <span className="text-[#FF4D2D] dark:text-[#FF7355] font-bold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#FF4D2D]" />
            <span>{isAr ? 'تعبئة سريعة (Demo):' : 'Quick Demo Login:'}</span>
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[#FF4D2D]/30 text-[#FF4D2D] dark:text-[#FF7355] text-[11px] font-bold hover:bg-[#FF4D2D]/10 transition"
            >
              🎓 {isAr ? 'طالب' : 'Student'}
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('teacher')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-[11px] font-bold hover:bg-blue-100 dark:hover:bg-blue-950/60 transition"
            >
              👨‍🏫 {isAr ? 'معلم' : 'Teacher'}
            </button>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              mode === 'login'
                ? 'bg-[#FF4D2D] text-white shadow-lg shadow-[#FF4D2D]/30 scale-[1.02]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'تسجيل الدخول' : 'Sign In'}
          </button>

          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all duration-300 ${
              mode === 'signup'
                ? 'bg-[#FF4D2D] text-white shadow-lg shadow-[#FF4D2D]/30 scale-[1.02]'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'حساب جديد' : 'Register'}
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition-all">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuthenticate} className="space-y-4">
          
          {/* Role Buttons */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {isAr ? 'صفة الدخول (Role):' : 'Select Role:'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                  role === 'student'
                    ? 'bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{isAr ? 'طالب (Student)' : 'Student'}</span>
              </button>

              <button
                type="button"
                onClick={() => setRole('teacher')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                  role === 'teacher'
                    ? 'bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>{isAr ? 'معلم / محاضر' : 'Teacher'}</span>
              </button>
            </div>
          </div>

          {/* Full Name for Signup */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label htmlFor="fullname-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'الاسم الكامل:' : 'Full Name:'}
              </label>
              <div className="relative">
                <User className={`w-4 h-4 text-slate-400 absolute top-3 ${isAr ? 'right-3' : 'left-3'}`} />
                <input
                  id="fullname-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "أدخل اسمك..." : "Enter full name..."}
                  className={`w-full py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF4D2D] transition ${
                    isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'
                  } ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Email / ID */}
          <div className="space-y-1">
            <label htmlFor="email-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {isAr ? 'البريد الإلكتروني الأكاديمي:' : 'Academic Email:'}
            </label>
            <div className="relative">
              <Mail className={`w-4 h-4 text-slate-400 absolute top-3 ${isAr ? 'right-3' : 'left-3'}`} />
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yusuf.student@shaghoof.ai"
                className={`w-full py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF4D2D] transition ${
                  isAr ? 'pr-10 pl-4' : 'pl-10 pr-4'
                } ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label htmlFor="password-input" className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {isAr ? 'كلمة المرور:' : 'Password:'}
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 text-slate-400 absolute top-3 ${isAr ? 'right-3' : 'left-3'}`} />
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF4D2D] transition ${
                  isAr ? 'pr-10 pl-10' : 'pl-10 pr-10'
                } ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className={`absolute top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white ${
                  isAr ? 'left-3' : 'right-3'
                }`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#FF4D2D] hover:bg-[#E03E1C] hover:scale-[1.01] transition shadow-lg shadow-[#FF4D2D]/20 text-white font-extrabold text-xs flex items-center justify-center gap-2 mt-4"
          >
            <span>{mode === 'login' ? (isAr ? 'دخول المنصة التعليمية' : 'Sign In') : (isAr ? 'تأكيد الحساب' : 'Register')}</span>
            <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
          </button>
        </form>

      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto text-center text-xs text-slate-400 pt-4 border-t border-slate-200 dark:border-slate-800/60">
        <span>© 2026 SHAGHOOF AI • YusufAbozeid / EduMind-AI</span>
      </footer>

    </div>
  );
};
