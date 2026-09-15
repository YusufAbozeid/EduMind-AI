import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { getKinestheticData, getTopicType } from '../../services/topicContentService';
import { Sliders, Play, Activity, Gamepad2, Sparkles, Cpu, Clock, Zap, Gauge } from 'lucide-react';
import { WordwallModal } from '../integrations/WordwallModal';

export const KinestheticRenderer: React.FC = () => {
  const { addXP, language, themeMode, topics, activeTopicId } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const kinData = getKinestheticData(activeTopic);
  const topicType = getTopicType(activeTopic);

  const [isWordwallOpen, setIsWordwallOpen] = useState(false);
  
  // -------------------------------------------------------------
  // 1. CONCURRENCY BENCHMARK STATE
  // -------------------------------------------------------------
  const [workloadType, setWorkloadType] = useState<'io' | 'cpu'>('io');
  const [taskCount, setTaskCount] = useState<number>(10);
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkCompleted, setBenchmarkCompleted] = useState<boolean>(false);
  const [benchmarkResults, setBenchmarkResults] = useState<{
    syncTime: number;
    threadsTime: number;
    asyncTime: number;
    multiTime: number;
  }>({ syncTime: 5.0, threadsTime: 0.8, asyncTime: 0.5, multiTime: 0.6 });

  const runConcurrencyBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkCompleted(false);

    setTimeout(() => {
      if (workloadType === 'io') {
        // I/O bound: AsyncIO and Threads excel
        setBenchmarkResults({
          syncTime: Number((taskCount * 0.5).toFixed(2)),
          threadsTime: Number((0.4 + taskCount * 0.04).toFixed(2)),
          asyncTime: Number((0.25 + taskCount * 0.02).toFixed(2)),
          multiTime: Number((0.6 + taskCount * 0.03).toFixed(2)),
        });
      } else {
        // CPU bound: Multiprocessing wins, GIL hurts Threads
        setBenchmarkResults({
          syncTime: Number((taskCount * 0.4).toFixed(2)),
          threadsTime: Number((taskCount * 0.42).toFixed(2)), // GIL contention
          asyncTime: Number((taskCount * 0.45).toFixed(2)),   // Single thread blocking
          multiTime: Number((0.2 + (taskCount * 0.4) / 4).toFixed(2)), // 4 cores parallel
        });
      }

      setIsBenchmarking(false);
      setBenchmarkCompleted(true);
      addXP(25);
    }, 1200);
  };

  // -------------------------------------------------------------
  // 2. RAG CHUNKING SIMULATOR STATE
  // -------------------------------------------------------------
  const [chunkSize, setChunkSize] = useState<number>(500);
  const [chunkOverlap, setChunkOverlap] = useState<number>(100);
  const [cosineThreshold, setCosineThreshold] = useState<number>(0.75);

  // -------------------------------------------------------------
  // 3. NEURAL NETWORKS STATE (Default)
  // -------------------------------------------------------------
  const [learningRate, setLearningRate] = useState<number>(0.05);
  const [epochs, setEpochs] = useState<number>(20);
  const [activation, setActivation] = useState<string>('ReLU');
  const [completedTask, setCompletedTask] = useState<boolean>(false);

  const computedAccuracy = Math.min(
    99.2,
    Math.round((epochs * 3.2 + (learningRate < 0.1 ? 30 : 15) + (activation === 'ReLU' ? 15 : 5)) * 10) / 10
  );

  return (
    <div className="space-y-6">
      
      {/* Kinesthetic Header */}
      <div className={`border rounded-2xl p-5 flex items-center justify-between shadow-sm transition-colors ${
        isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isAr ? kinData.headerTitleAr : kinData.headerTitleEn}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? kinData.headerDescAr : kinData.headerDescEn}
            </p>
          </div>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
          {isAr ? kinData.badgeAr : kinData.badgeEn}
        </span>
      </div>

      {/* Wordwall Games Embedded Banner */}
      <div className={`border rounded-2xl p-5 flex items-center justify-between shadow-sm transition-colors ${
        isDark ? 'bg-gradient-to-r from-purple-950/20 via-card to-cyan-950/15 border-purple-900/40' : 'bg-gradient-to-r from-purple-50 via-white to-sky-50 border-purple-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className={`text-sm font-extrabold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>{isAr ? 'ألعاب Wordwall التفاعلية لموضوع المقرر' : 'Wordwall Games for this Topic'}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-bold border border-sky-200">
                Wordwall Embed
              </span>
            </h4>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              {isAr ? 'العب ألعاب مطابقة المفاهيم وعجلة الحظ التفاعلية لكسب +50 XP فوري' : 'Play interactive matching cards & spin wheels to earn +50 XP!'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsWordwallOpen(true)}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-xs hover:scale-105 transition shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAr ? 'فتح لعبة Wordwall (+50 XP)' : 'Play Wordwall Game (+50 XP)'}</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* 1. PYTHON CONCURRENCY BENCHMARK SIMULATOR                     */}
      {/* ============================================================= */}
      {topicType === 'concurrency' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Controls Column */}
          <div className={`border rounded-2xl p-5 space-y-5 shadow-sm transition-colors ${
            isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-bold text-purple-600 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Gauge className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'إعدادات محاكاة أداء التزامن (Benchmark Configuration)' : 'Benchmark Configuration'}</span>
            </h4>

            {/* Workload Type Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'نوع الحمل والعمليات (Workload Type):' : 'Workload Bottleneck:'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setWorkloadType('io')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                    workloadType === 'io'
                      ? 'bg-sky-500/15 border-sky-500 text-sky-600 dark:text-sky-400 shadow-sm'
                      : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-sky-500" />
                  <span>{isAr ? 'I/O-Bound (طلبات شبكة)' : 'I/O-Bound (Network)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWorkloadType('cpu')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-2 cursor-pointer ${
                    workloadType === 'cpu'
                      ? 'bg-[#FF4D2D]/15 border-[#FF4D2D] text-[#FF4D2D] shadow-sm'
                      : isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-[#FF4D2D]" />
                  <span>{isAr ? 'CPU-Bound (حسابات مكثفة)' : 'CPU-Bound (Heavy Math)'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                {workloadType === 'io' 
                  ? (isAr ? 'مثل تنزيل ملفات PDF أو استدعاء APIs، حيث يقضي الكود وقته في الانتظار.' : 'Simulates network requests or database waits.')
                  : (isAr ? 'مثل معالجة الصور والتشفير، حيث يعتمد الكود على المعالج وقفل الـ GIL.' : 'Simulates cryptographic hashing and matrix operations affected by GIL.')}
              </p>
            </div>

            {/* Task Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isAr ? 'عدد المهام المتزامنة:' : 'Concurrent Tasks:'}</span>
                <span className="text-purple-600 font-bold">{taskCount} {isAr ? 'مهمة' : 'tasks'}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={taskCount}
                onChange={(e) => setTaskCount(parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Run Button */}
            <button
              onClick={runConcurrencyBenchmark}
              disabled={isBenchmarking}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-[#FF4D2D] hover:from-purple-700 hover:to-[#e03e1c] text-white font-bold text-xs shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              {isBenchmarking ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>{isAr ? '⏳ جاري تشغيل اختبار الأداء الحركي...' : 'Running Benchmark...'}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isAr ? 'تشغيل المحاكاة العملية (+25 XP) 🚀' : 'Run Live Benchmark (+25 XP) 🚀'}</span>
                </>
              )}
            </button>
          </div>

          {/* Benchmark Results Display Column */}
          <div className={`border rounded-2xl p-5 space-y-4 shadow-sm transition-colors flex flex-col justify-between ${
            isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#FF4D2D]" />
                  <span>{isAr ? 'مقارنة أزمنة التنفيذ (Execution Times):' : 'Execution Times Comparison:'}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {benchmarkCompleted && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold border border-emerald-500/20">
                      {isAr ? '✓ اكتمل' : '✓ Completed'}
                    </span>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 font-mono font-bold">
                    {workloadType.toUpperCase()}
                  </span>
                </div>
              </h4>

              <div className="space-y-3 mt-4">
                {/* 1. Sync */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">1. Synchronous (تتابعي)</span>
                    <span className="font-mono font-bold text-red-500">{benchmarkResults.syncTime}s</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full transition-all duration-500" style={{ width: '100%' }} />
                  </div>
                </div>

                {/* 2. Threading */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">2. Threading (خيوط متعددة)</span>
                    <span className="font-mono font-bold text-sky-500">{benchmarkResults.threadsTime}s</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-sky-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (benchmarkResults.threadsTime / benchmarkResults.syncTime) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* 3. AsyncIO */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">3. AsyncIO (Event Loop)</span>
                    <span className="font-mono font-bold text-purple-500">{benchmarkResults.asyncTime}s</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-purple-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (benchmarkResults.asyncTime / benchmarkResults.syncTime) * 100)}%` }} 
                    />
                  </div>
                </div>

                {/* 4. Multiprocessing */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-600 dark:text-slate-400">4. Multiprocessing (توازي حقيقي)</span>
                    <span className="font-mono font-bold text-emerald-500">{benchmarkResults.multiTime}s</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, (benchmarkResults.multiTime / benchmarkResults.syncTime) * 100)}%` }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Analysis Insight Box */}
            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs">
              <p className="text-purple-700 dark:text-purple-300 font-semibold leading-relaxed">
                {workloadType === 'io'
                  ? (isAr 
                      ? `💡 النتيجة: في مهام الـ I/O حقق AsyncIO و Threading أسرع استجابة (${benchmarkResults.asyncTime}s) لأن الانتظار تم بالتوازي دون حجز المعالج!`
                      : `💡 Insight: In I/O workloads, AsyncIO and Threads deliver a 10x speedup by sharing wait states non-blockingly.`)
                  : (isAr
                      ? `💡 النتيجة: في مهام الـ CPU عانى Threading بسبب قفل الـ GIL، بينما اكتسح Multiprocessing (${benchmarkResults.multiTime}s) لأنه استغل كافة الأنوية!`
                      : `💡 Insight: In CPU workloads, the GIL serializes Threads, while Multiprocessing scales linearly across physical cores.`)}
              </p>
            </div>
          </div>

        </div>
      ) : topicType === 'rag' ? (
        /* ============================================================= */
        /* 2. RAG CHUNKING & COSINE SIMILARITY LAB                      */
        /* ============================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`border rounded-2xl p-5 space-y-5 shadow-sm transition-colors ${
            isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-bold text-purple-600 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'معايير تقطيع المستندات (Chunking Parameters)' : 'RAG Chunking Parameters'}</span>
            </h4>

            {/* Chunk Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isAr ? 'حجم المقطع (Chunk Size):' : 'Chunk Size:'}</span>
                <span className="text-sky-600 font-bold">{chunkSize} {isAr ? 'حرف' : 'chars'}</span>
              </div>
              <input
                type="range"
                min="200"
                max="1500"
                step="50"
                value={chunkSize}
                onChange={(e) => setChunkSize(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            {/* Overlap */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isAr ? 'نسبة التداخل (Chunk Overlap):' : 'Chunk Overlap:'}</span>
                <span className="text-purple-600 font-bold">{chunkOverlap} {isAr ? 'حرف' : 'chars'}</span>
              </div>
              <input
                type="range"
                min="20"
                max="300"
                step="20"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            {/* Cosine Threshold */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isAr ? 'عتبة التشابه الدلالي (Cosine Threshold):' : 'Cosine Similarity Threshold:'}</span>
                <span className="text-emerald-600 font-bold">{cosineThreshold}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="0.95"
                step="0.05"
                value={cosineThreshold}
                onChange={(e) => setCosineThreshold(parseFloat(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>
          </div>

          <div className={`border rounded-2xl p-5 space-y-4 shadow-sm transition-colors flex flex-col justify-between ${
            isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-3">
              {isAr ? 'مؤشرات كفاءة الاسترجاع في Weaviate:' : 'Retrieval Quality Metrics:'}
            </h4>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs flex justify-between items-center">
                <span>{isAr ? 'متوسط المقاطع المستخرجة لكل صفحة:' : 'Estimated Chunks per Page:'}</span>
                <span className="font-bold text-sky-600">{Math.round(2500 / (chunkSize - chunkOverlap))} Chunks</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs flex justify-between items-center">
                <span>{isAr ? 'دقة الاسترجاع الدلالي (Top-K Recall):' : 'Top-K Retrieval Precision:'}</span>
                <span className="font-bold text-emerald-600">{Math.min(98, Math.round(cosineThreshold * 115))}%</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-700 dark:text-purple-300">
              {isAr 
                ? 'الحجم 500 مع تداخل 100 يمثل المعيار الذهبي لمقررات الـ Moodle للحفاظ على الكود والمعادلات.'
                : 'A 500-char window with 100-char overlap offers the gold standard for university lecture materials.'}
            </div>
          </div>
        </div>
      ) : (
        /* ============================================================= */
        /* 3. DEFAULT NEURAL NETWORKS TUNING SLIDERS                     */
        /* ============================================================= */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`border rounded-2xl p-5 space-y-5 shadow-sm transition-colors ${
            isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <h4 className="text-xs font-bold text-purple-600 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Sliders className="w-4 h-4 text-purple-600" />
              <span>{isAr ? 'ضبط معاملات النموذج (Hyperparameters):' : 'Hyperparameters Panel:'}</span>
            </h4>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isAr ? 'معدل التعلم (Learning Rate α):' : 'Learning Rate (α):'}</span>
                <span className="text-purple-600 font-bold">{learningRate}</span>
              </div>
              <input
                type="range"
                min="0.001"
                max="0.2"
                step="0.005"
                value={learningRate}
                onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">{isAr ? 'عدد الدورات (Epochs Count):' : 'Training Epochs:'}</span>
                <span className="text-sky-600 font-bold">{epochs} {isAr ? 'دورة' : 'epochs'}</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="5"
                value={epochs}
                onChange={(e) => setEpochs(parseInt(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {isAr ? 'دالة التنشيط (Activation Function):' : 'Activation Function:'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['ReLU', 'Sigmoid', 'Tanh'].map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setActivation(act)}
                    className={`py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                      activation === act
                        ? 'bg-[#FF4D2D] text-white border-[#FF4D2D] shadow-sm'
                        : isDark ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`border rounded-2xl p-5 space-y-4 shadow-sm transition-colors flex flex-col justify-between ${
            isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div>
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 pb-3">
                {isAr ? 'مؤشرات الأداء التفاعلي:' : 'Performance Metrics:'}
              </h4>
              <div className="mt-4 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                <span className="text-2xl font-black text-purple-600">{computedAccuracy}%</span>
                <p className="text-xs text-slate-500 mt-1">{isAr ? 'دقة النموذج المحسوبة' : 'Calculated Model Accuracy'}</p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!completedTask) {
                  setCompletedTask(true);
                  addXP(20);
                }
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-sky-600 text-white font-bold text-xs shadow-md"
            >
              {isAr ? 'تأكيد المعاملات (+20 XP)' : 'Apply Hyperparameters (+20 XP)'}
            </button>
          </div>
        </div>
      )}

      {/* Wordwall Modal */}
      <WordwallModal
        isOpen={isWordwallOpen}
        onClose={() => setIsWordwallOpen(false)}
      />

    </div>
  );
};