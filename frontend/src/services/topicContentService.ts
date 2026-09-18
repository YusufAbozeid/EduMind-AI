import type { CourseTopic, GlossaryTerm } from '../store/useStore';

export type TopicType = 'concurrency' | 'rag' | 'transformers' | 'cnn' | 'rnn' | 'generic_pdf' | 'neural_nets';

export function getTopicType(topic?: CourseTopic): TopicType {
  if (!topic) return 'neural_nets';
  const text = `${topic.id} ${topic.moduleCode} ${topic.titleAr} ${topic.titleEn} ${topic.descriptionAr} ${topic.descriptionEn}`.toLowerCase();

  if (text.includes('concurrency') || text.includes('sync') || text.includes('threads') || text.includes('async') || text.includes('تزامن') || text.includes('متزامن')) {
    return 'concurrency';
  }
  if (text.includes('rag') || text.includes('weaviate') || text.includes('retrieval') || text.includes('استرجاع') || text.includes('فهرسة')) {
    return 'rag';
  }
  if (text.includes('transformer') || text.includes('attention') || text.includes('انتباه') || topic.id === 'su26_session1') {
    return 'transformers';
  }
  if (text.includes('cnn') || text.includes('intel') || text.includes('تلافيفية') || text.includes('image')) {
    return 'cnn';
  }
  if (text.includes('rnn') || text.includes('lstm') || text.includes('gru') || text.includes('تكرارية') || topic.id === 'su26_session3') {
    return 'rnn';
  }
  if (topic.id.startsWith('moodle_pdf_') || topic.moduleCode?.toLowerCase().includes('pdf')) {
    return 'generic_pdf';
  }
  return 'neural_nets';
}

// -------------------------------------------------------------
// 1. VISUAL MODALITY DATA
// -------------------------------------------------------------
export interface VisualNode {
  id: string;
  label: string;
  subLabel?: string;
  x: number;
  y: number;
  color: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
}

export interface VisualData {
  headerTitleAr: string;
  headerTitleEn: string;
  headerDescAr: string;
  headerDescEn: string;
  diagramType: TopicType;
  nodes: VisualNode[];
  card1: { icon: string; titleAr: string; titleEn: string; descAr: string; descEn: string };
  card2: { icon: string; titleAr: string; titleEn: string; descAr: string; descEn: string };
}

export function getVisualData(topic: CourseTopic): VisualData {
  const type = getTopicType(topic);

  if (type === 'concurrency') {
    return {
      headerTitleAr: 'المخطط التفاعلي: نماذج التزامن والتوازي في بايثون (Sync, Threads, AsyncIO & Multiprocessing)',
      headerTitleEn: 'Interactive Architecture: Python Concurrency & Parallelism Models',
      headerDescAr: 'اضغط على أي نموذج معماري لمعاينة طريقة تدفق المهام، تأثير قفل بايثون (GIL)، ونوع الحمل المناسب (I/O vs CPU).',
      headerDescEn: 'Click on any architecture node to inspect task flow, GIL impact, and optimal workload (I/O vs CPU bound).',
      diagramType: 'concurrency',
      nodes: [
        {
          id: 'sync',
          label: 'Sync Code',
          subLabel: 'Sequential',
          x: 90,
          y: 70,
          color: '#64748B',
          titleAr: 'الكود المتزامن التقليدي (Synchronous Execution)',
          titleEn: 'Synchronous Execution (Sequential)',
          descAr: 'المهام تنفذ واحدة تلو الأخرى. إذا توقفت مهمة لانتظار استجابة من الخادم (I/O Block)، يتجمد البرنامج بالكامل.',
          descEn: 'Tasks execute strictly one-by-one. If a task blocks on network or disk I/O, the entire program halts.'
        },
        {
          id: 'threads',
          label: 'Threading',
          subLabel: 'GIL-Bound',
          x: 230,
          y: 50,
          color: '#0284C7',
          titleAr: 'الخيوط المتعددة (Multi-Threading & ThreadPool)',
          titleEn: 'Multi-Threading (GIL-Bound)',
          descAr: 'تسمح بتشغيل عدة خيوط معاً. ممتازة لعمليات الـ I/O-Bound (شبكة وقراءة ملفات)، حيث يُطلق مفسر بايثون قفل الـ GIL أثناء الانتظار.',
          descEn: 'Manages lightweight threads sharing memory. Ideal for I/O-bound tasks where CPython releases the GIL during wait states.'
        },
        {
          id: 'asyncio',
          label: 'AsyncIO',
          subLabel: 'Event Loop',
          x: 370,
          y: 50,
          color: '#7C3AED',
          titleAr: 'البرمجة غير المتزامنة (AsyncIO & Coroutines)',
          titleEn: 'AsyncIO & Event Loop Coroutines',
          descAr: 'خيط واحد ذكي يعتمد على الـ Event Loop والكلمات المفتاحية async و await. يتعامل مع آلاف الاتصالات المتزامنة بكفاءة ذاكرة خارقة.',
          descEn: 'Single-threaded cooperative multitasking with async/await. Can comfortably handle tens of thousands of concurrent network sockets.'
        },
        {
          id: 'multiprocess',
          label: 'Multiprocess',
          subLabel: 'Bypasses GIL',
          x: 510,
          y: 70,
          color: '#FF4D2D',
          titleAr: 'المعالجة المتعددة (Multiprocessing - True Parallelism)',
          titleEn: 'Multiprocessing (True Parallelism)',
          descAr: 'تنشئ عمليات بايثون مستقلة بذاكرة منفصلة لكل نواة CPU. تتخطى الـ GIL تماماً ومخصصة للعمليات الحسابية المكثفة (CPU-Bound).',
          descEn: 'Spawns isolated Python processes across multiple CPU cores, bypassing the GIL completely for compute-heavy workloads.'
        },
        {
          id: 'gil',
          label: 'Python GIL',
          subLabel: 'Mutex Lock',
          x: 300,
          y: 175,
          color: '#D97706',
          titleAr: 'قفل مفسر بايثون العام (Global Interpreter Lock - GIL)',
          titleEn: 'Global Interpreter Lock (GIL)',
          descAr: 'قفل تنافسي في CPython يسمح لخيط واحد فقط بتنفيذ أوامر بايثون في نفس اللحظة لحماية إدارة الذاكرة (Reference Counting).',
          descEn: 'CPython mutex that prevents multiple native threads from executing Python bytecodes simultaneously to ensure thread safety.'
        }
      ],
      card1: {
        icon: 'Zap',
        titleAr: 'المهام المقيدة بالإدخال/الإخراج (I/O-Bound Workloads)',
        titleEn: 'I/O-Bound Workloads (Network & Disk)',
        descAr: 'مثل طلبات HTTP وسحب صفحات الويب وقواعد البيانات: استخدام AsyncIO أو ThreadPool يسرع البرنامج 10x إلى 50x.',
        descEn: 'Web scraping, REST API calls, database queries: AsyncIO or ThreadPool yields a 10x-50x speedup with minimal overhead.'
      },
      card2: {
        icon: 'Cpu',
        titleAr: 'المهام المقيدة بالمعالج (CPU-Bound Workloads)',
        titleEn: 'CPU-Bound Workloads (Math & Data Processing)',
        descAr: 'مثل معالجة الصور والتشفير وتدريب النماذج: الحل الوحيد هو Multiprocessing لتشغيل الأنوية الحقيقية بالتوازي.',
        descEn: 'Image transformations, cryptographic hashing, matrix operations: Multiprocessing is required for true multicore execution.'
      }
    };
  }

  if (type === 'rag') {
    return {
      headerTitleAr: 'المخطط التفاعلي: خط أنابيب الـ RAG المتقدم وقواعد البيانات الاتجاهية (Weaviate RAG Pipeline)',
      headerTitleEn: 'Interactive Architecture: Advanced RAG & Vector Database Pipeline',
      headerDescAr: 'تتبع مراحل تحويل المستندات والـ PDF إلى Chunks وتوليد الـ Embeddings واسترجاع السياق بدقة للذكاء الاصطناعي.',
      headerDescEn: 'Trace documents chunking, dense vector embeddings, hybrid retrieval, and grounded LLM generation.',
      diagramType: 'rag',
      nodes: [
        {
          id: 'docs',
          label: 'Raw PDFs',
          subLabel: 'Moodle Files',
          x: 80,
          y: 70,
          color: '#64748B',
          titleAr: 'المستندات الخام ومحاضرات Moodle',
          titleEn: 'Raw PDF Documents & Lectures',
          descAr: 'يتم قراءة النصوص وتفريغ الجداول والفصول من ملفات الـ PDF مع الحفاظ على ترقيم الصفحات وسياق الأقسام.',
          descEn: 'Extracts formatted text, tables, and metadata from course PDFs while preserving page numbers and section hierarchy.'
        },
        {
          id: 'chunking',
          label: 'Chunking',
          subLabel: 'Overlap Splitter',
          x: 220,
          y: 60,
          color: '#0284C7',
          titleAr: 'تقطيع المستندات (Recursive Character Chunking)',
          titleEn: 'Document Chunking with Overlap',
          descAr: 'تقسيم النصوص إلى مقاطع بحجم 500-1000 حرف مع تداخل (Overlap 100 حرف) لمنع ضياع المعنى عبر حدود المقاطع.',
          descEn: 'Splits text into cohesive segments (500-1000 chars) with 100-char overlap to preserve context across boundaries.'
        },
        {
          id: 'weaviate',
          label: 'Vector DB',
          subLabel: 'Weaviate Index',
          x: 360,
          y: 60,
          color: '#7C3AED',
          titleAr: 'قاعدة البيانات الاتجاهية (Weaviate Vector DB & HNSW)',
          titleEn: 'Weaviate Vector Database (Dense Embeddings)',
          descAr: 'تخزين متجهات الـ Embeddings في فضاء متعدد الأبعاد يتيح البحث الدلالي الفائق (Cosine Similarity) في جزء من الملي ثانية.',
          descEn: 'Indexes dense embeddings using HNSW graph algorithms for sub-millisecond semantic similarity search.'
        },
        {
          id: 'hybrid',
          label: 'Hybrid Search',
          subLabel: 'BM25 + Dense',
          x: 430,
          y: 175,
          color: '#D97706',
          titleAr: 'البحث الهجين (Hybrid Search: Dense Semantic + BM25 Sparse)',
          titleEn: 'Hybrid Retrieval (Dense + BM25)',
          descAr: 'يدمج البحث بالمعنى الدلالي والبحث الدقيق بالكلمات المفتاحية وأرقام الصفحات لضمان أعلى دقة استرجاع.',
          descEn: 'Combines neural dense vectors with lexical keyword matching for best-in-class retrieval precision.'
        },
        {
          id: 'llm',
          label: 'AI Generator',
          subLabel: 'Grounded LLM',
          x: 520,
          y: 70,
          color: '#FF4D2D',
          titleAr: 'المولد الذكي الموثق (Grounded LLM & Citations)',
          titleEn: 'Grounded LLM with Accurate Citations',
          descAr: 'يستقبل استفسار الطالب مع السياق الموثق ويولد إجابة أكاديمية موثقة برقم الصفحة واسم الملف دون أي هلوسة.',
          descEn: 'Generates fact-checked academic explanations strictly citing course name, file, and exact page number.'
        }
      ],
      card1: {
        icon: 'Layers',
        titleAr: 'المتجهات الدلالية (Dense Embeddings)',
        titleEn: 'Dense Semantic Embeddings',
        descAr: 'تحويل الجمل إلى مصفوفات رقمية تعكس المعنى الحقيقي، مما يمكن النظام من العثور على الإجابة حتى لو اختلفت صياغة السؤال.',
        descEn: 'Captures nuanced semantic intent beyond exact keywords, matching questions to answers conceptually.'
      },
      card2: {
        icon: 'CheckCircle',
        titleAr: 'التوثيق الأكاديمي ومنع الهلوسة (Zero Hallucination)',
        titleEn: 'Zero Hallucination Citations',
        descAr: 'كل معلومة يقدمها المعلم الذكي مصحوبة برابط موثق للمحاضرة والصفحة داخل مقرر الـ Moodle.',
        descEn: 'Every generated claim links to verified course lecture source chunks and page numbers.'
      }
    };
  }

  if (type === 'transformers') {
    return {
      headerTitleAr: 'المخطط التفاعلي: معمارية المحولات وآلية الانتباه الذاتي (Transformers & Self-Attention)',
      headerTitleEn: 'Interactive Architecture: Transformer & Multi-Head Self-Attention',
      headerDescAr: 'استكشف كيف تترابط الكلمات عبر مصفوفات الـ Query و Key و Value لفهم العلاقات اللغوية العميقة.',
      headerDescEn: 'Explore how tokens attend to each other via Query, Key, and Value matrices to model complex semantics.',
      diagramType: 'transformers',
      nodes: [
        {
          id: 'tokens',
          label: 'Tokens + Pos',
          subLabel: 'Encoding',
          x: 90,
          y: 70,
          color: '#64748B',
          titleAr: 'ترميز الرموز والمواقع (Token & Positional Encoding)',
          titleEn: 'Token & Positional Embeddings',
          descAr: 'تحويل الكلمات لأرقام مع إضافة مصفوفة المواقع لحفظ ترتيب الكلمات في الجملة بالتوازي.',
          descEn: 'Converts input words into vectors infused with sinusoidal position markers for parallel processing.'
        },
        {
          id: 'qkv',
          label: 'Q, K, V',
          subLabel: 'Projections',
          x: 230,
          y: 60,
          color: '#0284C7',
          titleAr: 'إسقاطات Q و K و V (Query, Key, Value Projections)',
          titleEn: 'Query, Key, Value Projections',
          descAr: 'كل كلمة تولد استعلام (Query) ومفتاح (Key) وقيمة (Value) لتقييم مدى ترابطها مع باقي كلمات الجملة.',
          descEn: 'Computes Query, Key, and Value projections to score semantic resonance between all token pairs.'
        },
        {
          id: 'attention',
          label: 'Self-Attention',
          subLabel: 'Softmax Matrix',
          x: 370,
          y: 60,
          color: '#7C3AED',
          titleAr: 'الانتباه الذاتي الموزون (Scaled Dot-Product Attention)',
          titleEn: 'Scaled Dot-Product Attention',
          descAr: 'ضرب مصفوفات Q في ترانسبوز K مقسوماً على جذر البعد، ثم تطبيق Softmax للحصول على أوزان الانتباه.',
          descEn: 'Calculates softmax((Q * K^T) / sqrt(d_k)) * V to capture dynamic dependencies irrespective of distance.'
        },
        {
          id: 'multihead',
          label: 'Multi-Head',
          subLabel: 'Parallel Heads',
          x: 430,
          y: 175,
          color: '#D97706',
          titleAr: 'الانتباه متعدد الرؤوس (Multi-Head Attention)',
          titleEn: 'Multi-Head Attention Layers',
          descAr: 'تشغيل 8 إلى 16 رأس انتباه متوازية ليركز كل رأس على نمط مختلف (قواعد، تشابه دلالي، علاقات مكانية).',
          descEn: 'Enables the model to jointly attend to information from different representation subspaces concurrently.'
        },
        {
          id: 'ffn',
          label: 'FFN & Norm',
          subLabel: 'Add & Norm',
          x: 520,
          y: 70,
          color: '#FF4D2D',
          titleAr: 'الشبكة الأمامية والتطبيع (Feed-Forward & LayerNorm)',
          titleEn: 'Feed-Forward Network & Layer Normalization',
          descAr: 'طبقات متتالية لتكثيف التعلم مع وصلات Residual لمنع تلاشي التدرج الرياضي أثناء التدريب.',
          descEn: 'Deep feedforward layers coupled with residual skip connections and normalization stabilize gradient flow.'
        }
      ],
      card1: {
        icon: 'Sparkles',
        titleAr: 'التوازي الفائق بدلاً من التكرار (No Sequential Bottleneck)',
        titleEn: 'Massive Parallelization over RNNs',
        descAr: 'على عكس الـ RNN التي تعالج كلمة كلمة، المحولات تعالج الجملة بالكامل دفعة واحدة عبر بطاقات الرسوميات GPU.',
        descEn: 'Processes all sequence tokens simultaneously on modern GPUs, drastically cutting training duration.'
      },
      card2: {
        icon: 'Brain',
        titleAr: 'الذاكرة السياقية الممتدة (Long-Range Context Window)',
        titleEn: 'Long-Range Context Windows',
        descAr: 'آلية الانتباه تلغي مشكلة نسيان بداية النص حتى في المستندات والكتب الدراسية الطويلة.',
        descEn: 'Self-attention spans thousands of tokens without vanishing gradient issues, keeping full document context alive.'
      }
    };
  }

  // Fallback / Neural Networks Default
  return {
    headerTitleAr: 'المخطط التفاعلي: هندسة الشبكات العصبية والتعلم العميق (Neural Networks Architecture)',
    headerTitleEn: 'Interactive Architecture: Neural Network & Deep Learning Architecture',
    headerDescAr: 'اضغط على أي طبقة داخل المخطط البصري لمعاينة طريقة تدفق البيانات والأوزان وتوليد النتائج.',
    headerDescEn: 'Click any layer in the visual diagram to inspect data flow, weight matrices, and output predictions.',
    diagramType: 'neural_nets',
    nodes: [
      {
        id: 'input',
        label: 'Input X',
        subLabel: 'Features',
        x: 100,
        y: 80,
        color: '#64748B',
        titleAr: 'طبقة المدخلات (Input Layer)',
        titleEn: 'Input Features Layer',
        descAr: 'تستقبل مصفوفات الميزات الرقمية أو بكسلات الصور بعد التجهيز الأولي.',
        descEn: 'Receives raw numerical feature vectors or normalized image pixels for processing.'
      },
      {
        id: 'hidden',
        label: 'Hidden H',
        subLabel: 'Weights + ReLU',
        x: 300,
        y: 60,
        color: '#7C3AED',
        titleAr: 'الطبقات الخفية (Hidden Layers & Activations)',
        titleEn: 'Hidden Layers (Weights & ReLU)',
        descAr: 'تقوم بضرب المدخلات في مصفوفة الأوزان (Weights) وإضافة الانحياز (Bias) مع تطبيق دوال التنشيط غير الخطية مثل ReLU.',
        descEn: 'Computes matrix multiplications, applies trainable biases, and executes non-linear activation functions.'
      },
      {
        id: 'output',
        label: 'Output Y',
        subLabel: 'Softmax Score',
        x: 500,
        y: 80,
        color: '#0284C7',
        titleAr: 'طبقة المخرجات (Output Predictions)',
        titleEn: 'Output Classification Layer',
        descAr: 'تحسب الاحتمالية النهائية للنتيجة وتوزع احتمالات الفئات بدالة Softmax.',
        descEn: 'Emits normalized class probability distributions via Softmax activation.'
      }
    ],
    card1: {
      icon: 'Zap',
      titleAr: 'التدفق الأمامي (Forward Pass)',
      titleEn: 'Forward Pass',
      descAr: 'تنتقل المدخلات من اليسار إلى اليمين لحساب التوقع الأولي للنموذج.',
      descEn: 'Signals propagate forward across layer weights to compute baseline predictions.'
    },
    card2: {
      icon: 'Sparkles',
      titleAr: 'التمرير الخلفي (Backpropagation)',
      titleEn: 'Backpropagation',
      descAr: 'يتم حساب نسبة الخطأ وتعديل الأوزان لتقليل دالة الخسارة في كل دورة تدريب.',
      descEn: 'Loss error gradients flow backward to adjust synaptic weights and drive learning convergence.'
    }
  };
}

// -------------------------------------------------------------
// 2. AUDIO MODALITY DATA
// -------------------------------------------------------------
export interface AudioData {
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  audioScriptAr: string;
  audioScriptEn: string;
  chapters: { time: string; titleAr: string; titleEn: string }[];
}

export function getAudioData(topic: CourseTopic): AudioData {
  const type = getTopicType(topic);

  if (type === 'concurrency') {
    return {
      titleAr: 'المُستمع الذكي: ملخص البرمجة المتزامنة في بايثون (Python Concurrency Audio Digest)',
      titleEn: 'Smart Audio Digest: Python Concurrency, AsyncIO & Threads',
      descAr: 'شرح صوتي ميسر مع استعراض عملي للفروق الدقيقة بين Sync و Threading و AsyncIO و Multiprocessing.',
      descEn: 'Clear, engaging audio lecture walking you through Threading, AsyncIO Event Loop, GIL, and Multiprocessing.',
      audioScriptAr: `
        أهلاً بك في الملخص الصوتي لدرس البرمجة المتزامنة في بايثون، مستخرج من مذكرات التدريب الصيفي.
        البرمجة المتزامنة مش مجرد تشغيل كل الأكواد مع بعض، ولكنها فن اختيار النموذج المناسب لكل مهمة!
        أولاً: الكود التتابعي Synchronous بينفذ الأوامر واحد ورا التاني، ولو حصل انتظار شبكة البرنامج بيقف.
        ثانياً: الـ Multi-threading بيفيد جداً في مهام الـ I/O-Bound، لأن مفسر بايثون بيفك قفل الـ GIL ويسيب الخيوط التانية تشتغل.
        ثالثاً: الـ AsyncIO مع async و await بيعتمد على Event Loop ذكي على خيط واحد، وبيقدر يخدم آلاف الاتصالات بأقل استهلاك للذاكرة.
        وأخيراً: لو بتعمل عمليات حسابية تقيلة CPU-Bound، مفيش حل غير الـ Multiprocessing لتوزيع الشغل على كل أنوية المعالج وتخطي الـ GIL.
      `,
      audioScriptEn: `
        Welcome to the audio digest on Python Concurrency, extracted from your Moodle course syllabus.
        Writing concurrent code is about choosing the right model for the right workload!
        Sequential sync code blocks the program during I/O delays.
        Multi-threading is ideal for network and disk I/O because Python releases the GIL during wait operations.
        AsyncIO uses an event loop on a single thread to handle tens of thousands of concurrent connections efficiently.
        For CPU-bound processing, Multiprocessing bypasses the GIL by spawning worker processes across all CPU cores.
      `,
      chapters: [
        { time: '00:00', titleAr: 'المقدمة: التزامن مقابل التوازي (Concurrency vs Parallelism)', titleEn: 'Intro: Concurrency vs Parallelism' },
        { time: '01:05', titleAr: 'قفل بايثون العام GIL وتأثيره الحقيقي', titleEn: 'The Python GIL Explained' },
        { time: '02:10', titleAr: 'الـ Event Loop في AsyncIO وكيف يخدم آلاف الطلبات', titleEn: 'AsyncIO Event Loop in Depth' },
        { time: '03:15', titleAr: 'متى تختار Threading ومتى تختار Multiprocessing؟', titleEn: 'Choosing the Right Tool' }
      ]
    };
  }

  if (type === 'rag') {
    return {
      titleAr: 'المُستمع الذكي: ملخص تقنيات الـ RAG المتقدمة و Weaviate',
      titleEn: 'Smart Audio Digest: Advanced RAG Techniques & Weaviate',
      descAr: 'شرح صوتي متقدم يغطي استراتيجيات الـ Chunking والبحث الدلالي بالمتجهات واسترجاع السياق الموثق.',
      descEn: 'Audio masterclass on document chunking, dense vector retrieval, and zero-hallucination grounding.',
      audioScriptAr: `
        أهلاً بك في الملخص الصوتي لتقنيات الـ RAG المتقدمة مع Weaviate.
        الـ Retrieval-Augmented Generation هو الحل الجذري لمنع هلوسة نماذج الذكاء الاصطناعي.
        بتبدأ الرحلة بتقسيم ملفات المقررات الـ PDF إلى مقاطع Chunks مع نسبة تداخل تمنع انقطاع المعنى.
        بعدها بيتم تحويل كل مقطع لمتجه كثيف Dense Embedding وتخزينه في Weaviate.
        عند طرح أي سؤال، بنعمل Hybrid Search يدمج الفهم الدلالي مع مطابقة الكلمات المفتاحية، ويتم تزويد المعلم الذكي بالسياق الموثق برقم الصفحة بدقة متناهية.
      `,
      audioScriptEn: `
        Welcome to the audio summary on Advanced RAG Techniques with Weaviate.
        RAG anchors LLM responses in real course documents to eliminate hallucination.
        Course PDFs are parsed into overlapping chunks, vectorized into dense embeddings, and indexed in Weaviate.
        Hybrid search pairs semantic understanding with BM25 keywords to feed the AI verified context down to the exact page number.
      `,
      chapters: [
        { time: '00:00', titleAr: 'أهمية الـ RAG ومنع هلوسة الذكاء الاصطناعي', titleEn: 'Why RAG Matters' },
        { time: '01:15', titleAr: 'هندسة الـ Chunking والتداخل الدلالي', titleEn: 'Chunking & Overlap Engineering' },
        { time: '02:20', titleAr: 'فهرسة Weaviate والبحث الهجين Hybrid Search', titleEn: 'Weaviate Indexing & Hybrid Search' },
        { time: '03:30', titleAr: 'التوثيق الأكاديمي بالأرقام والصفحات', titleEn: 'Verified Page Citations' }
      ]
    };
  }

  if (type === 'transformers') {
    return {
      titleAr: 'المُستمع الذكي: ملخص معمارية الـ Transformers وآلية الانتباه',
      titleEn: 'Smart Audio Digest: Transformers & Attention Mechanisms',
      descAr: 'شرح صوتي لمعمارية نموذج Attention Is All You Need وتطور معالجة اللغات الطبيعية.',
      descEn: 'Audio digest on self-attention, QKV matrices, and multi-head parallel representations.',
      audioScriptAr: `
        أهلاً بك في الملخص الصوتي لورقة Attention Is All You Need ومعمارية المحولات.
        المحولات أحدثت ثورة لأنها تخلت تماماً عن التكرار التسلسلي في الـ RNN.
        من خلال آلية الـ Self-Attention، كل كلمة في النص بتبص على باقي الكلمات في نفس الوقت وتحسب وزن ترابطها عبر مصفوفات Query و Key و Value.
        والـ Multi-Head Attention بيسمح للنموذج بالانتباه لأنماط مختلفة زي النحو والدلالة والسياق في نفس الوقت بالتوازي.
      `,
      audioScriptEn: `
        Welcome to the audio breakdown of Transformers and Attention Mechanisms.
        Transformers revolutionized AI by replacing sequential RNN steps with fully parallel self-attention.
        Using Query, Key, and Value projections, tokens attend to the entire sequence simultaneously to capture context effortlessly.
      `,
      chapters: [
        { time: '00:00', titleAr: 'لماذا تفوقت الـ Transformers على الـ RNN؟', titleEn: 'Why Transformers Won' },
        { time: '01:20', titleAr: 'رياضيات الـ Query والـ Key والـ Value', titleEn: 'The Q, K, V Matrix Math' },
        { time: '02:35', titleAr: 'رؤوس الانتباه المتعددة Multi-Head Attention', titleEn: 'Multi-Head Attention' }
      ]
    };
  }

  // Fallback
  return {
    titleAr: 'المُستمع الذكي: ملخص الدرس السمعي (Audio Digest)',
    titleEn: 'Smart Audio Digest: Waveform Audio Player',
    descAr: 'قارئ صوتي ميسر مع التحكم الكامل بالسرعة والجدول النصي.',
    descEn: 'Interactive audio summary with variable playback speed & transcript.',
    audioScriptAr: `
      مرحباً بك في الشرح السمعي الميسر للدرس الحالي.
      تعتمد خوارزميات التعلم الذكي على تقسيم البيانات إلى ميزات وطبقات معالجة وتغذية راجعة.
      يمكنك استخدام أدوات التيسير والاستماع بالسرعة المناسبة لك لتحقيق أعلى استيعاب أكاديمي.
    `,
    audioScriptEn: `
      Welcome to your interactive audio digest for the current topic.
      Listen to clear synthesized audio breakdowns designed for optimal retention.
    `,
    chapters: [
      { time: '00:00', titleAr: 'المقدمة والمفاهيم الأساسية', titleEn: 'Core Introduction' },
      { time: '01:15', titleAr: 'التحليل المعماري والخطوات', titleEn: 'Step-by-Step Architecture' },
      { time: '02:30', titleAr: 'التطبيق العملي والأسئلة', titleEn: 'Practical Application' }
    ]
  };
}

// -------------------------------------------------------------
// 3. READ / WRITE MODALITY DATA
// -------------------------------------------------------------
export interface ReadWriteData {
  sec1TitleAr: string;
  sec1TitleEn: string;
  sec1BulletsAr: string[];
  sec1BulletsEn: string[];
  sec1TextAr: string;
  sec1TextEn: string;
  sec2TitleAr: string;
  sec2TitleEn: string;
  sec2BulletsAr: string[];
  sec2BulletsEn: string[];
  sec2TextAr: string;
  sec2TextEn: string;
  parallelViewEn: string;
  glossaryTerms: Record<string, GlossaryTerm>;
}

export function getReadWriteData(topic: CourseTopic, isAr: boolean): ReadWriteData {
  const type = getTopicType(topic);

  if (type === 'concurrency') {
    return {
      sec1TitleAr: '1. ما هي البرمجة المتزامنة في بايثون؟ (Concurrency vs Parallelism)',
      sec1TitleEn: '1. What is Python Concurrency (Concurrency vs Parallelism)?',
      sec1BulletsAr: [
        'التزامن (Concurrency) هو القدرة على تنظيم وإدارة عدة مهام معاً، وليس بالضرورة تشغيلها في نفس النانو ثانية.',
        'التوازي (Parallelism) هو التشغيل الحقيقي في نفس اللحظة عبر أنوية معالج متعددة (Multiprocessing).',
        'مفسر بايثون CPython يستخدم قفل مفسر عام يسمى GIL يمنع تشغيل أكثر من خيط بايثون في نفس الوقت للنواة الواحدة.',
        'المهام المقيدة بالإدخال/الإخراج (I/O-Bound) مثل طلبات الشبكة وقواعد البيانات تستفيد بنسبة 100% من Threading و AsyncIO.'
      ],
      sec1BulletsEn: [
        'Concurrency is dealing with a lot of things at once (structure), while Parallelism is doing multiple things at once (execution).',
        'CPython enforces a Global Interpreter Lock (GIL) preventing multiple native threads from running bytecode concurrently.',
        'I/O-bound tasks release the GIL during network delays, allowing massive speedups with Threading and AsyncIO.',
        'CPU-bound tasks require Multiprocessing to bypass the GIL and utilize physical processor cores.'
      ],
      sec1TextAr: `
        البرمجة المتزامنة في بايثون تعتمد على التمييز بين نوعين من الأحمال: العمليات المقيدة بالإدخال والإخراج (I/O-Bound) مثل تحميل صفحات الويب وقراءة قواعد البيانات، والعمليات المقيدة بالمعالج (CPU-Bound) مثل معالجة الصور والتشفير. في حالة الـ I/O-Bound، يقضي البرنامج أغلب وقته منتظراً الخادم، وهنا يأتي دور الـ Multi-threading والـ AsyncIO لتنفيذ مهام أخرى أثناء الانتظار، مما يحول كفاءة البرنامج من ثوانٍ إلى أجزاء من الثانية.
      `,
      sec1TextEn: `
        Python concurrency centers around understanding your workload bottleneck: I/O-bound vs CPU-bound. When making network calls or reading disk files, code spends most of its time waiting. Utilizing Threading or AsyncIO allows the program to switch context and process other tasks during wait states, turning minutes of execution into sub-second runs.
      `,
      sec2TitleAr: '2. مقارنة النماذج الأربعة: Sync vs Threads vs AsyncIO vs Multiprocessing',
      sec2TitleEn: '2. The 4 Models: Sync vs Threads vs AsyncIO vs Multiprocessing',
      sec2BulletsAr: [
        'Sync: كود خطي تسلسلي بسيط، مناسب للمهام الصغيرة التي لا تحتاج لأي توازي.',
        'Threading: خيوط نظام تشغيل خفيفة تشترك في الذاكرة، ممتازة لطلبات HTTP وتتطلب حذر من الـ Race Conditions.',
        'AsyncIO: حلقة أحداث ذكية (Event Loop) بخيط واحد غير مجمّد، تتعامل مع 10,000+ اتصال متزامن بأقل استهلاك RAM.',
        'Multiprocessing: عمليات منفصلة تماماً بذاكرة معزولة تتخطى الـ GIL، الحل المثالي للـ AI والحسابات الرياضية.'
      ],
      sec2BulletsEn: [
        'Sync: Linear sequential execution, ideal for simple scripts without I/O blocking.',
        'Threading: Lightweight OS threads sharing memory, ideal for web scrapers and REST API consumers.',
        'AsyncIO: Single-threaded cooperative event loop handling 10,000+ concurrent connections with tiny memory footprint.',
        'Multiprocessing: Completely isolated processes bypassing the GIL for compute-heavy ML and data tasks.'
      ],
      sec2TextAr: `
        لاختيار الأداة المناسبة: إذا كان كودك ينتظر الشبكة أو الـ APIs، استخدم AsyncIO مع async/await لكفاءة ذاكرة استثنائية، أو ThreadPoolExecutor لسهولة الدمج مع المكتبات القديمة. أما إذا كنت تقوم بتدريب نموذج ذكاء اصطناعي أو معالجة صور ضخمة، فإن Multiprocessing هو الخيار الحصري الذي يستغل كافة أنوية المعالج ويتخطى قفل الـ GIL تماماً.
      `,
      sec2TextEn: `
        To select the right architecture: If your code waits on HTTP APIs or database transactions, use AsyncIO for unmatched throughput or ThreadPoolExecutor for legacy code. If your bottleneck is mathematical computation or image processing, Multiprocessing is the only way to scale across all CPU cores and bypass Python's GIL.
      `,
      parallelViewEn: 'Python Concurrency distinguishes between I/O-bound tasks (solved by AsyncIO and Threads) and CPU-bound tasks (solved by Multiprocessing to bypass the GIL).',
      glossaryTerms: {
        gil: {
          word: 'GIL (Global Interpreter Lock)',
          arabic: 'قفل مفسر بايثون العام',
          definition: isAr
            ? 'آلية قفل في لغة CPython تسمح بتنفيذ خيط واحد فقط في المرة الواحدة لحماية إدارة الذاكرة من التضارب.'
            : 'A mutex in CPython that allows only one thread to execute Python bytecodes at a time to ensure thread-safe reference counting.',
          culturalNote: isAr ? 'يشبه ممر الدخول الضيق الذي يسمح بمرور شخص واحد في المرة الواحدة لحفظ النظام.' : 'Like a single-lane turnstile allowing one passenger at a time.',
          image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80'
        },
        eventloop: {
          word: 'Event Loop',
          arabic: 'حلقة الأحداث',
          definition: isAr
            ? 'المحرك الأساسي في AsyncIO الذي يراقب المهام غير المتزامنة وينقل التنفيذ إلى المهمة الجاهزة فور اكتمال انتظارها.'
            : 'The central orchestration loop in AsyncIO that schedules and executes non-blocking coroutines when their I/O waits resolve.',
          culturalNote: isAr ? 'تشبه النادل الذكي الذي يخدم الطاولة الجاهزة دون أن ينتظر الطباخ أمام الفرن.' : 'Like an efficient waiter servicing tables rather than idling in the kitchen.',
          image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80'
        },
        coroutine: {
          word: 'Coroutine (async/await)',
          arabic: 'الروتينات التعاونية',
          definition: isAr
            ? 'دوال يمكن تعليق تنفيذها مؤقتاً عبر أمر await وإعادة استئنافها لاحقاً دون حجز موارد المعالج.'
            : 'Special Python functions defined with async def that can yield execution via await and resume when ready.',
          culturalNote: isAr ? 'مثل وضع المكالمة على الانتظار للرد على مكالمة طارئة أخرى ثم العودة للأولى.' : 'Like pausing a phone call to answer another urgent query, then resuming seamlessly.',
          image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80'
        }
      }
    };
  }

  if (type === 'rag') {
    return {
      sec1TitleAr: '1. ما هو الـ RAG (Retrieval-Augmented Generation)؟',
      sec1TitleEn: '1. What is RAG (Retrieval-Augmented Generation)?',
      sec1BulletsAr: [
        'الـ RAG يدمج بين قوة الاسترجاع الدلالي من قواعد البيانات وقدرة التوليد اللغوي للنماذج الذكية.',
        'يمنع ظاهرة الهلوسة (Hallucination) عبر إجبار النموذج على الاستشهاد بفقرات محددة من المنهج.',
        'يتم تقطيع المستندات إلى Chunks متجانسة بحجم 500-1000 حرف مع تداخل 100 حرف للحفاظ على السياق.',
        'يتم تحويل المقاطع إلى متجهات أرقام كثيفة (Dense Vectors) باستخدام نماذج Embeddings متخصصة.'
      ],
      sec1BulletsEn: [
        'RAG blends information retrieval from vector stores with generative language intelligence.',
        'Eliminates hallucination by forcing the LLM to ground its claims in verified curriculum passages.',
        'Documents are split into cohesive chunks (500-1000 chars) with overlap to preserve semantic continuity.',
        'Chunks are transformed into dense semantic embeddings stored inside high-performance vector databases like Weaviate.'
      ],
      sec1TextAr: `
        يمثل الـ RAG العمود الفقري للأنظمة التعليمية الذكية، حيث لا يعتمد المعلم الذكي على معلوماته العامة فقط، بل يقوم بالبحث الحي داخل مقررات الطالب المسحوبة من Moodle. يتم استخراج الفقرات الدقيقة ومطابقتها دلالياً مع سؤال الطالب، ثم إرسال الفقرات كمرجع رسمي للنموذج ليصيغ إجابة أكاديمية موثقة برقم الصفحة والمقرر.
      `,
      sec1TextEn: `
        RAG serves as the foundation for modern AI tutoring. Rather than relying on outdated weights, the assistant performs real-time semantic retrieval over course PDFs, extracting relevant paragraphs to supply as grounded context alongside student questions.
      `,
      sec2TitleAr: '2. قواعد البيانات الاتجاهية والبحث الهجين (Weaviate & Hybrid Search)',
      sec2TitleEn: '2. Vector Databases & Hybrid Search in Weaviate',
      sec2BulletsAr: [
        'قواعد البيانات الاتجاهية تستخدم خوارزميات مثل HNSW للبحث عن أقرب المتجهات في أجزاء من الملي ثانية.',
        'البحث الهجين (Hybrid Search) يجمع بين البحث الدلالي العصبي (Dense) والبحث اللفظي (BM25 Sparse).',
        'يضمن البحث الهجين العثور على المفاهيم الفلسفية بالدلالة، والعثور على الأكواد والمعادلات بالكلمات الدقيقة.',
        'يقوم النظام بتوليد استشهادات أكاديمية دقيقة تظهر للطالب بصيغة [اسم المقرر، اسم الملف، الصفحة].'
      ],
      sec2BulletsEn: [
        'Vector databases utilize graph indexing (HNSW) to compute nearest-neighbor cosine similarities in sub-milliseconds.',
        'Hybrid Search merges dense semantic embeddings with lexical sparse BM25 keyword matching.',
        'Ensures abstract concepts match by meaning, while exact acronyms and variable names match precisely.',
        'System generates grounded citations showing exact course title, filename, and page number.'
      ],
      sec2TextAr: `
        تتميز قواعد بيانات Weaviate بقدرتها على دمج البحث الدلالي مع الكلمات المفتاحية التقليدية في استعلام واحد متكامل. هذا المزيج يضمن أنه لو سأل الطالب بصياغة عامية أو بكلمات مختلفة، سيفهم النظام المقصود ويسترجع نفس الصفحة التي تحتوي على الحل الأكاديمي.
      `,
      sec2TextEn: `
        Weaviate excels by synthesizing vector embeddings and lexical keywords into unified hybrid queries. This allows students to ask questions in colloquial dialects or varied phrasing, while consistently retrieving the exact curriculum pages needed.
      `,
      parallelViewEn: 'RAG anchors AI answers in real course materials via dense embeddings and Weaviate hybrid search, delivering zero-hallucination tutoring with verified page citations.',
      glossaryTerms: {
        embeddings: {
          word: 'Dense Embeddings',
          arabic: 'المتجهات الدلالية الكثيفة',
          definition: isAr ? 'تمثيل رياضي للكلمات والجمل في فضاء متعدد الأبعاد يعكس المعنى الحقيقي للنص.' : 'High-dimensional vector representations capturing deep contextual and semantic meaning.',
          culturalNote: isAr ? 'تشبه الإحداثيات الجغرافية لكنها للمفاهيم والأفكار.' : 'Like GPS coordinates for concepts in meaning-space.',
          image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80'
        },
        hybridsearch: {
          word: 'Hybrid Search',
          arabic: 'البحث الهجين',
          definition: isAr ? 'تقنية تجمع بين البحث بالمعنى (Dense Vector) والبحث الدقيق بالكلمات (BM25) لأعلى دقة استرجاع.' : 'A search strategy combining neural vector semantic matching with lexical BM25 keyword search.',
          culturalNote: isAr ? 'مثل البحث بالاسم ورقم الهوية معاً لضمان عدم حدوث أي خطأ.' : 'Like searching by name and national ID simultaneously for foolproof accuracy.',
          image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80'
        }
      }
    };
  }

  // Fallback / Neural Networks Default
  return {
    sec1TitleAr: '1. ما هي الشبكات العصبية الاصطناعية؟ (What are ANNs?)',
    sec1TitleEn: '1. What are Artificial Neural Networks (ANNs)?',
    sec1BulletsAr: [
      'الشبكة العصبية هي نموذج برمجي يحاكي الخلايا البيولوجية في الدماغ البشري.',
      'تتلقى المدخلات عبر العقد (Nodes) وتضربها في أوزان ترجيحية قابلة للتعلم (Weights).',
      'تمر الحسابات عبر الطبقات الخفية (Hidden Layers) لاستخلاص الأنماط غير الخطية المعقدة.',
      'تخرج الاحتمالات والتصنيفات النهائية عبر طبقة المخرجات (Output Layer).'
    ],
    sec1BulletsEn: [
      'Neural networks are computational models inspired by biological brain neurons.',
      'Inputs propagate across nodes multiplied by trainable synaptic connection weights.',
      'Calculations pass through hidden layers applying non-linear activation functions.',
      'Predictions and class probabilities emit through the output layer via Softmax.'
    ],
    sec1TextAr: `
      الشبكات العصبية الاصطناعية هي نماذج رياضية مستوحاة من الخلايا العصبية للمخ. تعتمد على تقسيم العمل بين طبقات من العُقد (Nodes). تمر المدخلات بالطبقات حتى تصل إلى الطبقة الخفية (Hidden Layer) التي تقوم بمعالجة الملامح واستخلاص الأنماط الصعبة قبل إخراج النتيجة النهائية.
    `,
    sec1TextEn: `
      Artificial Neural Networks are computational architectures inspired by biological brain structures. Inputs propagate across layers of interconnected nodes. Signals reach the Hidden Layer to extract non-linear feature representations before emitting final classification outputs.
    `,
    sec2TitleAr: '2. دور التمرير الخلفي وضبط الأوزان (Backpropagation)',
    sec2TitleEn: '2. The Role of Backpropagation & Weight Tuning',
    sec2BulletsAr: [
      'عندما تخطئ الشبكة في التوقع، يتم حساب نسبة الخطأ باستخدام دالة الخسارة (Loss Function).',
      'تعود خوارزمية Backpropagation بالاتجاه المعاكس لحساب مشتقات الخطأ لكل وزن.',
      'يتم تعديل الأوزان بمقدار محكوم بمعدل التعلم (Learning Rate) لتقليل الخطأ مستقبلاً.',
      'تتكرر هذه الدورة عبر عدة دورات تدريبية (Epochs) حتى تصل الشبكة لدقة عالية.'
    ],
    sec2BulletsEn: [
      'Prediction errors are measured using objective loss functions.',
      'Backpropagation reverses signal flow to compute partial loss gradients for each parameter.',
      'Weights are incrementally updated according to the learning rate to minimize overall error.',
      'The process repeats over multiple training epochs until the network reaches optimal convergence.'
    ],
    sec2TextAr: `
      عندما تخطئ الشبكة في التوقع، يتم استدعاء خوارزمية Backpropagation لعكس الاتجاه وتعديل الأوزان. هذا التعديل يقلل من نسبة الخطأ في الدورة القادمة حتى تصل الشبكة لنسبة دقة عالية.
    `,
    sec2TextEn: `
      When prediction errors occur, the Backpropagation algorithm reverses signal flow to compute loss gradients and update internal weight parameters, minimizing future loss over training epochs.
    `,
    parallelViewEn: 'Artificial Neural Networks mimic biological brain structures. Inputs pass through Hidden Layers for non-linear pattern extraction before producing final class predictions.',
    glossaryTerms: {
      backpropagation: {
        word: 'Backpropagation',
        arabic: 'التمرير الخلفي للأخطاء',
        definition: isAr
          ? 'خوارزمية تستخدم لتعديل أوزان الروابط العصبية بناءً على نسبة الخطأ المحسوبة بين التوقع والنتيجة الحقيقية.'
          : 'An algorithm used to update neural network weights based on calculated loss gradient between predicted and actual target values.',
        culturalNote: isAr ? 'تشبه خطوة المراجعة الذاتية للتصحيح بعد الامتحانات.' : 'Similar to self-correction after reviewing exam mistakes.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80'
      },
      hiddenlayer: {
        word: 'Hidden Layer',
        arabic: 'الطبقة الخفية',
        definition: isAr
          ? 'طبقة معالجة تقع بين المدخلات والمخرجات تقوم باستخلاص الملامح والأنماط المعقدة.'
          : 'A feature processing layer situated between input and output layers that extracts non-linear representations.',
        culturalNote: isAr ? 'تشبه مطبخ المطعم الداخلي الذي يعد الوجبة قبل تقديمها للزبون.' : 'Like the internal kitchen preparing the dish before table delivery.',
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=400&q=80'
      }
    }
  };
}

// -------------------------------------------------------------
// 4. KINESTHETIC MODALITY DATA
// -------------------------------------------------------------
export interface KinestheticData {
  headerTitleAr: string;
  headerTitleEn: string;
  headerDescAr: string;
  headerDescEn: string;
  badgeAr: string;
  badgeEn: string;
  simType: TopicType;
}

export function getKinestheticData(topic: CourseTopic): KinestheticData {
  const type = getTopicType(topic);

  if (type === 'concurrency') {
    return {
      headerTitleAr: 'المختبر التفاعلي الحركي: محاكي قياس أداء التزامن (Python Concurrency Benchmark Lab)',
      headerTitleEn: 'Kinesthetic Concurrency Benchmark Simulator: Sync vs Threads vs AsyncIO vs Multiprocessing',
      headerDescAr: 'غيّر نوع الحمل (I/O-Bound vs CPU-Bound) وعدد المهام وشاهد سرعة التنفيذ الحية وتأثير قفل الـ GIL بنفسك!',
      headerDescEn: 'Toggle workload type (I/O vs CPU), adjust task batches, and measure live execution speed and GIL utilization!',
      badgeAr: 'مختبر أداء التزامن العملي',
      badgeEn: 'Concurrency Simulator',
      simType: 'concurrency'
    };
  }

  if (type === 'rag') {
    return {
      headerTitleAr: 'المختبر التفاعلي الحركي: محاكي تقطيع النصوص والتشابه الاتجاهي (RAG Chunking & Vector Lab)',
      headerTitleEn: 'Kinesthetic RAG Lab: Chunking Size, Overlap & Cosine Similarity Simulator',
      headerDescAr: 'حرّك سلايدرات حجم المقاطع ونسبة التداخل وافحص درجات التشابه الدلالي (Cosine Similarity) في استرجاع المحاضرات.',
      headerDescEn: 'Adjust chunk size and overlap sliders to see how vector cosine similarity changes during retrieval.',
      badgeAr: 'مختبر الـ RAG والـ Vector DB',
      badgeEn: 'RAG Lab Simulation',
      simType: 'rag'
    };
  }

  if (type === 'transformers') {
    return {
      headerTitleAr: 'المختبر التفاعلي الحركي: محاكي مصفوفة الانتباه الذاتي (Self-Attention Matrix Explorer)',
      headerTitleEn: 'Kinesthetic Transformer Lab: Self-Attention Weight Explorer',
      headerDescAr: 'حرّك أوزان الـ Query والـ Key لمشاهدة توزيع درجات الانتباه عبر مصفوفة الـ Softmax مباشرة.',
      headerDescEn: 'Manipulate Query and Key vectors to watch attention weights recalculate across token matrices.',
      badgeAr: 'مختبر مصفوفات الانتباه',
      badgeEn: 'Attention Matrix Lab',
      simType: 'transformers'
    };
  }

  return {
    headerTitleAr: 'المختبر التفاعلي الحركي (Kinesthetic Lab Simulation)',
    headerTitleEn: 'Kinesthetic Interactive Lab Simulation',
    headerDescAr: 'حرّك المعاملات وسلايدرات الضبط للتحكم في دقة الشبكة العصبية بنفسك.',
    headerDescEn: 'Adjust hyperparameter sliders to dynamically control neural network accuracy.',
    badgeAr: 'تفاعل حركي مباشر',
    badgeEn: 'Interactive Lab',
    simType: 'neural_nets'
  };
}

// -------------------------------------------------------------
// 5. PODCAST MODALITY DYNAMIC DIALOGUE ENGINE
// -------------------------------------------------------------
export interface PodcastHostTurn {
  speaker: 'host1' | 'host2';
  speakerName: string;
  avatar: string;
  role: string;
  text: string;
  timestamp: string;
}

export function getPodcastDialogue(topic: CourseTopic, language: string = 'ar', dialect: boolean = true): PodcastHostTurn[] {
  const type = getTopicType(topic);
  const isAr = language === 'ar';
  const title = isAr ? topic.titleAr : topic.titleEn;

  // 1. Session 1: Text Preprocessing & Attention
  if (type === 'transformers' || topic.id === 'su26_session1') {
    if (isAr && dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `أهلاً بيكم يا شباب في حلقة جديدة من كبسولة بودكاست شغوف! النهاردة بنفكك سوا موضوع السيشين الأولى الأهم: معالجة النصوص وحسابات الانتباه (Text Preprocessing & Attention). إزيك يا مريم، جاهزة نبسط معمارية الـ Attention سوا؟`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `أهلاً دكتور يوسف! بصراحة جداً ومتحمسة. ورقة Attention Is All You Need بتلخبط طلبة كتير في البداية لما يشوفوا مصفوفات الـ Query و Key و Value وتجهيز الـ Tokens!`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `بالظبط! الفكرة بسيطة جداً: تخيلي جملة زي 'البنك على شاطئ النهر' وجملة 'سحبت فلوس من البنك'. إزاي النموذج بيعرف معنى كلمة 'البنك' في السياقين؟`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `عن طريق الكلمات المجاورة ليها! كلمة 'شاطئ' بتوجه المعنى للطبيعة، بينما كلمة 'فلوس' بتوجه المعنى للمؤسسة المالية!`,
          timestamp: '00:48'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `الله ينور عليكي! ده بالظبط آلية الـ Self-Attention! بنضرب الـ Query في ترانسبوز الـ Key ونطبق Softmax عشان نحدد وزن ترابط كل كلمة مع باقي الكلمات، ونعالج الجملة كاملة بالتوازي على الـ GPU بدلاً من بطء الـ RNN القديم!`,
          timestamp: '01:05'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `روعة! وبكده الـ Embedding بياخد بُعد دلالي حي، وكل رأس في الـ Multi-Head بيتعلم نمط لغوي مختلف. استوعبت الفكرة تماماً وجاهزة لتطبيق أكواد الـ Preprocessing!`,
          timestamp: '01:25'
        }
      ];
    } else if (isAr && !dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'خبير النظم الذكية',
          text: `مرحباً بكم في حلقة جديدة من البودكاست التعليمي لمنصة شغوف. موضوع جلستنا اليوم: معالجة النصوص وحسابات الانتباه (Text Preprocessing & Attention). أهلاً بكِ مريم.`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'باحثة نظم الحوسبة',
          text: `أهلاً بك دكتور يوسف. تمثل آلية الانتباه الذاتي Self-Attention حجر الزاوية في نماذج معالجة اللغات الحديثة، ابتداءً من ترميز الرموز Tokenization وحتى بناء مصفوفات التضمين Embeddings.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'خبير النظم الذكية',
          text: `صحيح تماماً. المبدأ يقوم على حساب مصفوفات Q و K و V لتقييم الترابط الدلالي بين كافة مفردات الجملة بالتوازي عبر مقياس Scaled Dot-Product وتطبيق دالة Softmax.`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'باحثة نظم الحوسبة',
          text: `وهذا يفسر التخلص التام من الاختناق التسلسلي الذي عانت منه شبكات RNN، مما مكن المحولات من معالجة السياقات الضخمة بسرعة فائقة ودقة متناهية.`,
          timestamp: '00:50'
        }
      ];
    } else {
      return [
        {
          speaker: 'host1',
          speakerName: 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: 'Lead AI Scientist',
          text: `Welcome to the SHAGHOOF AI Deep-Dive Podcast! Today we explore Session 1: Text Preprocessing and the Attention Mechanism. Ready Mariam?`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'Mariam',
          avatar: '👩‍🔬',
          role: 'AI Research Engineer',
          text: `Thrilled to be here! The Attention Is All You Need architecture completely revolutionizes NLP by ditching recurrence for parallel self-attention.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: 'Lead AI Scientist',
          text: `Exactly! Through Query, Key, and Value matrix projections, every token measures semantic resonance against all other sequence tokens via Scaled Dot-Product Attention.`,
          timestamp: '00:35'
        },
        {
          speaker: 'host2',
          speakerName: 'Mariam',
          avatar: '👩‍🔬',
          role: 'AI Research Engineer',
          text: `And multi-head projections allow the model to concurrently attend to grammatical structure, factual relations, and distant dependencies across GPU tensor cores!`,
          timestamp: '00:55'
        }
      ];
    }
  }

  // 2. Session 2: CNN & Concurrency
  if (type === 'cnn' || topic.id === 'su26_session2') {
    if (isAr && dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `أهلاً بيكم يا شباب في حلقة جديدة من بودكاست شغوف! النهاردة معادنا مع السيشين التانية: الشبكات التلافيفية CNN وتصنيف الصور والبرمجة المتزامنة Concurrency في بايثون. جاهزة يا مريم؟`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `أهلاً دكتور يوسف! بصراحة موضوع شيق جداً، دمج الرؤية الحاسوبية على مجموعة بيانات Intel Kaggle مع تحديات التزامن والـ GIL في بايثون مهم جداً للتطبيقات الواقعية.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `بالظبط! فكرة الـ CNN بتعتمد على فلاتر كيرنل (Kernels) صغيرة بتنزلق على بكسلات الصورة لاستخراج ملامح زي الحواف والزوايا، وبنعمل Max Pooling لتقليل الحجم والحفاظ على أهم الخصائص.`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `وعلى جانب بايثون، لما نحمل آلاف الصور بنستخدم Threading أو AsyncIO لتسريع الـ I/O، بينما معالجة البكسلات الحسابية بتحتاج Multiprocessing لتخطي قفل الـ GIL!`,
          timestamp: '00:48'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `الله يفتح عليكي! التفرقة دي بين الـ I/O-Bound والـ CPU-Bound هي اللي بتخلي نظام الذكاء الاصطناعي يشتغل في الإنتاج بكفاءة وسرعة استثنائية!`,
          timestamp: '01:05'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `عظيم جداً! كده وضحت صورة الـ Feature Extraction وتكاملها مع بنية الـ Concurrency البرمجية. يلا بينا على التطبيق العملي!`,
          timestamp: '01:25'
        }
      ];
    } else if (isAr && !dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'خبير النظم الذكية',
          text: `مرحباً بكم في حلقة جديدة من البودكاست التعليمي لمنصة شغوف. نناقش اليوم: الشبكات التلافيفية CNN وتصنيف الصور وأنظمة التزامن Concurrency. أهلاً بكِ مريم.`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'باحثة نظم الحوسبة',
          text: `أهلاً دكتور يوسف. تكمن قوة شبكات CNN في قدرتها الفائقة على استخلاص الخصائص المكانية للصورة عبر طبقات الالتفاف Convolution والتجميع Pooling.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'خبير النظم الذكية',
          text: `بالتأكيد. ويقترن ذلك برفع كفاءة تحميل البيانات عبر معمارية التزامن؛ حيث نتجاوز قيود قفل بايثون GIL باستخدام المعالجة المتعددة Multiprocessing للأعباء الحسابية.`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'باحثة نظم الحوسبة',
          text: `وهذا يحقق التوازن الأمثل بين دقة نموذج التصنيف وسرعة معالجة التدفقات الصورية الضخمة.`,
          timestamp: '00:50'
        }
      ];
    } else {
      return [
        {
          speaker: 'host1',
          speakerName: 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: 'Lead AI Scientist',
          text: `Welcome back! Today we break down Session 2: Convolutional Neural Networks (CNNs) and Python Concurrency Architecture. Ready Mariam?`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'Mariam',
          avatar: '👩‍🔬',
          role: 'AI Research Engineer',
          text: `Excited for this! CNN feature extraction on the Intel image dataset combined with Python GIL bypass strategies makes for an essential production deep dive.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: 'Lead AI Scientist',
          text: `Exactly. Convolutional kernels scan spatial hierarchies while pooling reduces dimensions. Pairing this with Multiprocessing ensures full CPU-bound throughput without GIL bottleneck.`,
          timestamp: '00:35'
        },
        {
          speaker: 'host2',
          speakerName: 'Mariam',
          avatar: '👩‍🔬',
          role: 'AI Research Engineer',
          text: `Clear, robust, and highly scalable. Let's inspect the pipeline!`,
          timestamp: '00:55'
        }
      ];
    }
  }

  // 3. Session 3: RNN, LSTM & Sentiment Analysis
  if (type === 'rnn' || topic.id === 'su26_session3') {
    if (isAr && dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `أهلاً بيكم يا شباب في حلقة جديدة من بودكاست شغوف! النهاردة موضوعنا عن السيشين التالتة: الشبكات التكرارية RNN و LSTM و GRU وتصنيف المشاعر على داتا ست Amazon Polarity. إزيك يا مريم؟`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `أهلاً دكتور يوسف! موضوع الـ Recurrence والذاكرة الزمنية في السلاسل النصية ده كان التحدي الأكبر لعلماء الذكاء الاصطناعي لعقود!`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `بالظبط! الـ Vanilla RNN كانت بتعاني من مشكلة قاتلة اسمها تلاشي التدرج Vanishing Gradient، فالشبكة كانت بتنسى أول الجملة لما النص يطول!`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `وهنا ظهرت عبقرية خلايا LSTM مع بوابات النسيان Forget Gate والإدخال Input Gate والإخراج Output Gate للتحكم بدقة في تدفق المعلومات عبر الزمن!`,
          timestamp: '00:48'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `صح جداً! وبفضل بنية البوابات دي، الموديل بيقدر يحلل تقييمات العملاء الطويلة على Amazon ويحدد المشاعر إيجابية ولا سلبية بدقة عالية جداً!`,
          timestamp: '01:05'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `رائع جداً! فهمت الفارق بين الـ Cell State والـ Hidden State ومستعدة لاختبار نموذج تصنيف المشاعر عملياً!`,
          timestamp: '01:25'
        }
      ];
    } else if (isAr && !dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'خبير النظم الذكية',
          text: `مرحباً بكم في حلقة جديدة من البودكاست التعليمي لمنصة شغوف. جلستنا اليوم مخصصة للشبكات التكرارية (RNN, LSTM, GRU) وتطبيقات تصنيف المشاعر. أهلاً بكِ مريم.`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'باحثة نظم الحوسبة',
          text: `أهلاً دكتور يوسف. يمثل التعامل مع البيانات المتسلسلة زمنياً تحدياً محورياً نظراً لمشكلة تلاشي التدرج الرياضي في الشبكات التكرارية البسيطة.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'خبير النظم الذكية',
          text: `صحيح تماماً. وتكمن المعالجة الحاسمة في معمارية LSTM عبر تسييل الذاكرة الطويلة Cell State وضبط بوابات النسيان والتحديث للحفاظ على السياق.`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'باحثة نظم الحوسبة',
          text: `مما يجعلها مثالية لتصنيف النصوص المعقدة وتحليل المشاعر بدقة عالية في مجموعات البيانات الحقيقية.`,
          timestamp: '00:50'
        }
      ];
    } else {
      return [
        {
          speaker: 'host1',
          speakerName: 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: 'Lead AI Scientist',
          text: `Welcome! Today we dissect Session 3: Recurrent Neural Networks, LSTMs, GRUs, and Sentiment Analysis. Ready Mariam?`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'Mariam',
          avatar: '👩‍🔬',
          role: 'AI Research Engineer',
          text: `Excited to be here! The transition from vanishing gradient issues in vanilla RNNs to gated memory cells in LSTMs is a pivotal milestone in sequential modeling.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: 'Lead AI Scientist',
          text: `Indeed. By regulating the cell state through forget, input, and output gates, LSTMs preserve long-range text context for accurate sentiment polarity classification.`,
          timestamp: '00:35'
        },
        {
          speaker: 'host2',
          speakerName: 'Mariam',
          avatar: '👩‍🔬',
          role: 'AI Research Engineer',
          text: `Crucial foundation before scaling to transformers. Let's analyze the recurrent gates!`,
          timestamp: '00:55'
        }
      ];
    }
  }

  // 4. Session 5: Fine-tuning LoRA/QLoRA & Streamlit
  if (topic.id === 'su26_session5') {
    if (isAr && dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `أهلاً بيكم يا شباب في حلقة جديدة من بودكاست شغوف! النهاردة معادنا مع موضوع السيشين الخامسة: الضبط الدقيق بنظام LoRA و QLoRA ونشر التطبيقات بواجهة Streamlit! جاهزة يا مريم؟`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `أهلاً دكتور يوسف! بصراحة موضوع في غاية الأهمية. تدريب النماذج الضخمة Full Fine-Tuning بيحتاج سيرفرات بملايين، فإزاي LoRA حلت المعضلة دي؟`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `عبقرية LoRA إننا بنجمد أوزان الموديل الأساسية بالكامل، وبنضيف مصفوفتين صغيرين جداً برتبة منخفضة (Low Rank) للتدريب، فنوفر أكتر من 90% من الذاكرة!`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `ومع QLoRA بنعمل تكميم Quantization بدقة 4-bit، فالموديل يشتغل على كارت شاشة شخصي عادي، ونبنيله واجهة تفاعلية بـ Streamlit في دقايق!`,
          timestamp: '00:48'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `بالظبط! ودي المهارة الأساسية اللي بتخليك قادر تبني منتجات ذكاء اصطناعي جاهزة للاستخدام الحقيقي بتكلفة اقتصادية مذهلة.`,
          timestamp: '01:05'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `رائع جداً! مستعدة تماماً لتطبيق كود الـ PEFT ورفع واجهة التطبيق التفاعلية!`,
          timestamp: '01:25'
        }
      ];
    } else {
      return [
        {
          speaker: 'host1',
          speakerName: isAr ? 'د. يوسف' : 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: isAr ? 'كبير باحثي الذكاء الاصطناعي' : 'Lead AI Scientist',
          text: isAr
            ? `مرحباً بكم في حلقة بودكاست شغوف حول تقنيات الضبط الدقيق الفعال LoRA و QLoRA ونشر النماذج بواجهات Streamlit.`
            : `Welcome to the deep dive on Parameter-Efficient Fine-Tuning: LoRA, QLoRA, and Streamlit deployment!`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: isAr ? 'مريم' : 'Mariam',
          avatar: '👩‍🔬',
          role: isAr ? 'مهندسة وباحثة ذكاء اصطناعي' : 'AI Research Engineer',
          text: isAr
            ? `أهلاً دكتور يوسف. تكمن أهمية LoRA في تجميد أوزان النموذج وتدريب مصفوفات منخفضة الرتبة مما يوفر الذاكرة الحسابية بشكل جذري.`
            : `Glad to be here! LoRA freezes foundational weights and trains low-rank adapter matrices, slashing GPU VRAM requirements by over 80%.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: isAr ? 'د. يوسف' : 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: isAr ? 'كبير باحثي الذكاء الاصطناعي' : 'Lead AI Scientist',
          text: isAr
            ? `صحيح تماماً، ومع تكميم 4-bit في تقنية QLoRA نتمكن من تشغيل النماذج وتطوير واجهات تفاعلية سريعة عبر Streamlit بكفاءة إنتاجية عالية.`
            : `Pairing that with 4-bit NormalFloat quantization in QLoRA empowers us to deploy interactive Streamlit AI apps on accessible hardware.`,
          timestamp: '00:35'
        }
      ];
    }
  }

  // 5. Session 8: RAG & Vector Databases
  if (type === 'rag' || topic.id === 'su26_session8') {
    if (isAr && dialect) {
      return [
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `أهلاً بيكم يا شباب في حلقة جديدة من بودكاست شغوف! النهاردة بنفكك السيشين التامنة الأهم: التوليد المعزز بالاسترجاع RAG وقواعد البيانات المتجهة Vector DBs! جاهزة يا مريم؟`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `أهلاً دكتور يوسف! جداً ومتحمسة. الـ RAG هو النقلة النوعية اللي حلت مشكلة الهلوسة Hallucination في النماذج التوليدية وجعلت الذكاء الاصطناعي موثوق 100%!`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `بالظبط! الفكرة عاملة زي الطالب اللي داخل الامتحان بكتاب مفتوح: بنقطع ملفات الـ PDF لمقاطع Chunks مع نسبة تداخل Overlap، ونحولها لمتجهات دلالية نخزنها في Weaviate أو FAISS!`,
          timestamp: '00:32'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `ولما الطالب يسأل سؤاله، بنعمل بحث تشابه جيب التمام Cosine Similarity، ونسترجع الفقرة المطابقة بالضبط برقم الصفحة واسم الملف ونمررها للـ LLM مع السؤال!`,
          timestamp: '00:48'
        },
        {
          speaker: 'host1',
          speakerName: 'د. يوسف',
          avatar: '👨‍🏫',
          role: 'كبير باحثي الذكاء الاصطناعي',
          text: `الله يفتح عليكي! بكده الإجابة تكون موثقة علمياً بدقة مية في المية، وده المعيار الأكاديمي الحقيقي المعتمد في منصة شغوف.`,
          timestamp: '01:05'
        },
        {
          speaker: 'host2',
          speakerName: 'مريم',
          avatar: '👩‍🔬',
          role: 'مهندسة ذكاء اصطناعي وباحثة',
          text: `ممتاز جداً! استوعبت هندسة الـ Chunking والبحث الدلالي تماماً ومستعدة لفحص مقاييس الـ RAG Triad عملياً!`,
          timestamp: '01:25'
        }
      ];
    } else {
      return [
        {
          speaker: 'host1',
          speakerName: isAr ? 'د. يوسف' : 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: isAr ? 'كبير باحثي الذكاء الاصطناعي' : 'Lead AI Scientist',
          text: isAr
            ? `مرحباً بكم في حلقة بودكاست شغوف حول التوليد المعزز بالاسترجاع RAG وقواعد البيانات المتجهة Vector Databases.`
            : `Welcome to the SHAGHOOF AI Deep-Dive on Retrieval-Augmented Generation (RAG) and Vector Databases!`,
          timestamp: '00:00'
        },
        {
          speaker: 'host2',
          speakerName: isAr ? 'مريم' : 'Mariam',
          avatar: '👩‍🔬',
          role: isAr ? 'مهندسة وباحثة ذكاء اصطناعي' : 'AI Research Engineer',
          text: isAr
            ? `أهلاً دكتور يوسف. يمثل الـ RAG الحل الجذري للقضاء على الهلوسة في نماذج LLM وربط الإجابات بمستندات Moodle الموثقة.`
            : `Excited to discuss this! RAG grounds generative models in verified course PDFs to ensure zero-hallucination factual precision.`,
          timestamp: '00:15'
        },
        {
          speaker: 'host1',
          speakerName: isAr ? 'د. يوسف' : 'Dr. Yusuf',
          avatar: '👨‍🏫',
          role: isAr ? 'كبير باحثي الذكاء الاصطناعي' : 'Lead AI Scientist',
          text: isAr
            ? `صحيح تماماً، عبر تقطيع المستندات وتضمينها متجهات واسترجاعها عبر Weaviate و FAISS بالتشابه الاتجاهي وتوثيق رقم الصفحة بدقة.`
            : `Through recursive chunking, dense vector indexing, and cosine similarity retrieval, the LLM receives verified page citations for every claim.`,
          timestamp: '00:35'
        }
      ];
    }
  }

  // 6. Generic / Custom / Any other topic (Dynamic Synthesis)
  return [
    {
      speaker: 'host1',
      speakerName: isAr ? 'د. يوسف' : 'Dr. Yusuf',
      avatar: '👨‍🏫',
      role: isAr ? 'كبير باحثي الذكاء الاصطناعي' : 'Lead AI Scientist',
      text: isAr
        ? (dialect
            ? `أهلاً بيكم يا شباب في حلقة جديدة من بودكاست شغوف! النهاردة معادنا مع موضوع مهم جداً: "${title}". إزيك يا مريم، جاهزة نفكك الموضوع ده ببساطة؟`
            : `مرحباً بكم في حلقة جديدة من البودكاست التعليمي لمنصة شغوف. موضوع جلستنا اليوم يتمحور حول "${title}". أهلاً بكِ مريم.`)
        : `Welcome back to the SHAGHOOF AI Deep-Dive Podcast! Today we explore: "${title}". Ready Mariam?`,
      timestamp: '00:00'
    },
    {
      speaker: 'host2',
      speakerName: isAr ? 'مريم' : 'Mariam',
      avatar: '👩‍🔬',
      role: isAr ? 'مهندسة ذكاء اصطناعي وباحثة' : 'AI Research Engineer',
      text: isAr
        ? (dialect
            ? `أهلاً دكتور يوسف! بصراحة متحمسة جداً. موضوع ${title} بيلخبط طلبة كتير في البداية لما يشوفوا تفاصيله المعقدة في المحاضرة!`
            : `أهلاً بك دكتور يوسف. يمثل مفهوم ${title} ركيزة أساسية في المنهج الأكاديمي، وتوضيح فلسفته وتطبيقه العملي يسهل استيعابه بشكل كبير.`)
        : `Thrilled to be here! "${title}" is a critical topic in our syllabus, and breaking down its intuition makes all the difference for students.`,
      timestamp: '00:15'
    },
    {
      speaker: 'host1',
      speakerName: isAr ? 'د. يوسف' : 'Dr. Yusuf',
      avatar: '👨‍🏫',
      role: isAr ? 'كبير باحثي الذكاء الاصطناعي' : 'Lead AI Scientist',
      text: isAr
        ? (dialect
            ? `بالظبط! السر دايماً إننا نفهم الحدس والتطبيق العملي قبل الحفظ: كل خطوة في ${title} ليها هدف واضح بيخدم حل المشكلة بكفاءة.`
            : `صحيح تماماً. المبدأ يقوم على تفكيك التحدي إلى خطوات متسلسلة واستخدام الأدوات التقنية المناسبة لتحقيق أعلى كفاءة ودقة ممكنة.`)
        : `Exactly! The core intuition behind "${title}" is breaking down complex problems into modular steps and applying rigorous best practices.`,
      timestamp: '00:32'
    },
    {
      speaker: 'host2',
      speakerName: isAr ? 'مريم' : 'Mariam',
      avatar: '👩‍🔬',
      role: isAr ? 'مهندسة ذكاء اصطناعي وباحثة' : 'AI Research Engineer',
      text: isAr
        ? (dialect
            ? `يا سلام! وبكده الطالب يقدر يربط المفاهيم النظرية بالتطبيق العملي في منصة شغوف، ويستفيد من أنماط VARK البصرية والحركية!`
            : `وهذا يفسر التكامل الفريد في منصة شغوف لترسيخ الفهم النظري والممارسة العملية التفاعلية لكافة الطلاب.`)
        : `And that ties directly into SHAGHOOF's adaptive multimodal player, allowing students to visualize, listen, and interact hands-on!`,
      timestamp: '00:50'
    }
  ];
}