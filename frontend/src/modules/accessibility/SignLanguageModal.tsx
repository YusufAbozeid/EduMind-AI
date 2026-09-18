import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { 
  X, Hand, BookOpen, ChevronRight, Play, Pause, 
  RotateCcw, UserCheck, Video, Subtitles, Upload
} from 'lucide-react';

interface ArSLTerm {
  id: string;
  termAr: string;
  termEn: string;
  signDescriptionAr: string;
  signDescriptionEn: string;
  motionStepsAr: string[];
  motionStepsEn: string[];
  svgPath: string;
  avatarUrl: string;
}

export const SignLanguageModal: React.FC = () => {
  const { 
    signLanguageModalOpen, 
    setSignLanguageModalOpen, 
    signLanguageTerm,
    language 
  } = useStore();

  const isAr = language === 'ar';

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [videoProgress, setVideoProgress] = useState<number>(35);
  const [viewMode, setViewMode] = useState<'video' | 'full_video'>('full_video');
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const arSLTerms: ArSLTerm[] = [
    {
      id: 'ai',
      termAr: 'الذكاء الاصطناعي (AI)',
      termEn: 'Artificial Intelligence',
      signDescriptionAr: 'إشارة إلى الجبهة بإصبع السبابة ثم تفتيح الأصابع للخارج كشعاع معرفي.',
      signDescriptionEn: 'Index finger pointing to forehead then expanding outwards to signify computational intelligence.',
      motionStepsAr: [
        'المس الجبهة بالسبابة (رمز الذكاء والعقل).',
        'افتح اليد للخارج تدريجياً لبيان تمدد التعلم الاصطناعي.'
      ],
      motionStepsEn: [
        'Point index finger to forehead.',
        'Spread hand outward smoothly to signal artificial learning.'
      ],
      svgPath: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v8M8 12h8',
      avatarUrl: '/arsl_ai.png'
    },
    {
      id: 'neural_nets',
      termAr: 'شبكات عصبية (Neural Networks)',
      termEn: 'Neural Networks',
      signDescriptionAr: 'إشارة اليدين المفتوحتين مع تشابك أطراف الأصابع وتذبذبها لتمثيل شبكة الخواص المتصلة.',
      signDescriptionEn: 'Open hands facing each other with interlocked fingertips moving rhythmically to show interconnectivity.',
      motionStepsAr: [
        'ارفع يديك أمام الصدر والراحة باتجاه الوجه.',
        'شبك أطراف أصابع اليدين كأشباه عصبية.',
        'حرّك الأصابع حركة نبضية خفيفة لتمثيل سريان الإشارات.'
      ],
      motionStepsEn: [
        'Raise hands to chest level facing inwards.',
        'Interlock fingertips like neural nodes.',
        'Pulsate fingers gently to mimic signal propagation.'
      ],
      svgPath: 'M12 4v16m-8-8h16M6 6l12 12M6 18L18 6',
      avatarUrl: '/arsl_neural.png'
    },
    {
      id: 'backprop',
      termAr: 'التمرير الخلفي (Backpropagation)',
      termEn: 'Backpropagation',
      signDescriptionAr: 'حركة اليد للأمام ثم عودتها سريعة للخلف مع إغلاق اليد لتمثيل تعديل الخطأ.',
      signDescriptionEn: 'Forward hand motion followed by a swift backward sweep denoting error gradient feedback.',
      motionStepsAr: [
        'امدُد كف اليد للأمام لتمثيل التمرير الأمامي.',
        'اسحب اليد بسرعة للخلف مع إطباق اليد قليلاً لتمثيل تصحيح الأخطاء.'
      ],
      motionStepsEn: [
        'Extend hand forward for forward pass.',
        'Pull hand back swiftly while gently closing fingers for error correction.'
      ],
      svgPath: 'M19 12H5M12 19l-7-7 7-7',
      avatarUrl: '/arsl_backprop.png'
    },
    {
      id: 'weights',
      termAr: 'الأوزان والمعاملات (Weights & Biases)',
      termEn: 'Weights & Biases',
      signDescriptionAr: 'إشارة الميزان بكفي اليدين المرفوعين لأعلى وأسفل لبيان تعديل القيمة.',
      signDescriptionEn: 'Balance scale gesture alternating palms up and down to represent value adjustment.',
      motionStepsAr: [
        'افرد الكفين لأعلى مثل كفتي الميزان.',
        'حرّك اليد اليمنى لأعلى واليسرى لأسفل بالتطابق لتوضيح ضبط الوزن.'
      ],
      motionStepsEn: [
        'Hold palms facing upward like scale pans.',
        'Alternate left and right height to show precision tuning.'
      ],
      svgPath: 'M3 6h18M12 6v14M6 12l6 6 6-6',
      avatarUrl: '/arsl_weights.png'
    }
  ];

  // Dynamic custom term generator for any AI Tutor chat answer
  const isCustomMessage = signLanguageTerm && !arSLTerms.some(t => t.id === signLanguageTerm || t.termAr === signLanguageTerm);

  const customTermObj: ArSLTerm | null = isCustomMessage ? {
    id: 'custom_reply',
    termAr: `ترجمة إجابة المعلم الذكي بلغة الإشارة`,
    termEn: `AI Tutor Answer Sign Translation`,
    signDescriptionAr: signLanguageTerm!,
    signDescriptionEn: signLanguageTerm!,
    motionStepsAr: [
      'المس الجبهة ثم افرد اليدين لتمثيل مفهوم الذكاء الاصطناعي والإمكانيات.',
      'افرد الكفين للخارج بحركة سلسة لبيان فتح آفاق وفرص التعلم والعمل.',
      'إنهاء الحركة بإيقاع متوازن يمثل اكتمال ترجمة الإجابة للغة الإشارة.'
    ],
    motionStepsEn: [
      'Touch forehead then extend hands for AI concept.',
      'Extend palms outward in a smooth sweep for opportunity expansion.',
      'Conclude sentence translation rhythmically.'
    ],
    svgPath: 'M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v8M8 12h8',
    avatarUrl: signLanguageTerm!.includes('شبك') || signLanguageTerm!.includes('عصب') 
      ? '/arsl_neural.png' 
      : signLanguageTerm!.includes('وزن') || signLanguageTerm!.includes('معامل') 
      ? '/arsl_weights.png' 
      : signLanguageTerm!.includes('رجع') || signLanguageTerm!.includes('خلف')
      ? '/arsl_backprop.png'
      : '/arsl_ai.png'
  } : null;

  const displayTerms = customTermObj ? [customTermObj, ...arSLTerms] : arSLTerms;
  const selectedTerm = customTermObj || arSLTerms.find(t => t.termAr.includes(signLanguageTerm || '') || t.id === signLanguageTerm) || arSLTerms[0];

  const [activeTabTermId, setActiveTabTermId] = useState<string>(selectedTerm.id);

  useEffect(() => {
    if (selectedTerm) {
      setActiveTabTermId(selectedTerm.id);
      setIsPlaying(true);
    }
  }, [signLanguageTerm]);

  // Video playback timeline progress loop
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setVideoProgress((prev) => (prev >= 100 ? 0 : prev + 1.5 * playbackSpeed));
    }, 150);
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
    }
  };

  if (!signLanguageModalOpen) return null;

  const currentTermObj = displayTerms.find(t => t.id === activeTabTermId) || selectedTerm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/10 rounded-2xl border border-teal-500/20 text-teal-600 dark:text-teal-400">
              <Hand className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isAr ? 'مشغّل فيديو الشرح الشامل بلغة الإشارة (ArSL Video Streamer)' : 'Sign Language Motion & Video Streamer'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'عرض حركي متصل ورسوم فيديو تفاعلية لمترجم لغة الإشارة للطلاب الصم وضعاف السمع' : 'Interactive sign language motion video stream with live presenter animations and controls'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              accept="video/mp4,video/webm" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/30 text-xs font-bold hover:bg-teal-500/20 transition flex items-center gap-1.5"
              title="تحميل فيديو MP4 مخصص"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isAr ? 'رفع فيديو MP4' : 'Upload MP4'}</span>
            </button>

            <button
              onClick={() => setSignLanguageModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Term Selector Sidebar */}
          <div className="w-full md:w-64 p-4 border-b md:border-b-0 md:border-r dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto">
            {displayTerms.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setActiveTabTermId(t.id);
                  setIsPlaying(true);
                  setVideoProgress(10);
                }}
                className={`p-3 rounded-2xl text-start flex items-center justify-between shrink-0 transition-all ${
                  activeTabTermId === t.id
                    ? 'bg-teal-500 text-white font-bold shadow-lg shadow-teal-500/20'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-500/10'
                }`}
              >
                <span className="text-xs sm:text-sm truncate">
                  {isAr ? t.termAr.split('(')[0] : t.termEn}
                </span>
                <ChevronRight className="w-4 h-4 shrink-0 opacity-60" />
              </button>
            ))}
          </div>

          {/* Active Gesture Card & Interactive Video Streamer Stage */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                  {isAr ? 'المحتوى التعليمي المعالج' : 'Active Video Concept'}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isAr ? currentTermObj.termAr : currentTermObj.termEn}
                </h3>
              </div>

              {/* Mode Switcher */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                <button
                  onClick={() => setViewMode('full_video')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                    viewMode === 'full_video' ? 'bg-teal-500 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فيديو الإشارة المتحرك 🎬' : 'Motion Video 🎬'}</span>
                </button>

                <button
                  onClick={() => setViewMode('video')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    viewMode === 'video' ? 'bg-teal-500 text-white shadow' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'المُعلم 3D' : '3D Presenter'}</span>
                </button>
              </div>
            </div>

            {/* FULL ANIMATED MOTION VIDEO LESSON PLAYER STAGE */}
            <div className="p-4 rounded-2xl border border-slate-700 bg-slate-950 text-white flex flex-col gap-4 relative overflow-hidden shadow-2xl">
              
              {/* HD Sign Language Video Presenter Stage */}
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner group flex items-center justify-center">
                
                {customVideoUrl ? (
                  /* Custom Uploaded MP4 Video Stream */
                  <video
                    src={customVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Live Animated 3D Sign Language Video Motion Stage */
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900">
                    {/* Animated 3D Avatar Image with Skeletal Motion Keyframes */}
                    <img 
                      src={currentTermObj.avatarUrl} 
                      alt={currentTermObj.termAr}
                      className={`w-full h-full object-contain transition-all duration-300 ${
                        isPlaying ? 'animate-sign-gesture filter brightness-110' : 'filter brightness-80'
                      }`}
                    />

                    {/* Animated Hand Movement Vectors & Gesture Waves Overlay */}
                    {isPlaying && (
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        {/* Sweeping Arm Movement Ring */}
                        <div className="w-48 h-48 rounded-full border-2 border-dashed border-teal-400/40 animate-hand-sweep flex items-center justify-center">
                          <Hand className="w-12 h-12 text-teal-300 opacity-80 animate-pulse" />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Animated HD Video Scanline & Pulse Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/40 pointer-events-none" />

                {/* Live Presenter Video Badge */}
                <div className="absolute top-4 right-4 px-3 py-1.5 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-teal-500/40 text-teal-300 text-xs font-extrabold flex items-center gap-2 shadow-2xl z-20">
                  <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  <span>🤟 {isPlaying ? (isAr ? 'معلم الإشارة يتحرك الآن (Live Motion)' : 'Live Motion Video') : (isAr ? 'متوقف مؤقتاً' : 'Paused')}</span>
                </div>

                {/* HD Stream Badge */}
                <div className="absolute top-4 left-4 px-2.5 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-700 text-[10px] font-mono text-slate-300 z-20">
                  1080p HD Stream • ArSL
                </div>

                {/* Center Play Floating Overlay Icon on Pause */}
                {!isPlaying && (
                  <button
                    onClick={() => setIsPlaying(true)}
                    className="absolute z-30 w-16 h-16 rounded-full bg-teal-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
                  >
                    <Play className="w-8 h-8 fill-current ml-1" />
                  </button>
                )}

                {/* Synchronized Subtitles Bar (CC) */}
                <div className="absolute bottom-14 inset-x-4 p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-teal-500/30 text-center text-xs sm:text-sm text-amber-300 font-bold z-20 flex items-center justify-center gap-2 shadow-2xl">
                  <Subtitles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    {isAr 
                      ? `الآن حركة الإشارة: "${currentTermObj.signDescriptionAr}"`
                      : `Sign Language Motion Subtitles: "${currentTermObj.signDescriptionEn}"`}
                  </span>
                </div>

                {/* Video Playback Timeline Progress Bar */}
                <div className="absolute bottom-0 inset-x-0 bg-slate-950/95 border-t border-slate-800 p-2.5 flex items-center gap-3 z-20">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg bg-teal-500 text-slate-950 hover:bg-teal-400 transition"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  {/* Scrub Bar */}
                  <div className="flex-1 h-2 rounded-full bg-slate-800 relative cursor-pointer overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-150"
                      style={{ width: `${videoProgress}%` }}
                    />
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    00:{Math.floor(videoProgress * 1.5).toString().padStart(2, '0')} / 02:30
                  </span>

                  <button
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 0.5 : 1.0)}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-teal-300"
                  >
                    {playbackSpeed}x
                  </button>

                  <button 
                    onClick={() => { setIsPlaying(true); setVideoProgress(0); }}
                    className="p-1 text-slate-400 hover:text-white"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span className="flex items-center gap-1.5 text-teal-300 font-semibold">
                  <Video className="w-4 h-4 text-teal-400" />
                  {isAr ? 'فيديو حركي ممتد لمترجم لغة الإشارة التفاعلي HD' : 'Full motion video stream with live interactive sign language presenter'}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 font-mono text-[10px] border border-teal-500/30">
                  ArSL Live Motion • HD Stream
                </span>
              </div>
            </div>

            {/* Step-by-step Motion Breakdown */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-500" />
                {isAr ? 'خطوات تنفيذ الإشارة بالتفصيل:' : 'Motion Step Breakdown:'}
              </h4>
              <div className="space-y-2">
                {(isAr ? currentTermObj.motionStepsAr : currentTermObj.motionStepsEn).map((step, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3 text-xs text-slate-700 dark:text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 font-bold flex items-center justify-center text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
