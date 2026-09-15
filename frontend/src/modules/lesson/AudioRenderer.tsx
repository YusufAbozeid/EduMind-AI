import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { getAudioData } from '../../services/topicContentService';
import { Play, Pause, FileText, Headphones, Clock, Sparkles } from 'lucide-react';

export const AudioRenderer: React.FC = () => {
  const { speakText, stopSpeech, isSpeaking, language, themeMode, topics, activeTopicId } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const audioData = getAudioData(activeTopic);

  const [speed, setSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const progress = isSpeaking ? 65 : 35;

  // Stop speech if topic changes
  useEffect(() => {
    stopSpeech();
    setActiveChapterIndex(0);
  }, [activeTopicId]);

  const currentScript = isAr ? audioData.audioScriptAr.trim() : audioData.audioScriptEn.trim();

  const handleTogglePlay = () => {
    if (isSpeaking) {
      stopSpeech();
    } else {
      speakText(currentScript, speed);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (isSpeaking) {
      speakText(currentScript, newSpeed);
    }
  };

  const handleChapterClick = (idx: number) => {
    setActiveChapterIndex(idx);
    const chapter = audioData.chapters[idx];
    const chapterIntro = isAr
      ? `ننتقل الآن إلى فقرة: ${chapter.titleAr}. ${currentScript}`
      : `Moving to: ${chapter.titleEn}. ${currentScript}`;
    speakText(chapterIntro, speed);
  };

  return (
    <div className="space-y-6">
      
      {/* Waveform Player Container */}
      <div className={`border rounded-2xl p-6 shadow-sm space-y-6 transition-colors ${
        isDark ? 'bg-gradient-to-r from-slate-900 via-[#161C2C] to-slate-900 border-purple-900/40' : 'bg-gradient-to-r from-white via-purple-50/50 to-white border-slate-200'
      }`}>
        
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-700 dark:text-purple-300 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className={`text-sm font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? audioData.titleAr : audioData.titleEn}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {isAr ? audioData.descAr : audioData.descEn}
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shrink-0">
            {isAr ? 'صوت أكاديمي HD 🎙️' : 'HD Audio Digest 🎙️'}
          </span>
        </div>

        {/* Animated Equalizer Waveform */}
        <div className={`flex items-center justify-center gap-1.5 h-16 rounded-xl px-4 border ${
          isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
        }`}>
          {Array.from({ length: 28 }).map((_, idx) => {
            const height = isSpeaking 
              ? Math.sin(idx + progress) * 20 + 28 
              : ((idx % 5) + 1) * 6;

            return (
              <div
                key={idx}
                className="w-1.5 rounded-full transition-all duration-150"
                style={{
                  height: `${height}px`,
                  backgroundColor: idx % 3 === 0 ? '#0284C7' : idx % 2 === 0 ? '#7C3AED' : '#FF4D2D'
                }}
              />
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden cursor-pointer">
            <div 
              className="bg-gradient-to-r from-purple-600 via-[#FF4D2D] to-sky-600 h-full rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
            <span>{isSpeaking ? '01:45' : '00:00'}</span>
            <span>04:12</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 gap-2 flex-wrap">
          
          {/* Speed Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800">
            {[0.75, 1.0, 1.25, 1.5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => handleSpeedChange(s)}
                aria-label={`Set speech speed to ${s}x`}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition ${
                  speed === s ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {/* Main Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            aria-label={isSpeaking ? "Pause audio speech" : "Play audio speech"}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-[#FF4D2D] hover:scale-105 transition shadow-lg text-white font-bold flex items-center justify-center cursor-pointer shadow-purple-500/25"
          >
            {isSpeaking ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current translate-x-0.5" />}
          </button>

          {/* Transcript Toggle */}
          <button
            type="button"
            onClick={() => setShowTranscript(!showTranscript)}
            aria-label="Toggle transcript display"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
              showTranscript ? 'bg-sky-100 dark:bg-sky-950/60 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300' : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isAr ? 'التفريغ النصي' : 'Transcript'}</span>
          </button>

        </div>

      </div>

      {/* Chapters Navigation List */}
      <div className={`p-4 rounded-2xl border space-y-2.5 transition-colors ${
        isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>{isAr ? 'فصول ومحطات الدرس الصوتي:' : 'Audio Lecture Chapters:'}</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {audioData.chapters.map((chap, idx) => (
            <button
              key={idx}
              onClick={() => handleChapterClick(idx)}
              className={`text-start p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${
                activeChapterIndex === idx
                  ? 'bg-purple-500/15 border-purple-500 text-purple-600 dark:text-purple-400 font-bold'
                  : isDark ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="truncate">{isAr ? chap.titleAr : chap.titleEn}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono shrink-0 ml-2">
                {chap.time}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Transcript Area */}
      {showTranscript && (
        <div className={`p-5 rounded-2xl border space-y-3 shadow-sm transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-600" />
              <span>{isAr ? 'النص الصوتي المنسوق (Synchronized Transcript):' : 'Synchronized Transcript:'}</span>
            </h4>
            <span className="text-[10px] text-[#FF4D2D] font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{isAr ? 'مستخرج من ملف الـ PDF' : 'Extracted from PDF'}</span>
            </span>
          </div>
          <p className={`text-xs leading-loose p-4 rounded-xl border font-medium ${
            isDark ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            "{currentScript}"
          </p>
        </div>
      )}

    </div>
  );
};