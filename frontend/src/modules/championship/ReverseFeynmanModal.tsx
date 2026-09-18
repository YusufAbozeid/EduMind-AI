import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Mic, 
  MicOff,
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  BrainCircuit
} from 'lucide-react';

interface ReverseFeynmanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReverseFeynmanModal: React.FC<ReverseFeynmanModalProps> = ({ isOpen, onClose }) => {
  const { language, themeMode, addXP, activeTopicId, topics } = useStore();
  const isAr = language === 'ar';
  const isDark = themeMode === 'dark';

  const currentTopic = topics.find(t => t.id === activeTopicId) || topics[0] || {
    titleAr: 'التمرير الخلفي وضبط الأوزان العصبية',
    titleEn: 'Backpropagation and Neural Weight Optimization'
  };

  const topicTitle = isAr ? currentTopic.titleAr : currentTopic.titleEn;

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [result, setResult] = useState<any>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = isAr ? 'ar-EG' : 'en-US';

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(prev => prev + ' ' + transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, [isAr]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(isAr ? 'المتصفح لا يدعم ميزة التعرف على الصوت المباشر' : 'Speech recognition not supported in this browser.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleEvaluate = () => {
    if (!inputText.trim()) return;

    setIsEvaluating(true);
    setTimeout(() => {
      const text = inputText.toLowerCase();
      const jargons = ['اشتقاق', 'تدرج جزئي', 'هايبرباراميتر', 'جاكوبيان', 'تنسور', 'backprop', 'hyperparameter', 'gradient'];
      const detected = jargons.filter(j => text.includes(j));
      const hasAnalogy = ['زي', 'كأنه', 'تخيل', 'مثل', 'like', 'imagine'].some(w => text.includes(w));

      const simplicity = Math.min(96, Math.max(35, 80 - (detected.length * 15) + (hasAnalogy ? 20 : 0)));
      const passedGrandma = simplicity >= 70 && detected.length <= 1;

      if (passedGrandma) {
        addXP(150);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else {
        addXP(40);
      }

      setResult({
        simplicityScore: simplicity,
        detectedJargons: detected,
        hasAnalogy,
        passedGrandma,
        feedback: passedGrandma 
          ? (isAr ? 'عبقري ومبهر! شرحت الفكرة بتشبيه فطري تفهمه جدتك أو طفل صغير دون أي تعقيد!' : 'Magnificent! You explained it using a natural analogy that anyone can understand!')
          : (isAr ? `بداية ممتازة، ولكنك استخدمت مصطلحات معقدة (${detected.join('، ')}). حاول استبدالها بتشبيه من الحياة اليومية!` : 'Good start, but try replacing technical jargon with everyday real-life metaphors.')
      });

      setIsEvaluating(false);
    }, 600);
  };

  const topicLower = (currentTopic.id + ' ' + (currentTopic.titleEn || '') + ' ' + (currentTopic.titleAr || '')).toLowerCase();

  const getInspirationSamples = () => {
    if (topicLower.includes('attention') || topicLower.includes('انتباه') || topicLower.includes('session 1') || topicLower.includes('session1')) {
      return [
        {
          id: 'flashlight',
          icon: '🔦',
          titleAr: 'كشاف القراءة',
          titleEn: 'Reading Flashlight',
          textAr: 'زي لما تقرأ مقال ومعاك قلم فسفوري أو كشاف: عينك بتلقط الجملة كلها في ثانية، وتسلط الضوء (Attention Weight) على الكلمات المفتاحية اللي بتحدد المعنى وتسيب الباقي!',
          textEn: 'Like reading a book with a highlighter: you scan the entire sentence at once, focusing intense light (Attention Weight) on key terms that carry core meaning!'
        },
        {
          id: 'library',
          icon: '📚',
          titleAr: 'فهرس المكتبة (QKV)',
          titleEn: 'Library Index (QKV)',
          textAr: 'زي موظف المكتبة: بتسأله سؤال محدد (Query)، يطابق السؤال مع عناوين وفهارس الكتب (Keys)، ويديك كتاب المحتوى الفعلي (Values) اللي فيه إجابتك بالمللي!',
          textEn: 'Like searching a library: your question is a Query, the shelf tags are Keys, and when they match, you retrieve the exact knowledge Value you need!'
        },
        {
          id: 'meeting',
          icon: '👥',
          titleAr: 'نقاش متوازي',
          titleEn: 'Parallel Discussion',
          textAr: 'تخيل 5 خبراء قاعدين في اجتماع: بدل ما كل واحد يستنى اللي قبله يخلص كلام في طابور (RNN)، كلهم بيبصوا على بعض ويفهموا سياق الفكرة مع بعض في نفس اللحظة!',
          textEn: 'Imagine 5 experts in a meeting: instead of speaking one-by-one in a slow line (RNN), they concurrently exchange perspectives to form complete context instantly!'
        }
      ];
    } else if (topicLower.includes('cnn') || topicLower.includes('concurrency') || topicLower.includes('تزامن') || topicLower.includes('session 2')) {
      return [
        {
          id: 'lens',
          icon: '🔍',
          titleAr: 'عدسة الفحص',
          titleEn: 'Inspection Lens',
          textAr: 'زي مفتش اللوحات اللي ماسك عدسة مكبرة: بيمشي الفلتر (Kernel) خطوة بخطوة على الصورة عشان يكتشف الخطوط والزوايا والألوان بدون ما يفوّت تفصيلة!',
          textEn: 'Like an inspector with a magnifying glass: sliding a small filter kernel across the image to detect edges, textures, and shapes!'
        },
        {
          id: 'kitchen',
          icon: '🍳',
          titleAr: 'مطبخ التزامن',
          titleEn: 'Kitchen Concurrency',
          textAr: 'زي مطبخ المطعم: الشيف بيقطع الخضار وهو مستني المية تغلي (AsyncIO)، ولو عنده 4 طباخين على 4 بوتاجازات (Multiprocessing) يوزع عليهم اللحمة لتخطي الزحمة!',
          textEn: 'Like a busy kitchen: doing prep work while waiting for water to boil (AsyncIO), and hiring 4 distinct chefs on separate stoves (Multiprocessing) to bypass CPU limits!'
        },
        {
          id: 'puzzle',
          icon: '🧩',
          titleAr: 'تجميع البازل',
          titleEn: 'Pooling Compression',
          textAr: 'زي لما تلخص صورة بازل كبيرة: بتجمع كل 4 قطع في فكرة واحدة أساسية (Max Pooling) فتوفر مساحة التخزين وتفضل عارف شكل الصورة العام بدقة!',
          textEn: 'Like compressing a jigsaw puzzle: grouping every 4 pieces into their most dominant color (Max Pooling) to reduce complexity while preserving structure!'
        }
      ];
    } else if (topicLower.includes('rnn') || topicLower.includes('lstm') || topicLower.includes('sentiment') || topicLower.includes('session 3')) {
      return [
        {
          id: 'tape',
          icon: '📼',
          titleAr: 'شريط الكاسيت',
          titleEn: 'Memory Tape',
          textAr: 'زي شريط الكاسيت أو نوتة الملاحظات: كل كلمة في الجملة بتسيب أثر في ذاكرتك المؤقتة، وخلايا LSTM عندها بوابات نسيان عشان تمسح التفاصيل غير المهمة وتفتكر المعنى الأساسي بس!',
          textEn: 'Like a mental notebook while reading: each word updates your recurrent memory, and LSTM gates decide what to preserve and what to discard!'
        },
        {
          id: 'filter',
          icon: '🚪',
          titleAr: 'بوابات الفرز',
          titleEn: 'Gated Sieve',
          textAr: 'زي حارس البوابة: بيفحص المعلومات القديمة ويدخل المهم بس (Input Gate)، ويمسح الذكريات المشوشة (Forget Gate) عشان الموديل ميتشتتش في المقالات الطويلة!',
          textEn: 'Like a smart gatekeeper: filtering incoming information, discarding irrelevant details (Forget Gate), and passing forward only critical context!'
        },
        {
          id: 'gauge',
          icon: '📊',
          titleAr: 'مؤشر المشاعر',
          titleEn: 'Sentiment Gauge',
          textAr: 'زي مقياس السعادة والرضا: بيقرأ تعليقات المشترين على Amazon كلمة كلمة، ويجمع مشاعر الإعجاب والانتقاد في تقييم نهائي دقيق إيجابي أو سلبي!',
          textEn: 'Like a customer sentiment meter: scanning product reviews word-by-word, balancing positive and negative signals into an accurate sentiment rating!'
        }
      ];
    } else if (topicLower.includes('rag') || topicLower.includes('vector') || topicLower.includes('استرجاع') || topicLower.includes('session 8')) {
      return [
        {
          id: 'openbook',
          icon: '📖',
          titleAr: 'امتحان الكتاب المفتوح',
          titleEn: 'Open Book Exam',
          textAr: 'تخيل طالب داخل الامتحان بكتاب مفتوح: بدل ما يخمن أو يهبد من الذاكرة (Hallucination)، بيفتح الفهرس ويطلع الفقرة المؤكدة برقم الصفحة واسم الملف!',
          textEn: 'Like an open-book exam: instead of guessing or hallucinating from memory, the model retrieves the exact textbook page and cites it verbatim!'
        },
        {
          id: 'vectorcards',
          icon: '🏷️',
          titleAr: 'بطاقات الفهرسة المتجهة',
          titleEn: 'Semantic Index Cards',
          textAr: 'زي تنظيم دولاب الملابس حسب النوع واللون: بنحول مقاطع الـ PDF لمتجهات دلالية في Weaviate، ولما تسأل سؤال يروح لأقرب رف مطابق بالمعنى مش بس بتطابق الحروف!',
          textEn: 'Like an intelligent semantic filing cabinet: indexing textbook chunks by conceptual similarity, so you find the exact concept even with different wording!'
        },
        {
          id: 'factcheck',
          icon: '🎯',
          titleAr: 'التوثيق الأكاديمي الصارم',
          titleEn: 'Zero Hallucination Fact-Check',
          textAr: 'زي الصحفي الاستقصائي: أي معلومة يكتبها لازم يكون في إيده المصدر والفقرة ورقم السطر، وده اللي بيخلي RAG المنظومة الأكثر موثوقية في التعليم والطب!',
          textEn: 'Like an investigative journalist: every statement must be backed by a verified course citation and page number before being published!'
        }
      ];
    } else {
      return [
        {
          id: 'analogy1',
          icon: '💡',
          titleAr: 'التشبيه الحياتي',
          titleEn: 'Life Analogy',
          textAr: `تخيل فكرة ${topicTitle} زي لعبة خطوات متتالية: كل خطوة بتسلم اللي بعدها بوضوح عشان نوصل لأعلى نتيجة ممكنة بسهولة ويسر!`,
          textEn: `Think of ${topicTitle} like a sequence of intuitive steps: each stage transforms input data into clear, reliable results!`
        },
        {
          id: 'analogy2',
          icon: '🎯',
          titleAr: 'تبسيط التجربة',
          titleEn: 'Everyday Model',
          textAr: `زي لما تحل مسألة صعبة وتقسمها لـ 3 أجزاء بسيطة: تفهم المشكلة، تطبق الخطوة الحسابية، وتتأكد من النتيجة النهائية!`,
          textEn: `Like solving a complex problem by breaking it into three simple parts: understand the input, process it logically, and verify the outcome!`
        },
        {
          id: 'analogy3',
          icon: '🚀',
          titleAr: 'الهدف العملي',
          titleEn: 'Practical Goal',
          textAr: `الهدف الأساسي من ${topicTitle} هو توفير الوقت والمجهود الحسابي وبناء أنظمة ذكية سريعة وموثوقة تفيد المستخدم في الواقع!`,
          textEn: `The core purpose of ${topicTitle} is optimizing computational efficiency and creating robust intelligent solutions for real-world problems!`
        }
      ];
    }
  };

  const inspirationSamples = getInspirationSamples();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-md animate-fade-in">
      <div 
        dir={isAr ? 'rtl' : 'ltr'}
        className={`w-full max-w-3xl max-h-[92vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isDark 
            ? 'bg-slate-900 border-slate-700 text-slate-100 shadow-purple-500/10' 
            : 'bg-white border-slate-200 text-slate-800 shadow-slate-300'
        }`}
      >
        {/* Top Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                  {isAr ? '🧠 تحدي فاينمان العكسي (Reverse Feynman Challenge)' : '🧠 Reverse Feynman Challenge'}
                </h2>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-500 border border-purple-500/30">
                  Active Recall
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isAr ? 'الذكاء الاصطناعي يتحدّاك: اشرح الفكرة المعقدة ببساطة تفهمها جدتك أو طفل صغير!' : 'The AI challenges you: Explain a complex concept in words simple enough for your grandma!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Prompt Challenge Box */}
        <div className={`p-6 border-b ${
          isDark ? 'bg-slate-950/50 border-slate-800' : 'bg-purple-50/50 border-purple-100'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl select-none">👵</span>
            <div>
              <h3 className="text-sm font-extrabold text-purple-600 dark:text-purple-400 mb-1">
                {isAr ? 'تحدي اليوم للمنهج النشط:' : 'Today\'s Syllabus Challenge:'}
              </h3>
              <p className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">
                {isAr 
                  ? `اشرح لي موضوع "${topicTitle}" بدون استخدام أي مصطلحات رياضية جافة، واستخدم تشبيهاً بسيطاً من الحياة اليومية!`
                  : `Explain "${topicTitle}" without using dry mathematical jargon. Use an everyday relatable analogy!`}
              </p>
            </div>
          </div>

          {/* Quick Pre-fill Samples */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-purple-200/50 dark:border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {isAr ? 'أمثلة تشبيه ملهمة:' : 'Inspiration analogies:'}
            </span>
            {inspirationSamples.map(sample => (
              <button
                key={sample.id}
                type="button"
                onClick={() => setInputText(isAr ? sample.textAr : sample.textEn)}
                className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-purple-500 hover:scale-105 transition flex items-center gap-1"
              >
                <span>{sample.icon}</span>
                <span>{isAr ? sample.titleAr : sample.titleEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Textarea & Speech Recognition */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="relative">
            <textarea
              rows={4}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={isAr ? 'اكتب شرحك هنا أو اضغط على أيقونة الميكروفون وتحدث بصوتك مباشرة...' : 'Type your explanation here or click the microphone to speak...'}
              className="w-full p-4 rounded-2xl text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            />

            <div className="absolute bottom-3 left-3 rtl:left-auto rtl:right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-xl transition ${
                  isRecording 
                    ? 'bg-red-500 text-white animate-pulse shadow-md shadow-red-500/30' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-purple-500 hover:text-white'
                }`}
                title={isRecording ? 'إيقاف التسجيل' : 'تسجيل صوتي'}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {inputText && (
                <button
                  type="button"
                  onClick={() => { setInputText(''); setResult(null); }}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                  title="مسح النص"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">
              {inputText.split(/\s+/).filter(Boolean).length} {isAr ? 'كلمة' : 'words'}
            </span>

            <button
              type="button"
              onClick={handleEvaluate}
              disabled={isEvaluating || !inputText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white text-xs font-black shadow-lg shadow-purple-500/20 disabled:opacity-50 hover:scale-105 active:scale-95 transition"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEvaluating ? (isAr ? 'جاري التحليل الذكي...' : 'Evaluating...') : (isAr ? 'تقييم الشرح واختبار الجدة' : 'Submit for Grandma Test')}</span>
            </button>
          </div>

          {/* Evaluation Results Card */}
          {result && (
            <div className={`p-5 rounded-2xl border space-y-4 animate-fade-in ${
              result.passedGrandma 
                ? 'bg-emerald-500/10 border-emerald-500/40' 
                : 'bg-amber-500/10 border-amber-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold ${
                    result.passedGrandma ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}>
                    {result.passedGrandma ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {result.passedGrandma ? (isAr ? 'اجتزت اختبار الجدة بنجاح! 👵🎉' : 'Passed Grandma Test! 👵🎉') : (isAr ? 'يحتاج إلى مزيد من التبسيط 🔄' : 'Needs Simplification 🔄')}
                    </h4>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {result.passedGrandma ? '+150 XP حصلت على وسام ماستر فاينمان' : '+40 XP للمحاولة الجيدة'}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:text-left">
                  <span className="text-[10px] text-slate-400 block">{isAr ? 'مؤشر البساطة' : 'Simplicity'}</span>
                  <span className="text-xl font-black text-purple-600 dark:text-purple-400">
                    {result.simplicityScore}%
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {result.feedback}
              </p>

              {result.detectedJargons.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isAr ? 'مصطلحات معقدة تم رصدها:' : 'Jargon words detected:'}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {result.detectedJargons.map((jg: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-rose-500/10 text-rose-500 border border-rose-500/30">
                        {jg}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-3 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-500'
        }`}>
          <span className="font-bold text-purple-500">
            Feynman Pedagogical Engine
          </span>
          <span>
            {isAr ? 'إذا لم تستطع شرحها ببساطة، فأنت لم تفهمها بما يكفي — ألبرت أينشتاين' : 'If you cannot explain it simply, you do not understand it well enough'}
          </span>
        </div>
      </div>
    </div>
  );
};
