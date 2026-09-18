import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Bot, 
  Sparkles, 
  Zap, 
  X, 
  TrendingDown
} from 'lucide-react';
import { ProactiveAgentService, type RescuePlan } from '../../services/proactiveAgentService';

interface ProactiveAgentBannerProps {
  onOpenRescuePlan: () => void;
}

export const ProactiveAgentBanner: React.FC<ProactiveAgentBannerProps> = ({ onOpenRescuePlan }) => {
  const { topics, activeTopicId, language } = useStore();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsDismissed(false);
  }, [activeTopicId]);

  const isAr = language === 'ar';
  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const plan: RescuePlan = ProactiveAgentService.getRescuePlanForTopic(activeTopic);

  if (isDismissed) return null;

  return (
    <div 
      className="relative overflow-hidden rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/70 via-indigo-950/60 to-slate-900/90 p-4 sm:p-4.5 shadow-lg shadow-purple-950/30 transition-all hover:border-purple-500/60"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 w-72 h-32 bg-purple-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left Side: Avatar + Alert Message */}
        <div className="flex items-start gap-3.5 min-w-0 flex-1">
          <div className="relative shrink-0 mt-0.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/40">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-300" />
                <span>{isAr ? 'مبادرة الوكيل الذكي المستقل' : 'Autonomous Study Agent'}</span>
              </span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <TrendingDown className="w-3 h-3 text-rose-400" />
                <span>{isAr ? `ثغرة تم رصدها (${plan.masteryScore}% إتقان)` : `Weakness Detected (${plan.masteryScore}%)`}</span>
              </span>
            </div>

            <p className="text-xs sm:text-[13px] font-bold text-white leading-relaxed">
              {isAr ? plan.proactiveMessageAr : plan.proactiveMessageEn}
            </p>
          </div>
        </div>

        {/* Right Side: CTA Action Buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end md:self-center w-full sm:w-auto">
          <button
            onClick={onOpenRescuePlan}
            className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center gap-1.5 transition hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
            <span>{isAr ? 'ابدأ خطة الإنقاذ (10 دقائق) 🚀' : 'Start 3-Step Rescue Plan 🚀'}</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="w-8 h-8 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 flex items-center justify-center transition"
            title={isAr ? 'تأجيل' : 'Dismiss'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};