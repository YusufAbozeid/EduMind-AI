import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import type { WhiteNoiseType, ColorBlindMode } from '../store/useStore';
import { 
  X, 
  Eye, 
  Volume2, 
  CloudRain, 
  Coffee, 
  Radio, 
  Zap,
  Sliders,
  Palette,
  MessageSquare,
  Hand,
  Calendar,
  Mic,
  Type
} from 'lucide-react';

interface AccessibilityToolbarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ isOpen, onClose }) => {
  const [fontSizeScale, setFontSizeScale] = useState<number>(100);

  const {
    language,
    colorBlindMode,
    setColorBlindMode,
    toggleBrailleMode,
    speechNavActive,
    toggleSpeechNav,
    dwellClickEnabled,
    toggleDwellClick,
    setAACBoardOpen,
    setSignLanguageModalOpen,
    setVisualScheduleOpen,
    openDyslexicEnabled,
    toggleOpenDyslexic,
    lineFocusEnabled,
    toggleLineFocus,
    bulletReformatEnabled,
    toggleBulletReformat,
    microQuestMode,
    toggleMicroQuestMode,
    whiteNoiseType,
    setWhiteNoiseType,
  } = useStore();

  const isAr = language === 'ar';

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#161C2C] border-l border-slate-700 h-full p-6 overflow-y-auto flex flex-col justify-between shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {isAr ? 'أدوات القراءة والتمكين الشامل' : 'Inclusive Accommodations Suite'}
                </h2>
                <p className="text-xs text-slate-400">
                  {isAr ? 'أدوات التيسير البصري والحركي والتواصل الشامل' : 'Visual, motor, speech & communication learning accommodations'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Color & Vision Accommodations */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'الرؤية والألوان والتباين (Vision & Color)' : 'Vision & Contrast Suite'}</span>
            </h3>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2 mb-3">
              <span className="text-xs font-bold text-white block">
                {isAr ? 'أنماط التباين وفلاتر عمى الألوان' : 'Contrast & Color Blind Filters'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'none', labelAr: 'طبيعي', labelEn: 'Standard' },
                  { id: 'high-contrast', labelAr: 'تباين عالٍ AAA', labelEn: 'AAA Contrast' },
                  { id: 'protanopia', labelAr: 'عمى الأحمر (Protanopia)', labelEn: 'Protanopia' },
                  { id: 'deuteranopia', labelAr: 'عمى الأخضر (Deuteranopia)', labelEn: 'Deuteranopia' },
                  { id: 'tritanopia', labelAr: 'عمى الأزرق (Tritanopia)', labelEn: 'Tritanopia' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setColorBlindMode(mode.id as ColorBlindMode)}
                    className={`p-2 rounded-lg text-xs font-bold border transition text-start ${
                      colorBlindMode === mode.id
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isAr ? mode.labelAr : mode.labelEn}
                  </button>
                ))}
              </div>
            </div>

            {/* Braille Reader Launcher */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
              <div>
                <span className="text-xs font-bold text-white block">
                  {isAr ? 'عرض برايل الميسر (Braille Reader)' : 'Braille Display Reader View'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isAr ? 'تحويل الدرس لنص موحد أحادي لقارئات الشاشة وأجهزة برايل' : 'Monospace formatted output optimized for refreshable Braille displays'}
                </span>
              </div>
              <button
                onClick={toggleBrailleMode}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-xs font-bold hover:bg-amber-500/30 transition-colors flex items-center gap-1.5"
              >
                <Type className="w-4 h-4" />
                <span>{isAr ? 'تفتح العرض' : 'Open Braille'}</span>
              </button>
            </div>
          </div>

          {/* Section 2: Speech & Motor Navigation */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Mic className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'التنقل الحركي والصوتي (Motor & Speech)' : 'Motor & Speech Controls'}</span>
            </h3>

            <div className="space-y-3">
              {/* Voice Navigation */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'التحكم بالأوامر الصوتية (Voice Commands)' : 'Hands-Free Voice Commands'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'إصدار أوامر بالصوت للتنقل بدون استخدام الماوس' : 'Execute navigation actions using microphone voice recognition'}
                  </span>
                </div>
                <button
                  onClick={toggleSpeechNav}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    speechNavActive ? 'bg-teal-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    speechNavActive ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Dwell Click Eye-Gaze Simulator */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'النقر التلقائي بتركيز النظر (Eye-Gaze Dwell Click)' : 'Eye-Gaze Dwell-Click Timer'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'النقر التلقائي بعد التوقف بالماوس/النظر على الأزرار لمدة ثانية' : 'Auto-click interactive elements upon dwelling cursor focus for 1.2s'}
                  </span>
                </div>
                <button
                  onClick={toggleDwellClick}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    dwellClickEnabled ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-slate-900 transition-transform ${
                    dwellClickEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 3: AAC & Predictability Modals */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'التواصل والتنبؤ (AAC & Predictability)' : 'AAC Communication & Schedule'}</span>
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => { setAACBoardOpen(true); onClose(); }}
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 flex flex-col items-center gap-2 text-xs font-bold transition-all"
              >
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <span className="text-center">{isAr ? 'لوحة الرموز AAC' : 'AAC Board'}</span>
              </button>

              <button
                onClick={() => { setSignLanguageModalOpen(true); onClose(); }}
                className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-teal-300 flex flex-col items-center gap-2 text-xs font-bold transition-all"
              >
                <Hand className="w-5 h-5 text-teal-400" />
                <span className="text-center">{isAr ? 'لغة الإشارة ArSL' : 'Sign Helper'}</span>
              </button>

              <button
                onClick={() => { setVisualScheduleOpen(true); onClose(); }}
                className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 flex flex-col items-center gap-2 text-xs font-bold transition-all"
              >
                <Calendar className="w-5 h-5 text-indigo-400" />
                <span className="text-center">{isAr ? 'الجدول البصري' : 'Schedule'}</span>
              </button>
            </div>
          </div>

          {/* Section 4: Reading & Dyslexia Assistance */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-amber-300" />
              <span>{isAr ? 'أدوات تيسير تتبع الكلمات (Dyslexia Suite)' : 'Reading Assistance Suite'}</span>
            </h3>
            
            <div className="space-y-3">
              {/* OpenDyslexic Font */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'خط تيسير تتبع الكلمات (OpenDyslexic Font)' : 'OpenDyslexic Enhanced Font'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'تفعيل خط مصمم بقواعد عريضة لتسهيل تتبع الحروف وقراءتها' : 'Load heavy-weighted baseline font designed for readable line tracking'}
                  </span>
                </div>
                <button
                  onClick={toggleOpenDyslexic}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    openDyslexicEnabled ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    openDyslexicEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Line Focus Reading Ruler */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'مسطرة التركيز الموجه (Line Focus Ruler)' : 'Line Focus Reading Ruler'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'تظليل سطر واحد متتبع للمؤشر لزيادة التركيز وتقليل تشتت العين' : 'Highlight a single active reading line following cursor navigation'}
                  </span>
                </div>
                <button
                  onClick={toggleLineFocus}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    lineFocusEnabled ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    lineFocusEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* Bullet Reformatter */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'تنسيق الفقرات إلى نقاط (Bullet Reformatter)' : 'Bullet Reformatter'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'تحويل الفقرات الكثيفة إلى نقاط قصيرة لتسهيل القراءة' : 'Convert lengthy prose into short digestible bullet lists'}
                  </span>
                </div>
                <button
                  onClick={toggleBulletReformat}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    bulletReformatEnabled ? 'bg-sky-500' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    bulletReformatEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section 5: Focus & Ambient Sound */}
          <div className="mb-6">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'أدوات التركيز والصوت المحيط' : 'Focus & Ambient Sound Suite'}</span>
            </h3>

            <div className="space-y-3">
              {/* Micro-Quest Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div>
                  <span className="text-xs font-bold text-white block">
                    {isAr ? 'جلسات التركيز المصغرة 3 دقائق (Micro-Quest Mode)' : '3-Min Micro-Quest Mode'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'تقسيم المحاضرة لشرائح 3 دقائق مع حلقة وقت محفزة' : 'Chunk lessons into 3-minute micro steps with timer rings'}
                  </span>
                </div>
                <button
                  onClick={toggleMicroQuestMode}
                  className={`w-12 h-6 rounded-full transition-colors relative p-1 ${
                    microQuestMode ? 'bg-amber-400' : 'bg-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-slate-900 transition-transform ${
                    microQuestMode ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </button>
              </div>

              {/* White Noise Ambient Generator */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-xs font-bold text-white block mb-2">
                  {isAr ? 'مولد الأصوات المحيطية للتركيز (Ambient Sound Generator)' : 'Ambient Sound Generator'}
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'off', label: isAr ? 'إيقاف' : 'Off', icon: Volume2 },
                    { id: 'rain', label: isAr ? 'مطر' : 'Rain', icon: CloudRain },
                    { id: 'coffee', label: isAr ? 'كافيه' : 'Coffee', icon: Coffee },
                    { id: 'whitenoise', label: isAr ? 'ضوضاء' : 'Noise', icon: Radio },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = whiteNoiseType === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setWhiteNoiseType(item.id as WhiteNoiseType)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg text-[11px] font-bold border transition ${
                          isActive
                            ? 'bg-amber-500/30 border-amber-500 text-amber-300'
                            : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Scaling Slider */}
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="flex justify-between text-xs font-bold text-white mb-2">
                  <span>{isAr ? 'حجم الخط والنصوص:' : 'Text Scale Factor:'}</span>
                  <span className="text-amber-300">{fontSizeScale}%</span>
                </div>
                <input
                  type="range"
                  min="90"
                  max="140"
                  step="5"
                  value={fontSizeScale}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFontSizeScale(val);
                    document.documentElement.style.fontSize = `${val}%`;
                  }}
                  className="w-full accent-sky-400 cursor-pointer"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            {isAr ? 'تتم حفظ وتطبيق كافة إعدادات التيسير الشامل تلقائياً لحسابك' : 'All inclusive accommodation preferences are saved automatically'}
          </p>
        </div>

      </div>
    </div>
  );
};
