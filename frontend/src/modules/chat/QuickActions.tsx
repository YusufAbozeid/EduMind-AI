import React from 'react';
import { useStore } from '../../store/useStore';
import { Lightbulb, HelpCircle, Brain, Baby } from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (actionText: string, level?: 'intuitive' | 'academic' | 'deep') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onSelectAction }) => {
  const { language } = useStore();
  const isAr = language === 'ar';

  const actions = [
    {
      label: isAr ? 'أعطني تلميحاً 💡' : 'Give me a hint 💡',
      text: isAr 
        ? 'ممكن تعطيني تلميح بسيط يساعدني أفهم الخوارزمية بدون حل مباشر؟'
        : 'Can you give me a simple hint to understand the algorithm step?',
      icon: Lightbulb,
      color: 'hover:border-amber-400/60 hover:bg-amber-500/10 text-amber-300'
    },
    {
      label: isAr ? 'أنا عالق! 🆘' : "I'm stuck! 🆘",
      text: isAr
        ? 'أنا حاسس إني عالق ومش فاهم خطوة التمرير الخلفي، اعطني خطة تبسيط.'
        : "I am feeling stuck on Backpropagation. Please break it down simply.",
      icon: HelpCircle,
      color: 'hover:border-rose-400/60 hover:bg-rose-500/10 text-rose-300'
    },
    {
      label: isAr ? 'شرح مبسط للغاية 👶' : 'ELI5 Simplify 👶',
      text: isAr
        ? 'اشرح لي مفهوم الشبكات العصبية بأسلوب ELI5 كأن عمري 5 سنوات بتشبيه بسيط.'
        : 'Explain Neural Networks to me like I am 5 years old (ELI5) with an easy analogy.',
      icon: Baby,
      level: 'intuitive' as const,
      color: 'hover:border-accent-cyan/60 hover:bg-accent-cyan/10 text-accent-cyan'
    },
    {
      label: isAr ? 'مستوى فاينمان المتعمق 🧠' : 'Feynman Deep Math 🧠',
      text: isAr
        ? 'اعطني إثبات رياضي وتطبيقي متعمق بدقة عالية.'
        : 'Provide a rigorous deep mathematical derivation for Backpropagation.',
      icon: Brain,
      level: 'deep' as const,
      color: 'hover:border-accent-purple/60 hover:bg-accent-purple/10 text-accent-purple'
    }
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      {actions.map((act, idx) => {
        const Icon = act.icon;
        return (
          <button
            key={idx}
            onClick={() => onSelectAction(act.text, act.level)}
            className={`whitespace-nowrap flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/80 text-[11px] font-bold transition-all ${act.color}`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
};
