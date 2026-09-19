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

  // Autonomous Proactive Study Agent
  isRescueModalOpen: boolean;
  setIsRescueModalOpen: (open: boolean) => void;
  topicMastery: Record<string, number>;
  setTopicMastery: (topicId: string, score: number) => void;
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

    const currentTopic = get().topics.find(t => t.id === get().activeTopicId) || get().topics[0];
    const isAr = lang === 'ar';
    const topicTitle = currentTopic ? (isAr ? currentTopic.titleAr : currentTopic.titleEn) : (isAr ? 'رحلتك التعليمية' : 'your learning journey');

    const initialText = lang === 'en'
      ? (currentTopic ? `Welcome to SHAGHOOF AI! I am your AI Tutor. How can I help you explore ${topicTitle} today?` : `Welcome to SHAGHOOF AI! 🚀 I am your AI Tutor. Your account is fresh and ready. Select a textbook or upload a PDF to begin!`)
      : (currentTopic ? `أهلاً بك في منصة SHAGHOOF AI! أنا مساعدك التعليمي. كيف تحب أن نبدأ دراسة ${topicTitle} اليوم؟ 🚀` : `أهلاً بك في منصة SHAGHOOF AI! 🚀 أنا رفيقك التعليمي الذكي. حسابك جديد ونظيف، اختر مادتك من مجمع المناهج أو ارفع ملف المحاضرة لنبدأ رحلتك التعليمية المخصصة!`);

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

  // Topics (Fresh Account - Empty Curriculum on Start)
  topics: [],
  activeTopicId: '',
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
      ? `أهلاً بك في ${topicTitle}! أنا مساعدك التعليمي، وجاهز لمساعدتك في فهم كل تفصيلة بالمخططات البصرية والكبسولات التفاعلية. كيف تحب أن نبدأ اليوم؟ 🚀`
      : `Welcome to ${topicTitle}! I am your AI Tutor, ready to guide you through this session with interactive visualizations and intuitive analogies. How would you like to begin? 🚀`;

    set({
      messages: [
        {
          id: Date.now().toString(),
          sender: 'bot',
          text: newMsgText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          feynmanLevel: 'intuitive'
        }
      ]
    });
  },
  addTopic: (newTopic: CourseTopic) => {
    set((state) => {
      const exists = state.topics.some(t => t.id === newTopic.id);
      if (exists) return state;
      const nextTopics = [newTopic, ...state.topics];
      return { 
        topics: nextTopics,
        activeTopicId: state.activeTopicId || newTopic.id,
        currentStep: 1,
        totalSteps: newTopic.totalSteps || 5
      };
    });
  },
  addTopics: (newTopics: CourseTopic[]) => {
    set((state) => {
      const filtered = newTopics.filter(nt => !state.topics.some(t => t.id === nt.id));
      const nextTopics = [...filtered, ...state.topics];
      const nextActiveId = state.activeTopicId || (nextTopics[0] ? nextTopics[0].id : '');
      const currentActiveTopic = nextTopics.find(t => t.id === nextActiveId);
      return { 
        topics: nextTopics,
        activeTopicId: nextActiveId,
        currentStep: 1,
        totalSteps: currentActiveTopic ? currentActiveTopic.totalSteps : 5
      };
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
      text: 'أهلاً بك في منصة SHAGHOOF AI! 🚀 أنا رفيقك التعليمي الذكي. حسابك جديد ونظيف، اختر مادتك من مجمع المناهج أو ارفع ملف المحاضرة لنبدأ رحلتك التعليمية المخصصة!',
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
        const topicType = activeTopic ? getTopicType(activeTopic) : 'neural_nets';
        const topicTitleAr = activeTopic ? activeTopic.titleAr : 'مادتك التعليمية';
        const topicTitleEn = activeTopic ? activeTopic.titleEn : 'your course';
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
                ? `أهلاً بيك يا بطل! جاهز نكمل محطة النهاردة في ${topicTitleAr}؟ أومرني بتحب نبدأ بإيه؟ 🚀`
                : `أهلاً ومرحباً بك! يسعدني مساعدتك في دراسة ${topicTitleAr}. كيف تفضل أن نبدأ؟ 🚀`)
            : `Hello! I am your SHAGHOOF AI Learning Assistant. Ready to explore ${topicTitleEn} together today? 🚀`;
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
            } else if (topicType === 'transformers') {
              botResponse = 'Think of Self-Attention like a group discussion: every token simultaneously compares itself to all other tokens using Query, Key, and Value projections to capture deep contextual meaning in parallel!';
            } else if (topicType === 'cnn') {
              botResponse = 'Think of a CNN like scanning a photo with magnifying lenses: small convolutional kernels detect edges and textures, while pooling layers shrink the dimension to preserve high-level patterns!';
            } else if (topicType === 'rnn') {
              botResponse = 'Think of an RNN like a mental notepad while reading: each word updates your recurrent memory state, and LSTM gates decide what to remember and what to discard!';
            } else {
              botResponse = `Think of ${topicTitleEn} as a modular pipeline: each step transforms inputs through specialized representations to minimize error and maximize performance!`;
            }
          } else if (text.includes('hint') || text.includes('tactic')) {
            if (topicType === 'concurrency') {
              botResponse = '💡 Proactive Hint: Python\'s GIL prevents threads from running CPU-heavy bytecode simultaneously. Use AsyncIO/Threads for network I/O, and Multiprocessing for heavy math!';
            } else if (topicType === 'rag') {
              botResponse = '💡 Proactive Hint: Chunk overlap (e.g. 100 chars) is crucial to avoid losing semantic continuity between document boundaries.';
            } else if (topicType === 'transformers') {
              botResponse = '💡 Proactive Hint: Scaled Dot-Product divides Q*K^T by sqrt(d_k) to prevent extreme softmax gradients in high-dimensional embedding spaces!';
            } else if (topicType === 'cnn') {
              botResponse = '💡 Proactive Hint: Convolutional filters achieve spatial invariance, meaning they recognize features regardless of where they appear in the image!';
            } else {
              botResponse = `💡 Proactive Hint: Focus on the primary input representation and how the model evaluates its objective function in ${topicTitleEn}!`;
            }
          } else if (text.includes('example')) {
            if (topicType === 'concurrency') {
              botResponse = 'Practical Example: Downloading 50 Moodle PDFs takes 50 seconds sequentially, but under 2 seconds with AsyncIO or ThreadPoolExecutor!';
            } else if (topicType === 'transformers') {
              botResponse = 'Practical Example: In "The bank of the river" vs "Money in the bank", Self-Attention uses surrounding tokens ("river" vs "money") to disambiguate the word "bank" effortlessly!';
            } else if (topicType === 'cnn') {
              botResponse = 'Practical Example: An image classifier passes 150x150 Intel landscape pixels through 3x3 kernels to identify mountains, forests, and buildings!';
            } else {
              botResponse = `Practical Example: In ${topicTitleEn}, structured data flows into feature layers to yield high-confidence predictions!`;
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
            } else if (topicType === 'transformers') {
              botResponse = 'Attention Summary 📌:\n1. Tokenize text & project Q, K, V matrices.\n2. Compute parallel Self-Attention with Softmax.\n3. Multi-Head attention models diverse syntactic & semantic patterns.';
            } else {
              botResponse = `Key Points Summary for ${topicTitleEn} 📌:\n1. Formulate input representation.\n2. Process signals through modular architecture.\n3. Optimize performance iteratively.`;
            }
          } else if (text.includes('understand') || text.includes('confident') || text.includes('great') || text.includes('awesome')) {
            botResponse = 'Awesome work! Your strong grasp clears the path to master this topic! 🚀';
          } else {
            botResponse = `Great question! Regarding "${msg.text}" in ${topicTitleEn}, this relates directly to how Python processes tasks using your chosen ${activeModality.toUpperCase()} learning style. Let me know if you want a code snippet or a visual breakdown!`;
          }
        } else {
          if (egyptianDialect) {
            if (text.includes('لم أفهم') || text.includes('مش فاهم') || text.includes('غير واضح') || text.includes('أبسط') || text.includes('مبسط')) {
              if (topicType === 'concurrency') {
                botResponse = 'ولا يهمك يا بطل! بص يا سيدي، تخيل البرمجة المتزامنة دي زي مطعم: لو الكود شغال Sync، الشيف مش هيعمل أي أكل غير لما الطباخ التاني يخلص تقطيع البصل! لكن في الـ AsyncIO، أول ما حاجة تتحط على النار، الشيف بيخدم زبون تاني على طول (Event Loop)! ولو عندك شغل حسابات تقيل بتشغل كذا شيف على أنوية مختلفة (Multiprocessing)!';
              } else if (topicType === 'rag') {
                botResponse = 'الـ RAG ده يا سيدي عامل زي الطالب الشاطر اللي داخل الامتحان ومعاه الكتاب الرسمي ومصرح له يفتحه! بدل ما الذكاء الاصطناعي يفتي ويهلوس، بيبحث في ملفات الـ Moodle ويطلع الصفحة بالضبط ويجاوبك منها!';
              } else if (topicType === 'transformers') {
                botResponse = 'ولا يهمك يا بطل! بص يا سيدي، تخيل الـ Self-Attention ده زي دايرة أصحاب: لما حد يتكلم، الباقيين بيبصوله وكل واحد بيفهم الكلام بناءً على علاقته بيه! الكلمة بتبص على كل كلمات الجملة في نفس اللحظة عبر مصفوفات Q و K و V عشان تفهم المعنى السياقي الصح بالتوازي!';
              } else if (topicType === 'cnn') {
                botResponse = 'ولا يهمك يا بطل! بص يا سيدي، الـ CNN عاملة زي عدسة مكبرة بتعدي على الصورة تستكشف الخطوط والزوايا (Kernels)! وعشان نحمل آلاف الصور بسرعة بنستخدم AsyncIO، ولما نيجي نحسب بالمعالج بنشغل Multiprocessing عشان نعدي قفل الـ GIL!';
              } else if (topicType === 'rnn') {
                botResponse = 'ولا يهمك يا بطل! تخيل الـ RNN دي زي شريط كاسيت ماشي خطوة بخطوة: كل كلمة بتسيب أثر في الذاكرة (Hidden State)، وخلايا الـ LSTM عندها بوابات نسيان عشان تفتكر المهم بس وما تتشتتش في الجمل الطويلة!';
              } else {
                botResponse = `ولا يهمك يا بطل! بص يا سيدي، موضوع ${topicTitleAr} فكرته الأساسية إننا بنقسم التحدي لخطوات منظمة عشان نوصل لأعلى دقة وكفاءة برمجية ممكنة!`;
              }
            } else if (text.includes('تلميح') || text.includes('رمز')) {
              if (topicType === 'concurrency') {
                botResponse = '💡 تلميح ميسر: لو بتتعامل مع اتصالات ويب وسحب صفحات استخدم AsyncIO أو Threads. لو بتعالج صور أو تشفير رياضي استخدم Multiprocessing عشان قفل الـ GIL ميعطلش الخيوط!';
              } else if (topicType === 'rag') {
                botResponse = '💡 تلميح: سر دقة استرجاع الإجابات من مقررات Moodle هو الـ Overlap بين المقاطع عشان المعنى ميتفصلش في النص!';
              } else if (topicType === 'transformers') {
                botResponse = '💡 تلميح: الـ Query هو سؤال الكلمة، والـ Key هو هويتها، والـ Value هو محتواها الفعلي اللي بيتنقل في شبكة الانتباه!';
              } else if (topicType === 'cnn') {
                botResponse = '💡 تلميح: فلاتر الـ Convolution بتكتشف الأنماط في الصورة بغض النظر عن مكانها (Spatial Invariance)!';
              } else {
                botResponse = `💡 تلميح ميسر: ركز على طريقة حركة البيانات والتحويلات في خطوات ${topicTitleAr}!`;
              }
            } else if (text.includes('مثال')) {
              if (topicType === 'concurrency') {
                botResponse = 'من عينيا! تخيل كود بيحمل 50 ملف PDF من Moodle: لو بالطريقة العادية Sync هياخد 50 ثانية. لكن بـ AsyncIO أو ThreadPool هياخد ثانيتين بس لأن الطلبات بتتسحب مع بعض في نفس وقت الانتظار!';
              } else if (topicType === 'transformers') {
                botResponse = 'من عينيا! تخيل جملة: "المرمى كان خالي واللاعب سجل هدف": آلية الانتباه بتربط كلمة "اللاعب" و"سجل" بكلمة "المرمى" فوراً وتفهم السياق الرياضي!';
              } else if (topicType === 'cnn') {
                botResponse = 'من عينيا! تخيل نظام تصنيف صور Intel Kaggle: المدخلات بكسلات المناظر الطبيعية، والفلاتر بتميز ملامح الجبال من الغابات والبحار بدقة عالية!';
              } else {
                botResponse = `من عينيا! في ${topicTitleAr}، بنحول البيانات الأولية إلى مدخلات مهيكلة تتيح للنموذج استخراج النتائج بدقة!`;
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
              } else if (topicType === 'transformers') {
                botResponse = 'ملخص الانتباه 📌:\n1. تجهيز الـ Tokens ومصفوفات التضمين.\n2. حساب مصفوفات Q و K و V بالـ Softmax.\n3. معالجة النص بالكامل بالتوازي عبر كروت الشاشة GPU.';
              } else {
                botResponse = `ملخص سريع لـ ${topicTitleAr} 📌:\n1. تحديد المدخلات.\n2. المعالجة المعمارية المتخصصة.\n3. تحسين النتائج بدقة.`;
              }
            } else if (text.includes('فهمت') || text.includes('سعيد') || text.includes('ممتاز') || text.includes('واضح')) {
              botResponse = 'عاش يا بطل! فخور جداً باستيعابك السريع، يلا بينا نكمل إنجاز بقية محطات الدرس! 🚀';
            } else {
              botResponse = `سؤال ممتاز! بالنسبة لـ "${msg.text}" في موضوع ${topicTitleAr}، النقطة دي متصلة بالنمط المفضل لديك (${activeModality.toUpperCase()}). تحب نطبق عليها بمثال كود عملي ولا بمخطط بصري؟`;
            }
          } else {
            if (text.includes('لم أفهم') || text.includes('غير واضح') || text.includes('أبسط') || text.includes('مبسط')) {
              if (topicType === 'concurrency') {
                botResponse = 'لا تقلق أبداً! البرمجة المتزامنة في بايثون تعني تنظيم العمل: إذا كان برنامجك ينتظر الشبكة (I/O-Bound)، استخدم AsyncIO أو Threads لخدمة مهام أخرى أثناء الانتظار. وإذا كان ينفذ عمليات حسابية مكثفة (CPU-Bound)، استخدم Multiprocessing لتخطي قفل الـ GIL واستغلال كل أنوية المعالج.';
              } else if (topicType === 'transformers') {
                botResponse = 'لا تقلق على الإطلاق! آلية الانتباه الذاتي Self-Attention تسمح للنموذج بمعالجة كافة مفردات الجملة بالتوازي عبر مصفوفات Q و K و V لفهم السياق اللغوي دون بطء الـ RNN.';
              } else if (topicType === 'cnn') {
                botResponse = 'لا تقلق! شبكات الـ CNN تعمل كعدسة مكبرة تفحص أجزاء الصورة لاستخراج الحواف والأشكال عبر طبقات الالتفاف والتجميع لتقليل الحجم مع حفظ الخصائص.';
              } else if (topicType === 'rnn') {
                botResponse = 'لا تقلق! الشبكات التكرارية تحفظ سياق الكلمات السابقة عبر خلايا الذاكرة، وخلايا LSTM تحل مشكلة النسيان عبر بوابات ذكية.';
              } else if (topicType === 'rag') {
                botResponse = 'لا تقلق! الـ RAG يربط الذكاء بمستنداتك الأكاديمية: يتم تقطيع الملفات لفقرات صغيرة وحفظها كمتجهات، وعند السؤال يسترجع الفقرة الدقيقة مع رقم الصفحة لمنع الهلوسة.';
              } else {
                botResponse = `لا تقلق على الإطلاق! في ${topicTitleAr} نقوم بتفكيك المفهوم إلى عناصر بسيطة متسلسلة تحقق أعلى استيعاب أكاديمي.`;
              }
            } else if (text.includes('تلميح')) {
              if (topicType === 'concurrency') {
                botResponse = '💡 تلميح دراسي: قفل بايثون العام (GIL) يُعطل التوازي في الـ Threads للمهام الحسابية، لذا فإن Multiprocessing هو الحل الحصري للـ CPU-Bound.';
              } else if (topicType === 'transformers') {
                botResponse = '💡 تلميح دراسي: مصفوفة Q تسأل ومصفوفة K تجيب ومصفوفة V تنقل المعنى الفعلي، والـ Softmax يحول النواتج لنسب مئوية للأهمية.';
              } else if (topicType === 'cnn') {
                botResponse = '💡 تلميح دراسي: فلاتر الـ Kernel بتنزلق على بكسلات الصورة لحساب الضرب النقطي واستخراج الخصائص المكانية.';
              } else if (topicType === 'rnn') {
                botResponse = '💡 تلميح دراسي: سر الـ LSTM هو الـ Cell State الذي يمر كطريق سريع عبر الزمن مع التحكم به ببوابات النسيان.';
              } else if (topicType === 'rag') {
                botResponse = '💡 تلميح دراسي: حافظ على نسبة التداخل (Overlap) بين الـ Chunks لضمان عدم انقطاع المعنى الدلالي بين الفقرات.';
              } else {
                botResponse = `💡 تلميح دراسي: ركز على تسلسل الخطوات في ${topicTitleAr} وطريقة تحويل المدخلات إلى نواتج دقيقة.`;
              }
            } else if (text.includes('مثال')) {
              if (topicType === 'concurrency') {
                botResponse = 'مثال عملي: تحميل 50 محاضرة من Moodle. بالطريقة التتابعية يستغرق 50 ثانية، بينما عبر aiohttp أو ThreadPoolExecutor ينتهي في ثانيتين فقط!';
              } else if (topicType === 'transformers') {
                botResponse = 'مثال عملي: جملة "بنك النيل يفتح أبوابه" مقارنة بـ "جلس على بنك النهر"؛ انتباه المحولات يفهم الفارق بين البنك المالي وبنك النهر فوراً من سياق الجملة!';
              } else if (topicType === 'cnn') {
                botResponse = 'مثال عملي: تصنيف صور مجموعة بيانات Intel Kaggle؛ الفلاتر الأولى تكتشف الخطوط الأفقية ثم أسطح المباني والجبال لتحديد المشهد بدقة.';
              } else if (topicType === 'rnn') {
                botResponse = 'مثال عملي: تقييمات Amazon مثل "المنتج كان ممتازاً لكن التوصيل تأخر جداً"، الشبكة تقيس الكلمات المتتابعة لتحديد المشاعر العامة بدقة.';
              } else if (topicType === 'rag') {
                botResponse = 'مثال عملي: طالب يسأل "ما موعد تسليم التكليف الأول؟"، الـ RAG يبحث في ملف توصيف المقرر ويرد بالنص ورقم الصفحة واسم الملف فوراً.';
              } else {
                botResponse = `مثال عملي: في ${topicTitleAr} نقوم بتطبيق الخوارزمية على عينة بيانات واقعية لتوضيح النتائج بشكل ملموس.`;
              }
            } else if (text.includes('أبطأ')) {
              botResponse = 'بالتأكيد! سنتقدم بخطوات ميسرة ومرحلية لضمان الاستيعاب التام قبل الانتقال للجزئية التالية.';
            } else if (text.includes('استراحة')) {
              botResponse = 'فكرة رائعة! أخذ استراحة قصيرة يجدد النشاط الذهني، أنا بانتظارك متى ما كُنت جاهزاً للمتابعة. ☕';
            } else if (text.includes('تلخيص') || text.includes('خص')) {
              if (topicType === 'concurrency') {
                botResponse = 'ملخص مفاهيم التزامن 📌:\n1. مهام الإدخال والإخراج I/O: نستخدم AsyncIO أو Threading.\n2. مهام المعالج المكثفة CPU: نستخدم Multiprocessing لتجاوز الـ GIL.';
              } else if (topicType === 'transformers') {
                botResponse = 'ملخص آلية الانتباه 📌:\n1. ترميز المفردات وتضمين المواقع (Positional Encoding).\n2. حساب انتباه Q, K, V بالتوازي وتطبيق Softmax.\n3. التخلص التام من الاختناق التسلسلي لمعالجة سياقات فائقة الطول.';
              } else if (topicType === 'cnn') {
                botResponse = 'ملخص الـ CNN 📌:\n1. فلاتر الالتفاف لاستخراج الخصائص المكانية.\n2. طبقات الـ Pooling لتقليص الأبعاد وتفادي فرط التخصيص.\n3. الطبقات الكثيفة للتصنيف النهائي.';
              } else if (topicType === 'rnn') {
                botResponse = 'ملخص الشبكات التكرارية 📌:\n1. التمرير عبر الزمن لتحديث الحالة الخفية.\n2. بوابات LSTM لتفادي تلاشي التدرج الحسابي.\n3. استخراج المعنى الكلي من السلاسل النصية.';
              } else if (topicType === 'rag') {
                botResponse = 'ملخص الـ RAG 📌:\n1. تقسيم المستندات وتضمينها كمتجهات في Vector DB.\n2. البحث الدلالي المتجهي بأقرب تشابه Cosine.\n3. صياغة إجابة موثقة علمياً بالصفحات دون هلوسة.';
              } else {
                botResponse = `ملخص موضوع ${topicTitleAr} 📌:\n1. استيعاب المدخلات والبيانات الأساسية.\n2. تطبيق المعالجة والخوارزمية الرياضية بدقة.\n3. التحقق من كفاءة النتائج العملية.`;
              }
            } else if (text.includes('فهمت') || text.includes('سعيد') || text.includes('ممتاز') || text.includes('واضح')) {
              botResponse = 'أحسنت صنعاً! فهمك المتميز يمهد الطريق لإتقان كافة مفاهيم هذا المقرر. 🚀';
            } else {
              botResponse = `استفسار رائع! بخصوص "${msg.text}" في مقرر ${topicTitleAr}، يرتبط هذا الاستفسار بكيفية تحليل واستجابة النموذج التكيفي وفق نمط التعلم (${activeModality.toUpperCase()}). هل تود الشرح بأسلوب مبسط أم أمثلة تطبيقية؟`;
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
  },

  // Autonomous Proactive Study Agent
  isRescueModalOpen: false,
  setIsRescueModalOpen: (open: boolean) => set({ isRescueModalOpen: open }),
  topicMastery: {},
  setTopicMastery: (topicId: string, score: number) => set((state) => ({
    topicMastery: { ...state.topicMastery, [topicId]: score }
  }))
}));
