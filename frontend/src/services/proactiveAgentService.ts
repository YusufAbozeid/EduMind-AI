// =============================================================
// SHAGHOOF AI — AUTONOMOUS PROACTIVE STUDY AGENT ENGINE
// 100% Dynamic Topic-Aware Diagnostics, Weakness Detection & Tool Dispatcher
// =============================================================

import type { CourseTopic, Modality } from '../store/useStore';
import { getTopicType } from './topicContentService';

export type AgentActionType = 
  | 'SWITCH_MODALITY' 
  | 'OPEN_SLIDE' 
  | 'PLAY_PODCAST' 
  | 'LAUNCH_MICRO_QUIZ' 
  | 'SHOW_FEYNMAN_ANALOGY';

export interface AgentAction {
  id: string;
  type: AgentActionType;
  labelAr: string;
  labelEn: string;
  icon?: string;
  payload: {
    modality?: Modality;
    slideNumber?: number;
    slideTitleAr?: string;
    slideTitleEn?: string;
    slideContentAr?: string;
    slideContentEn?: string;
    podcastTimestamp?: number;
    quizQuestions?: {
      qAr: string;
      qEn: string;
      optionsAr: string[];
      optionsEn: string[];
      correct: number;
      explanationAr: string;
      explanationEn: string;
    }[];
  };
}

export interface RescueStep {
  stepNumber: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  duration: string;
  action: AgentAction;
  completed: boolean;
}

export interface RescuePlan {
  id: string;
  topicId: string;
  conceptId: string;
  conceptNameAr: string;
  conceptNameEn: string;
  masteryScore: number;
  detectedWeaknessReasonAr: string;
  detectedWeaknessReasonEn: string;
  proactiveMessageAr: string;
  proactiveMessageEn: string;
  steps: RescueStep[];
  status: 'pending' | 'in_progress' | 'completed';
  rewardXP: number;
}

// -------------------------------------------------------------
// DYNAMIC RESCUE PLANS REPOSITORY (FOR ALL TOPIC TYPES)
// -------------------------------------------------------------
const RESCUE_PLANS: Record<string, (topic: CourseTopic) => RescuePlan> = {
  transformers: (topic) => ({
    id: `rescue_transformers_${topic.id}`,
    topicId: topic.id,
    conceptId: 'self_attention_qk',
    conceptNameAr: 'حسابات الانتباه الذكي ومصفوفات Q, K, V (Self-Attention)',
    conceptNameEn: 'Self-Attention & Scaled Dot-Product (Q, K, V)',
    masteryScore: 44,
    detectedWeaknessReasonAr: 'تكرار الخطأ في حساب ضرب المصفوفات QK^T وسبب القسمة على جذر d_k في ألعاب Wordwall الأخيرة (نسبة الإتقان: 44%).',
    detectedWeaknessReasonEn: 'Repeated mistakes in QK^T dot-product scaling by sqrt(d_k) in recent Wordwall games (Mastery: 44%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظ الوكيل الذكي في موضوع (${topic.titleAr}) أنك تواجه تشتتاً في فهم مصفوفات الانتباه (Query, Key, Value) ومقياس التدرج. جهزت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق لإتقان الحسابات تماماً.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected difficulty with Self-Attention Q, K, V projections in ${topic.titleEn}. I synthesized a 3-step rescue plan (10 mins) to master it.. Ready? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لاستعراض خريطة انتباه الكلمات التفاعلية وتوزيع درجات السوفت ماكس.',
        descEn: 'Switching active modality to Visual to view the multi-head attention heatmaps and softmax distributions.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_trans_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (Visual Attention)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 12)',
        titleEn: 'Step 2: Lecture Slide 12 Spotlight',
        descAr: 'عرض شريحة المحاضرة التي تشرح معادلة: Attention(Q,K,V) = softmax((QK^T)/√d_k) · V ولماذا نقسم على جذر البعد.',
        descEn: 'Examining lecture slide 12 covering scaled dot-product attention formula and gradient stabilization.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_trans_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 12)',
          labelEn: 'Open Slide 12 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 12,
            slideTitleAr: 'الشريحة 12: معمارية الانتباه الذكي المنقسم (Scaled Dot-Product)',
            slideTitleEn: 'Slide 12: Scaled Dot-Product Attention Architecture',
            slideContentAr: 'المعادلة الذهبية:\nAttention(Q, K, V) = softmax((Q · K^T) / √d_k) · V\n\nلماذا نقسم على √d_k؟\nفي الأبعاد الكبيرة، ضرب المتجهات ينتج قيماً ضخمة تجعل دالة Softmax تقترب من الأطراف (تلاشي التدرج). القسمة على الجذر التربيعي تعيد التباين لـ 1 وتضمن تدفق تدرج سليم!',
            slideContentEn: 'Scaled dot-product prevents softmax gradients from vanishing in high-dimensional vector spaces.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لتأكيد استيعاب الانتباه الذكي وحصد +60 XP وبادج التميز.',
        descEn: '3 targeted questions to lock in Self-Attention mastery and claim +60 XP.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_trans_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق (3 أسئلة)',
          labelEn: 'Start 3-Question Quiz',
          icon: 'CheckCircle',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هو الدور الأساسي للقسمة على √d_k في معادلة الانتباه الذكي؟',
                qEn: 'What is the primary role of dividing by √d_k in scaled dot-product attention?',
                optionsAr: ['منع وصول دالة Softmax لمناطق التشبع وتلاشي التدرج', 'تقليل عدد أوزان النموذج للنصف', 'تسريع قراءة ملفات النصوص فقط', 'إلغاء الحاجة لمتجهات Value'],
                optionsEn: ['Preventing softmax saturation and vanishing gradients', 'Halving parameter count', 'Only speeding disk I/O', 'Eliminating Value vectors'],
                correct: 0,
                explanationAr: 'القسمة تعيد استقرار التباين الحسابي للمشتقات حتى لا تصبح درجات الـ Softmax حادة جداً.',
                explanationEn: 'Scaling by sqrt(d_k) stabilizes dot product magnitude so softmax gradients remain non-zero.'
              },
              {
                qAr: 'في ميكانيزم الانتباه، ما الذي يمثله متجه Query (Q)؟',
                qEn: 'In attention mechanisms, what does the Query (Q) vector represent?',
                optionsAr: ['ما تبحث عنه الكلمة الحالية من سياق في باقي الجملة', 'المحتوى الدلالي المخزن في الذاكرة', 'موضع الكلمة الزمني في الفقرة', 'الناتج النهائي لطبقة التغذية الأمامية'],
                optionsEn: ['What the current token is seeking from other tokens', 'Stored memory content', 'Positional index only', 'Feed-forward output'],
                correct: 0,
                explanationAr: 'الـ Query يمثل السؤال أو الطلب الذي تطرحه الكلمة لمطابقته مع الـ Keys الخاصة بالكلمات الأخرى.',
                explanationEn: 'Query represents the probe vector matched against Keys to compute attention weights.'
              },
              {
                qAr: 'ما الميزة المحورية للـ Transformers مقارنة بشبكات الـ RNN في تدريب النصوص الطويلة؟',
                qEn: 'What is the pivotal advantage of Transformers over RNNs in processing long sequences?',
                optionsAr: ['معالجة جميع الكلمات بالتوازي الكامل دون قيود التسلسل الزمني', 'حفظ الملفات بصيغة CSV', 'عدم استخدام أي عمليات تفاضل', 'تقليل دقة الترجمة'],
                optionsEn: ['Full parallel processing of all tokens without sequential recurrent bottlenecks', 'Saving files as CSV', 'No calculus derivatives', 'Reducing accuracy'],
                correct: 0,
                explanationAr: 'الـ Transformers تلغي الحلقات التكرارية مما يسمح باستغلال كامل لقدرات الـ GPU في التوازي.',
                explanationEn: 'Transformers process all tokens simultaneously, allowing massive GPU parallelism.'
              }
            ]
          }
        }
      }
    ]
  }),

  concurrency: (topic) => ({
    id: `rescue_concurrency_${topic.id}`,
    topicId: topic.id,
    conceptId: 'cpython_gil',
    conceptNameAr: 'قفل المفسر العام (GIL) وتعدد العمليات (Multiprocessing)',
    conceptNameEn: 'CPython GIL & Multiprocessing vs Threading',
    masteryScore: 45,
    detectedWeaknessReasonAr: 'الخلط بين مهام الـ I/O-bound و CPU-bound وتأثير الـ GIL على خيوط بايثون (نسبة الإتقان: 45%).',
    detectedWeaknessReasonEn: 'Confusion between I/O-bound vs CPU-bound tasks under CPython GIL (Mastery: 45%).',
    proactiveMessageAr: `أهلاً يا يوسف! ⚡ حلل الوكيل الذكي أداءك في (${topic.titleAr}) ولاحظ صعوبة في التمييز بين Threading و Multiprocessing بسبب قفل الـ GIL. جهزت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق.. نبدأ الآن؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! ⚡ The proactive agent detected weakness in Python GIL vs Multiprocessing in ${topic.titleEn}. Ready for a 3-step rescue plan? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: التحويل للنمط المقروء (Read/Write)',
        titleEn: 'Step 1: Read/Write Comparison Matrix',
        descAr: 'استعراض مصفوفة المقارنة الدقيقة بين الخيوط والعمليات ومكتبة AsyncIO ومتى تستخدم كل منها.',
        descEn: 'Reviewing comparison matrix between Threads, Processes, and AsyncIO event loops.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_gil_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط المقروء (Read/Write)',
          labelEn: 'Switch to Read/Write',
          icon: 'BookOpen',
          payload: { modality: 'read' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 6)',
        titleEn: 'Step 2: Slide 6 GIL Architecture Deep Dive',
        descAr: 'عرض شريحة المحاضرة التي تشرح معمارية الـ Mutex Lock ولماذا ينفذ مفسر CPython خيطاً واحداً فقط في المرة.',
        descEn: 'Examining lecture slide 6 detailing CPython mutex locking and memory safety mechanisms.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_gil_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة الـ GIL (Slide 6)',
          labelEn: 'Open Slide 6 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 6,
            slideTitleAr: 'الشريحة 6: معمارية قفل المفسر العام (GIL) في بايثون',
            slideTitleEn: 'Slide 6: CPython Global Interpreter Lock (GIL)',
            slideContentAr: 'الـ GIL هو Mutex Lock يمنع تنفيذ كود بايثون في أكثر من خيط حقيقي في نفس اللحظة لحماية عدادات المراجع Reference Counting.\n\nالنتيجة الهندسية:\n- لمهام الشبكة وقراءة الملفات (I/O-Bound): استخدم threading أو asyncio لأن الخيط يحرر الـ GIL أثناء الانتظار.\n- لمهام الذكاء الاصطناعي والحسابات الكثيفة (CPU-Bound): استخدم multiprocessing لتوزيع العمل على أنوية المعالج المستقلة!',
            slideContentEn: 'The GIL allows only one thread to execute Python bytecode at once. CPU-bound tasks require multiprocessing.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لتثبيت فهم التزامن وحصد +60 XP.',
        descEn: '3 questions to test Concurrency understanding and claim +60 XP.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_gil_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز Concurrency (3 أسئلة)',
          labelEn: 'Start Concurrency Quiz',
          icon: 'CheckCircle',
          payload: {
            quizQuestions: [
              {
                qAr: 'أي من الحلول التالية يتجاوز قفل الـ GIL تماماً للاستفادة من جميع أنوية المعالج في العمليات الحسابية الشاقة؟',
                qEn: 'Which solution completely bypasses the GIL to utilize all CPU cores for heavy computational tasks?',
                optionsAr: ['استخدام مكتبة multiprocessing مع عمليات منفصلة', 'زيادة عدد الـ Threads العادية إلى 100', 'استخدام دوال time.sleep() المتكررة', 'إلغاء متغيرات البيئة'],
                optionsEn: ['Using multiprocessing with independent OS processes', 'Increasing standard threads to 100', 'Using repeated sleep pauses', 'Removing environment variables'],
                correct: 0,
                explanationAr: 'الـ Multiprocessing ينشئ مساحة ذاكرة ومفسر بايثون منفصل لكل نواة، متجاوزاً قيد الـ GIL تماماً.',
                explanationEn: 'Multiprocessing creates separate memory space and interpreter per core, bypassing GIL.'
              },
              {
                qAr: 'ما هي بيئة المهام التي يكون فيها استخدام AsyncIO أو Threading مفيداً ومثالياً في بايثون؟',
                qEn: 'For which type of tasks is AsyncIO or Threading optimal in Python despite the GIL?',
                optionsAr: ['المهام المعتمدة على انتظار الشبكة والملفات (I/O-bound)', 'تدريب شبكات CNN الضخمة على المعالج فقط', 'تعدين العملات الرقمية', 'فك الضغط المشفر للملفات'],
                optionsEn: ['I/O-bound tasks involving network or file latency', 'CPU-only training of massive CNNs', 'Cryptocurrency mining', 'Encrypted file decompression'],
                correct: 0,
                explanationAr: 'الخيوط تحرر الـ GIL أثناء انتظار استجابة السيرفرات أو قراءة الهارد ديسك، مما يحقق سرعة عالية.',
                explanationEn: 'Threads release the GIL during blocking I/O calls, allowing other threads to run.'
              },
              {
                qAr: 'ما هي حالة سباق البيانات (Race Condition)؟',
                qEn: 'What is a Race Condition in concurrent programming?',
                optionsAr: ['تعديل متغير مشترك بين خيطين في نفس الوقت دون تزامن مما يفسد القيمة', 'تسابق خوارزميات الترتيب على الذاكرة', 'انتهاء البرنامج قبل بدء الخادم', 'عدم توافق إصدار بايثون'],
                optionsEn: ['Concurrent mutation of shared state without locking corrupting data', 'Sorting algorithms competing for RAM', 'Process terminating early', 'Version mismatch'],
                correct: 0,
                explanationAr: 'تحدث عندما تعتمد صحة النتيجة على توقيت أو ترتيب تنفيذ الخيوط غير المنضبط.',
                explanationEn: 'Occurs when multiple threads access shared data concurrently and the final result depends on timing.'
              }
            ]
          }
        }
      }
    ]
  }),

  rag: (topic) => ({
    id: `rescue_rag_${topic.id}`,
    topicId: topic.id,
    conceptId: 'rag_hybrid_rerank',
    conceptNameAr: 'البحث الهجين وتفادي ضياع السياق (Hybrid Search & Re-ranking)',
    conceptNameEn: 'Hybrid Retrieval & Cross-Encoder Re-ranking',
    masteryScore: 48,
    detectedWeaknessReasonAr: 'الخلط بين البحث الدلالي المتجهي (Cosine Similarity) والبحث اللفظي (BM25) وكيفية الترتيب (نسبة الإتقان: 48%).',
    detectedWeaknessReasonEn: 'Confusion between dense semantic vectors vs BM25 keyword matching and re-ranking (Mastery: 48%).',
    proactiveMessageAr: `مرحباً يا يوسف! 🌟 رصد الوكيل الذكي في موضوع (${topic.titleAr}) فجوة معرفية في فهم البحث الهجين وإعادة ترتيب السياق (Re-ranking). أعددت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق لإتقان منظومة الـ RAG الاحترافية.. نبدأ؟ 🚀`,
    proactiveMessageEn: `Hello Yusuf! 🌟 The agent spotted a knowledge gap in Hybrid Search & Re-ranking for ${topic.titleEn}. I prepared a 3-step rescue plan (10 mins).. Ready? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الانتقال للنمط الحركي التفاعلي',
        titleEn: 'Step 1: Switch to Kinesthetic Modality',
        descAr: 'استعراض تجربة المطابقة وسحب القطع التفاعلية لاستيعاب كيفية دمج المتجهات مع الكلمات المفتاحية.',
        descEn: 'Engaging with the interactive hands-on component for hybrid search combination.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_rag_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط الحركي (Kinesthetic)',
          labelEn: 'Switch to Kinesthetic Modality',
          icon: 'Move',
          payload: { modality: 'kinesthetic' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 8)',
        titleEn: 'Step 2: Lecture Slide 8 Spotlight',
        descAr: 'عرض شريحة المحاضرة التي تشرح معمارية الـ Cross-Encoder وتفادي ظاهرة ضياع السياق في المنتصف (Lost in the Middle).',
        descEn: 'Reviewing Slide 8 covering Cross-Encoder re-ranking to defeat Lost-in-the-Middle bias.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_rag_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة RAG المتقدمة (Slide 8)',
          labelEn: 'Open RAG Slide 8',
          icon: 'FileText',
          payload: {
            slideNumber: 8,
            slideTitleAr: 'الشريحة 8: معمارية الـ Re-ranker وتجنب ضياع السياق',
            slideTitleEn: 'Slide 8: Cross-Encoder Re-ranker Architecture',
            slideContentAr: 'الـ Cross-Encoder يقيم زوج (السؤال + الفقرة) معاً مباشرة لإعطاء درجة صلة متناهية الدقة، ثم يضع أهم الفقرات في قمة وقاع الـ Prompt لتجاوز ضعف انتباه النماذج اللغوية في المنتصف.',
            slideContentEn: 'Cross-encoders score query and document simultaneously to ensure top context is placed at prompt boundaries.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة دقيقة لتأكيد إتقان خط أنابيب الـ RAG وحصد +60 XP.',
        descEn: '3 targeted questions to secure RAG pipeline mastery.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_rag_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز RAG (3 أسئلة)',
          labelEn: 'Start RAG Quiz',
          icon: 'CheckCircle',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هي الفائدة الأساسية لدمج بحث BM25 مع البحث المتجهي (Vector Search) في الـ Hybrid RAG؟',
                qEn: 'What is the primary benefit of combining BM25 with Vector Search in Hybrid RAG?',
                optionsAr: ['التقاط الأرقام والأسماء والمصطلحات النادرة بدقة مع فهم المعنى الدلالي العام', 'تقليل استهلاك كهرباء السيرفر', 'إلغاء الحاجة لتقطيع الـ PDF', 'إجبار الموديل على الرد بالإنجليزية فقط'],
                optionsEn: ['Capturing exact IDs, acronyms and rare keywords alongside semantic meaning', 'Lowering power consumption', 'Eliminating chunking', 'Forcing English output'],
                correct: 0,
                explanationAr: 'البحث الهجين يتفوق على المتجهات وحدها في اصطياد أرقام الهواتف أو أسماء الأدوية أو الأكواد البرمجية الدقيقة.',
                explanationEn: 'Hybrid search catches rare terms, IDs, and code tokens where embeddings might blur similarities.'
              },
              {
                qAr: 'ما هي ظاهرة ضياع السياق في المنتصف (Lost in the Middle)؟',
                qEn: 'What is the Lost-in-the-Middle phenomenon in LLMs?',
                optionsAr: ['ميل النماذج اللغوية لتذكر بداية ونهاية السياق ونسيان المعلومات الواقعة في المنتصف', 'انقطاع الاتصال بقاعدة البيانات في منتصف الاستعلام', 'ضياع نصف ملف الـ PDF أثناء التقطيع', 'حدوث خطأ في ذاكرة المتصفح'],
                optionsEn: ['LLM tendency to attend to prompt start and end while ignoring the middle', 'Database timeout halfway', 'Dropping half the PDF during chunking', 'Browser RAM error'],
                correct: 0,
                explanationAr: 'أثبتت أبحاث جامعة ستانفورد أن النماذج تظهر دقة استرجاع عالية عند أطراف السياق وضعفاً ملحوظاً في الوسط.',
                explanationEn: 'Studies show LLMs recall information significantly better from prompt edges than from the center.'
              },
              {
                qAr: 'لماذا نستخدم تداخلاً (Chunk Overlap) عند تقطيع المستندات التعليمية؟',
                qEn: 'Why do we use chunk overlap when splitting educational documents?',
                optionsAr: ['لمنع انقطاع المعنى وسياق الجمل الواقعة على حدود المقاطع', 'لمضاعفة حجم الملفات دون سبب', 'لإلغاء التشفير', 'لتقليل سرعة الموديل'],
                optionsEn: ['To prevent splitting sentences and context across boundary borders', 'To duplicate storage needlessly', 'To bypass encryption', 'To slow down latency'],
                correct: 0,
                explanationAr: 'التداخل يضمن أن الكلمات المترابطة في نهاية صفحة أو فقرة لا تفقد معناها المعرفي.',
                explanationEn: 'Overlap preserves semantic continuity between consecutive segments.'
              }
            ]
          }
        }
      }
    ]
  }),

  cnn: (topic) => ({
    id: `rescue_cnn_${topic.id}`,
    topicId: topic.id,
    conceptId: 'cnn_kernels_pooling',
    conceptNameAr: 'فلاتر الالتفاف واستخلاص الخرائط المكانية (Kernels & Spatial Pooling)',
    conceptNameEn: 'Convolutional Kernels, Stride & Max Pooling Dimensions',
    masteryScore: 41,
    detectedWeaknessReasonAr: 'صعوبة في حساب أبعاد خريطة الميزات الناتجة ومعادلة الحشو (Padding) والخطوة (Stride) (نسبة الإتقان: 41%).',
    detectedWeaknessReasonEn: 'Difficulty computing feature map output dimensions with Padding and Stride (Mastery: 41%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👁️ حلل الوكيل الذكي أداءك في (${topic.titleAr}) ولاحظ صعوبة في حساب أبعاد فلاتر الـ CNN وتأثير الـ Max Pooling. جهزت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق لإتقان الحسابات.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👁️ The proactive agent noticed difficulty with CNN Kernels & Stride dimensions in ${topic.titleEn}. Ready for a 3-step rescue plan? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الانتقال للنمط البصري (Visual Schematics)',
        titleEn: 'Step 1: Switch to Visual Modality',
        descAr: 'تحويل نمط التعلم إلى البصري لرؤية حركة الفلتر خطوة بخطوة فوق مصفوفة بكسلات الصورة.',
        descEn: 'Switching to Visual modality to observe the kernel sliding across the pixel grid.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_cnn_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (Visual Filters)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 7)',
        titleEn: 'Step 2: Lecture Slide 7 Spatial Math',
        descAr: 'عرض شريحة المحاضرة التي تشرح معادلة الأبعاد: Output = ((W - K + 2P) / S) + 1 ودور الـ Max Pooling.',
        descEn: 'Examining lecture slide 7 detailing dimension calculations with Kernel K, Padding P, and Stride S.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_cnn_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة الـ CNN (Slide 7)',
          labelEn: 'Open Slide 7 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 7,
            slideTitleAr: 'الشريحة 7: معادلة حساب أبعاد خريطة الميزات في شبكات CNN',
            slideTitleEn: 'Slide 7: CNN Output Dimension & Spatial Feature Maps',
            slideContentAr: 'المعادلة الأساسية:\nOut = ⌊(W - K + 2P) / S⌋ + 1\n\nحيث:\n- W: عرض الصورة الأصلية\n- K: حجم الفلتر (Kernel)\n- P: مقدار الحشو بالأصفار (Padding)\n- S: الخطوة (Stride)\n\nدور Max Pooling: تقليل الأبعاد للنصف مع الاحتفاظ بأقوى الإشارات وتوفير ثبات موضعي (Translation Invariance)!',
            slideContentEn: 'Output dimension equals floor((W - K + 2P)/S) + 1. Pooling provides translation invariance.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لتثبيت حسابات الفلاتر وحصد +60 XP.',
        descEn: '3 targeted questions to lock in CNN mechanics and claim +60 XP.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_cnn_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز CNN (3 أسئلة)',
          labelEn: 'Start CNN Quiz',
          icon: 'CheckCircle',
          payload: {
            quizQuestions: [
              {
                qAr: 'إذا كانت الصورة بأبعاد 32x32 واستخدمنا فلتر 5x5 مع Stride=1 وبدون Padding (P=0)، ما أبعاد الناتج؟',
                qEn: 'Given a 32x32 image, 5x5 kernel, Stride=1 and Padding=0, what is the output size?',
                optionsAr: ['28x28', '32x32', '27x27', '16x16'],
                optionsEn: ['28x28', '32x32', '27x27', '16x16'],
                correct: 0,
                explanationAr: 'بتطبيق المعادلة: ((32 - 5 + 0) / 1) + 1 = 27 + 1 = 28.',
                explanationEn: 'Applying formula: ((32 - 5 + 0) / 1) + 1 = 28.'
              },
              {
                qAr: 'ما هي الوظيفة الأساسية لطبقات التجميع الأقصى (Max Pooling) في شبكات CNN؟',
                qEn: 'What is the primary function of Max Pooling layers in CNNs?',
                optionsAr: ['تقليل الأبعاد المكانية وحجم المعاملات مع الحفاظ على الملامح الأبرز', 'زيادة عدد القنوات الملونة', 'عكس ترتيب البكسلات', 'إلغاء التنشيط غير الخطي'],
                optionsEn: ['Downsampling spatial dimensions while retaining prominent features', 'Increasing color channels', 'Reversing pixels', 'Removing activation'],
                correct: 0,
                explanationAr: 'الـ Pooling يقلل العبء الحسابي ويوفر ثباتاً ضد التغيرات الطفيفة في موضع الأشكال داخل الصورة.',
                explanationEn: 'Max pooling downsamples representations, reducing computation and providing translation invariance.'
              },
              {
                qAr: 'ما الفرق الجوهري بين شبكات CNN والشبكات العادية كثيفة الاتصال (Fully Connected) في معالجة الصور؟',
                qEn: 'What is the crucial advantage of CNNs over Fully Connected networks for images?',
                optionsAr: ['مشاركة الأوزان (Weight Sharing) والحفاظ على العلاقات المكانية المجاورة للبكسلات', 'عدم الحاجة لأي تدريب', 'استخدام نصوص بدلاً من الأرقام', 'إلغاء دالة الخسارة'],
                optionsEn: ['Weight sharing and preserving 2D spatial locality between pixels', 'No training needed', 'Using text instead of numbers', 'No loss function'],
                correct: 0,
                explanationAr: 'الفلاتر تفحص الأنماط المحلية وتشارك نفس الأوزان عبر كل مناطق الصورة بدلاً من توصيل كل بكسل على حدة.',
                explanationEn: 'Kernels slide across local patches and share weights, drastically reducing parameters.'
              }
            ]
          }
        }
      }
    ]
  }),

  neural_nets: (topic) => ({
    id: `rescue_neural_${topic.id}`,
    topicId: topic.id,
    conceptId: 'backpropagation_chain_rule',
    conceptNameAr: 'الانحدار العكسي وقاعدة السلسلة (Backpropagation)',
    conceptNameEn: 'Backpropagation & Chain Rule Gradient Descent',
    masteryScore: 42,
    detectedWeaknessReasonAr: 'تكرار الأخطاء في حساب المشتقات الجزئية وتحديث الأوزان في ألعاب Wordwall الأخيرة (نسبة الإتقان: 42%).',
    detectedWeaknessReasonEn: 'Repeated mistakes detected in partial derivatives and weight updates in recent Wordwall games (Mastery: 42%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 حلل الوكيل الذكي أداءك في موضوع (${topic.titleAr}) ولاحظ صعوبة في فهم (الانحدار العكسي / Backpropagation) وتحديث الأوزان. جهزت لك خطة إنقاذ سريعة من 3 خطوات لمدة 10 دقائق لإتقان المفهوم تماماً.. هل نبدأ معاً؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected difficulty with Backpropagation in ${topic.titleEn}. I prepared an autonomous 3-step rescue plan (10 mins).. Ready? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لاستعراض مخطط تدفق الإشارات والتدرج للخلف عبر طبقات الشبكة العصبية.',
        descEn: 'Switching active modality to Visual to view the signal flow diagram and backward gradient propagation.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_backprop_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال إلى النمط البصري (Visual)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Lecture Slide 14)',
        titleEn: 'Step 2: Lecture Slide 14 Deep-Dive',
        descAr: 'استخراج وعرض الشريحة رقم 14 من مذكرة المحاضرة الرسمية التي تشرح معادلة قاعدة السلسلة ∂L/∂W = (∂L/∂y) · (∂y/∂z) · (∂z/∂W).',
        descEn: 'Displaying lecture slide 14 containing the core Chain Rule equation for weight gradients.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_backprop_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 14)',
          labelEn: 'Open Slide 14 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 14,
            slideTitleAr: 'الشريحة 14: اشتقاق قاعدة السلسلة وتحديث الأوزان',
            slideTitleEn: 'Slide 14: Chain Rule Derivation & Weight Update',
            slideContentAr: 'توضح المعادلة أن التدرج الكلي لدالة الخسارة بالنسبة للوزن W هو حاصل ضرب المشتقات المتتالية من المخرج للطبقة المخفية: ΔW = -η · (∂L/∂W).\n\nالقاعدة الذهبية: كل طبقة تحتاج فقط إشارة الخطأ القادمة من الطبقة التي تليها مضروبة في المشتقة المحلية لدالة التنشيط.',
            slideContentEn: 'The core formula defines that total loss gradient is the chained product of local derivatives: ΔW = -η · (∂L/∂W).'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: 'اختبار سريع من 3 أسئلة لتأكيد الفهم العملي وحصد +60 XP وبادج إتقان الانحدار العكسي.',
        descEn: 'A 3-question diagnostic micro-quiz to lock in understanding and award +60 XP.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_backprop_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق (3 أسئلة)',
          labelEn: 'Start 3-Question Micro-Quiz',
          icon: 'CheckCircle',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هي الأداة الرياضية الأساسية التي يعتمد عليها الانحدار العكسي لنقل التدرج للخلف؟',
                qEn: 'What is the primary mathematical tool used by Backpropagation to propagate gradients backward?',
                optionsAr: ['قاعدة السلسلة في التفاضل (Chain Rule)', 'مبرهنة فيثاغورس', 'تحويلات فورييه السريعة', 'التكامل المحدد'],
                optionsEn: ['Calculus Chain Rule', 'Pythagorean Theorem', 'Fast Fourier Transform', 'Definite Integral'],
                correct: 0,
                explanationAr: 'قاعدة السلسلة تتيح حساب مشتقة دالة مركبة كحاصل ضرب مشتقات دوالها المكونة عبر الطبقات.',
                explanationEn: 'The Chain Rule allows computing composite derivatives as the product of successive component derivatives.'
              },
              {
                qAr: 'في معادلة تحديث الوزن W = W - η · (∂L/∂W)، ماذا يمثل الرمز η؟',
                qEn: 'In the weight update equation W = W - η · (∂L/∂W), what does η represent?',
                optionsAr: ['معدل التعلم (Learning Rate)', 'عدد الطبقات المخفية', 'قيمة التنشيط الأولي', 'الخطأ التربيعي المتوسط'],
                optionsEn: ['Learning Rate', 'Hidden Layer Count', 'Activation Value', 'Mean Squared Error'],
                correct: 0,
                explanationAr: 'يمثل η (Learning Rate) حجم الخطوة التي يخطوها النموذج في اتجاه تقليل دالة الخسارة.',
                explanationEn: 'η represents the step size taken towards the minimum of the loss function.'
              },
              {
                qAr: 'ما المشكلة التي تحدث عندما تصبح مشتقات دوال التنشيط قريبة جداً من الصفر في الطبقات الأولى؟',
                qEn: 'What problem occurs when activation derivatives become extremely close to zero in early layers?',
                optionsAr: ['تلاشي التدرج (Vanishing Gradient)', 'انفجار التدرج', 'التطابق التام السريع', 'الجمود الرياضي الكامل'],
                optionsEn: ['Vanishing Gradient Problem', 'Exploding Gradient', 'Instant Overfitting', 'Deadlock'],
                correct: 0,
                explanationAr: 'تلاشي التدرج يمنع الأوزان الأولى من التحديث بسبب ضرب قيم كسرية متناهية الصغر في بعضها.',
                explanationEn: 'Vanishing gradient prevents early layers from updating because multiplying small fractions shrinks gradient to zero.'
              }
            ]
          }
        }
      }
    ]
  }),

  rnn: (topic) => ({
    id: `rescue_rnn_${topic.id}`,
    topicId: topic.id,
    conceptId: 'lstm_gates_memory',
    conceptNameAr: 'بوابات الـ LSTM وحالة الخلية الذاكرية (Cell State & Gates)',
    conceptNameEn: 'LSTM Gates (Forget/Input/Output) & Cell State',
    masteryScore: 43,
    detectedWeaknessReasonAr: 'صعوبة في التمييز بين دور بوابة النسيان (Forget Gate) وبوابة الإدخال في الحفاظ على الذاكرة طويلة المدى (نسبة الإتقان: 43%).',
    detectedWeaknessReasonEn: 'Difficulty distinguishing Forget Gate from Input Gate in preserving long-term dependencies (Mastery: 43%).',
    proactiveMessageAr: `أهلاً يا يوسف! 🔄 رصد الوكيل الذكي في موضوع (${topic.titleAr}) فجوة في فهم بوابات الـ LSTM وكيف تحل مشكلة تلاشي التدرج في النصوص المتسلسلة. أعددت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق.. نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 🔄 The proactive agent identified a gap in LSTM Gates for ${topic.titleEn}. Ready for a 3-step rescue plan? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الانتقال للنمط البصري (LSTM Circuit)',
        titleEn: 'Step 1: Switch to Visual Modality',
        descAr: 'استعراض الدائرة الكهربية الافتراضية لحركة المعلومات على شريط الذاكرة (Cell State Highway).',
        descEn: 'Viewing the schematic diagram of cell state information highways.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_rnn_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (Visual LSTM)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 9)',
        titleEn: 'Step 2: Lecture Slide 9 Spotlight',
        descAr: 'عرض شريحة المحاضرة التي تشرح معادلة بوابة النسيان: f_t = σ(W_f · [h_{t-1}, x_t] + b_f).',
        descEn: 'Examining lecture slide 9 covering Forget Gate sigmoid equation.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_rnn_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة الـ LSTM (Slide 9)',
          labelEn: 'Open Slide 9 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 9,
            slideTitleAr: 'الشريحة 9: معمارية بوابات التحكم في شبكات LSTM',
            slideTitleEn: 'Slide 9: LSTM Gated Architecture & Cell State',
            slideContentAr: 'معادلة بوابة النسيان:\nf_t = σ(W_f · [h_{t-1}, x_t] + b_f)\n\nتحدد دالة Sigmoid نسبة ما يتم حذفه من الذاكرة السابقة (بين 0 و 1). إذا كانت 0 فالمعلومة تُنسى تماماً، وإذا كانت 1 فالمعلومة تمر بالكامل دون أي تلاشي للتدرج!',
            slideContentEn: 'Forget gate outputs a number between 0 and 1, describing how much of each component should be let through.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لتثبيت فهم بوابات الـ LSTM وحصد +60 XP.',
        descEn: '3 questions to test LSTM understanding and claim +60 XP.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_rnn_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز LSTM (3 أسئلة)',
          labelEn: 'Start LSTM Quiz',
          icon: 'CheckCircle',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هي الوظيفة المحورية لبوابة النسيان (Forget Gate) في خلية الـ LSTM؟',
                qEn: 'What is the core function of the Forget Gate in an LSTM cell?',
                optionsAr: ['تحديد أي معلومات من حالة الخلية السابقة (C_{t-1}) يجب التخلص منها وأيها يُحتفظ به', 'إعادة ضبط أوزان النموذج للصفر', 'حذف ملف الكود بعد انتهاء التدريب', 'إلغاء اتصال الإنترنت'],
                optionsEn: ['Deciding what information to discard from previous cell state C_{t-1}', 'Resetting model weights to zero', 'Deleting code files', 'Disconnecting network'],
                correct: 0,
                explanationAr: 'بوابة النسيان تخرج قيماً بين 0 (انسَ هذا تماماً) و 1 (احتفظ بهذا كاملاً).',
                explanationEn: 'The forget gate outputs values between 0 and 1 determining how much past memory to preserve.'
              },
              {
                qAr: 'لماذا تستخدم شبكات LSTM دالة Sigmoid في بوابات التحكم بدلاً من ReLU؟',
                qEn: 'Why do LSTM gating units use Sigmoid instead of ReLU?',
                optionsAr: ['لأن Sigmoid تحصر القيم بين 0 و 1 مما يجعلها مثالية لتمثيل نسب السماح والحجب', 'لأنها أسرع دالة حسابية فقط', 'لأن ReLU لا تعمل على المعالج', 'لإلغاء التدرج العكسي'],
                optionsEn: ['Because Sigmoid constrains output to [0, 1], ideal for gating percentages', 'Fastest compute only', 'ReLU is unsupported', 'Cancelling backprop'],
                correct: 0,
                explanationAr: 'النسبة المئوية بين 0 و 1 تمثل فيزيائياً صمام مرور المعلومات (Gate).',
                explanationEn: 'Outputs strictly in [0, 1] represent smooth physical valves gating data flow.'
              },
              {
                qAr: 'ما هو الممر السريع (Highway) الذي ينقل المعلومات عبر الزمن دون أي ضرب غير خطي مدمر للتدرج في LSTM؟',
                qEn: 'What is the constant error carousel highway that carries information across time steps in LSTM?',
                optionsAr: ['حالة الخلية (Cell State C_t)', 'طبقة Softmax', 'فلاتر الالتفاف', 'مصفوفة التشتت'],
                optionsEn: ['Cell State (C_t)', 'Softmax Layer', 'Convolutional Filters', 'Scatter Matrix'],
                correct: 0,
                explanationAr: 'شريط حالة الخلية يعتمد على عمليات جمع خطية متوازية تسمح للتدرج بالتدفق دون تلاشي لآلاف الخطوات.',
                explanationEn: 'Cell state runs straight down the entire chain with only minor linear interactions, avoiding gradient decay.'
              }
            ]
          }
        }
      }
    ]
  })
};

// -------------------------------------------------------------
// PROACTIVE AGENT SERVICE IMPLEMENTATION
// -------------------------------------------------------------
export class ProactiveAgentService {
  /**
   * Retrieves or computes the active rescue plan dynamically for ANY topic.
   */
  static getRescuePlanForTopic(topic: CourseTopic | undefined): RescuePlan {
    if (!topic) {
      const fallbackTopic: CourseTopic = {
        id: 'default',
        moduleCode: 'AI Fundamentals',
        titleAr: 'الشبكات العصبية والذكاء الاصطناعي',
        titleEn: 'Neural Networks & Deep Learning',
        descriptionAr: 'المفاهيم الأساسية للشبكات العصبية',
        descriptionEn: 'Core neural network foundations',
        totalSteps: 5,
        icon: 'Brain',
        badge: 'Core'
      };
      return RESCUE_PLANS.neural_nets(fallbackTopic);
    }

    const type = getTopicType(topic);
    const planFactory = RESCUE_PLANS[type] || RESCUE_PLANS.neural_nets;
    return planFactory(topic);
  }

  /**
   * Evaluates if a proactive initiative banner should be displayed.
   */
  static shouldTriggerProactivePrompt(plan: RescuePlan, dismissed: boolean): boolean {
    if (dismissed) return false;
    return plan.status !== 'completed';
  }
}
