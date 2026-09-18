import React from 'react';
import { useStore } from '../../store/useStore';
import { 
  Globe2, 
  Award, 
  Download, 
  X,
  Eye,
  Ear,
  Hand,
  Brain
} from 'lucide-react';

interface SDGImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SDGImpactModal: React.FC<SDGImpactModalProps> = ({ isOpen, onClose }) => {
  const { language, themeMode } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const downloadWhitepaper = () => {
    const whitepaper = `# SHAGHOOF AI — UN SDG 4 & 10 Impact Whitepaper
Title: Equitable & Cognitive-Adaptive AI Education Engine
Authors: Yusuf Abozeid et al. — Route Academy AI Education 2026

1. Alignment with UN Sustainable Development Goals:
- SDG 4 (Quality Education): Guaranteeing inclusive, fair, and high-quality learning through adaptive VARK models and automated Moodle course assimilation.
- SDG 10 (Reduced Inequalities): Eliminating physical, sensory, and cognitive learning barriers via built-in Dyslexia fonts, Egyptian Sign Language, and AAC Boards.

2. Inclusive Feature Breakdown:
- Sensory & Motor: Dwell Click simulation, Line Focus ruler, High-contrast color matrices (Protanopia, Deuteranopia, Tritanopia).
- Auditory & Speech: Two-speaker conversational podcasts, Speech navigation controller, Egyptian dialect support.
- Cognitive & Neurodivergent: Ambient noise soundscapes, Zen Mode for ADHD learners, Step-by-step Feynman simplification.

3. Open Source & Educational Sovereignty:
Full local offline RAG capability using FAISS vector stores ensuring complete data privacy and accessible deployments on commodity hardware.`;

    const blob = new Blob([whitepaper], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'SHAGHOOF_AI_SDG4_Impact_Whitepaper.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-teal-500/10' 
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
        }`}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? '🌍 أثر التنمية المستدامة والشمولية (UN SDG 4 & 10 Matrix)' : '🌍 UN SDG 4 & 10 Inclusion Matrix'}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500 border border-teal-500/30">
                  Global Impact
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'كيف تضمن منصة شغوف تعليماً منصفاً وشاملاً ومتاحاً للجميع وفق أرقى المعايير الدولية' : 'How SHAGHOOF AI empowers inclusive education for neurodivergent & disabled learners'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Top Banner: UN Goals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              isDark ? 'bg-red-950/20 border-red-800/40' : 'bg-red-50/80 border-red-200'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                SDG 4
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                  {isAr ? 'التعليم الجيد والمنصف (Quality Education)' : 'Quality Education'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isAr 
                    ? 'ضمان حصول كل طالب على شرح يناسب وتيرته ونمطه المعرفي الفطري دون تمييز، عبر تكييف المحتوى لحظياً من المناهج المعتمدة.' 
                    : 'Ensuring equitable and adaptive learning tailored to every student\'s cognitive capacity.'}
                </p>
              </div>
            </div>

            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
              isDark ? 'bg-pink-950/20 border-pink-800/40' : 'bg-pink-50/80 border-pink-200'
            }`}>
              <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center font-black text-lg shrink-0 shadow-md">
                SDG 10
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white mb-1">
                  {isAr ? 'الحد من أوجه عدم المساواة (Reduced Inequalities)' : 'Reduced Inequalities'}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isAr 
                    ? 'دمج ذوي الإعاقات الحسية والحركية والذهنية في التعليم الجامعي بنفس كفاءة أقرانهم عبر أدوات الإتاحة الرقمية المتقدمة.' 
                    : 'Bridging educational gaps for learners with sensory, motor, and cognitive disabilities.'}
                </p>
              </div>
            </div>
          </div>

          {/* 4 Inclusion Pillars */}
          <div className="space-y-3">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {isAr ? 'ركائز الإتاحة والشمول الرقمي في منصة شغوف:' : 'SHAGHOOF Inclusive Education Pillars:'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pillar 1: Visual Accommodations */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                    <Eye className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {isAr ? 'إتاحة البصر وعسر القراءة (Visual & Dyslexia)' : 'Visual & Dyslexia'}
                  </h4>
                </div>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <li>✓ خط OpenDyslexic المتخصص لمنع انعكاس الحروف</li>
                  <li>✓ مسطرة تركيز السطر (Line Focus Ruler) لمتلازمة إرلن</li>
                  <li>✓ مصفوفة ألوان متقدمة لعمى الألوان (Protanopia / Tritanopia)</li>
                </ul>
              </div>

              {/* Pillar 2: Auditory & Speech */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                    <Ear className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {isAr ? 'إتاحة السمع ولغة الإشارة (Auditory & Sign)' : 'Auditory & Sign Language'}
                  </h4>
                </div>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <li>✓ مترجم لغة الإشارة المصرية التفاعلي (3D ESL Presenter)</li>
                  <li>✓ بودكاست صوتي ذكي بمذيعين بالعامية والفصحى</li>
                  <li>✓ تحويل الكلام إلى نص حي مع قارئات الشاشة</li>
                </ul>
              </div>

              {/* Pillar 3: Motor & Physical */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                    <Hand className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {isAr ? 'الإتاحة الحركية والتحكم (Motor & Navigation)' : 'Motor & Control Accessibility'}
                  </h4>
                </div>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <li>✓ محاكي النقر بالثبات (Dwell Click) للمشلولين حركياً</li>
                  <li>✓ تحكم كامل بالتصفح عبر الأوامر الصوتية (Speech Nav)</li>
                  <li>✓ لوحة تواصل تعزيزية وبديلة (AAC Board)</li>
                </ul>
              </div>

              {/* Pillar 4: Neurodivergence & ADHD */}
              <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/40 border-slate-700' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white">
                    {isAr ? 'فرط الحركة وتشتت الانتباه (ADHD & Zen)' : 'ADHD & Focus Accommodations'}
                  </h4>
                </div>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  <li>✓ وضع التركيز الصارم (Zen Mode) وإلغاء المشتتات</li>
                  <li>✓ مولد الأصوات البيئية المحفزة للتركيز (Rain & Coffee)</li>
                  <li>✓ كبسولات مهام تفاعلية دقيقة (Micro-Quests)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & Download Whitepaper Action */}
        <div className={`px-6 py-4 border-t flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-200 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Award className="w-4 h-4 text-teal-500" />
            <span>{isAr ? 'مستوفٍ لمعايير WCAG 2.1 AAA الدولية للوصول الرقمي' : 'Compliant with WCAG 2.1 AAA accessibility standard'}</span>
          </div>

          <button
            type="button"
            onClick={downloadWhitepaper}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-black shadow-md shadow-teal-500/20 hover:scale-105 active:scale-95 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isAr ? 'تحميل ورقة العمل البيضاء (Impact Whitepaper)' : 'Download Whitepaper'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
