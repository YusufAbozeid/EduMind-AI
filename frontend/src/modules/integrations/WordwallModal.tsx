import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Gamepad2, X, Sparkles, Trophy, CheckCircle2, Link, Disc, 
  AlertCircle, Heart, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw
} from 'lucide-react';
import {
  TOP_15_WORDWALL_TEMPLATES,
  getWordwallGameData,
  getUniqueBatchOfQuestions,
  type WordwallGameTemplate,
  type WordwallQuizQuestion
} from '../../services/wordwallDataService';

export type { WordwallGameTemplate };

interface WordwallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WordwallModal: React.FC<WordwallModalProps> = ({ isOpen, onClose }) => {
  const { activeTopicId, topics, addXP, language } = useStore();
  const isAr = language === 'ar';
  
  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const currentData = useMemo(() => getWordwallGameData(activeTopic), [activeTopic]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('gameshow_quiz');
  const [gameUrl, setGameUrl] = useState<string | null>(null);
  const [inputUrl, setInputUrl] = useState<string>('');
  const [gameCompleted, setGameCompleted] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Common Gameplay State
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [tfIndex, setTfIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // 10-Question Non-Repeating Batch State
  const [seenQuestionIds, setSeenQuestionIds] = useState<string[]>([]);
  const [currentBatch, setCurrentBatch] = useState<WordwallQuizQuestion[]>([]);
  const [showMilestoneDialog, setShowMilestoneDialog] = useState<boolean>(false);
  const [batchCount, setBatchCount] = useState<number>(1);

  // Match-up Round State (Supports multiple 4-pair rounds)
  const [matchRound, setMatchRound] = useState<number>(0);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);

  // Question Indices for arcade templates
  const [moleQIndex, setMoleQIndex] = useState<number>(0);
  const [airplaneQIndex, setAirplaneQIndex] = useState<number>(0);
  const [balloonQIndex, setBalloonQIndex] = useState<number>(0);

  // Wheel State
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);

  // Flashcards State
  const [cardRevealed, setCardRevealed] = useState<boolean>(false);
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);

  // Anagram State
  const [anagramBuilt, setAnagramBuilt] = useState<string[]>([]);
  const [anagramIndex, setAnagramIndex] = useState<number>(0);

  // Missing Word State
  const [missingWordIndex, setMissingWordIndex] = useState<number>(0);

  // Group Sort State
  const [placedGroupItems, setPlacedGroupItems] = useState<Record<number, 1 | 2>>({});

  // Rank Order State
  const [userRankSteps, setUserRankSteps] = useState<{ id: number; textAr: string; textEn: string; correctOrder: number }[]>([]);
  const [rankValidated, setRankValidated] = useState<boolean>(false);

  // Balloon Pop State
  const [poppedBalloons, setPoppedBalloons] = useState<number[]>([]);

  // Maze Chase State
  const [mazeSelectedDoor, setMazeSelectedDoor] = useState<number | null>(null);

  const currentTemplate = TOP_15_WORDWALL_TEMPLATES.find(t => t.id === selectedTemplateId) || TOP_15_WORDWALL_TEMPLATES[0];

  // Match-up current round pairs
  const activeMatchPairs = useMemo(() => {
    const start = matchRound * 4;
    const slice = currentData.matchPairs.slice(start, start + 4);
    return slice.length > 0 ? slice : currentData.matchPairs.slice(0, 4);
  }, [currentData, matchRound]);

  const hasMoreMatchRounds = useMemo(() => {
    return (matchRound + 1) * 4 < currentData.matchPairs.length;
  }, [currentData, matchRound]);

  // Anagram current word
  const anagramPool = useMemo(() => {
    return currentData.anagramTerms && currentData.anagramTerms.length > 0
      ? currentData.anagramTerms
      : [currentData.anagramTerm];
  }, [currentData]);
  const activeAnagram = anagramPool[anagramIndex % anagramPool.length] || 'ATTENTION';

  // Missing word current sentence
  const missingWordPool = useMemo(() => {
    return currentData.missingWordSentences && currentData.missingWordSentences.length > 0
      ? currentData.missingWordSentences
      : [currentData.missingWordSentence];
  }, [currentData]);
  const activeMissingWord = missingWordPool[missingWordIndex % missingWordPool.length] || currentData.missingWordSentence;

  // Load 10 unique non-repeating questions on mount or topic change
  useEffect(() => {
    const batchRes = getUniqueBatchOfQuestions(activeTopic, seenQuestionIds, 10);
    setCurrentBatch(batchRes.questions);
    setCurrentQIndex(0);
    setTfIndex(0);
    setSelectedOption(null);
    setShowMilestoneDialog(false);
  }, [activeTopicId]);

  const activeQuizBatch = useMemo(() => {
    return currentBatch.length > 0 ? currentBatch : currentData.quizQuestions.slice(0, 10);
  }, [currentBatch, currentData]);

  // Reset gameplay state when template or topic changes
  useEffect(() => {
    setScore(0);
    setLives(3);
    setCurrentQIndex(0);
    setTfIndex(0);
    setSelectedOption(null);
    setMatchedPairs([]);
    setSelectedTerm(null);
    setMatchRound(0);
    setWheelRotation(0);
    setIsSpinning(false);
    setCardRevealed(false);
    setFlashcardIndex(0);
    setAnagramBuilt([]);
    setAnagramIndex(0);
    setMissingWordIndex(0);
    setMoleQIndex(0);
    setAirplaneQIndex(0);
    setBalloonQIndex(0);
    setPlacedGroupItems({});
    setUserRankSteps([...currentData.rankSteps].sort(() => Math.random() - 0.5));
    setRankValidated(false);
    setPoppedBalloons([]);
    setMazeSelectedDoor(null);
    setGameCompleted(false);
    setFeedbackMsg(null);
  }, [selectedTemplateId, activeTopicId, currentData]);

  const handleClaimXP = () => {
    if (!gameCompleted) {
      setGameCompleted(true);
      addXP(50);
    }
  };

  const handleNextTemplate = () => {
    const currentIdx = TOP_15_WORDWALL_TEMPLATES.findIndex(t => t.id === selectedTemplateId);
    const nextTmpl = TOP_15_WORDWALL_TEMPLATES[(currentIdx + 1) % TOP_15_WORDWALL_TEMPLATES.length];
    setSelectedTemplateId(nextTmpl.id);
  };

  const handleLoadCustomUrl = (urlToLoad?: string) => {
    const raw = urlToLoad || inputUrl;
    if (!raw.trim()) return;
    let cleanEmbed = raw.trim();
    if (cleanEmbed.includes('wordwall.net/resource/')) {
      cleanEmbed = cleanEmbed.replace('/resource/', '/embed/');
    } else if (cleanEmbed.includes('wordwall.net/play/')) {
      cleanEmbed = cleanEmbed.replace('/play/', '/embed/');
    }
    setGameUrl(cleanEmbed);
  };

  const moveRankStep = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= userRankSteps.length) return;
    const updated = [...userRankSteps];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setUserRankSteps(updated);
    setRankValidated(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      <div dir={isAr ? "rtl" : "ltr"} className={`w-full max-w-5xl bg-card border border-accent-purple/50 rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto my-auto ${isAr ? "text-right font-sans" : "text-left"}`}>
        {/* Milestone Dialog (10-Questions Checkpoint) */}
        {showMilestoneDialog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-slate-950 border border-purple-500/40 rounded-3xl p-6 max-w-lg w-full text-center space-y-4 shadow-2xl shadow-purple-900/30">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 via-purple-500 to-emerald-400 flex items-center justify-center text-3xl shadow-xl shadow-purple-500/30 animate-bounce">
                🎯
              </div>
              <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-black text-white">
                  {isAr ? `🎉 أحسنت! أنهيت 10 أسئلة بنجاح (المحطة ${batchCount})!` : `Milestone! Set #${batchCount} (10 Questions) Completed!`}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr
                    ? `أجبت على 10 أسئلة تخصصية غير مكررة في "${activeTopic.titleAr}". نقاطك الحالية: ${score} نقطة.`
                    : `You completed 10 non-repeating specialized questions on "${activeTopic.titleEn}". Current Score: ${score} pts.`}
                </p>
              </div>

              {/* Stats Badges */}
              <div className="flex items-center justify-center gap-2.5 py-1">
                <div className="px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-1.5">
                  <span>🎯</span>
                  <span>{isAr ? `الأسئلة المجابة: ${batchCount * 10}` : `Answered: ${batchCount * 10}`}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? `النقاط: ${score} XP` : `Score: ${score} XP`}</span>
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-current text-rose-400" />
                  <span>{lives} {isAr ? "قلوب متبقية" : "lives"}</span>
                </div>
              </div>

              {/* The Crucial Question Requested by User */}
              <div className="p-3.5 bg-slate-900/90 border border-amber-500/40 rounded-2xl text-amber-200 text-xs sm:text-sm font-extrabold shadow-inner leading-relaxed">
                {isAr 
                  ? "❓ هل ترغب في المتابعة لـ 10 أسئلة جديدة وغير مكررة أم إنهاء النشاط وحفظ نقاطك؟"
                  : "❓ Would you like to continue for 10 new, non-repeating questions or finish and save your score?"}
              </div>

              {/* Milestone Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    const allBatchIds = activeQuizBatch.map(q => q.id);
                    const updatedSeen = Array.from(new Set([...seenQuestionIds, ...allBatchIds]));
                    setSeenQuestionIds(updatedSeen);
                    const nextBatchRes = getUniqueBatchOfQuestions(activeTopic, updatedSeen, 10);
                    setCurrentBatch(nextBatchRes.questions);
                    setBatchCount(prev => prev + 1);
                    setCurrentQIndex(0);
    setTfIndex(0);
                    setSelectedOption(null);
                    setShowMilestoneDialog(false);
                    setFeedbackMsg({
                      text: isAr ? "🚀 تم تجهيز 10 أسئلة جديدة وحصرية غير مكررة نهائياً! بالتوفيق 🌟" : "Loaded 10 brand-new unique questions with zero repeats!",
                      type: "success"
                    });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-cyan-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500 text-white font-black text-xs shadow-xl hover:scale-105 transition flex items-center justify-center gap-2"
                >
                  <span>{isAr ? "🚀 نعم، أريد المتابعة (10 أسئلة جديدة غير مكررة)" : "🚀 Yes, Continue (10 New Questions)"}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </button>

                <button
                  onClick={() => {
                    setShowMilestoneDialog(false);
                    handleClaimXP();
                    setGameCompleted(true);
                    setFeedbackMsg({
                      text: isAr ? "🏆 تم حفظ نقاطك وإنجازك بنجاح! أحسنت صنعاً يا بطل!" : "Saved all achievements and XP successfully!",
                      type: "success"
                    });
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <span>{isAr ? "🛑 اكتفيت بهذا القدر (حفظ النقاط)" : "🛑 Finish & Save XP"}</span>
                  <Trophy className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-accent-purple via-sky-500 to-accent-cyan flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Gamepad2 className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white">
                  {isAr ? 'أشهر ألعاب Wordwall التفاعلية (Wordwall Games Suite)' : 'Wordwall Games Suite'}
                </h3>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-sky-300 font-bold border border-purple-500/40">
                  🎯 {isAr ? `الموضوع النشط: ${activeTopic.titleAr}` : `Active Topic: ${activeTopic.titleEn}`}
                </span>
                <button
                  onClick={() => {
                    const allBatchIds = activeQuizBatch.map(q => q.id);
                    const updatedSeen = Array.from(new Set([...seenQuestionIds, ...allBatchIds]));
                    setSeenQuestionIds(updatedSeen);
                    const nextBatchRes = getUniqueBatchOfQuestions(activeTopic, updatedSeen, 10);
                    setCurrentBatch(nextBatchRes.questions);
                    setBatchCount(prev => prev + 1);
                    setCurrentQIndex(0);
                    setMoleQIndex(0);
                    setAirplaneQIndex(0);
                    setBalloonQIndex(0);
                    setTfIndex(0);
                    setSelectedOption(null);
                    setFeedbackMsg({
                      text: isAr ? '✨ تم استدعاء 10 أسئلة جديدة وحصرية غير مكررة بنجاح!' : 'Loaded 10 brand-new unique questions!',
                      type: 'success'
                    });
                  }}
                  title={isAr ? 'توليد 10 أسئلة جديدة فوراً من بنك الأسئلة' : 'Generate 10 new questions now'}
                  className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[10px] border border-cyan-500/40 flex items-center gap-1 transition"
                >
                  <span>🔄</span>
                  <span>{isAr ? '10 أسئلة جديدة فوراً' : '10 New Questions'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400">
                {isAr ? 'تم ضبط محركات اللعب وإتاحة الإجابات الصحيحة والخاطئة مع حساب النقاط والقلوب والجولات المتتالية فورياً' : 'All Wordwall templates are fully tuned with score tracking, hearts system, and continuous rounds'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wordwall Game Templates Selector Bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
              {isAr ? '📋 اختر لعبة تفاعلية من القائمة:' : '📋 Select Game from Wordwall Suite:'}
            </span>
            <span className="text-[11px] text-amber-300 font-bold">
              {isAr ? `النشاط المفعل: ${currentTemplate.icon} ${currentTemplate.nameAr}` : `Active: ${currentTemplate.icon} ${currentTemplate.nameEn}`}
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2 bg-slate-950/90 p-2.5 rounded-2xl border border-slate-800 max-h-36 overflow-y-auto">
            {TOP_15_WORDWALL_TEMPLATES.map((tmpl) => {
              const isSelected = selectedTemplateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  title={isAr ? tmpl.descriptionAr : tmpl.nameEn}
                  className={`p-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-gradient-to-b from-purple-600/40 to-cyan-600/40 border-sky-400 text-white shadow-lg scale-[1.03]'
                      : 'bg-slate-900 border-slate-800/80 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span className="text-base leading-none">{tmpl.icon}</span>
                  <span className="text-[10px] font-bold truncate w-full">{isAr ? tmpl.nameAr : tmpl.nameEn}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Feedback Toast Alert */}
        {feedbackMsg && (
          <div className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300'
              : 'bg-rose-500/20 border border-rose-400 text-rose-300'
          }`}>
            {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* GAMEPLAY STAGE RENDERER */}
        <div className="w-full h-[420px] rounded-2xl bg-slate-950 border border-slate-800 p-5 flex flex-col justify-between relative overflow-hidden">
          
          {/* TEMPLATE 1: QUIZ ARENA (المسابقة التفاعلية - دفعات من 10 أسئلة غير مكررة) */}
          {selectedTemplateId === 'gameshow_quiz' && (() => {
            const activeQ = activeQuizBatch[currentQIndex] || activeQuizBatch[0];
            return (
              <div className="w-full h-full flex flex-col justify-between items-center text-center" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2 text-xs font-bold">
                  <span className="text-purple-400 flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>{isAr ? `المسابقة التفاعلية (دفعة 10 أسئلة - جولة ${batchCount})` : `Interactive Quiz (Round ${batchCount})`}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current text-rose-400" /> {lives}</span>
                    <span className="text-emerald-400 font-mono">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                    <span className="text-sky-300 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
                      {isAr ? `سؤال ${currentQIndex + 1} / ${activeQuizBatch.length}` : `Q: ${currentQIndex + 1}/${activeQuizBatch.length}`}
                    </span>
                  </div>
                </div>

                <div className="my-auto space-y-4 max-w-xl w-full">
                  <h4 
                    dir={isAr ? 'rtl' : 'ltr'} 
                    className="text-xs sm:text-sm font-extrabold text-white bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-md leading-relaxed text-right"
                  >
                    {isAr ? activeQ.qAr : activeQ.qEn}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(isAr ? activeQ.optionsAr : activeQ.optionsEn).map((opt, i) => {
                      const isSelected = selectedOption === i;
                      const isCorrect = i === activeQ.correct;
                      return (
                        <button 
                          key={i} 
                          onClick={() => {
                            if (selectedOption !== null) return;
                            setSelectedOption(i);
                            if (isCorrect) {
                              setScore(prev => prev + 25);
                              setFeedbackMsg({ text: isAr ? 'إجابة صحيحة! أحسنت 🎯 (+25 نقطة)' : 'Correct answer! (+25 pts)', type: 'success' });
                              handleClaimXP();
                            } else {
                              setLives(prev => Math.max(0, prev - 1));
                              setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! السبب: ${activeQ.explanationAr}` : 'Incorrect answer!', type: 'error' });
                            }
                          }} 
                          dir={isAr ? 'rtl' : 'ltr'}
                          className={`p-3 rounded-xl border text-xs font-bold text-right transition flex items-center justify-between ${
                            selectedOption !== null
                              ? isCorrect
                                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 scale-[1.02]'
                                : isSelected
                                ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                                : 'bg-slate-900/60 border-slate-800 text-slate-500'
                              : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-purple-500 hover:bg-slate-850'
                          }`}
                        >
                          <span dir={isAr ? 'rtl' : 'ltr'} className="flex-1 text-right">{opt}</span>
                          {selectedOption !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mx-1" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Question Navigation / 10-Question Milestone Trigger */}
                  {selectedOption !== null && (
                    <div className="flex items-center justify-center gap-3 pt-2 animate-fade-in">
                      {currentQIndex + 1 < activeQuizBatch.length ? (
                        <button
                          onClick={() => {
                            if (activeQ && !seenQuestionIds.includes(activeQ.id)) {
                              setSeenQuestionIds(prev => [...prev, activeQ.id]);
                            }
                            setCurrentQIndex(prev => prev + 1);
                            setSelectedOption(null);
                            setFeedbackMsg(null);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition hover:scale-105"
                        >
                          <span>{isAr ? `السؤال التالي (${currentQIndex + 2} / ${activeQuizBatch.length})` : `Next Question (${currentQIndex + 2}/${activeQuizBatch.length})`}</span>
                          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (activeQ && !seenQuestionIds.includes(activeQ.id)) {
                              setSeenQuestionIds(prev => [...prev, activeQ.id]);
                            }
                            setShowMilestoneDialog(true);
                          }}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 hover:scale-105 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2 transition"
                        >
                          <Trophy className="w-4 h-4 text-slate-950" />
                          <span>{isAr ? '🏆 إتمام الـ 10 أسئلة واستعراض النتيجة' : '🏆 Complete 10 Questions & View Milestone'}</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 2: MATCH-UP (التوصيل والمطابقة) */}
          {selectedTemplateId === 'match_up' && (() => {
            const isRoundFinished = matchedPairs.length === activeMatchPairs.length;
            return (
              <div className="w-full h-full flex flex-col justify-between space-y-3 relative">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? `اختر المصطلح باليمين ثم انقر على التعريف المطابق (الجولة ${matchRound + 1}):` : `Match term to definition (Round ${matchRound + 1}):`}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-amber-400">
                      {isAr ? `الجولة: ${matchRound + 1}` : `Round: ${matchRound + 1}`}
                    </span>
                    <span className="text-xs font-bold text-emerald-400">
                      {matchedPairs.length} / {activeMatchPairs.length} {isAr ? 'أزواج مكتملة' : 'matched'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 items-center">
                  {/* Left/Right Terms Column */}
                  <div className="space-y-2">
                    {activeMatchPairs.map(t => (
                      <button
                        key={t.id}
                        disabled={matchedPairs.includes(t.id)}
                        onClick={() => setSelectedTerm(t.id)}
                        className={`w-full p-2.5 rounded-xl border text-xs font-bold text-right transition flex items-center justify-between ${
                          matchedPairs.includes(t.id) 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 opacity-60' 
                            : selectedTerm === t.id 
                            ? 'bg-purple-600/30 border-sky-400 text-sky-300 shadow-md' 
                            : 'bg-card border-slate-800 text-white hover:border-purple-500'
                        }`}
                      >
                        <span>{t.term}</span>
                        {matchedPairs.includes(t.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>

                  {/* Definitions Column */}
                  <div className="space-y-2">
                    {[...activeMatchPairs].sort((a,b) => a.defAr.localeCompare(b.defAr)).map(d => (
                      <button
                        key={d.id}
                        disabled={matchedPairs.includes(d.id)}
                        onClick={() => {
                          if (!selectedTerm) return;
                          if (selectedTerm === d.id) {
                            const next = [...matchedPairs, d.id];
                            setMatchedPairs(next);
                            setSelectedTerm(null);
                            setFeedbackMsg({ text: isAr ? 'اقتران صحيح! أحسنت 🎯' : 'Correct match!', type: 'success' });
                            if (next.length === activeMatchPairs.length) { handleClaimXP(); }
                          } else {
                            setSelectedTerm(null);
                            setFeedbackMsg({ text: isAr ? 'إجابة غير متطابقة، حاول ثانية ❌' : 'Incorrect match, try again', type: 'error' });
                          }
                        }}
                        className={`w-full p-2.5 rounded-xl border text-xs font-semibold text-right transition flex items-center justify-between ${
                          matchedPairs.includes(d.id) 
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 opacity-60' 
                            : 'bg-card border-slate-800 text-slate-200 hover:border-purple-500'
                        }`}
                      >
                        <span>{isAr ? d.defAr : d.defEn}</span>
                        {matchedPairs.includes(d.id) && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Completion Celebration Overlay with Next Round / Next Game */}
                {isRoundFinished && (
                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in space-y-4 rounded-2xl">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20 animate-bounce">
                      🏆
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-extrabold text-white">
                        {isAr ? `🎉 ممتاز! أكملت مطابقة الجولة (${matchRound + 1}) بنجاح!` : `Round ${matchRound + 1} Completed!`}
                      </h4>
                      <p className="text-xs text-slate-300 max-w-sm mx-auto">
                        {hasMoreMatchRounds
                          ? (isAr ? 'لديك 4 مصطلحات جديدة إضافية جاهزة للمطابقة في هذا الموضوع!' : 'New additional terms are ready for the next round!')
                          : (isAr ? 'أنهيت جميع مصطلحات هذا الموضوع! يمكنك تكرارها أو الانتقال للعبة التالية.' : 'All terms mastered! You can replay or try the next game.')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setMatchRound(prev => (hasMoreMatchRounds ? prev + 1 : 0));
                          setMatchedPairs([]);
                          setSelectedTerm(null);
                          setFeedbackMsg(null);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-sky-600 to-emerald-500 hover:scale-105 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{hasMoreMatchRounds ? (isAr ? '🔄 الجولة التالية (4 مصطلحات جديدة)' : 'Next Round (New Terms)') : (isAr ? '🔄 إعادة اللعب بمصطلحات إضافية' : 'Replay Terms')}</span>
                      </button>
                      <button
                        onClick={handleNextTemplate}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition"
                      >
                        <span>{isAr ? '🎮 اللعبة التالية' : 'Next Game'}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TEMPLATE 3: SPIN THE WHEEL */}
          {selectedTemplateId === 'spin_wheel' && (() => {
            const spinQ = activeQuizBatch[currentQIndex % activeQuizBatch.length] || activeQuizBatch[0];
            return (
              <div className="w-full h-full flex flex-col items-center justify-between">
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Disc className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'أدر العجلة ليتم اختيار سؤال التحدي:' : 'Spin the wheel for topic questions:'}</span>
                  </span>
                  <span className="text-xs font-bold text-emerald-400">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6 flex-1 my-auto w-full justify-center">
                  <div className="text-center space-y-3 shrink-0">
                    <div 
                      className="w-36 h-36 rounded-full border-4 border-amber-400 bg-gradient-to-tr from-purple-600 via-sky-600 to-amber-500 flex items-center justify-center transition-all duration-3000 shadow-[0_0_25px_rgba(245,158,11,0.3)]"
                      style={{ transform: `rotate(${wheelRotation}deg)` }}
                    >
                      <Disc className="w-16 h-16 text-white opacity-80" />
                    </div>
                    <button 
                      disabled={isSpinning}
                      onClick={() => {
                        if (isSpinning) return;
                        setIsSpinning(true);
                        setFeedbackMsg(null);
                        const extra = 1440 + Math.floor(Math.random() * 360);
                        setWheelRotation(prev => prev + extra);
                        setTimeout(() => {
                          setIsSpinning(false);
                          const qIdx = Math.floor(Math.random() * activeQuizBatch.length);
                          setCurrentQIndex(qIdx);
                          setSelectedOption(null);
                        }, 1500);
                      }}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-extrabold text-xs shadow-lg hover:scale-105 transition disabled:opacity-50"
                    >
                      {isSpinning ? (isAr ? 'العجلة تدور... 🎡' : 'Spinning...') : (isAr ? '🎡 أدر العجلة الآن!' : 'Spin Wheel!')}
                    </button>
                  </div>

                  <div className="max-w-md w-full space-y-3">
                    <h4 className="text-xs font-bold text-white bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow">
                      {isAr ? spinQ.qAr : spinQ.qEn}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {(isAr ? spinQ.optionsAr : spinQ.optionsEn).map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            if (selectedOption !== null) return;
                            setSelectedOption(idx);
                            if (idx === spinQ.correct) {
                              setScore(prev => prev + 30);
                              setFeedbackMsg({ text: isAr ? 'إجابة مذهلة وصحيحة! 🎡🎯 (+30 نقطة) - أدر العجلة مجدداً لسؤال آخر!' : 'Correct spin answer!', type: 'success' });
                              handleClaimXP();
                            } else {
                              setLives(prev => Math.max(0, prev - 1));
                              setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! ${spinQ.explanationAr}` : 'Incorrect answer!', type: 'error' });
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-[11px] font-bold text-right transition ${
                            selectedOption !== null && idx === spinQ.correct
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : selectedOption === idx
                              ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                              : 'bg-slate-900 border-slate-800 text-slate-200 hover:border-amber-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 4: TRUE OR FALSE */}
          {selectedTemplateId === 'true_false' && (() => {
            const stmts = currentData.trueFalseStatements;
            const activeStmt = stmts[tfIndex % stmts.length] || stmts[0];
            return (
              <div className="w-full h-full flex flex-col justify-between items-center text-center" dir={isAr ? 'rtl' : 'ltr'}>
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>{isAr ? 'تقييم العبارات العلمية (صواب أم خطأ):' : 'Scientific Statements Evaluation:'}</span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-mono text-xs">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                    <span className="text-xs text-sky-300 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      {tfIndex + 1} / {stmts.length}
                    </span>
                  </div>
                </div>

                <div className="my-auto space-y-6 max-w-xl w-full">
                  <p 
                    dir={isAr ? 'rtl' : 'ltr'}
                    className="text-xs sm:text-sm font-extrabold text-white bg-slate-900 p-5 rounded-2xl border border-slate-800 leading-relaxed shadow-lg text-right"
                  >
                    "{isAr ? activeStmt.statementAr : activeStmt.statementEn}"
                  </p>

                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => {
                        if (activeStmt.isTrue === true) {
                          setScore(prev => prev + 15);
                          setFeedbackMsg({ text: isAr ? `صحيح! 🎯 ${activeStmt.explanationAr}` : 'Correct!', type: 'success' });
                          handleClaimXP();
                        } else {
                          setLives(prev => Math.max(0, prev - 1));
                          setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! ${activeStmt.explanationAr}` : 'Incorrect!', type: 'error' });
                        }
                        if (tfIndex + 1 >= stmts.length || (tfIndex + 1) % 10 === 0) {
                          setShowMilestoneDialog(true);
                        } else {
                          setTfIndex(prev => prev + 1);
                        }
                      }} 
                      className="px-6 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-sm hover:scale-105 transition shadow-lg"
                    >
                      ✅ {isAr ? 'صواب (True)' : 'True'}
                    </button>

                    <button 
                      onClick={() => {
                        if (activeStmt.isTrue === false) {
                          setScore(prev => prev + 15);
                          setFeedbackMsg({ text: isAr ? `صحيح! 🎯 ${activeStmt.explanationAr}` : 'Correct!', type: 'success' });
                          handleClaimXP();
                        } else {
                          setLives(prev => Math.max(0, prev - 1));
                          setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! ${activeStmt.explanationAr}` : 'Incorrect!', type: 'error' });
                        }
                        if (tfIndex + 1 >= stmts.length || (tfIndex + 1) % 10 === 0) {
                          setShowMilestoneDialog(true);
                        } else {
                          setTfIndex(prev => prev + 1);
                        }
                      }} 
                      className="px-6 py-3 rounded-2xl bg-rose-500/20 border border-rose-400 text-rose-300 font-extrabold text-sm hover:scale-105 transition shadow-lg"
                    >
                      ❌ {isAr ? 'خطأ (False)' : 'False'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 5: WHACK A MOLE */}
          {selectedTemplateId === 'whack_a_mole' && (() => {
            const activeQ = activeQuizBatch[moleQIndex % activeQuizBatch.length] || currentData.quizQuestions[0];
            return (
              <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-rose-400">🔨 {isAr ? 'اصطد القوارض التي تحمل الإجابة الصحيحة فقط:' : 'Whack only the mole with the correct answer!'}</span>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="text-sky-300">{isAr ? `السؤال ${moleQIndex + 1} / ${activeQuizBatch.length}` : `Q: ${moleQIndex + 1}/${activeQuizBatch.length}`}</span>
                    <span className="text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current" /> {lives}</span>
                    <span className="text-emerald-400">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                  </div>
                </div>

                <div className="my-auto space-y-4 w-full max-w-lg">
                  <h4 className="text-xs font-bold text-white bg-slate-900 p-3.5 rounded-xl border border-slate-800 shadow-md">
                    {isAr ? activeQ.qAr : activeQ.qEn}
                  </h4>

                  <div className="grid grid-cols-2 gap-3">
                    {(isAr ? activeQ.optionsAr : activeQ.optionsEn).map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (idx === activeQ.correct) {
                            setScore(prev => prev + 20);
                            setFeedbackMsg({ text: isAr ? 'ضربة صائبة! تم اصطياد الإجابة الصحيحة 🔨🎯' : 'Correct Whack!', type: 'success' });
                            handleClaimXP();
                            setTimeout(() => {
                              if (moleQIndex + 1 >= activeQuizBatch.length) {
                                setShowMilestoneDialog(true);
                              } else {
                                setMoleQIndex(prev => prev + 1);
                              }
                            }, 800);
                          } else {
                            setLives(prev => Math.max(0, prev - 1));
                            setFeedbackMsg({ text: isAr ? 'اصطياد خاطئ! خسرت محاولة ❌' : 'Wrong Mole!', type: 'error' });
                          }
                        }}
                        className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-rose-500 text-xs font-extrabold text-white transition transform active:scale-95 flex items-center justify-between shadow-lg"
                      >
                        <span className="text-xl">🐹</span>
                        <span className="text-right flex-1 px-2">{opt}</span>
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => setMoleQIndex(prev => (prev + 1) % activeQuizBatch.length)}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>{isAr ? 'السؤال التالي' : 'Next Question'}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 6: ANAGRAM */}
          {selectedTemplateId === 'anagram' && (() => {
            const isCompleted = anagramBuilt.length === activeAnagram.length && anagramBuilt.map(s => s.split('_')[0]).join('') === activeAnagram;
            return (
              <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="border-b border-slate-800 pb-2 text-xs font-bold text-teal-400 w-full flex items-center justify-between">
                  <span>🔤 {isAr ? 'انقر الأحرف بالتسلسل الصحيح لتجميع المصطلح العلمي:' : 'Click letters in order to spell the target term:'}</span>
                  <span className="text-amber-300">{isAr ? `مصطلح ${anagramIndex + 1} من ${anagramPool.length}` : `Word ${anagramIndex + 1}/${anagramPool.length}`}</span>
                </div>
                
                <div className="my-auto space-y-4">
                  <span className="text-xs text-slate-400 block">{isAr ? 'المصطلح المكتشف:' : 'Target Term:'}</span>
                  
                  <div className="flex justify-center gap-2 flex-wrap">
                    {activeAnagram.split('').map((char, i) => {
                      const isSelected = anagramBuilt.includes(`${char}_${i}`);
                      return (
                        <button
                          key={i}
                          onClick={() => {
                            if (isSelected) return;
                            const next = [...anagramBuilt, `${char}_${i}`];
                            setAnagramBuilt(next);
                            if (next.length === activeAnagram.length) {
                              const formed = next.map(s => s.split('_')[0]).join('');
                              if (formed === activeAnagram) {
                                setFeedbackMsg({ text: isAr ? 'تجميع صحيح للمصطلح! +50 XP 🎯' : 'Correct Spelled Term!', type: 'success' });
                                handleClaimXP();
                              } else {
                                setFeedbackMsg({ text: isAr ? 'ترتيب غير صحيح ❌! تم إعادة الضبط' : 'Incorrect order!', type: 'error' });
                                setAnagramBuilt([]);
                              }
                            }
                          }}
                          className={`w-10 h-12 rounded-xl border flex items-center justify-center font-extrabold text-sm transition ${
                            isSelected ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-900 border-slate-800 text-sky-300 hover:border-purple-500'
                          }`}
                        >
                          {char}
                        </button>
                      );
                    })}
                  </div>

                  {isCompleted && (
                    <div className="pt-2 animate-fade-in">
                      <button
                        onClick={() => {
                          setAnagramIndex(prev => (prev + 1) % anagramPool.length);
                          setAnagramBuilt([]);
                          setFeedbackMsg(null);
                        }}
                        className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:scale-105 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 mx-auto transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                        <span>{isAr ? '🔤 الكلمة والمصطلح التالي' : 'Next Word'}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 7: MISSING WORD */}
          {selectedTemplateId === 'missing_word' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="border-b border-slate-800 pb-2 text-xs font-bold text-amber-400 w-full flex items-center justify-between">
                <span>📝 {isAr ? 'أكمل الكلمة المفقودة في الجملة العلمية التالية:' : 'Fill in the missing word:'}</span>
                <span className="text-sky-300">{isAr ? `جملة ${missingWordIndex + 1} من ${missingWordPool.length}` : `Sentence ${missingWordIndex + 1}/${missingWordPool.length}`}</span>
              </div>
              <div className="my-auto space-y-4 max-w-md w-full bg-slate-900 p-5 rounded-2xl border border-slate-800">
                <p className="text-xs font-bold text-white leading-relaxed">
                  {activeMissingWord.sentenceAr}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {activeMissingWord.wordOptionsAr.map((w, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        if (w === activeMissingWord.correctWord) {
                          setFeedbackMsg({ text: isAr ? 'إكمال صحيح للجملة! +50 XP 🎯' : 'Correct missing word!', type: 'success' });
                          handleClaimXP();
                        } else {
                          setFeedbackMsg({ text: isAr ? `إجابة خاطئة ❌! الكلمة الصحيحة هي: ${activeMissingWord.correctWord}` : 'Incorrect word!', type: 'error' });
                        }
                      }}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-sky-300 hover:border-purple-500 transition"
                    >
                      {w}
                    </button>
                  ))}
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      setMissingWordIndex(prev => (prev + 1) % missingWordPool.length);
                      setFeedbackMsg(null);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:bg-purple-600/50 transition text-xs font-bold flex items-center gap-1.5"
                  >
                    <span>{isAr ? 'الجملة التالية' : 'Next Sentence'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TEMPLATE 8: AIRPLANE FLIGHT */}
          {selectedTemplateId === 'airplane_flight' && (() => {
            const activeQ = activeQuizBatch[airplaneQIndex % activeQuizBatch.length] || activeQuizBatch[0];
            return (
              <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="border-b border-slate-800 pb-2 text-xs font-bold text-sky-400 w-full flex items-center justify-between">
                  <span>✈️ {isAr ? 'وجه الطائرة نحو السحابة ذات الإجابة الصحيحة فقط:' : 'Fly through the correct answer cloud!'}</span>
                  <span className="text-amber-300">{isAr ? `السؤال ${airplaneQIndex + 1} من ${activeQuizBatch.length}` : `Q: ${airplaneQIndex + 1}/${activeQuizBatch.length}`}</span>
                </div>
                <div className="my-auto space-y-4 max-w-lg w-full">
                  <span className="text-4xl animate-bounce block">✈️ ☁️</span>
                  <h4 className="text-xs font-bold text-white bg-slate-900 p-3 rounded-xl border border-slate-800">
                    {isAr ? activeQ.qAr : activeQ.qEn}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {(isAr ? activeQ.optionsAr : activeQ.optionsEn).map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => {
                          if (i === activeQ.correct) {
                            setFeedbackMsg({ text: isAr ? 'طيران ناجح عبر السحابة الصحيحة! ✈️✨' : 'Successful Flight!', type: 'success' });
                            handleClaimXP();
                            setTimeout(() => {
                              if (airplaneQIndex + 1 >= activeQuizBatch.length) {
                                setShowMilestoneDialog(true);
                              } else {
                                setAirplaneQIndex(prev => prev + 1);
                              }
                            }, 800);
                          } else {
                            setFeedbackMsg({ text: isAr ? 'اصطدام بسحابة خاطئة 💥! حاول مجدداً' : 'Cloud Collision!', type: 'error' });
                          }
                        }} 
                        className="p-3 rounded-xl bg-sky-500/15 border border-sky-400/40 text-sky-300 font-bold text-xs hover:scale-105 transition"
                      >
                        ☁️ {opt}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => {
                        if (airplaneQIndex + 1 >= activeQuizBatch.length) {
                          setShowMilestoneDialog(true);
                        } else {
                          setAirplaneQIndex(prev => prev + 1);
                        }
                      }}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>{isAr ? (airplaneQIndex + 1 >= activeQuizBatch.length ? '🏆 إتمام الـ 10 أسئلة' : 'السؤال التالي') : (airplaneQIndex + 1 >= activeQuizBatch.length ? '🏆 Milestone' : 'Next Question')}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 9: FLASHCARDS */}
          {selectedTemplateId === 'flashcards' && (() => {
            const activeCard = currentData.matchPairs[flashcardIndex % currentData.matchPairs.length] || currentData.matchPairs[0];
            return (
              <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="border-b border-slate-800 pb-2 text-xs font-bold text-amber-400 w-full flex items-center justify-between">
                  <span>🎴 {isAr ? 'اقلب بطاقة المراجعة لمعاينة الشرح والمفهوم:' : 'Flip flashcard for concept breakdown:'}</span>
                  <span className="text-sky-300">{isAr ? `بطاقة ${flashcardIndex + 1} من ${currentData.matchPairs.length}` : `Card ${flashcardIndex + 1}/${currentData.matchPairs.length}`}</span>
                </div>
                <div 
                  onClick={() => setCardRevealed(!cardRevealed)}
                  className="w-full max-w-md h-44 my-auto rounded-3xl bg-gradient-to-br from-slate-900 to-purple-950 border-2 border-purple-500/40 p-6 flex flex-col items-center justify-center cursor-pointer transition shadow-2xl hover:scale-105"
                >
                  <span className="text-[10px] text-sky-400 font-bold uppercase mb-1">{isAr ? 'انقر لقلب البطاقة' : 'Click to flip'}</span>
                  <h4 className="text-base font-extrabold text-white mb-2">{activeCard.term}</h4>
                  {cardRevealed && (
                    <p className="text-xs text-amber-300 font-semibold animate-fade-in">{isAr ? activeCard.defAr : activeCard.defEn}</p>
                  )}
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardRevealed(false);
                      setFlashcardIndex(prev => (prev - 1 + currentData.matchPairs.length) % currentData.matchPairs.length);
                    }}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500 transition text-xs font-bold flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
                    <span>{isAr ? 'السابقة' : 'Prev'}</span>
                  </button>
                  <span className="text-xs font-extrabold text-amber-400 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
                    {flashcardIndex + 1} / {currentData.matchPairs.length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardRevealed(false);
                      setFlashcardIndex(prev => (prev + 1) % currentData.matchPairs.length);
                    }}
                    className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-purple-500 transition text-xs font-bold flex items-center gap-1"
                  >
                    <span>{isAr ? 'التالية' : 'Next'}</span>
                    <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardRevealed(false);
                      const rand = Math.floor(Math.random() * currentData.matchPairs.length);
                      setFlashcardIndex(rand);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 hover:bg-purple-600/50 transition text-xs font-bold"
                  >
                    🎲 {isAr ? 'عشوائي' : 'Random'}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 10: GROUP SORT (تصنيف المجموعات) */}
          {selectedTemplateId === 'group_sort' && (() => {
            const isAllSorted = Object.keys(placedGroupItems).length === currentData.groupSortData.items.length;
            return (
              <div className="w-full h-full flex flex-col justify-between relative">
                <div className="border-b border-slate-800 pb-2 text-xs font-bold text-sky-400 flex items-center justify-between">
                  <span>⚖️ {isAr ? 'انقر على العنصر ثم اختر التصنيف الصحيح لإدراجه في الصندوق:' : 'Select item and place into correct bucket:'}</span>
                  <span className="text-emerald-400 text-xs">{Object.keys(placedGroupItems).length} / {currentData.groupSortData.items.length} {isAr ? 'مُصنّف' : 'sorted'}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 flex-1 items-stretch my-2">
                  {/* Category Bucket 1 */}
                  <div className="bg-slate-900/90 border-2 border-purple-500/40 rounded-2xl p-3 flex flex-col justify-between">
                    <h5 className="text-xs font-extrabold text-purple-300 border-b border-slate-800 pb-1.5 text-center">
                      {isAr ? currentData.groupSortData.cat1Ar : currentData.groupSortData.cat1En}
                    </h5>
                    <div className="space-y-1.5 my-auto max-h-36 overflow-y-auto">
                      {currentData.groupSortData.items.map((item, idx) => {
                        if (placedGroupItems[idx] !== 1) return null;
                        return (
                          <div key={idx} className="bg-purple-500/20 border border-purple-400 text-purple-200 text-[11px] font-bold p-1.5 rounded-lg flex items-center justify-between">
                            <span>{isAr ? item.textAr : item.textEn}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category Bucket 2 */}
                  <div className="bg-slate-900/90 border-2 border-cyan-500/40 rounded-2xl p-3 flex flex-col justify-between">
                    <h5 className="text-xs font-extrabold text-cyan-300 border-b border-slate-800 pb-1.5 text-center">
                      {isAr ? currentData.groupSortData.cat2Ar : currentData.groupSortData.cat2En}
                    </h5>
                    <div className="space-y-1.5 my-auto max-h-36 overflow-y-auto">
                      {currentData.groupSortData.items.map((item, idx) => {
                        if (placedGroupItems[idx] !== 2) return null;
                        return (
                          <div key={idx} className="bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-[11px] font-bold p-1.5 rounded-lg flex items-center justify-between">
                            <span>{isAr ? item.textAr : item.textEn}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Unsorted Items Bar */}
                <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center gap-2 overflow-x-auto">
                  <span className="text-[11px] font-bold text-slate-400 shrink-0">{isAr ? 'المفاهيم:' : 'Items:'}</span>
                  {currentData.groupSortData.items.map((item, idx) => {
                    if (placedGroupItems[idx] !== undefined) return null;
                    return (
                      <div key={idx} className="flex items-center gap-1 bg-slate-950 border border-slate-700 px-2 py-1 rounded-lg text-[11px] font-bold text-white shrink-0">
                        <span>{isAr ? item.textAr : item.textEn}</span>
                        <button
                          onClick={() => {
                            if (item.cat === 1) {
                              setPlacedGroupItems(prev => ({ ...prev, [idx]: 1 }));
                              setScore(prev => prev + 10);
                              setFeedbackMsg({ text: isAr ? 'تصنيف صحيح في الصندوق الأول! 🎯' : 'Correct Bucket 1!', type: 'success' });
                            } else {
                              setLives(prev => Math.max(0, prev - 1));
                              setFeedbackMsg({ text: isAr ? 'تصنيف خاطئ! المكان الصحيح في الصندوق الآخر ❌' : 'Wrong Bucket!', type: 'error' });
                            }
                          }}
                          className="px-1.5 py-0.5 rounded bg-purple-600/40 text-purple-300 text-[10px] hover:bg-purple-600"
                        >
                          1
                        </button>
                        <button
                          onClick={() => {
                            if (item.cat === 2) {
                              setPlacedGroupItems(prev => ({ ...prev, [idx]: 2 }));
                              setScore(prev => prev + 10);
                              setFeedbackMsg({ text: isAr ? 'تصنيف صحيح في الصندوق الثاني! 🎯' : 'Correct Bucket 2!', type: 'success' });
                            } else {
                              setLives(prev => Math.max(0, prev - 1));
                              setFeedbackMsg({ text: isAr ? 'تصنيف خاطئ! المكان الصحيح في الصندوق الأول ❌' : 'Wrong Bucket!', type: 'error' });
                            }
                          }}
                          className="px-1.5 py-0.5 rounded bg-cyan-600/40 text-cyan-300 text-[10px] hover:bg-cyan-600"
                        >
                          2
                        </button>
                      </div>
                    );
                  })}
                </div>

                {isAllSorted && (
                  <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-fade-in space-y-4 rounded-2xl">
                    <div className="text-4xl animate-bounce">🏆</div>
                    <h4 className="text-base font-extrabold text-white">
                      {isAr ? '🎉 أحسنت! تم تصنيف جميع المفاهيم بنجاح!' : 'All Concepts Classified!'}
                    </h4>
                    <button
                      onClick={() => {
                        setPlacedGroupItems({});
                        setFeedbackMsg(null);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-600 hover:scale-105 text-white font-extrabold text-xs shadow-lg flex items-center gap-2 transition"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>{isAr ? '🔄 إعادة الفرز وجولة جديدة' : 'Replay Sort'}</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* TEMPLATE 11: BALLOON POP (فرقعة البالونات) */}
          {selectedTemplateId === 'balloon_pop' && (() => {
            const activeQ = activeQuizBatch[balloonQIndex % activeQuizBatch.length] || activeQuizBatch[0];
            return (
              <div className="w-full h-full flex flex-col justify-between items-center text-center">
                <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold text-amber-400">🎈 {isAr ? 'انقر لفرقعة البالون الذي يحوي الإجابة الصحيحة:' : 'Pop the balloon with the correct answer!'}</span>
                  <div className="flex items-center gap-3 text-xs font-bold">
                    <span className="text-sky-300">{isAr ? `السؤال ${balloonQIndex + 1} من ${activeQuizBatch.length}` : `Q: ${balloonQIndex + 1}/${activeQuizBatch.length}`}</span>
                    <span className="text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current" /> {lives}</span>
                    <span className="text-emerald-400">{isAr ? `النقاط: ${score}` : `Score: ${score}`}</span>
                  </div>
                </div>

                <div className="my-auto space-y-4 w-full max-w-lg">
                  <h4 className="text-xs font-bold text-white bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-md">
                    {isAr ? activeQ.qAr : activeQ.qEn}
                  </h4>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    {(isAr ? activeQ.optionsAr : activeQ.optionsEn).map((opt, i) => {
                      const isPopped = poppedBalloons.includes(i);
                      const colors = ['from-pink-500 to-purple-600', 'from-sky-400 to-blue-600', 'from-amber-400 to-orange-500', 'from-emerald-400 to-teal-600'];
                      return (
                        <button
                          key={i}
                          disabled={isPopped}
                          onClick={() => {
                            setPoppedBalloons(prev => [...prev, i]);
                            if (i === activeQ.correct) {
                              setScore(prev => prev + 25);
                              setFeedbackMsg({ text: isAr ? 'فرقعة صائبة! تم تدمير البالون الصحيح 🎈💥 (+25 نقطة)' : 'Correct Balloon Popped!', type: 'success' });
                              handleClaimXP();
                              setTimeout(() => {
                                setPoppedBalloons([]);
                                if (balloonQIndex + 1 >= activeQuizBatch.length) {
                                  setShowMilestoneDialog(true);
                                } else {
                                  setBalloonQIndex(prev => prev + 1);
                                }
                              }, 800);
                            } else {
                              setLives(prev => Math.max(0, prev - 1));
                              setFeedbackMsg({ text: isAr ? 'فرقعة خاطئة! خسرت محاولة ❌' : 'Wrong Balloon Popped!', type: 'error' });
                            }
                          }}
                          className={`h-24 rounded-3xl border border-white/20 flex flex-col items-center justify-center p-2 text-xs font-extrabold text-white transition transform hover:scale-105 shadow-xl ${
                            isPopped ? 'opacity-20 scale-90 border-slate-800 bg-slate-900' : `bg-gradient-to-b ${colors[i % colors.length]} animate-bounce`
                          }`}
                        >
                          <span className="text-lg">🎈</span>
                          <span className="truncate w-full">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex justify-center pt-1">
                    <button
                      onClick={() => {
                        setPoppedBalloons([]);
                        if (balloonQIndex + 1 >= activeQuizBatch.length) {
                          setShowMilestoneDialog(true);
                        } else {
                          setBalloonQIndex(prev => prev + 1);
                        }
                      }}
                      className="px-4 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5"
                    >
                      <span>{isAr ? (balloonQIndex + 1 >= activeQuizBatch.length ? '🏆 إتمام الـ 10 أسئلة' : 'السؤال التالي') : (balloonQIndex + 1 >= activeQuizBatch.length ? '🏆 Milestone' : 'Next Question')}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TEMPLATE 12: RANK ORDER (التدرج الترتيبي) */}
          {selectedTemplateId === 'rank_order' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-sky-400">📊 {isAr ? 'استخدم أسهم الترتيب لضبط الخطوات المتسلسلة ثم تحقق:' : 'Order steps correctly using arrows then verify:'}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setUserRankSteps([...currentData.rankSteps].sort(() => Math.random() - 0.5));
                      setRankValidated(false);
                      setFeedbackMsg(null);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
                    title={isAr ? 'إعادة خلط الخطوات' : 'Shuffle'}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      const isCorrectOrder = userRankSteps.every((step, idx) => step.correctOrder === idx + 1);
                      setRankValidated(true);
                      if (isCorrectOrder) {
                        setScore(prev => prev + 40);
                        setFeedbackMsg({ text: isAr ? 'تسلسل صحيـح 100%! تم إكمال خوارزمية التدرج 🎯 (+50 XP)' : 'Sequence 100% Correct!', type: 'success' });
                        handleClaimXP();
                      } else {
                        setLives(prev => Math.max(0, prev - 1));
                        setFeedbackMsg({ text: isAr ? 'تسلسل غير دقيق ❌، اعد ترتيب الخطوات وحاول مجدداً' : 'Incorrect sequence order!', type: 'error' });
                      }
                    }}
                    className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-xs hover:bg-emerald-500/30"
                  >
                    🔍 {isAr ? 'تحقق من الترتيب' : 'Verify Order'}
                  </button>
                </div>
              </div>

              <div className="my-auto space-y-2 w-full max-w-md">
                {userRankSteps.map((step, idx) => (
                  <div 
                    key={step.id} 
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold text-white transition ${
                      rankValidated
                        ? step.correctOrder === idx + 1
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                          : 'bg-rose-500/20 border-rose-400 text-rose-200'
                        : 'bg-slate-900 border-slate-800'
                    }`}
                  >
                    <span>{isAr ? step.textAr : step.textEn}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => moveRankStep(idx, idx - 1)} disabled={idx === 0} className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30">
                        <ArrowUp className="w-3.5 h-3.5 text-sky-400" />
                      </button>
                      <button onClick={() => moveRankStep(idx, idx + 1)} disabled={idx === userRankSteps.length - 1} className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30">
                        <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEMPLATE 13: MAZE CHASE (مطاردة المتاهة) */}
          {selectedTemplateId === 'maze_chase' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="flex items-center justify-between w-full border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-purple-400">🕳️ {isAr ? 'اختر بوابة المتاهة الآمنة التي تعبر منها الشخصية للهدف:' : 'Choose the safe maze gate to reach the target:'}</span>
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-current" /> {lives}</span>
              </div>

              <div className="my-auto space-y-4 w-full max-w-lg">
                <div className="flex items-center justify-center gap-3 text-3xl">
                  <span className="animate-pulse">🏃‍♂️</span>
                  <span className="text-xs font-bold text-slate-400">➡️ 🚪 ➡️</span>
                  <span>🏆</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {currentData.mazeDoors.map((door, idx) => {
                    const isSelected = mazeSelectedDoor === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setMazeSelectedDoor(idx);
                          if (door.isCorrect) {
                            setScore(prev => prev + 30);
                            setFeedbackMsg({ text: isAr ? 'عبرت الباب الآمن بنجاح ووصلت للكأس! 🏆✨ (+50 XP)' : 'Reached Trophy safely!', type: 'success' });
                            handleClaimXP();
                          } else {
                            setLives(prev => Math.max(0, prev - 1));
                            setFeedbackMsg({ text: isAr ? 'وقعت في فخ المتاهة 💀! حاول عبر باب آخر' : 'Trapped in Maze!', type: 'error' });
                          }
                        }}
                        className={`p-3.5 rounded-2xl border text-xs font-bold text-right transition flex items-center justify-between ${
                          isSelected
                            ? door.isCorrect
                              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                              : 'bg-rose-500/20 border-rose-400 text-rose-300'
                            : 'bg-slate-900 border-slate-800 text-white hover:border-purple-500'
                        }`}
                      >
                        <span className="text-sky-400 font-extrabold">{door.label}</span>
                        <span>{isAr ? door.optionAr : door.optionEn}</span>
                      </button>
                    );
                  })}
                </div>

                {mazeSelectedDoor !== null && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setMazeSelectedDoor(null);
                        setFeedbackMsg(null);
                      }}
                      className="px-4 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1.5 mx-auto"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'غرفة متاهة جديدة' : 'New Maze Room'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CUSTOM WORDWALL EMBED */}
          {selectedTemplateId === 'custom_embed' && (
            <div className="w-full h-full flex flex-col justify-between items-center text-center">
              <div className="w-full flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder={isAr ? "ضع رابط لعبة Wordwall هنا..." : "Paste Wordwall link here..."}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent-purple flex-1"
                />
                <button onClick={() => handleLoadCustomUrl()} className="px-4 py-1.5 rounded-xl bg-accent-cyan text-slate-950 font-bold text-xs hover:bg-cyan-300 shrink-0">
                  {isAr ? 'تضمين اللعبة' : 'Embed Link'}
                </button>
              </div>

              {gameUrl ? (
                <iframe src={gameUrl} className="w-full flex-1 border-0 rounded-xl bg-white" allowFullScreen title="Wordwall Embed" />
              ) : (
                <div className="my-auto space-y-3">
                  <Link className="w-8 h-8 text-sky-400 mx-auto" />
                  <p className="text-xs text-slate-400">{isAr ? 'ضع رابط أي نشاط Wordwall عام لتشغيله مباشرة.' : 'Paste your Wordwall URL above.'}</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'كسب +50 XP عند إكمال أي جولة أو نشاط بنجاح!' : 'Earn +50 XP upon completing any round activity!'}</span>
          </div>

          <button
            onClick={handleClaimXP}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              gameCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gradient-to-r from-accent-purple to-accent-cyan text-slate-950 hover:scale-105'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{gameCompleted ? (isAr ? 'تم كسب +50 XP 🎉' : '+50 XP Claimed! 🎉') : (isAr ? 'تأكيد إكمال اللعبة (+50 XP)' : 'Claim Game Completion (+50 XP)')}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
