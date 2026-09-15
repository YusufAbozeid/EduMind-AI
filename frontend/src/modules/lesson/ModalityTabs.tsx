import React from 'react';
import { useStore } from '../../store/useStore';
import type { Modality } from '../../store/useStore';
import { Eye, Headphones, BookOpen, Sliders, Sparkles } from 'lucide-react';

export const ModalityTabs: React.FC = () => {
  const { activeModality, setActiveModality, varkScores, addXP, language } = useStore();
  const isAr = language === 'ar';

  const tabs: { id: Modality; label: string; icon: React.FC<{ className?: string }>; score: number }[] = [
    { id: 'visual', label: isAr ? 'بصري 🎨' : 'Visual 🎨', icon: Eye, score: varkScores.visual },
    { id: 'audio', label: isAr ? 'سمعي 🎧' : 'Audio 🎧', icon: Headphones, score: varkScores.audio },
    { id: 'read', label: isAr ? 'قرائي 📖' : 'Read 📖', icon: BookOpen, score: varkScores.read },
    { id: 'kinesthetic', label: isAr ? 'حركي ⚙️' : 'Kinesthetic ⚙️', icon: Sliders, score: varkScores.kinesthetic },
  ];

  const handleTabClick = (modality: Modality) => {
    if (modality !== activeModality) {
      setActiveModality(modality);
      addXP(10);
    }
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeModality === tab.id;
        const isPreferred = tab.score >= 35;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold transition-all relative shrink-0 whitespace-nowrap ${
              isActive
                ? 'bg-[#FF4D2D] border-[#FF4D2D] text-white shadow-md shadow-[#FF4D2D]/25'
                : 'bg-card/80 border-slate-700/60 dark:border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
            <span>{tab.label}</span>

            {/* VARK Score Badge or +10 XP Incentive */}
            {isPreferred ? (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold shrink-0 ${
                isActive ? 'bg-white/20 text-white border border-white/30' : 'bg-[#FF4D2D]/15 text-[#FF4D2D] dark:text-[#FF7355] border border-[#FF4D2D]/30'
              }`}>
                {tab.score}%
              </span>
            ) : (
              <span className={`text-[9.5px] px-1 py-0.5 rounded-full flex items-center gap-0.5 shrink-0 ${
                isActive ? 'bg-white/20 text-white border border-white/30' : 'bg-amber-500/15 text-amber-500 dark:text-amber-300 border border-amber-500/30'
              }`}>
                <Sparkles className="w-2.5 h-2.5 shrink-0" />
                <span>+10</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
