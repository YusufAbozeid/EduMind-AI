import React from 'react';
import { useStore } from '../../store/useStore';
import { Users, ShieldCheck, X } from 'lucide-react';

interface TeacherDashboardPreviewProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TeacherDashboardPreview: React.FC<TeacherDashboardPreviewProps> = ({ isOpen, onClose }) => {
  const { user, varkScores, language } = useStore();
  const isAr = language === 'ar';

  if (!isOpen) return null;

  // Build dynamic roster incorporating current user if authenticated
  const currentUserVarkText = `Visual (${varkScores.visual}%)`;
  const roster = [
    { 
      name: user.name || (isAr ? 'يوسف أبو زيد' : 'Yusuf Abozeid'), 
      vark: currentUserVarkText, 
      sen: 'Dyslexia & ADHD Accommodation', 
      status: isAr ? 'إتقان ممتاز ✨' : 'Mastery ✨', 
      score: '95%' 
    },
    { 
      name: isAr ? 'مريم أحمد' : 'Mariam Ahmed', 
      vark: 'Audio (45%)', 
      sen: 'Auditory Focus & Speech Nav', 
      status: isAr ? 'في المسار الصحيح 👍' : 'On Track 👍', 
      score: '88%' 
    },
    { 
      name: isAr ? 'عمر خالد' : 'Omar Khaled', 
      vark: 'Kinesthetic (50%)', 
      sen: 'ADHD Micro-Quests', 
      status: isAr ? 'يحتاج مراجعة ⚠️' : 'Needs Review ⚠️', 
      score: '72%' 
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-2xl bg-card border border-accent-purple/40 rounded-3xl p-6 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent-purple/20 border border-accent-purple/50 flex items-center justify-center text-accent-cyan font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isAr ? 'لوحة تحكم المعلم والشعبة (Dev D Teacher Roster)' : 'Teacher Analytics Dashboard (Dev D)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr 
                  ? 'تتبع تقدم الطلاب ومؤشرات التنوع العصبي وحالة مزامنة Moodle LMS' 
                  : 'Track student progress, neurodivergent adaptation metrics & LMS integration'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Moodle Sync Banner */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {isAr ? 'حالة ربط نظام Moodle LMS: متصل ومزامن تلقائياً' : 'Moodle LMS Integration: Live Synchronized'}
            </span>
          </div>
          <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
            Synced
          </span>
        </div>

        {/* Student Roster Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-2.5 px-3 text-right">{isAr ? 'الطالب' : 'Student'}</th>
                <th className="py-2.5 px-3 text-right">{isAr ? 'نمط VARK' : 'VARK Profile'}</th>
                <th className="py-2.5 px-3 text-right">{isAr ? 'تكييفات SEN' : 'SEN Accommodations'}</th>
                <th className="py-2.5 px-3 text-right">{isAr ? 'حالة الاستيعاب' : 'Mastery Status'}</th>
                <th className="py-2.5 px-3 text-right">{isAr ? 'النسبة' : 'Score'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {roster.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-900/40 text-slate-200 transition">
                  <td className="py-3 px-3 font-bold text-white">{row.name}</td>
                  <td className="py-3 px-3 text-accent-cyan font-semibold">{row.vark}</td>
                  <td className="py-3 px-3 text-amber-300 font-medium">{row.sen}</td>
                  <td className="py-3 px-3 text-emerald-400 font-semibold">{row.status}</td>
                  <td className="py-3 px-3 font-bold text-white">{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition"
          >
            {isAr ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
