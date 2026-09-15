import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import logoImg from '../../assets/logo.png';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  GraduationCap, 
  BookOpen, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  ShieldCheck,
  Building2,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, language, themeMode } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [role, setRole] = useState<'student' | 'teacher' | 'admin'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [varkPref, setVarkPref] = useState<'visual' | 'audio' | 'read' | 'kinesthetic'>('visual');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickDemoLogin = (demoRole: 'student' | 'teacher') => {
    if (demoRole === 'student') {
      setEmail('yusuf.student@shaghoof.ai');
      setPassword('demo123456');
      setName('يوسف أبوزيد');
      setRole('student');
    } else {
      setEmail('dr.ahmed@shaghoof.ai');
      setPassword('teacher123456');
      setName('د. أحمد العوضي');
      setRole('teacher');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(isAr ? 'تم تسجيل الدخول بنجاح! جاري توجيهك للمنصة...' : 'Successfully authenticated! Redirecting...');
    
    setTimeout(() => {
      login({
        name: name || (role === 'student' ? 'يوسف أبوزيد' : 'د. أحمد العوضي'),
        email: email || 'student@shaghoof.ai',
        role: role,
        varkPreference: varkPref
      });
      setSuccessMessage(null);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in">
      <div className={`w-full max-w-lg border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto relative transition-colors ${
        isDark ? 'bg-[#121827] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-slate-500/10'
      }`}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="flex items-center justify-center gap-3">
            <div className="p-2 rounded-2xl bg-white dark:bg-transparent border border-slate-200 dark:border-[#FF4D2D]/30 shadow-md dark:shadow-none transition-all duration-300">
              <img src={logoImg} alt="SHAGHOOF AI Logo" className="h-10 w-auto rounded-lg object-contain" />
            </div>
            <span className="font-extrabold text-xl tracking-wider text-[#FF4D2D] dark:text-[#FF7355]">
              SHAGHOOF AI
            </span>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' 
              ? (isAr ? 'مرحباً بك مجدداً في المنصة التعليمية' : 'Welcome Back to SHAGHOOF AI')
              : (isAr ? 'إنشاء حساب طالب / معلم جديد' : 'Create a New Account')}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isAr ? 'ادخل إلى تجربة التعلم التكيفية الميسرة بأحدث تقنيات الذكاء الاصطناعي' : 'Access your adaptive & inclusive AI learning portal'}
          </p>
        </div>

        {/* Quick Demo Credentials Pill Bar */}
        <div className="p-3 rounded-2xl bg-[#FF4D2D]/10 border border-[#FF4D2D]/30 flex items-center justify-between text-xs">
          <span className="text-[#FF4D2D] dark:text-[#FF7355] font-bold flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-[#FF4D2D]" />
            <span>{isAr ? 'تجربة سريعة (Quick Demo):' : 'Quick Demo Fill:'}</span>
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-[#FF4D2D]/40 text-[#FF4D2D] dark:text-[#FF7355] text-[11px] font-bold hover:bg-[#FF4D2D]/10"
            >
              🎓 {isAr ? 'طالب' : 'Student'}
            </button>
            <button
              onClick={() => handleQuickDemoLogin('teacher')}
              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-sky-300 dark:border-sky-700 text-sky-700 dark:text-sky-300 text-[11px] font-bold hover:bg-sky-100"
            >
              👨‍🏫 {isAr ? 'معلم' : 'Teacher'}
            </button>
          </div>
        </div>

        {/* Mode Switcher (Login vs Sign Up Tabs) */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setMode('login')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === 'login'
                ? 'bg-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'تسجيل الدخول (Sign In)' : 'Sign In'}
          </button>

          <button
            onClick={() => setMode('signup')}
            className={`py-2 rounded-xl text-xs font-bold transition ${
              mode === 'signup'
                ? 'bg-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/20'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {isAr ? 'إنشاء حساب جديد (Register)' : 'Register'}
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-2 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-bounce">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Role Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {isAr ? 'نوع الحساب (Role):' : 'Account Type:'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'student', label: isAr ? 'طالب 🎓' : 'Student 🎓', icon: GraduationCap },
                { id: 'teacher', label: isAr ? 'معلم 👨‍🏫' : 'Teacher 👨‍🏫', icon: Building2 },
                { id: 'admin', label: isAr ? 'مدير 🛡️' : 'Admin 🛡️', icon: ShieldCheck }
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id as any)}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    role === r.id
                      ? 'bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Full Name Input (Sign Up Mode) */}
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'الاسم الكامل:' : 'Full Name:'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isAr ? "أدخل اسمك الثلاثي..." : "Enter your full name..."}
                  className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF4D2D] transition ${
                    isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>
          )}

          {/* Email / Student ID Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              {isAr ? 'البريد الإلكتروني / رقم الطالب Academic Email:' : 'Academic Email / Student ID:'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@shaghoof.edu.eg"
                className={`w-full pr-10 pl-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF4D2D] transition ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'كلمة المرور:' : 'Password:'}
              </label>
              {mode === 'login' && (
                <button type="button" className="text-[11px] text-[#FF4D2D] hover:underline">
                  {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className={`w-full pr-10 pl-10 py-2.5 rounded-xl border text-xs focus:outline-none focus:border-[#FF4D2D] transition ${
                  isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Initial VARK Preference Selection (Sign Up Mode) */}
          {mode === 'signup' && role === 'student' && (
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-[#FF4D2D] block">
                {isAr ? 'نمط التعلم المفضل المبدئي (VARK Preference):' : 'Preferred VARK Learning Style:'}
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'visual', label: 'بصري 🎨' },
                  { id: 'audio', label: 'سمعي 🎧' },
                  { id: 'read', label: 'قرائي 📖' },
                  { id: 'kinesthetic', label: 'حركي ⚙️' }
                ].map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVarkPref(v.id as any)}
                    className={`py-1.5 rounded-lg text-[11px] font-bold border transition ${
                      varkPref === v.id
                        ? 'bg-[#FF4D2D]/10 text-[#FF4D2D] border-[#FF4D2D]/30'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#FF4D2D] hover:bg-[#E03E1C] transition shadow-lg shadow-[#FF4D2D]/20 text-white font-extrabold text-xs flex items-center justify-center gap-2 mt-4"
          >
            <span>
              {mode === 'login' 
                ? (isAr ? 'دخول المنصة التعليمية' : 'Sign In to Portal')
                : (isAr ? 'تأكيد وإنشاء الحساب' : 'Create Account')}
            </span>
            <ArrowLeft className={`w-4 h-4 ${isAr ? '' : 'rotate-180'}`} />
          </button>
        </form>

        {/* Enterprise SSO Social Login Providers */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center space-y-3">
          <span className="text-[11px] text-slate-400 block font-semibold">
            {isAr ? 'أو الدخول الموحد عبر نظام المؤسسة (Enterprise SSO):' : 'Or Sign In with Enterprise Single Sign-On:'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemoLogin('student')}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-amber-300 flex items-center justify-center gap-2"
            >
              <span>🌐 Google Workspace</span>
            </button>
            <button
              onClick={() => handleQuickDemoLogin('teacher')}
              className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-300 hover:border-amber-300 flex items-center justify-center gap-2"
            >
              <span>🎓 Moodle / LMS Login</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
