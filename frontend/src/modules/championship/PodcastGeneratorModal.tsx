import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Copy, 
  Check, 
  X
} from 'lucide-react';
import { getPodcastDialogue, type PodcastHostTurn } from '../../services/topicContentService';

interface PodcastGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type HostTurn = PodcastHostTurn;


export const PodcastGeneratorModal: React.FC<PodcastGeneratorModalProps> = ({ isOpen, onClose }) => {
  const { language, themeMode, activeTopicId, topics } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const currentTopic = topics.find(t => t.id === activeTopicId) || topics[0] || {
    id: 'default',
    titleAr: 'التمرير الخلفي وضبط الأوزان العصبية',
    titleEn: 'Backpropagation and Neural Weight Optimization'
  };

  const topicTitle = isAr ? currentTopic.titleAr : currentTopic.titleEn;

  const [dialectMode, setDialectMode] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [copied, setCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [dialogue, setDialogue] = useState<HostTurn[]>([]);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [voiceEngine, setVoiceEngine] = useState<'elevenlabs' | 'azure' | 'google'>('elevenlabs');
  const [elevenApiKey, setElevenApiKey] = useState<string>(() => {
    return typeof window !== 'undefined' ? (localStorage.getItem('shaghoof_eleven_key') || '') : '';
  });

  // Studio Neural Audio references
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobCacheRef = useRef<Map<string, string>>(new Map());
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Pre-fetch next line audio for zero-latency seamless playback
  const prefetchLineAudio = async (index: number) => {
    if (index >= dialogue.length) return;
    const item = dialogue[index];
    const cacheKey = `v3_${voiceEngine}_${item.speaker}_${dialectMode}_${playbackSpeed}_${item.text}`;
    if (audioBlobCacheRef.current.has(cacheKey)) return;

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/championship/podcast/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: item.text,
          speaker: item.speaker,
          language: isAr ? 'ar' : 'en',
          dialect: dialectMode,
          speed: playbackSpeed,
          engine: voiceEngine,
          api_key: elevenApiKey || undefined
        })
      });
      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        audioBlobCacheRef.current.set(cacheKey, blobUrl);
      }
    } catch (e) {
      // Background prefetch error ignored
    }
  };

  // Play a line using high-fidelity unified TTS with fallback
  const playNeuralLine = async (index: number) => {
    if (index >= dialogue.length || isMuted) {
      if (index >= dialogue.length) {
        setIsPlaying(false);
        setCurrentLineIndex(0);
      }
      return;
    }

    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }

    const item = dialogue[index];
    const cacheKey = `v3_${voiceEngine}_${item.speaker}_${dialectMode}_${playbackSpeed}_${item.text}`;
    let audioUrl = audioBlobCacheRef.current.get(cacheKey);

    if (!audioUrl) {
      setIsBuffering(true);
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/championship/podcast/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: item.text,
            speaker: item.speaker,
            language: isAr ? 'ar' : 'en',
            dialect: dialectMode,
            speed: playbackSpeed,
            engine: voiceEngine,
            api_key: elevenApiKey || undefined
          })
        });
        if (res.ok) {
          const blob = await res.blob();
          audioUrl = URL.createObjectURL(blob);
          audioBlobCacheRef.current.set(cacheKey, audioUrl);
        }
      } catch (err) {
        console.warn('Backend Neural TTS unreachable, falling back to browser synthesis:', err);
      } finally {
        setIsBuffering(false);
      }
    }

    // If neural audio is ready, play studio audio!
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.playbackRate = playbackSpeed;

      audio.onended = () => {
        if (index + 1 < dialogue.length) {
          setCurrentLineIndex(index + 1);
          playNeuralLine(index + 1);
        } else {
          setIsPlaying(false);
          setCurrentLineIndex(0);
        }
      };

      audio.onerror = () => {
        setIsPlaying(false);
      };

      try {
        await audio.play();
        // Trigger prefetch for next line
        prefetchLineAudio(index + 1);
      } catch (e) {
        console.warn('Autoplay error:', e);
        setIsPlaying(false);
      }
    } else {
      // Fallback: Browser speech synthesis
      if (synthRef.current) {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(item.text);
        utterance.lang = isAr ? 'ar-SA' : 'en-US';
        utterance.rate = playbackSpeed;
        utterance.pitch = item.speaker === 'host1' ? 0.95 : 1.2;

        utterance.onend = () => {
          if (index + 1 < dialogue.length) {
            setCurrentLineIndex(index + 1);
            playNeuralLine(index + 1);
          } else {
            setIsPlaying(false);
            setCurrentLineIndex(0);
          }
        };

        utterance.onerror = () => setIsPlaying(false);
        synthRef.current.speak(utterance);
      }
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playNeuralLine(currentLineIndex);
    }
  };

  const handleReset = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    audioBlobCacheRef.current.clear();
    setIsPlaying(false);
    setCurrentLineIndex(0);
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  // Dynamically load tailored dialogue for the active topic
  useEffect(() => {
    // 1. Immediately update dialogue using smart knowledge matrix (zero latency)
    const initialDialogue = getPodcastDialogue(currentTopic, isAr ? 'ar' : 'en', dialectMode);
    setDialogue(initialDialogue as HostTurn[]);
    setCurrentLineIndex(0);
    setIsPlaying(false);
    audioBlobCacheRef.current.clear();
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    // 2. Query backend generation asynchronously for real-time generative dialogue
    let isCancelled = false;
    const fetchBackendDialogue = async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/championship/podcast/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topicTitle,
            language: isAr ? 'ar' : 'en',
            dialect: dialectMode
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (!isCancelled && data && Array.isArray(data.dialogue) && data.dialogue.length > 0) {
            setDialogue(data.dialogue);
          }
        }
      } catch (err) {
        // Fallback already active from topicContentService
      }
    };

    if (isOpen) {
      fetchBackendDialogue();
    }

    return () => {
      isCancelled = true;
    };
  }, [dialectMode, isAr, activeTopicId, isOpen]);

  const handleCopyTranscript = () => {
    const textToCopy = dialogue.map(d => `[${d.timestamp}] ${d.speakerName} (${d.role}):\n${d.text}`).join('\n\n');
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-md animate-fade-in">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className={`w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-orange-500/10' 
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
        }`}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF4D2D] to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 animate-pulse">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? '🎙️ كبسولة البودكاست التعليمية (AI Podcast Deep Dive)' : '🎙️ AI Educational Podcast Deep-Dive'}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                  NotebookLM Style
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {voiceEngine === 'elevenlabs'
                      ? (isAr ? '👑 إليفن لابس (ElevenLabs Multilingual v2)' : 'ElevenLabs Multilingual v2')
                      : voiceEngine === 'azure' 
                      ? (isAr ? 'صوت استوديو موحد (Azure Neural)' : 'Azure Studio Neural')
                      : (isAr ? 'محرك جوجل الصوتي الموحد (Google AI Voice)' : 'Google AI Unified Voice')
                    }
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isAr ? 'حوار تفاعلي ذكي بنبرة صوت موحدة 100% بدون أي تبديل بين الأصوات للمصطلحات التقنية' : 'Two AI Co-hosts deconstructing complex lecture topics into conversational clarity'}
                </p>
                {isBuffering && (
                  <span className="text-[11px] font-bold text-amber-500 animate-pulse flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{isAr ? 'جاري تجهيز الصوت عالي النقاء...' : 'Buffering audio...'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              if (synthRef.current) synthRef.current.cancel();
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Player Showcase Banner */}
        <div className={`p-6 border-b flex flex-col gap-4 relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-b from-slate-950 to-slate-900 border-slate-800' 
            : 'bg-gradient-to-b from-orange-50/60 to-white border-slate-100'
        }`}>
          {/* Active Topic Badge & Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {isAr ? 'الموضوع المشروح:' : 'Topic in focus:'}
              </span>
              <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#FF4D2D]/10 text-[#FF4D2D] border border-[#FF4D2D]/30 shadow-xs">
                {topicTitle}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Dialect Switcher (Egyptian vs Standard) */}
              {isAr && (
                <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => setDialectMode(true)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      dialectMode 
                        ? 'bg-[#FF4D2D] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    🇪🇬 بالعامية المصرية
                  </button>
                  <button
                    type="button"
                    onClick={() => setDialectMode(false)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      !dialectMode 
                        ? 'bg-[#FF4D2D] text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    📖 بالفصحى الأكاديمية
                  </button>
                </div>
              )}

              {/* Voice Engine Switcher (ElevenLabs vs Azure vs Google) */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-300/60 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setVoiceEngine('elevenlabs');
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 ${
                    voiceEngine === 'elevenlabs' 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isAr ? 'أعلى دقة بشرية عالمياً - ElevenLabs Multilingual v2' : 'ElevenLabs Multilingual v2'}
                >
                  <span>👑 {isAr ? 'ElevenLabs v2' : 'ElevenLabs'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceEngine('azure');
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    voiceEngine === 'azure' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isAr ? 'أصوات استوديو إذاعية مصرية فائقة النقاء' : 'Studio Neural Voices'}
                >
                  <span>🎙️ {isAr ? 'استوديو' : 'Studio'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceEngine('google');
                    handleReset();
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                    voiceEngine === 'google' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={isAr ? 'محرك جوجل الصوتي الموحد' : 'Google AI Voice'}
                >
                  <span>🌐 {isAr ? 'جوجل' : 'Google'}</span>
                </button>

                {/* Optional Key Config Button */}
                <button
                  type="button"
                  onClick={() => {
                    const input = window.prompt(
                      isAr 
                        ? 'أدخل مفتاح ElevenLabs API Key الخاص بك (اختياري - لتشغيل الموديل بمفتاحك):' 
                        : 'Enter your ElevenLabs API Key (optional):',
                      elevenApiKey
                    );
                    if (input !== null) {
                      setElevenApiKey(input.trim());
                      localStorage.setItem('shaghoof_eleven_key', input.trim());
                      audioBlobCacheRef.current.clear();
                      handleReset();
                    }
                  }}
                  className="px-1.5 py-1 text-slate-400 hover:text-purple-500 transition text-xs font-bold"
                  title={isAr ? 'إدخال مفتاح ElevenLabs API Key' : 'Configure ElevenLabs Key'}
                >
                  ⚙️
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic Audio Waveform Animation */}
          <div className="flex items-center justify-center gap-1.5 h-14 py-2 z-10">
            {[40, 75, 95, 60, 30, 85, 100, 70, 50, 90, 65, 45, 80, 95, 55, 35, 90, 75, 60, 85, 40].map((height, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-200 ${
                  isPlaying 
                    ? 'bg-gradient-to-t from-[#FF4D2D] to-amber-400 animate-pulse' 
                    : 'bg-slate-300 dark:bg-slate-700'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(15, (height * ((i % 3) + 1)) % 100)}%` : '20%',
                  animationDelay: `${(i * 65) % 800}ms`
                }}
              />
            ))}
          </div>

          {/* Master Playback Controls */}
          <div className="flex items-center justify-between gap-4 z-10">
            <div className="flex items-center gap-3">
              {/* Play / Pause Main Button */}
              <button
                type="button"
                onClick={togglePlay}
                className="w-12 h-12 rounded-2xl bg-[#FF4D2D] hover:bg-[#e03e20] text-white flex items-center justify-center shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                title={isAr ? 'إعادة من البداية' : 'Restart from beginning'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Mute Toggle */}
              <button
                type="button"
                onClick={() => {
                  setIsMuted(!isMuted);
                  if (synthRef.current && isPlaying) synthRef.current.cancel();
                  setIsPlaying(false);
                }}
                className="p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200/50 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1.5 bg-slate-200/70 dark:bg-slate-800/90 p-1 rounded-xl border border-slate-300/50 dark:border-slate-700">
              {[1.0, 1.25, 1.5].map(spd => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setPlaybackSpeed(spd)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                    playbackSpeed === spd 
                      ? 'bg-white dark:bg-slate-700 text-[#FF4D2D] shadow-xs' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>

            {/* Copy Transcript Button */}
            <button
              type="button"
              onClick={handleCopyTranscript}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ النص' : 'Copy Script')}</span>
            </button>
          </div>
        </div>

        {/* Real-time Interactive Dialogue Script */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        >
          {dialogue.map((turn, index) => {
            const isCurrent = isPlaying && index === currentLineIndex;
            const isHost1 = turn.speaker === 'host1';

            return (
              <div
                key={index}
                onClick={() => {
                  setCurrentLineIndex(index);
                  if (isPlaying) {
                    playNeuralLine(index);
                  }
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isCurrent 
                    ? 'bg-orange-500/10 border-orange-500/60 ring-2 ring-orange-500/30 shadow-md scale-[1.01]' 
                    : isDark 
                      ? 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80' 
                      : 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl select-none">{turn.avatar}</span>
                    <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {turn.speakerName}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      isHost1 
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/30' 
                        : 'bg-purple-500/10 text-purple-500 border-purple-500/30'
                    }`}>
                      {turn.role}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 animate-pulse">
                        <Volume2 className="w-3 h-3" />
                        <span>{isAr ? 'يتحدث الآن...' : 'Speaking now...'}</span>
                      </span>
                    )}
                    <span className="text-[11px] font-mono text-slate-400">
                      {turn.timestamp}
                    </span>
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${
                  isCurrent 
                    ? 'text-slate-900 dark:text-orange-200 font-bold' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  {turn.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Footer info banner */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#FF4D2D]" />
            <span>
              {isAr 
                ? 'توليد ديناميكي يعتمد على أحدث تقنيات RAG وتفكيك نصوص المحاضرات إلى سرد صوتي ممتع' 
                : 'Dynamically generated from your syllabus PDFs using RAG & conversational synthesis'}
            </span>
          </div>

          <span className="font-bold text-[#FF4D2D]">
            SHAGHOOF Podcast Engine v2.0
          </span>
        </div>
      </div>
    </div>
  );
};
