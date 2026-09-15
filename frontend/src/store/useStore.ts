import { create } from 'zustand';
import confetti from 'canvas-confetti';
import { getTopicType } from '../services/topicContentService';

export type Modality = 'visual' | 'audio' | 'read' | 'kinesthetic';
export type WhiteNoiseType = 'off' | 'rain' | 'coffee' | 'whitenoise';
export type SensoryLevel = 'low' | 'medium' | 'high';
export type Language = 'ar' | 'en';
export type ThemeMode = 'light' | 'dark';
export type UserRole = 'student' | 'teacher' | 'admin';
export type AuthStep = 'welcome' | 'login' | 'authenticated';
export type ColorBlindMode = 'none' | 'high-contrast' | 'protanopia' | 'deuteranopia' | 'tritanopia';


export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  varkPreference?: Modality;
  isAuthenticated: boolean;
}

export interface CourseTopic {
  id: string;
  moduleCode: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  totalSteps: number;
  icon: string;
  badge: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  modalityTag?: Modality;
  feynmanLevel?: 'intuitive' | 'academic' | 'deep';
  isProactiveHint?: boolean;
}

export interface GlossaryTerm {
  word: string;
  arabic: string;
  definition: string;
  culturalNote?: string;
  image?: string;
}

interface AppState {
  // Application Authentication & Journey Step Lifecycle
  authStep: AuthStep;
  setAuthStep: (step: AuthStep) => void;
  user: UserProfile;
  login: (userData: Partial<UserProfile>) => void;
  logout: () => void;

  // Global Theme & Language Mode
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Multi-Topic Course Navigation
  topics: CourseTopic[];
  activeTopicId: string;
  setActiveTopicId: (id: string) => void;
  addTopic: (newTopic: CourseTopic) => void;
  addTopics: (newTopics: CourseTopic[]) => void;

  // User Profile & VARK (Dev A Contract)
  varkScores: { visual: number; audio: number; read: number; kinesthetic: number };
  updateVarkScores: (scores: { visual: number; audio: number; read: number; kinesthetic: number }) => void;
  xp: number;
  streak: number;
  addXP: (amount: number) => void;

  // Developer B1: Lesson Player & Modalities
  activeModality: Modality;
  setActiveModality: (modality: Modality) => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;

  // Developer B2: Tutor Chat & Keystroke Psychology
  messages: ChatMessage[];
  isStreaming: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setIsStreaming: (status: boolean) => void;
  lastKeystrokeTime: number;
  registerKeystroke: () => void;
  proactiveHintTriggered: boolean;
  clearProactiveHint: () => void;

  // Developer B3: Dyslexia Suite
  openDyslexicEnabled: boolean;
  toggleOpenDyslexic: () => void;
  lineFocusEnabled: boolean;
  toggleLineFocus: () => void;
  lineFocusY: number;
  setLineFocusY: (y: number) => void;
  bulletReformatEnabled: boolean;
  toggleBulletReformat: () => void;

  // Developer B4: ADHD, ESL & Dialects
  microQuestMode: boolean;
  toggleMicroQuestMode: () => void;
  microQuestSeconds: number;
  decrementTimer: () => void;
  resetTimer: () => void;
  zenMode: boolean;
  toggleZenMode: () => void;
  whiteNoiseType: WhiteNoiseType;
  setWhiteNoiseType: (type: WhiteNoiseType) => void;
  bilingualMode: boolean;
  toggleBilingualMode: () => void;
  egyptianDialect: boolean;
  toggleEgyptianDialect: () => void;
  activeGlossaryTerm: GlossaryTerm | null;
  setActiveGlossaryTerm: (term: GlossaryTerm | null) => void;
  sensoryLoadLevel: SensoryLevel;
  setSensoryLoadLevel: (level: SensoryLevel) => void;

  // Extended Accessibility & Accommodations Suite
  colorBlindMode: ColorBlindMode;
  setColorBlindMode: (mode: ColorBlindMode) => void;
  brailleModeEnabled: boolean;
  toggleBrailleMode: () => void;
  aacBoardOpen: boolean;
  setAACBoardOpen: (open: boolean) => void;
  signLanguageModalOpen: boolean;
  setSignLanguageModalOpen: (open: boolean) => void;
  signLanguageTerm: string | null;
  setSignLanguageTerm: (term: string | null) => void;
  visualScheduleOpen: boolean;
  setVisualScheduleOpen: (open: boolean) => void;
  speechNavActive: boolean;
  toggleSpeechNav: () => void;
  dwellClickEnabled: boolean;
  toggleDwellClick: () => void;

  // Audio Speech Player
  speakText: (text: string, rate?: number) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
}

export const defaultTopics: CourseTopic[] = [
  {
    id: 'su26_session1',
    moduleCode: 'Session 1',
    titleAr: 'Session 1: معالجة النصوص وحسابات الانتباه (Text Preprocessing & Attention)',
    titleEn: 'Session 1: Text Preprocessing Code & Attention Is All You Need Paper',
    descriptionAr: 'تحليل Encoder-Decoder، أكواد التجهيز text preprocessing code، والمهام Task 1.1 & 1.2 وبناء الـ Embedding Models.',
    descriptionEn: 'Encoder-Decoder paper report, text preprocessing codeFolder, and 3 embedding models assignment.',
    totalSteps: 5,
    icon: 'BookOpen',
    badge: 'TR333 - G2'
  },
  {
    id: 'su26_session2',
    moduleCode: 'Session 2',
    titleAr: 'Session 2: الشبكات التلافيفية CNN وتصنيف الصور والبرمجة المتزامنة Concurrency',
    titleEn: 'Session 2: CNN Code, Intel Kaggle Image Classification & Concurrency',
    descriptionAr: 'تطبيق تصنيف الصور بالـ CNN على Kaggle Intel Image Dataset، بالإضافة لأكواد Concurrency و Synchronization.',
    descriptionEn: 'CNN image classification on Intel dataset, Concurrency PDF & synchronization python code file.',
    totalSteps: 5,
    icon: 'Eye',
    badge: 'Kaggle Intel'
  },
  {
    id: 'su26_session3',
    moduleCode: 'Session 3',
    titleAr: 'Session 3: الشبكات التكرارية (RNN, LSTM, GRU) وتصنيف المشاعر',
    titleEn: 'Session 3: RNN, LSTM, GRU Models & Amazon Polarity Dataset',
    descriptionAr: 'تطبيق أكواد RNN و LSTM و GRU على مجموعات بيانات Amazon Polarity عبر مكتبة HuggingFace Datasets.',
    descriptionEn: 'Applying RNN, LSTM, and GRU models on Amazon Polarity dataset using HuggingFace Datasets.',
    totalSteps: 5,
    icon: 'Sparkles',
    badge: 'Amazon Polarity'
  },
  {
    id: 'su26_session5',
    moduleCode: 'Session 5',
    titleAr: 'Session 5: معمارية Transformers والضبط الدقيق LoRA / QLoRA واجهات Streamlit',
    titleEn: 'Session 5: Transformers, Vision, LoRA/QLoRA & Streamlit Deployment',
    descriptionAr: 'تطبيقات NLP & CV الشاملة، الضبط الدقيق بـ LoRA/QLoRA، ونشر النموذج المختار بواجهة Streamlit.',
    descriptionEn: 'NLP & Vision transformers, LoRA/QLoRA fine-tuning, and Streamlit interactive deployment assignment.',
    totalSteps: 6,
    icon: 'MessageCircle',
    badge: 'LoRA & Streamlit'
  },
  {
    id: 'su26_session7',
    moduleCode: 'Session 7',
    titleAr: 'Session 7: مشروع التدريب الصيفي العملي واختيار مواضيع الفرق (5 و 6 أعضاء)',
    titleEn: 'Session 7: Capstone Project Description & Team Formation (5/6 Members)',
    descriptionAr: 'اختيار مواضيع المشروع الفريدة للفرق 5 و 6 أعضاء، وتطبيق الكود وكتابة التقرير التفصيلي الشامل.',
    descriptionEn: 'Project description guidelines, team formation deadline, and unique topic selection.',
    totalSteps: 5,
    icon: 'Calculator',
    badge: 'Project Topics'
  },
  {
    id: 'su26_session8',
    moduleCode: 'Session 8',
    titleAr: 'Session 8: التوليد المعزز بالاسترجاع (RAG Code & Vector DBs)',
    titleEn: 'Session 8: RAG Code File, PPT Slides & Vector Databases',
    descriptionAr: 'تطبيقات الـ RAG، بناء وقواعد البيانات المتجهة Vector DBs واسترجاع المستندات والعروض التقديمية.',
    descriptionEn: 'RAG implementation notebook, vector search slides, and document retrieval.',
    totalSteps: 5,
    icon: 'Brain',
    badge: 'RAG & Vector Search'
  },
  {
    id: 'su26_session9',
    moduleCode: 'Session 9',
    titleAr: 'Session 9: التسليم النهائي للمشروع والمناقشة المباشرة عبر Zoom واستبيان التقييم',
    titleEn: 'Session 9: Final Presentation Submission, Zoom Discussion & Evaluation Form',
    descriptionAr: 'رفع العرض التقديمي النهائي presentation submission، التجهيز لمناقشة الخميس، وتعبئة نموذج التقييم الإجباري.',
    descriptionEn: 'Final presentation submission, Thursday live Zoom defense, and mandatory evaluation form.',
    totalSteps: 4,
    icon: 'Check',
    badge: 'Final Defense'
  }
];

export const useStore = create<AppState>((set, get) => ({
  // Authentication & Journey Step Lifecycle
  authStep: 'welcome',
  setAuthStep: (step) => set({ authStep: step }),

  user: {
    name: 'يوسف أبوزيد',
    email: 'yusuf.student@shaghoof.ai',
    role: 'student',
    isAuthenticated: false,
    varkPreference: 'visual'
  },
  login: (userData) => {
    set((state) => ({
      authStep: 'authenticated',
      user: {
        ...state.user,
        ...userData,
        isAuthenticated: true
      }
    }));
  },
  logout: () => {
    set((state) => ({
      authStep: 'login',
      user: {
        ...state.user,
        isAuthenticated: false
      }
    }));
  },

  themeMode: 'light',
  setThemeMode: (mode: ThemeMode) => {
    set({ themeMode: mode });
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  toggleThemeMode: () => {
    const next = get().themeMode === 'light' ? 'dark' : 'light';
    get().setThemeMode(next);
  },

  language: 'ar',
  setLanguage: (lang: Language) => {
    set({ language: lang });
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    const initialText = lang === 'en'
      ? 'Welcome to SHAGHOOF AI! I am your AI Tutor. How can I help you explore Neural Networks today?'
      : 'أهلاً بك في منصة SHAGHOOF AI! أنا مساعدك التعليمي. كيف تحب أن نبدأ دراسة الشبكات العصبية اليوم؟';

    set({
      messages: [
        {
          id: '1',
          sender: 'bot',
          text: initialText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          feynmanLevel: 'intuitive'
        }
      ]
    });
  },

  // Topics
  topics: defaultTopics,
  activeTopicId: defaultTopics[0].id,
  setActiveTopicId: (id: string) => {
    const targetTopic = get().topics.find(t => t.id === id);
    set({ 
      activeTopicId: id,
      currentStep: 1,
      totalSteps: targetTopic ? targetTopic.totalSteps : 5
    });

    const lang = get().language;
    const isAr = lang === 'ar';
    const topicTitle = targetTopic ? (isAr ? targetTopic.titleAr : targetTopic.titleEn) : id;

    const newMsgText = isAr
      ? `تم الانتقال لموضوع: ${topicTitle}! أنا معك لمساعدتك في فهم كل نقطة بكل الموداليتيز.`
      : `Switched to topic: ${topicTitle}! I am ready to guide you through all learning modalities.`;

    get().addMessage({
      sender: 'bot',
      text: newMsgText,
      feynmanLevel: 'intuitive'
    });
  },
  addTopic: (newTopic: CourseTopic) => {
    set((state) => {
      const exists = state.topics.some(t => t.id === newTopic.id);
      if (exists) return state;
      return { topics: [newTopic, ...state.topics] };
    });
  },
  addTopics: (newTopics: CourseTopic[]) => {
    set((state) => {
      const filtered = newTopics.filter(nt => !state.topics.some(t => t.id === nt.id));
      return { topics: [...filtered, ...state.topics] };
    });
  },

  varkScores: { visual: 40, audio: 25, read: 20, kinesthetic: 15 },
  updateVarkScores: (scores) => set({ varkScores: scores }),
  xp: 350,
  streak: 5,

  addXP: (amount: number) => {
    set((state) => ({ xp: state.xp + amount }));
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8B5CF6', '#00D9C0', '#FFB020']
      });
    } catch (e) {
      console.log('Confetti burst', e);
    }
  },

  // B1: Lesson Player
  activeModality: 'visual',
  setActiveModality: (modality: Modality) => set({ activeModality: modality }),
  currentStep: 1,
  totalSteps: 5,
  nextStep: () => {
    const { currentStep, totalSteps, addXP } = get();
    if (currentStep < totalSteps) {
      set({ currentStep: currentStep + 1 });
      addXP(15);
    }
  },
  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 1) {
      set({ currentStep: currentStep - 1 });
    }
  },

  // B2: Tutor Chat
  messages: [
    {
      id: '1',
      sender: 'bot',
      text: 'أهلاً بك في منصة SHAGHOOF AI! أنا مساعدك التعليمي. كيف تحب أن نبدأ دراسة الشبكات العصبية اليوم؟',
      timestamp: '10:00 AM',
      feynmanLevel: 'intuitive'
    }
  ],
  isStreaming: false,
  addMessage: (msg) => {
    const newMsg: ChatMessage = {
      ...msg,
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    set((state) => ({ messages: [...state.messages, newMsg] }));

    // Automatically trigger AI Bot Response if user sent a message
    if (msg.sender === 'user') {
      set({ isStreaming: true });

      setTimeout(() => {
        const { language, egyptianDialect, activeModality, topics, activeTopicId } = get();
        const activeTopic = topics.find(t => t.id === activeTopicId) || topics[0];
        const topicType = getTopicType(activeTopic);
        const text = msg.text.toLowerCase().trim();
        const isAr = language === 'ar';

        let botResponse = '';

        // Handle specific general knowledge & common queries
        if (text.includes('capital of egypt') || text.includes('عاصمة مصر')) {
          botResponse = isAr 
            ? (egyptianDialect 
                ? 'عاصمة مصر هي القاهرة 🇪🇬! ورغم إن تخصصي الأساسي في الذكاء الاصطناعي، إلا إني دايماً جاهز أجاوبك على أي سؤال وثقافتك العريضة ممتازة يا بطل!' 
                : 'عاصمة جمهورية مصر العربية هي القاهرة 🇪🇬. وبجانب دوري كمساعد تعليمي لمادة الذكاء الاصطناعي، يسعدني الإجابة عن أي استفسارات عامة لخدمة دراستك!')
            : 'The capital of Egypt is Cairo 🇪🇬! While my primary specialty is guiding you through AI & Neural Networks, I am always happy to answer general knowledge questions!';
        } else if (text.includes('hello') || text.includes('hi ') || text === 'hi' || text.includes('مرحبا') || text.includes('أهلا') || text.includes('ازيك') || text.includes('السلام عليكم')) {
          botResponse = isAr
            ? (egyptianDialect 
                ? 'أهلاً بيك يا بطل! جاهز نكمل محطة النهاردة في الشبكات العصبية؟ أومرني بتحب نبدأ بإيه؟ 🚀'
                : 'أهلاً ومرحباً بك! يسعدني مساعدتك في رحلتك التعليمية اليوم. كيف تفضل أن نبدأ؟ 🚀')
            : 'Hello! I am your SHAGHOOF AI Learning Assistant. Ready to explore Neural Networks together today? 🚀';
        } else if (text.includes('who are you') || text.includes('who r u') || text.includes('من أنت') || text.includes('مين انت')) {
          botResponse = isAr
            ? (egyptianDialect 
                ? 'أنا المساعد التعليمي الشامل في منصة شغوف (SHAGHOOF AI)، مبني بأحدث تقنيات الذكاء الاصطناعي ولغة الإشارة لتبسيط أي مفهوم محتاجه! 🤖'
                : 'أنا المساعد التعليمي الذكي في منصة شغوف (SHAGHOOF AI)، مصمم لمساعدتك في استيعاب المفاهيم وتسهيل الوصول عبر كافة الوسائط والأدوات الميسرة! 🤖')
            : 'I am your interactive AI Learning Assistant on the SHAGHOOF platform, engineered to customize explanations, sign language translations, and adaptive tutoring for you! 🤖';
        } else if (!isAr) {
          if (text.includes('don\'t understand') || text.includes('not understand') || text.includes('eli5') || text.includes('simplify')) {
            if (topicType === 'concurrency') {
              botResponse = 'Think of Python Concurrency like a busy kitchen: Synchronous code waits for water to boil before cutting vegetables. AsyncIO serves other customers while waiting for the kettle (Event Loop). Multiprocessing hires separate chefs across CPU cores to bypass the GIL!';
            } else if (topicType === 'rag') {
              botResponse = 'RAG is like an open-book exam for AI! Instead of hallucinating, the model searches your verified Moodle PDFs, finds the exact relevant paragraph, and cites it directly.';
            } else {
              botResponse = 'Think of a Neural Network like a football team: Inputs are the players, the Hidden Layer is the tactical strategy, and Output is scoring a goal! If they miss, the coach (Backpropagation) adjusts weights to fix errors instantly.';
            }
          } else if (text.includes('hint') || text.includes('tactic')) {
            if (topicType === 'concurrency') {
              botResponse = '💡 Proactive Hint: Python\'s GIL prevents threads from running CPU-heavy bytecode simultaneously. Use AsyncIO/Threads for network I/O, and Multiprocessing for heavy math!';
            } else if (topicType === 'rag') {
              botResponse = '💡 Proactive Hint: Chunk overlap (e.g. 100 chars) is crucial to avoid losing semantic continuity between document boundaries.';
            } else {
              botResponse = '💡 Proactive Hint: Focus on how loss gradients flow backward from the Output Layer to the Hidden Layer weights during Backpropagation!';
            }
          } else if (text.includes('example')) {
            if (topicType === 'concurrency') {
              botResponse = 'Practical Example: Downloading 50 Moodle PDFs takes 50 seconds sequentially, but under 2 seconds with AsyncIO or ThreadPoolExecutor!';
            } else {
              botResponse = 'Practical Example: An image recognition model takes image pixels as inputs, processing features through hidden layers to confidently identify objects like cats or cars!';
            }
          } else if (text.includes('slower') || text.includes('step')) {
            botResponse = 'Absolutely! We will move step-by-step at a comfortable pace for maximum comprehension.';
          } else if (text.includes('break') || text.includes('tired')) {
            botResponse = 'Great idea! Taking a 1-minute break refreshes cognitive focus. I am ready whenever you return! ☕';
          } else if (text.includes('summarize') || text.includes('bullet') || text.includes('key points')) {
            if (topicType === 'concurrency') {
              botResponse = 'Concurrency Summary 📌:\n1. I/O-Bound tasks: AsyncIO and Threading.\n2. CPU-Bound tasks: Multiprocessing to bypass Python\'s GIL.';
            } else if (topicType === 'rag') {
              botResponse = 'RAG Summary 📌:\n1. Chunk documents with overlap.\n2. Generate vector embeddings in Weaviate.\n3. Ground LLM with verified page citations.';
            } else {
              botResponse = 'Key Points Summary 📌:\n1. Forward pass computes output signals.\n2. Backpropagation calculates error gradient and updates connection weights.';
            }
          } else if (text.includes('understand') || text.includes('confident') || text.includes('great') || text.includes('awesome')) {
            botResponse = 'Awesome work! Your strong grasp clears the path to master this topic! 🚀';
          } else {
            botResponse = `Great question! Regarding "${msg.text}" in ${activeTopic.titleEn}, this relates directly to how Python processes tasks using your chosen ${activeModality.toUpperCase()} learning style. Let me know if you want a code snippet or a visual breakdown!`;
          }
        } else {
          if (egyptianDialect) {
            if (text.includes('لم أفهم') || text.includes('مش فاهم') || text.includes('غير واضح') || text.includes('أبسط') || text.includes('مبسط')) {
              if (topicType === 'concurrency') {
                botResponse = 'ولا يهمك يا بطل! بص يا سيدي، تخيل البرمجة المتزامنة دي زي مطعم: لو الكود شغال Sync، الشيف مش هيعمل أي أكل غير لما الطباخ التاني يخلص تقطيع البصل! لكن في الـ AsyncIO، أول ما حاجة تتحط على النار، الشيف بيخدم زبون تاني على طول (Event Loop)! ولو عندك شغل حسابات تقيل بتشغل كذا شيف على أنوية مختلفة (Multiprocessing)!';
              } else if (topicType === 'rag') {
                botResponse = 'الـ RAG ده يا سيدي عامل زي الطالب الشاطر اللي داخل الامتحان ومعاه الكتاب الرسمي ومصرح له يفتحه! بدل ما الذكاء الاصطناعي يفتي ويهلوس، بيبحث في ملفات الـ Moodle ويطلع الصفحة بالضبط ويجاوبك منها!';
              } else {
                botResponse = 'ولا يهمك يا بطل! بص يا سيدي، تخيل الشبكة العصبية دي زي لعبة تتابع: الإشارات بتمشي من الأول للآخر، ولو النتيجة مش مظبوطة بنرجع بالراجع (Backpropagation) نعدل كل خطوة بالراحة لحد ما تظبط تماماً!';
              }
            } else if (text.includes('تلميح') || text.includes('رمز')) {
              if (topicType === 'concurrency') {
                botResponse = '💡 تلميح ميسر: لو بتتعامل مع اتصالات ويب وسحب صفحات استخدم AsyncIO أو Threads. لو بتعالج صور أو تشفير رياضي استخدم Multiprocessing عشان قفل الـ GIL ميعطلش الخيوط!';
              } else if (topicType === 'rag') {
                botResponse = '💡 تلميح: سر دقة استرجاع الإجابات من مقررات Moodle هو الـ Overlap بين المقاطع عشان المعنى ميتفصلش في النص!';
              } else {
                botResponse = '💡 تلميح ميسر: ركز على طريقة حركة خطأ التوقع من طبقة المخرجات للورا عشان تظبط وزن كل ارتباط عصبي!';
              }
            } else if (text.includes('مثال')) {
              if (topicType === 'concurrency') {
                botResponse = 'من عينيا! تخيل كود بيحمل 50 ملف PDF من Moodle: لو بالطريقة العادية Sync هياخد 50 ثانية. لكن بـ AsyncIO أو ThreadPool هياخد ثانيتين بس لأن الطلبات بتتسحب مع بعض في نفس وقت الانتظار!';
              } else {
                botResponse = 'من عينيا! تخيل نظام التعرف على صور القطط: المدخلات هي بكسلات الصورة، والشبكة بتتعلم تميز شكل الودان والعينين وتطلع القرار بثقة من غير أي لخبطة!';
              }
            } else if (text.includes('أبطأ')) {
              botResponse = 'تمام يا بطل! هنمشي خطوة بخطوة بالراحة خالص عشان تفهم كل فتفوتة في الدرس من غير أي استعجال.';
            } else if (text.includes('استراحة')) {
              botResponse = 'فكرة ممتازة يا بطل! خد نفس عميق واستريح لمدة دقيقة، المساعد الذكي مستنيك أول ما تجهز تكمل! ☕';
            } else if (text.includes('تلخيص') || text.includes('خص')) {
              if (topicType === 'concurrency') {
                botResponse = 'ملخص التزامن السريع 📌:\n1. الـ I/O-Bound حله AsyncIO و Threading.\n2. الـ CPU-Bound حله Multiprocessing لتخطي عائق الـ GIL.';
              } else if (topicType === 'rag') {
                botResponse = 'ملخص الـ RAG 📌:\n1. تقطيع الـ PDFs لمقاطع مع overlap.\n2. تحويل لمتجهات Embeddings في Weaviate.\n3. توثيق إجابات الذكاء برقم الصفحة والمقرر.';
              } else {
                botResponse = 'ملخص سريع في نقطتين 📌:\n1. التمرير الأمامي بيحسب النواتج والإشارات.\n2. التمرير الخلفي ببيصلح الأخطاء وبيظبط الأوزان.';
              }
            } else if (text.includes('فهمت') || text.includes('سعيد') || text.includes('ممتاز') || text.includes('واضح')) {
              botResponse = 'عاش يا بطل! فخور جداً باستيعابك السريع، يلا بينا نكمل إنجاز بقية محطات الدرس! 🚀';
            } else {
              botResponse = `سؤال ممتاز! بالنسبة لـ "${msg.text}" في موضوع ${activeTopic.titleAr}، النقطة دي متصلة بالنمط المفضل لديك (${activeModality.toUpperCase()}). تحب نطبق عليها بمثال كود عملي ولا بمخطط بصري؟`;
            }
          } else {
            if (text.includes('لم أفهم') || text.includes('غير واضح') || text.includes('أبسط') || text.includes('مبسط')) {
              if (topicType === 'concurrency') {
                botResponse = 'لا تقلق أبداً! البرمجة المتزامنة في بايثون تعني تنظيم العمل: إذا كان برنامجك ينتظر الشبكة (I/O-Bound)، استخدم AsyncIO أو Threads لخدمة مهام أخرى أثناء الانتظار. وإذا كان ينفذ عمليات حسابية مكثفة (CPU-Bound)، استخدم Multiprocessing لتخطي قفل الـ GIL واستغلال كل أنوية المعالج.';
              } else {
                botResponse = 'لا تقلق على الإطلاق! يمكننا تبسيط المفهوم: تخيل الشبكة العصبية كمعمل تجارب، كل طبقة تقوم بفحص جزء من الإشارة، وعند وجود خطأ يتم إرجاع الإشارة للخلف لتصحيح المعاملات فوراً.';
              }
            } else if (text.includes('تلميح')) {
              if (topicType === 'concurrency') {
                botResponse = '💡 تلميح دراسي: قفل بايثون العام (GIL) يُعطل التوازي في الـ Threads للمهام الحسابية، لذا فإن Multiprocessing هو الحل الحصري للـ CPU-Bound.';
              } else {
                botResponse = '💡 تلميح دراسي: ركز على المعادلة الرياضية للتمرير الخلفي وكيفية تدفق المشتقة الجزئية.';
              }
            } else if (text.includes('مثال')) {
              if (topicType === 'concurrency') {
                botResponse = 'مثال عملي: تحميل 50 محاضرة من Moodle. بالطريقة التتابعية يستغرق 50 ثانية، بينما عبر aiohttp أو ThreadPoolExecutor ينتهي في ثانيتين فقط!';
              } else {
                botResponse = 'مثال عملي: نظام التنبؤ بالطقس يستقبل درجات الحرارة والضغط كمدخلات، وتقوم الشبكة العصبية بوزن هذه المتغيرات للتنبؤ بهطول الأمطار.';
              }
            } else if (text.includes('أبطأ')) {
              botResponse = 'بالتأكيد! سنتقدم بخطوات ميسرة ومرحلية لضمان الاستيعاب التام قبل الانتقال للجزئية التالية.';
            } else if (text.includes('استراحة')) {
              botResponse = 'فكرة رائعة! أخذ استراحة قصيرة يجدد النشاط الذهني، أنا بانتظارك متى ما كُنت جاهزاً للمتابعة. ☕';
            } else if (text.includes('تلخيص') || text.includes('خص')) {
              if (topicType === 'concurrency') {
                botResponse = 'ملخص مفاهيم التزامن 📌:\n1. مهام الإدخال والإخراج I/O: نستخدم AsyncIO أو Threading.\n2. مهام المعالج المكثفة CPU: نستخدم Multiprocessing لتجاوز الـ GIL.';
              } else {
                botResponse = 'ملخص النقاط الأساسية 📌:\n1. طبقة المدخلات تتولى استقبال الإشارات.\n2. التمرير الخلفي يتولى ضبط الأوزان وتفادي الخطأ.';
              }
            } else if (text.includes('فهمت') || text.includes('سعيد') || text.includes('ممتاز') || text.includes('واضح')) {
              botResponse = 'أحسنت صنعاً! فهمك المتميز يمهد الطريق لإتقان كافة مفاهيم هذا المقرر. 🚀';
            } else {
              botResponse = `استفسار رائع! بخصوص "${msg.text}" في مقرر ${activeTopic.titleAr}، يرتبط هذا الاستفسار بكيفية تحليل واستجابة النموذج التكيفي وفق نمط التعلم (${activeModality.toUpperCase()}). هل تود الشرح بأسلوب مبسط أم أمثلة تطبيقية؟`;
            }
          }
        }

        const botMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          feynmanLevel: msg.feynmanLevel || 'intuitive'
        };

        set((state) => ({ 
          messages: [...state.messages, botMsg],
          isStreaming: false 
        }));
      }, 900);
    }
  },
  setIsStreaming: (status) => set({ isStreaming: status }),
  lastKeystrokeTime: Date.now(),
  proactiveHintTriggered: false,
  registerKeystroke: () => {
    set({ lastKeystrokeTime: Date.now() });
  },
  clearProactiveHint: () => set({ proactiveHintTriggered: false }),

  // B3: Dyslexia Suite
  openDyslexicEnabled: false,
  toggleOpenDyslexic: () => set((state) => ({ openDyslexicEnabled: !state.openDyslexicEnabled })),
  lineFocusEnabled: false,
  toggleLineFocus: () => set((state) => ({ lineFocusEnabled: !state.lineFocusEnabled })),
  lineFocusY: 200,
  setLineFocusY: (y) => set({ lineFocusY: y }),
  bulletReformatEnabled: false,
  toggleBulletReformat: () => set((state) => ({ bulletReformatEnabled: !state.bulletReformatEnabled })),

  // B4: ADHD, ESL & Dialects
  microQuestMode: false,
  toggleMicroQuestMode: () => set((state) => ({ microQuestMode: !state.microQuestMode })),
  microQuestSeconds: 180,
  decrementTimer: () => {
    const { microQuestSeconds, addXP } = get();
    if (microQuestSeconds > 1) {
      set({ microQuestSeconds: microQuestSeconds - 1 });
    } else {
      set({ microQuestSeconds: 180 });
      addXP(25);
    }
  },
  resetTimer: () => set({ microQuestSeconds: 180 }),
  zenMode: false,
  toggleZenMode: () => set((state) => ({ zenMode: !state.zenMode })),
  whiteNoiseType: 'off',
  setWhiteNoiseType: (type) => set({ whiteNoiseType: type }),
  bilingualMode: true,
  toggleBilingualMode: () => set((state) => ({ bilingualMode: !state.bilingualMode })),
  egyptianDialect: true,
  toggleEgyptianDialect: () => set((state) => ({ egyptianDialect: !state.egyptianDialect })),
  activeGlossaryTerm: null,
  setActiveGlossaryTerm: (term) => set({ activeGlossaryTerm: term }),
  sensoryLoadLevel: 'low',
  setSensoryLoadLevel: (level) => set({ sensoryLoadLevel: level }),

  // Extended Accessibility & Accommodations Suite
  colorBlindMode: 'none',
  setColorBlindMode: (mode) => set({ colorBlindMode: mode }),
  brailleModeEnabled: false,
  toggleBrailleMode: () => set((state) => ({ brailleModeEnabled: !state.brailleModeEnabled })),
  aacBoardOpen: false,
  setAACBoardOpen: (open) => set({ aacBoardOpen: open }),
  signLanguageModalOpen: false,
  setSignLanguageModalOpen: (open) => set({ signLanguageModalOpen: open }),
  signLanguageTerm: null,
  setSignLanguageTerm: (term) => set({ signLanguageTerm: term, signLanguageModalOpen: !!term }),
  visualScheduleOpen: false,
  setVisualScheduleOpen: (open) => set({ visualScheduleOpen: open }),
  speechNavActive: false,
  toggleSpeechNav: () => set((state) => ({ speechNavActive: !state.speechNavActive })),
  dwellClickEnabled: false,
  toggleDwellClick: () => set((state) => ({ dwellClickEnabled: !state.dwellClickEnabled })),

  // Audio Speech Player
  isSpeaking: false,
  speakText: (text: string, rate = 1.0) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;

      const { language } = get();
      const hasArabic = /[\u0600-\u06FF]/.test(text);
      
      if (hasArabic && language === 'ar') {
        utterance.lang = 'ar-EG';
        const voices = window.speechSynthesis.getVoices();
        const egVoice = voices.find(v => v.lang.includes('ar-EG') || v.lang.includes('ar_EG') || v.name.includes('Salma') || v.name.includes('Egypt'));
        if (egVoice) utterance.voice = egVoice;
      } else {
        utterance.lang = 'en-US';
      }
      
      utterance.onstart = () => set({ isSpeaking: true });
      utterance.onend = () => set({ isSpeaking: false });
      utterance.onerror = () => set({ isSpeaking: false });

      window.speechSynthesis.speak(utterance);
    }
  },
  stopSpeech: () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      set({ isSpeaking: false });
    }
  }
}));
