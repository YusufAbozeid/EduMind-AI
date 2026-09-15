import React from 'react';
import { useStore } from '../../store/useStore';
import { getReadWriteData } from '../../services/topicContentService';
import { BookOpen, Sparkles, Check, Bookmark, ArrowRight, ArrowLeft } from 'lucide-react';

export const ReadWriteRenderer: React.FC = () => {
  const {
    openDyslexicEnabled,
    bulletReformatEnabled,
    toggleBulletReformat,
    bilingualMode,
    setActiveGlossaryTerm,
    language,
    themeMode,
    topics,
    activeTopicId,
    addMessage
  } = useStore();

  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
  const rwData = getReadWriteData(activeTopic, isAr);

  return (
    <div className={`space-y-6 ${openDyslexicEnabled ? 'font-opendyslexic' : ''}`}>
      
      {/* Read/Write Header */}
      <div className={`border rounded-2xl p-5 flex items-center justify-between shadow-sm transition-colors ${
        isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isAr ? 'النمط القرائي والكتابي (Read / Write Mode)' : 'Read / Write Prose Mode'}
            </h3>
            <p className="text-xs text-slate-500">
              {isAr ? 'نصوص ميسرة مستخرجة من الـ PDF مع مصطلحات أكاديمية قابلة للضغط' : 'Structured prose from PDF with interactive clickable terminology'}
            </p>
          </div>
        </div>

        {/* Reformatter Quick Button */}
        <button
          onClick={toggleBulletReformat}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer shrink-0 ${
            bulletReformatEnabled 
              ? 'bg-purple-100 border-purple-300 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800'
              : 'bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>
            {bulletReformatEnabled 
              ? (isAr ? 'مُنسق النقاط مفعل' : 'Bullet Format Active') 
              : (isAr ? 'تنسيق إلى نقاط' : 'Format as Bullets')}
          </span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className={`border rounded-2xl p-6 space-y-6 leading-relaxed shadow-sm transition-colors ${
        isDark ? 'bg-card border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Section 1 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-sky-600 border-r-2 border-sky-600 pr-3">
              {isAr ? rwData.sec1TitleAr : rwData.sec1TitleEn}
            </h4>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-semibold">
              {activeTopic.moduleCode}
            </span>
          </div>

          {bulletReformatEnabled ? (
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(isAr ? rwData.sec1BulletsAr : rwData.sec1BulletsEn).map((bullet, idx) => (
                <li 
                  key={idx} 
                  className={`flex items-start gap-2.5 p-3 rounded-xl border ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <Check className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-xs leading-loose p-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isAr ? rwData.sec1TextAr.trim() : rwData.sec1TextEn.trim()}
            </p>
          )}

          {/* Clickable Glossary Badges */}
          {Object.keys(rwData.glossaryTerms).length > 0 && (
            <div className="flex items-center gap-2 pt-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Bookmark className="w-3 h-3" />
                <span>{isAr ? 'مصطلحات مهمة:' : 'Key Terms:'}</span>
              </span>
              {Object.entries(rwData.glossaryTerms).map(([key, term]) => (
                <button
                  key={key}
                  onClick={() => setActiveGlossaryTerm(term)}
                  className="text-[11px] px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500 text-purple-600 hover:text-white border border-purple-500/30 transition-all font-semibold cursor-pointer"
                >
                  {term.word} ({term.arabic})
                </button>
              ))}
            </div>
          )}

          {isAr && bilingualMode && (
            <div className={`p-3.5 rounded-xl border text-xs text-slate-500 font-sans text-left space-y-1 dir-ltr mt-3 ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="text-[10px] text-sky-600 font-bold block uppercase">English Parallel View:</span>
              <p className="leading-relaxed">
                {rwData.parallelViewEn}
              </p>
            </div>
          )}
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pt-5 border-t border-slate-200 dark:border-slate-800/80">
          <h4 className="text-sm font-bold text-purple-600 border-r-2 border-purple-600 pr-3">
            {isAr ? rwData.sec2TitleAr : rwData.sec2TitleEn}
          </h4>

          {bulletReformatEnabled ? (
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              {(isAr ? rwData.sec2BulletsAr : rwData.sec2BulletsEn).map((bullet, idx) => (
                <li 
                  key={idx} 
                  className={`flex items-start gap-2.5 p-3 rounded-xl border ${
                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={`text-xs leading-loose p-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {isAr ? rwData.sec2TextAr.trim() : rwData.sec2TextEn.trim()}
            </p>
          )}

          {/* Ask AI about this section */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => {
                const prompt = isAr
                  ? `أنا أدرس فقرة ${rwData.sec2TitleAr} في مقرر ${activeTopic.titleAr}. ممكن تشرحها لي بمثال كود بايثون بسيط؟`
                  : `I am studying ${rwData.sec2TitleEn} in ${activeTopic.titleEn}. Could you illustrate this with a clean code example?`;
                addMessage({ sender: 'user', text: prompt });
              }}
              className="text-[11px] px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-600 text-purple-600 hover:text-white border border-purple-500/30 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{isAr ? 'اسأل المعلم الذكي عن هذه الجزئية' : 'Ask AI Tutor about this'}</span>
              {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};