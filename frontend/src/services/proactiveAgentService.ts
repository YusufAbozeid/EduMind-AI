// =============================================================
// SHAGHOOF AI — AUTONOMOUS PROACTIVE STUDY AGENT ENGINE
// 100% Dynamic Topic-Aware Diagnostics, Weakness Detection & Tool Dispatcher
// Zero Hardcoding — Unique Diagnostic Plan For Every Single Topic
// =============================================================

import type { CourseTopic, Modality } from '../store/useStore';

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
  isNewTopic?: boolean;
  badgeAr?: string;
  badgeEn?: string;
  badgeType?: 'new' | 'weakness' | 'mastered';
  ctaLabelAr?: string;
  ctaLabelEn?: string;
  detectedWeaknessReasonAr: string;
  detectedWeaknessReasonEn: string;
  proactiveMessageAr: string;
  proactiveMessageEn: string;
  steps: RescueStep[];
  status: 'pending' | 'in_progress' | 'completed';
  rewardXP: number;
}

// -------------------------------------------------------------
// DEDICATED TOPIC RESCUE PLANS FACTORY
// -------------------------------------------------------------
export const DEDICATED_PLANS: Record<string, (topic: CourseTopic) => RescuePlan> = {

  // ---------------------------------------------------------
  // SESSION 1: TEXT PREPROCESSING & ATTENTION PAPER
  // ---------------------------------------------------------
  su26_session1: (topic) => ({
    id: `rescue_${topic.id}`,
    topicId: topic.id,
    conceptId: 'tokenization_bpe_attention',
    conceptNameAr: 'تجهيز النصوص والترميز الموضعي (BPE & Positional Encoding)',
    conceptNameEn: 'Tokenization, BPE & Positional Encoding',
    masteryScore: 42,
    detectedWeaknessReasonAr: 'رصد تشتت في التفريق بين تقسيم النصوص بخوارزمية BPE وحساب متجهات التضمين الموضعي (Positional Encoding) قبل مصفوفات الانتباه (نسبة الإتقان: 42%).',
    detectedWeaknessReasonEn: 'Detected difficulty distinguishing Subword BPE tokenization and Sinusoidal Positional Encoding calculations before attention (Mastery: 42%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظ الوكيل الذكي في موضوع (${topic.titleAr}) أنك تواجه تشتتاً في فهم خوارزمية ترميز أزواج البايتات (Byte-Pair Encoding - BPE) وتضمين المواقع (Positional Encoding) في ورقة Attention Is All You Need. جهزت لك خطة إنقاذ سريعة من 3 خطوات لمدة 10 دقائق لإتقانها تماماً.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected difficulty with Byte-Pair Encoding (BPE) and Positional Encoding vectors in ${topic.titleEn}. I synthesized a 3-step rescue plan (10 mins) to master it.. Ready? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لمشاهدة محاكي تفاعلي لدمج أزواج الحروف (BPE Merges) وكيفية إضافة موجات الجيب (Sine & Cosine) للكلمات.',
        descEn: 'Switching active modality to Visual to explore interactive BPE pair merges and sinusoidal positional waves.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s1_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (BPE Visualizer)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 8)',
        titleEn: 'Step 2: Lecture Slide 8 Spotlight',
        descAr: 'فحص الشريحة رقم 8 التي توضح معادلات التضمين الموضعي ولماذا نستخدم ترددات مختلفة للأبعاد الفردية والزوجية.',
        descEn: 'Examining lecture slide 8 covering positional encoding formulas across odd and even embedding indices.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_s1_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 8)',
          labelEn: 'Open Slide 8 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 8,
            slideTitleAr: 'الشريحة 8: معادلات التضمين الموضعي (Sinusoidal Positional Encoding)',
            slideTitleEn: 'Slide 8: Sinusoidal Positional Encoding Equations',
            slideContentAr: `معادلات التضمين الموضعي:
PE(pos, 2i) = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))

الهدف الجوهري:
تسمح هذه الموجات الرياضية للنموذج بتعلم العلاقات الموضعية النسبية بين الكلمات بسهولة، لأن دالة sin(a+b) يمكن التعبير عنها كدالة خطية في sin(a) و cos(b)!`,
            slideContentEn: 'Sinusoidal encodings allow the Transformer to attend to relative positions since for any fixed offset k, PE(pos+k) can be represented as a linear function of PE(pos).'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لتأكيد استيعاب تجهيز النصوص والتضمين وحصد +60 XP.',
        descEn: '3 targeted questions to lock in Tokenization & Embeddings mastery and claim +60 XP.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s1_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق التشخيصي',
          labelEn: 'Launch Micro-Quiz',
          icon: 'Zap',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هي المشكلة الأساسية التي تحلها خوارزميات الترميز الفرعي مثل BPE مقارنة بتقسيم الكلمات بالمسافات (Word-level)؟',
                qEn: 'What core problem does Subword BPE solve compared to traditional word-level tokenization?',
                optionsAr: ['التعامل مع الكلمات النادرة وغير الموجودة بالقاموس (OOV - Out of Vocabulary)', 'تسريع كود البايثون في حلقة التدريب', 'تقليل دقة النموذج اللغوي', 'إلغاء الحاجة لمتجهات التضمين'],
                optionsEn: ['Handling Out-Of-Vocabulary (OOV) and rare words by decomposing into morphemes', 'Speeding up python training loop', 'Reducing model accuracy', 'Eliminating embeddings'],
                correct: 0,
                explanationAr: 'تسمح خوارزمية BPE بتمثيل أي كلمة غير مألوفة عبر تجزئتها إلى مقاطع فرعية معروفة مسبقاً، مما يمنع مشكلة الـ OOV نهائياً.',
                explanationEn: 'BPE splits unknown words into known subword units, ensuring zero out-of-vocabulary tokens.'
              },
              {
                qAr: 'لماذا تحتاج معمارية الـ Transformer الأصلية إلى التضمين الموضعي (Positional Encoding) عكس شبكات الـ RNN؟',
                qEn: 'Why do Transformers strictly require Positional Encoding unlike recurrent models (RNNs)?',
                optionsAr: ['لأن آلية الـ Self-Attention متماثلة في الترتيب (Permutation Invariant) ولا تدرك ترتيب الكلمات تلقائياً', 'لتقليل حجم الذاكرة المطلوبة على GPU', 'لتسريع حسابات Softmax', 'لمنع حدوث مشكلة الانفجار التدرجي'],
                optionsEn: ['Because Self-Attention is permutation-invariant and processes all tokens in parallel without order awareness', 'To reduce GPU memory', 'To speed up softmax', 'To prevent exploding gradients'],
                correct: 0,
                explanationAr: 'معمارية الـ Transformer تعالج جميع الكلمات معاً بالتوازي، وبدون الـ Positional Encoding ستكون الجملة (القط أكل الفأر) متطابقة تماماً مع (الفأر أكل القط)!',
                explanationEn: 'Transformers process tokens simultaneously; without positional encodings, word order is completely lost.'
              },
              {
                qAr: 'ما هي العملية الحسابية التي تتم لدمج الـ Word Embedding مع الـ Positional Encoding قبل أول طبقة Transformer؟',
                qEn: 'What mathematical operation combines Word Embeddings with Positional Encoding before the first layer?',
                optionsAr: ['الجمع العنصري البسيط (Element-wise Addition)', 'الضرب المتجهي المتقاطع (Cross Product)', 'حساب متوسط القيم (Mean Pooling)', 'التسلسل المضاعف للأبعاد (Concatenation)'],
                optionsEn: ['Element-wise Addition', 'Cross Product', 'Mean Pooling', 'Concatenation'],
                correct: 0,
                explanationAr: 'يتم جمع متجه التضمين الدلالي مع متجه الموضع جمعاً مباشراً (Element-wise) لأن لهما نفس البعد d_model = 512.',
                explanationEn: 'They are summed element-wise directly, preserving dimensional budget d_model = 512.'
              }
            ]
          }
        }
      }
    ]
  }),

  // ---------------------------------------------------------
  // SESSION 2: CNN & CONCURRENCY
  // ---------------------------------------------------------
  su26_session2: (topic) => ({
    id: `rescue_${topic.id}`,
    topicId: topic.id,
    conceptId: 'cnn_kernels_gil',
    conceptNameAr: 'مرشحات الالتفاف (CNN Kernels) وقفل المفسر العام (Python GIL)',
    conceptNameEn: 'CNN Feature Maps & Python GIL Concurrency',
    masteryScore: 39,
    detectedWeaknessReasonAr: 'رصد أخطاء في حساب أبعاد الـ Feature Maps بعد الـ Stride وكذلك فهم قيود الـ GIL عند معالجة دفعات الصور بالـ Multithreading (نسبة الإتقان: 39%).',
    detectedWeaknessReasonEn: 'Detected mistakes calculating CNN output dimensions with Stride/Padding and understanding GIL CPU bottlenecks (Mastery: 39%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظ الوكيل الذكي في موضوع (${topic.titleAr}) أنك تواجه صعوبة في حساب أبعاد مصفوفات الـ CNN مع الـ Padding وكذلك فهم قيود الـ Python GIL أثناء معالجة الصور المتزامنة. جهزت لك خطة إنقاذ مركزة من 3 خطوات لمدة 10 دقائق.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected difficulty with CNN output spatial dimensions and Python GIL multithreading constraints in ${topic.titleEn}. I prepared a 3-step rescue plan (10 mins).. Ready? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لمشاهدة فلتر الالتفاف 3x3 وهو يتحرك بخطوات (Stride) وكيف يمنع الـ GIL المعالجة المتوازية الصرفة.',
        descEn: 'Switching active modality to Visual to visualize 3x3 kernel sliding and Python GIL mutex locks.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s2_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (CNN & GIL Visualizer)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 11)',
        titleEn: 'Step 2: Lecture Slide 11 Spotlight',
        descAr: 'فحص الشريحة رقم 11 التي تشرح قانون أبعاد المخرجات [(W - K + 2P)/S + 1] وفارق الـ Threading عن الـ Multiprocessing في بايثون.',
        descEn: 'Examining lecture slide 11 detailing CNN spatial dimension arithmetic and multiprocessing vs multithreading in Python.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_s2_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 11)',
          labelEn: 'Open Slide 11 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 11,
            slideTitleAr: 'الشريحة 11: معادلات أبعاد الـ CNN وقفل الـ GIL في بايثون',
            slideTitleEn: 'Slide 11: CNN Spatial Dimensions & Python GIL Execution',
            slideContentAr: `قانون أبعاد الخريطة الناتجة:
Output_Size = ⌊(Input_Size - Kernel_Size + 2 * Padding) / Stride⌋ + 1

قاعدة بايثون الذهبية في الـ Concurrency:
- معالجة الصور بالـ CPU مكثفة (CPU-bound) -> الـ Threads العادية لا تسرع التنفيذ بسبب الـ GIL!
- الحل: استخدام multiprocessing أو تحرير الـ GIL عبر مكتبات C مثل OpenCV و NumPy و PyTorch.`,
            slideContentEn: 'Output spatial dimension formula and GIL release mechanics using C-backed libraries like PyTorch and OpenCV.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لحساب أبعاد مصفوفة CNN وتطبيق مفهوم الـ Concurrency الصحيح.',
        descEn: '3 targeted questions on CNN dimensional math and Python multiprocessing.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s2_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق التشخيصي',
          labelEn: 'Launch Micro-Quiz',
          icon: 'Zap',
          payload: {
            quizQuestions: [
              {
                qAr: 'إذا كانت الصورة بحجم 32x32 وتم تطبيق فلتر 5x5 مع خطوة Stride = 1 وبدون حشو (Padding = 0)، فما هو حجم المخرج؟',
                qEn: 'If an input image is 32x32 and a 5x5 kernel is applied with Stride=1 and Padding=0, what is the output dimension?',
                optionsAr: ['28x28', '30x30', '27x27', '32x32'],
                optionsEn: ['28x28', '30x30', '27x27', '32x32'],
                correct: 0,
                explanationAr: 'بحسب القانون: (32 - 5 + 0) / 1 + 1 = 27 + 1 = 28. إذن حجم المخرج هو 28x28.',
                explanationEn: '(32 - 5 + 0)/1 + 1 = 28. Output dimension is 28x28.'
              },
              {
                qAr: 'لماذا لا تحقق مكتبة threading في بايثون تسريعاً حقيقياً عند تطبيق فلاتر CNN على معالج متعدد الأنوية (Multi-core CPU)؟',
                qEn: 'Why does Python threading fail to achieve true parallel speedup for CPU-bound CNN filtering on multi-core CPUs?',
                optionsAr: ['بسبب قفل المفسر العام (GIL) الذي يقصر تنفيذ bytecode بايثون على خيط واحد فقط في نفس اللحظة', 'لأن بطاقات الشاشة لا تدعم بايثون', 'لأن المعالجات الحديثة لا تدعم الـ Threads', 'لأن الصور تستهلك مساحة تخزين ضخمة'],
                optionsEn: ['Due to the Global Interpreter Lock (GIL) preventing simultaneous multi-core Python bytecode execution', 'Because GPUs reject python', 'Because modern CPUs lack threading', 'Because images take too much storage'],
                correct: 0,
                explanationAr: 'الـ GIL يمنع تنفيذ أكثر من خيط بايثون في نفس اللحظة للعمليات الحسابية (CPU-bound)، والحل هو استخدام multiprocessing لتشغيل عمليات مستقلة بذاكرة منفصلة.',
                explanationEn: 'The GIL restricts bytecode execution to one native thread at a time for CPU-bound workloads.'
              },
              {
                qAr: 'ما هي الوظيفة الأساسية لطبقات الـ Max-Pooling في شبكات الـ CNN؟',
                qEn: 'What is the primary function of Max-Pooling layers in CNNs?',
                optionsAr: ['تقليل الأبعاد المكانية للخريطة وإضفاء ثبات نسبي ضد الإزاحة (Translation Invariance)', 'زيادة عدد المعاملات لتدريب الشبكة', 'تغيير ألوان الصورة إلى الأبيض والأسود', 'حساب المشتقة العكسية مباشرة'],
                optionsEn: ['Downsampling spatial dimensions and providing translation invariance', 'Increasing model parameter count', 'Converting image to grayscale', 'Computing backprop directly'],
                correct: 0,
                explanationAr: 'تقوم طبقة Max-Pooling بتصغير أبعاد الخريطة (Downsampling) مما يقلل الحسابات ويمنح النموذج قدرة على التعرف على الأنماط حتى لو تحرك مكانها في الصورة.',
                explanationEn: 'Max pooling downsamples representations, cutting computational costs and adding translation tolerance.'
              }
            ]
          }
        }
      }
    ]
  }),

  // ---------------------------------------------------------
  // SESSION 3: RNN, LSTM & SENTIMENT CLASSIFICATION
  // ---------------------------------------------------------
  su26_session3: (topic) => ({
    id: `rescue_${topic.id}`,
    topicId: topic.id,
    conceptId: 'lstm_gates_vanishing_gradients',
    conceptNameAr: 'بوابات الـ LSTM وتلاشي المشتقات (Vanishing Gradients)',
    conceptNameEn: 'LSTM Gates & Vanishing Gradients in Sentiment Classification',
    masteryScore: 35,
    detectedWeaknessReasonAr: 'رصد تشتت في التفريق بين بوابة النسيان (Forget Gate) وحالة الخلية (Cell State) في شبكات LSTM أثناء تصنيف نصوص Amazon Polarity (نسبة الإتقان: 35%).',
    detectedWeaknessReasonEn: 'Detected confusion distinguishing Forget Gate and Cell State highway during Amazon Polarity sentiment training (Mastery: 35%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظ الوكيل الذكي في موضوع (${topic.titleAr}) أنك واجهت صعوبة في فهم دور بوابة النسيان (Forget Gate) وتدفق التدرج في مصفوفات الـ Cell State أثناء تدريب نموذج تصنيف نصوص Amazon Polarity. جهزت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected difficulty with LSTM Forget Gates and Cell State gradient flow on Amazon Polarity texts in ${topic.titleEn}. Ready for a 3-step rescue plan (10 mins)? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لمشاهدة مسار حالة الخلية (Cell State Highway) وكيف تتفادى شبكات الـ LSTM مشكلة تلاشي التدرج.',
        descEn: 'Switching active modality to Visual to trace the LSTM constant error carousel highway.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s3_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (LSTM Gates Diagram)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 15)',
        titleEn: 'Step 2: Lecture Slide 15 Spotlight',
        descAr: 'فحص الشريحة رقم 15 التي توضح معادلات بوابات الـ LSTM الثلاث ودور دالة Sigmoid في فلترة المعلومات بين 0 و 1.',
        descEn: 'Examining lecture slide 15 explaining the three LSTM gates and sigmoid gating mathematics.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_s3_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 15)',
          labelEn: 'Open Slide 15 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 15,
            slideTitleAr: 'الشريحة 15: معمارية بوابات الـ LSTM وحماية المشتقات',
            slideTitleEn: 'Slide 15: LSTM Gating Architecture & Gradient Protection',
            slideContentAr: `معادلات خلية الـ LSTM:
1. بوابة النسيان: f_t = σ(W_f · [h_{t-1}, x_t] + b_f)
2. بوابة الإدخال: i_t = σ(W_i · [h_{t-1}, x_t] + b_i)
3. تحديث الخلية: C_t = f_t * C_{t-1} + i_t * tanh(W_c · [h_{t-1}, x_t] + b_c)

سر التغلب على Vanishing Gradient:
التحديث بين C_{t-1} و C_t يتم بعملية جمع وتمرير خطي، مما يجعل مشتقة dC_t / dC_{t-1} تحتوي على f_t بدون ضرب متكرر لمصفوفة الأوزان W!`,
            slideContentEn: 'LSTM additive cell state updates prevent repeated matrix multiplications during Backpropagation Through Time (BPTT).'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لاختبار فهم بوابات الـ LSTM والشبكات التكرارية وحصد +60 XP.',
        descEn: '3 targeted questions on LSTM cell states, vanishing gradients, and gating.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s3_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق التشخيصي',
          labelEn: 'Launch Micro-Quiz',
          icon: 'Zap',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هي الدالة الرياضية المستخدمة في بوابات الـ LSTM للتحكم في نسبة المعلومات المسموح بمرورها، ولماذا؟',
                qEn: 'Which activation function is used in LSTM gates to regulate information flow, and why?',
                optionsAr: ['دالة Sigmoid لأنها تحصر المخرجات بين 0 و 1 (0 يعني نسيان تام، و 1 يعني احتفاظ كامل)', 'دالة ReLU لأنها تمنع الصفر', 'دالة Softmax لتقسيم الكلمات', 'دالة التماس الزائدي Tanh فقط'],
                optionsEn: ['Sigmoid because its output ranges between 0 (completely block) and 1 (completely pass)', 'ReLU because it prevents zero', 'Softmax for word splitting', 'Tanh exclusively'],
                correct: 0,
                explanationAr: 'تعمل دالة Sigmoid كصمام رقمي ناعم: 0 يمحو المعلومة تماماً و 1 يمررها بالكامل.',
                explanationEn: 'Sigmoid outputs strictly in [0, 1], acting as an analog throttle valve for gating.'
              },
              {
                qAr: 'ما الذي يفرق شبكات الـ GRU عن شبكات الـ LSTM الأصلية؟',
                qEn: 'What distinguishes GRU (Gated Recurrent Unit) from standard LSTM?',
                optionsAr: ['دمج حالة الخلية مع الحالة الخفية وتخفيض عدد البوابات إلى اثنتين (Reset & Update) مما يسرع التدريب', 'إلغاء خوارزمية التمرير الخلفي', 'عدم قدرتها على معالجة النصوص', 'مضاعفة عدد البوابات إلى 6'],
                optionsEn: ['Merging cell state into hidden state and reducing to 2 gates (Reset & Update) for faster training', 'Removing backpropagation', 'Inability to process text', 'Doubling gates to 6'],
                correct: 0,
                explanationAr: 'شبكات GRU تدمج Cell State مع Hidden State وتستخدم بوابتين فقط (Reset و Update) مما يقلل الحسابات مع كفاءة مقاربة لـ LSTM.',
                explanationEn: 'GRU simplifies LSTM by merging cell and hidden states with just reset and update gates.'
              },
              {
                qAr: 'ما هو الممر السريع (Highway) في LSTM الذي ينقل الإشارات عبر الزمن دون ضرب غير خطي متكرر؟',
                qEn: 'What highway in LSTM carries signals across long sequences without repeated destructive non-linear products?',
                optionsAr: ['حالة الخلية (Cell State C_t)', 'طبقة التضمين فقط', 'مصفوفة الانتباه', 'طبقة الـ Dropout'],
                optionsEn: ['Cell State (C_t)', 'Embedding layer only', 'Attention matrix', 'Dropout layer'],
                correct: 0,
                explanationAr: 'حالة الخلية C_t تنتقل طولياً عبر الزمن بتفاعلات خطية بسيطة تمنع تلاشي المشتقات.',
                explanationEn: 'The cell state line carries gradients linearly through time without exponential decay.'
              }
            ]
          }
        }
      }
    ]
  }),

  // ---------------------------------------------------------
  // SESSION 5: LORA / QLORA FINE-TUNING & STREAMLIT (SCREENSHOT TOPIC!)
  // ---------------------------------------------------------
  su26_session5: (topic) => ({
    id: `rescue_${topic.id}`,
    topicId: topic.id,
    conceptId: 'lora_qlora_streamlit_finetuning',
    conceptNameAr: 'الضبط الدقيق LoRA / QLoRA ونشر واجهات Streamlit',
    conceptNameEn: 'LoRA / QLoRA Low-Rank Adaptation & Streamlit Deployment',
    masteryScore: 44,
    detectedWeaknessReasonAr: 'رصد تشتت في فهم تفكيك رتب المصفوفات (Rank Decomposition A × B) في تقنية LoRA وتكميم 4-bit NormalFloat في QLoRA وإدارة الحالة في Streamlit (نسبة الإتقان: 44%).',
    detectedWeaknessReasonEn: 'Detected confusion in Low-Rank Matrix Decomposition (A x B), 4-bit NormalFloat (NF4) quantization in QLoRA, and Streamlit session state (Mastery: 44%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظ الوكيل الذكي في موضوع (${topic.titleAr}) أنك تواجه تشتتاً في فهم تفكيك رتب مصفوفات التعديل (Low-Rank Decomposition A × B) في LoRA وتكميم الـ 4-bit في QLoRA لنشر النموذج عبر Streamlit. جهزت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق لإتقانها تماماً.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected difficulty with Low-Rank Matrix Decomposition (A × B) in LoRA, QLoRA 4-bit NF4 quantization, and Streamlit state management in ${topic.titleEn}. Ready for a 10-min 3-step rescue plan? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لمشاهدة تفكيك المصفوفة الضخمة W إلى مصفوفتين نحيفتين A و B بقيمة Rank منخفضة (r=8) مع تجميد الأوزان الأصلية.',
        descEn: 'Switching active modality to Visual to inspect low-rank matrix decomposition A x B alongside frozen base model weights.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s5_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (LoRA Matrix Visualizer)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 14)',
        titleEn: 'Step 2: Lecture Slide 14 Spotlight',
        descAr: 'فحص الشريحة رقم 14 التي توضح معادلة التحديث W = W_0 + (B · A) · (α / r) وتكميم NF4 وإدارة Streamlit Session State.',
        descEn: 'Examining lecture slide 14 covering LoRA weight adaptation formula, NF4 quantization, and Streamlit state caching.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_s5_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 14)',
          labelEn: 'Open Slide 14 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 14,
            slideTitleAr: 'الشريحة 14: معادلات الضبط الدقيق LoRA / QLoRA ونشر Streamlit',
            slideTitleEn: 'Slide 14: LoRA / QLoRA Low-Rank Adaptation & Streamlit Deployment',
            slideContentAr: `معادلة LoRA الجوهرية:
W = W_0 + ΔW = W_0 + (B · A) · (α / r)

حيث:
- W_0: أوزان النموذج الأصلية المجمدة تماماً (Frozen Weights)
- B ∈ R^(d × r) و A ∈ R^(r × k): مصفوفتان برتبة منخفضة جداً (مثلاً r=8 أو 16 بدلاً من d=4096!)
- هذا يقلل المعاملات القابلة للتدريب بأكثر من 99%!
- في QLoRA: يتم ضغط W_0 إلى 4-bit عبر NormalFloat4 (NF4) لحفظ ذاكرة الـ VRAM.

في واجهات Streamlit:
- نستخدم st.cache_resource لتحميل النموذج في الذاكرة مرة واحدة فقط!
- نستخدم st.session_state لحفظ سجل المحادثة بين التحديثات.`,
            slideContentEn: 'LoRA formula: W = W_0 + (B · A) · (alpha / r). Freezes base weights W_0 and trains only low-rank adapters A and B. QLoRA applies 4-bit NF4 quantization.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لاختبار استيعاب تقنيات LoRA و QLoRA ونشر تطبيقات Streamlit وحصد +60 XP.',
        descEn: '3 targeted questions on LoRA rank parameters, QLoRA NF4 quantization, and Streamlit caching.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s5_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق التشخيصي',
          labelEn: 'Launch Micro-Quiz',
          icon: 'Zap',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هي الفكرة الأساسية وراء تقنية LoRA (Low-Rank Adaptation) في تدريب النماذج اللغوية الضخمة؟',
                qEn: 'What is the core premise behind LoRA (Low-Rank Adaptation) when fine-tuning Large Language Models?',
                optionsAr: ['تجميد أوزان النموذج الأصلية بالكامل وتدريب مصفوفتين برتبة منخفضة (A و B) لتمثيل التغيير في الأوزان', 'حذف نصف طبقات النموذج لتسريع الاستدلال', 'إعادة تدريب جميع معاملات النموذج من الصفر', 'تحويل النموذج ليعمل فقط على المعالجات المركزية القديمة'],
                optionsEn: ['Freezing pre-trained weights and training two low-rank matrices (A and B) to represent delta W', 'Deleting half the model layers to speed up inference', 'Retraining all weights from scratch', 'Converting model to run on legacy CPUs only'],
                correct: 0,
                explanationAr: 'تثبت تقنية LoRA أوزان النموذج W_0 وتدرب مصفوفتين صغيرتين A و B، بحيث يكون ضربهما B*A مساوياً لـ ΔW، مما يقلل المعاملات المدربة بنسبة تصل لـ 99.9%!',
                explanationEn: 'LoRA freezes W_0 and decomposes delta W into B*A where rank r << d, slashing trainable parameters by up to 99.9%.'
              },
              {
                qAr: 'ما الذي تقدمه تقنية QLoRA كإضافة رئيسية تتفوق بها على LoRA التقليدية في توفير الذاكرة؟',
                qEn: 'What key innovation does QLoRA introduce over standard LoRA to drastically reduce GPU memory (VRAM)?',
                optionsAr: ['تكميم أوزان النموذج الأصلي المجمدة إلى دقة 4-bit بنوع NormalFloat (NF4) واستخدام التكميم المزدوج (Double Quantization)', 'إلغاء الحاجة لبطاقات الرسوميات نهائياً', 'تقليل عدد الكلمات في المدخلات', 'تدريب النموذج بدون دالة خسارة'],
                optionsEn: ['Quantizing frozen base weights to 4-bit NormalFloat (NF4) with Double Quantization', 'Eliminating GPU requirements altogether', 'Restricting prompt token lengths', 'Training without loss functions'],
                correct: 0,
                explanationAr: 'تضغط QLoRA النموذج الأساسي إلى 4-bit NormalFloat مع Paged Optimizers، مما يتيح تدريب نموذج 65B على بطاقة رسوميات واحدة 48GB بدلاً من 4x A100!',
                explanationEn: 'QLoRA quantizes the base model to 4-bit NormalFloat (NF4) with double quantization, democratizing LLM fine-tuning on consumer GPUs.'
              },
              {
                qAr: 'في واجهات Streamlit، ما هو الأمر الأمثل المستخدم لتحميل نموذج الذكاء الاصطناعي في الذاكرة مرة واحدة فقط وتجنب إعادة تحميله مع كل تفاعل للمستخدم؟',
                qEn: 'In Streamlit apps, which decorator ensures an AI model is loaded into memory only once and cached across user interactions?',
                optionsAr: ['@st.cache_resource', '@st.cache_data', 'st.session_state.clear()', 'st.experimental_rerun()'],
                optionsEn: ['@st.cache_resource', '@st.cache_data', 'st.session_state.clear()', 'st.experimental_rerun()'],
                correct: 0,
                explanationAr: 'يُستخدم @st.cache_resource لتخزين الكائنات التي لا تقبل التسلسل التسلسلي السهل مثل نماذج التعلم العميق والاتصالات بقواعد البيانات، بينما @st.cache_data مخصص للبيانات الحسابية والـ DataFrames.',
                explanationEn: '@st.cache_resource is specifically designed for caching global stateful resources like deep learning models and DB connections.'
              }
            ]
          }
        }
      }
    ]
  }),

  // ---------------------------------------------------------
  // SESSION 7: CAPSTONE PROJECT ARCHITECTURE & TEAM ALLOCATION
  // ---------------------------------------------------------
  su26_session7: (topic) => ({
    id: `rescue_${topic.id}`,
    topicId: topic.id,
    conceptId: 'capstone_ai_pipeline_architecture',
    conceptNameAr: 'معمارية خط إنتاج الذكاء الاصطناعي ومقاييس التقييم (AI Pipeline & Evaluation)',
    conceptNameEn: 'AI Pipeline Architecture & Benchmark Metrics',
    masteryScore: 48,
    detectedWeaknessReasonAr: 'رصد حاجة ماسة لتحديد خط إنتاج البيانات (Data Pipeline) وتفادي تسريب البيانات (Data Leakage) وتحديد مقاييس التقييم المعيارية F1 و BLEU و Latency (نسبة الإتقان: 48%).',
    detectedWeaknessReasonEn: 'Detected urgent need to define End-to-End Data Pipeline, prevent Data Leakage, and establish rigorous evaluation benchmarks (Mastery: 48%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظ الوكيل الذكي في موضوع (${topic.titleAr}) أنك وفريقك بحاجة لحسم معمارية خط الإنتاج (Data Pipeline) وتفادي تسريب البيانات وتحديد مقاييس التقييم المعيارية للنموذج المختار لمشروع التخرج. جهزت لك خطة من 3 خطوات لمدة 10 دقائق.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected that your team needs to lock down the End-to-End AI Data Pipeline, prevent data leakage, and establish evaluation benchmarks for ${topic.titleEn}. Ready for a 10-min 3-step rescue plan? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لمشاهدة مخطط هيكلي كامل لخط إنتاج الذكاء الاصطناعي (Ingestion -> Processing -> Model -> Inference API -> Monitoring).',
        descEn: 'Switching active modality to Visual to review end-to-end production AI pipeline blueprints.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s7_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (Pipeline Architecture)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 7)',
        titleEn: 'Step 2: Lecture Slide 7 Spotlight',
        descAr: 'فحص الشريحة رقم 7 التي تشرح معايير تسليم مشاريع التخرج وكيفية قياس الدقة المعيارية وزمن الاستجابة (Latency Constraints).',
        descEn: 'Examining lecture slide 7 detailing capstone project grading criteria, benchmark evaluation metrics, and latency constraints.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_s7_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 7)',
          labelEn: 'Open Slide 7 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 7,
            slideTitleAr: 'الشريحة 7: معايير تقييم مشاريع الذكاء الاصطناعي وهندسة الإنتاج',
            slideTitleEn: 'Slide 7: AI Project Evaluation & Production Engineering',
            slideContentAr: `ركائز مشروع التخرج الناجح:
1. فصل البيانات الصارم (Train / Validation / Test) قبل تطبيق أي Feature Scaling لمنع Data Leakage.
2. مقاييس التقييم المتخصصة:
   - للتصنيف غير المتوازن: Macro F1-Score و PR-AUC (وليس مجرد Accuracy!)
   - لتوليد النصوص: BLEU و ROUGE و BERTScore و LLM-as-a-Judge
3. ميزانية زمن الاستجابة (Inference Latency): ضمان الرد خلال أقل من 500ms عبر تقنيات التكميم والتخزين المؤقت.`,
            slideContentEn: 'Capstone essentials: Strict train/val/test splits to avoid data leakage, task-specific evaluation metrics, and latency SLAs under 500ms.'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لحسم المعمارية واختيار المقاييس وتجنب أخطاء التسريب وحصد +60 XP.',
        descEn: '3 targeted questions on pipeline engineering and benchmark selection.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s7_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق التشخيصي',
          labelEn: 'Launch Micro-Quiz',
          icon: 'Zap',
          payload: {
            quizQuestions: [
              {
                qAr: 'متى يعتبر مقياس الدقة التقليدي (Accuracy) مضللاً وخاطئاً لتقييم أداء نموذج الذكاء الاصطناعي في مشروع التخرج؟',
                qEn: 'When is standard Accuracy misleading for evaluating an AI model in a capstone project?',
                optionsAr: ['عندما تكون البيانات غير متوازنة بشدة بين الفئات (Imbalanced Classes كأن تكون 99% سليمة و 1% مصابة)', 'عندما تكون جميع الفئات متساوية تماماً', 'عند تدريب النموذج على بطاقة GPU قوية', 'عندما يكون حجم البيانات كبيراً جداً'],
                optionsEn: ['When classes are heavily imbalanced (e.g. 99% negative, 1% positive)', 'When classes are perfectly balanced', 'When trained on powerful GPUs', 'When the dataset is very large'],
                correct: 0,
                explanationAr: 'في البيانات غير المتوازنة، لو توقع النموذج دائماً الفئة الأكثر تكراراً سيحصل على 99% Accuracy ولكنه فشل تماماً في رصد الفئة النادرة المستهدفة! المقياس الصحيح هنا هو F1-Score أو ROC-AUC.',
                explanationEn: 'In imbalanced datasets, a trivial model predicting only the majority class scores high accuracy while completely failing. F1-score or PR-AUC must be used.'
              },
              {
                qAr: 'ما هو الخطأ القاتل المعروف بـ (Data Leakage) وكيف نتجنبه هندسياً في خط تجهيز البيانات؟',
                qEn: 'What is Data Leakage and how do we strictly prevent it during data preprocessing pipelines?',
                optionsAr: ['تسريب معلومات من مجموعة الاختبار (Test Set) إلى تدريب النموذج، ونتجنبه بحساب المتوسطات والمقاييس على Train فقط ثم تطبيقها على Test', 'فقدان البيانات عند إغلاق الحاسوب', 'مشاركة الكود مع الزملاء على GitHub', 'تحميل بيانات بصيغة CSV بدلاً من JSON'],
                optionsEn: ['Leaking information from test set into training; prevented by fitting preprocessors on Train only', 'Losing data upon shutdown', 'Sharing code on GitHub', 'Using CSV instead of JSON'],
                correct: 0,
                explanationAr: 'يحدث الـ Leakage عندما يتم حساب المتوسط والانحراف المعياري للتقييس (Scaling) على كامل البيانات قبل التقسيم، مما يجعل النموذج يرى إحصائيات المستقبل!',
                explanationEn: 'Fit scalers and imputation ONLY on the training split, then transform validation/test splits to preserve strict blindness.'
              },
              {
                qAr: 'ما هو مقياس التقييم المعياري الأكثر استخداماً لقياس جودة الترجمة الآلية وتلخيص النصوص ومقارنتها بنصوص المراجع البشرية؟',
                qEn: 'Which standard metric measures overlap of n-grams against human reference texts for summarization/translation?',
                optionsAr: ['مقياس BLEU و ROUGE', 'مقياس Mean Squared Error (MSE)', 'دالة Hinge Loss', 'معدل الـ Bitrate'],
                optionsEn: ['BLEU & ROUGE metrics', 'Mean Squared Error (MSE)', 'Hinge Loss', 'Bitrate'],
                correct: 0,
                explanationAr: 'يقيس مقياس BLEU نسبة تداخل الـ n-grams للترجمة، بينما يقيس ROUGE نسبة الاستدعاء (Recall) لتلخيص النصوص.',
                explanationEn: 'BLEU and ROUGE evaluate n-gram precision and recall between candidate machine outputs and human references.'
              }
            ]
          }
        }
      }
    ]
  }),

  // ---------------------------------------------------------
  // SESSION 8: RAG CODE & VECTOR DATABASES
  // ---------------------------------------------------------
  su26_session8: (topic) => ({
    id: `rescue_${topic.id}`,
    topicId: topic.id,
    conceptId: 'rag_chunking_vector_dbs',
    conceptNameAr: 'استراتيجيات تقطيع النصوص وقواعد البيانات المتجهة (RAG & Vector DBs)',
    conceptNameEn: 'RAG Chunking Strategies & Vector Databases (FAISS/Weaviate)',
    masteryScore: 40,
    detectedWeaknessReasonAr: 'تكرار الخطأ في تحديد حجم نافذة التقطيع (Chunk Size vs Overlap) وحساب تشابه المتجهات Cosine Similarity في فهارس FAISS (نسبة الإتقان: 40%).',
    detectedWeaknessReasonEn: 'Repeated mistakes tuning Chunk Size/Overlap and applying Cosine Similarity with FAISS indices (Mastery: 40%).',
    proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظ الوكيل الذكي في موضوع (${topic.titleAr}) أنك تواجه صعوبة في ضبط تداخل المقاطع (Chunk Overlap) وتطبيق البحث الهجين (Hybrid Search) في قواعد بيانات المتجهات FAISS و Weaviate. جهزت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق لإتقانها تماماً.. هل نبدأ؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent detected difficulty with text Chunking Overlap, FAISS indexing, and Cosine Similarity in ${topic.titleEn}. Ready for a 10-min 3-step rescue plan? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Modality Intuition',
        descAr: 'تحويل نمط التعلم إلى (البصري) لمشاهدة فضاء المتجهات ثلاثي الأبعاد وإسقاط السؤال ومقارنة زوايا الجيب تمام (Cosine Angles) مع المستندات المخزنة.',
        descEn: 'Switching active modality to Visual to visualize 3D embedding vector space and cosine angle retrieval.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s8_step1',
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري (Vector Space Projection)',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: 'الخطوة 2: فحص شريحة المحاضرة المستهدفة (Slide 19)',
        titleEn: 'Step 2: Lecture Slide 19 Spotlight',
        descAr: 'فحص الشريحة رقم 19 التي توضح المفاضلة بين حجم الـ Chunk وتأثير الـ Overlap وقانون تشابه الجيب تمام الموحد (Normalized Cosine Similarity).',
        descEn: 'Examining lecture slide 19 detailing chunk size tradeoffs, overlap benefits, and normalized cosine similarity formulas.',
        duration: '4 دقائق',
        completed: false,
        action: {
          id: 'act_s8_step2',
          type: 'OPEN_SLIDE',
          labelAr: 'عرض شريحة المحاضرة (Slide 19)',
          labelEn: 'Open Slide 19 Spotlight',
          icon: 'FileText',
          payload: {
            slideNumber: 19,
            slideTitleAr: 'الشريحة 19: استراتيجيات تقطيع النصوص وفهارس المتجهات FAISS',
            slideTitleEn: 'Slide 19: RAG Chunking Strategies & FAISS Vector Indexing',
            slideContentAr: `معادلة تشابه الجيب تمام:
Cosine_Similarity(u, v) = (u · v) / (||u|| * ||v||)

قواعد تقطيع النصوص في RAG:
- إذا كان الـ Chunk صغيراً جداً (مثلاً 100 توكن): يفقد النموذج السياق المحيط بالمعلومة!
- إذا كان الـ Chunk ضخماً (مثلاً 2000 توكن): يصبح التضمين مشتتاً ويحتوي على ضوضاء تقلل دقة الاسترجاع!
- القاعدة الذهبية: استخدام Chunk Size = 500 مع Overlap = 100 لضمان عدم قطع الجمل المفتاحية بين المقاطع.`,
            slideContentEn: 'Cosine similarity computes dot product over normalized vectors. Optimal chunking balances contextual coherence with embedding specificity (e.g. 500 tokens with 100 overlap).'
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي (3 أسئلة فورية)',
        titleEn: 'Step 3: Verification Micro-Quiz',
        descAr: '3 أسئلة فورية لاختبار فهم الـ RAG وقواعد بيانات المتجهات واسترجاع النصوص وحصد +60 XP.',
        descEn: '3 targeted questions on RAG chunking, FAISS index flat L2 vs cosine, and hybrid search.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: 'act_s8_step3',
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق التشخيصي',
          labelEn: 'Launch Micro-Quiz',
          icon: 'Zap',
          payload: {
            quizQuestions: [
              {
                qAr: 'ما هي الفائدة الرئيسية لتطبيق تداخل المقاطع (Chunk Overlap) أثناء تجزئة المستندات الطويلة في خط إنتاج RAG؟',
                qEn: 'What is the primary benefit of Chunk Overlap when splitting long documents in a RAG pipeline?',
                optionsAr: ['منع انشطار الأفكار والتعريفات المهمة التي تقع على حواف المقاطع وحفظ السياق المتصل', 'مضاعفة حجم قاعدة البيانات دون فائدة', 'تقليل عدد التوكنز المرسلة للنموذج', 'تسريع تدريب نموذج التضمين'],
                optionsEn: ['Preventing semantic fragmentation of ideas split across boundary edges and preserving context', 'Doubling DB size unnecessarily', 'Reducing prompt token count', 'Speeding up embedding training'],
                correct: 0,
                explanationAr: 'يضمن تداخل المقاطع (مثلاً 50-100 حرف أو توكن) ألا تنقسم جملة هامة أو معلومة حاسمة في المنتصف بين مقطعين فيفقد النموذج دلالتها.',
                explanationEn: 'Overlap preserves semantic continuity across chunk borders so crucial facts spanning cuts remain intact.'
              },
              {
                qAr: 'لماذا يُفضل استخدام مقياس Cosine Similarity على المسافة الإقليدية Euclidean Distance (L2) عند مقارنة متجهات النصوص غير الموحدة؟',
                qEn: 'Why is Cosine Similarity preferred over Euclidean Distance (L2) when comparing non-normalized text embedding vectors?',
                optionsAr: ['لأنه يقيس زاوية الاتجاه الدلالي فقط ويتجاهل الطول أو حجم النص الذي قد يسبب انحرافاً في L2', 'لأنه يعتمد على الجمع فقط دون الضرب', 'لأن L2 مخصص للصور فقط', 'لأن Cosine أبطأ في الحساب'],
                optionsEn: ['Because it evaluates semantic orientation angle, ignoring vector magnitude influenced by document length', 'Because it uses addition only', 'Because L2 is only for images', 'Because Cosine is slower'],
                correct: 0,
                explanationAr: 'يقيس Cosine Similarity جيب تمام الزاوية بين المتجهين، مما يعبر عن التشابه في المعنى بغض النظر عن تكرار الكلمات أو طول الفقرة.',
                explanationEn: 'Cosine similarity measures directional alignment, neutralizing distortion from text length differences.'
              },
              {
                qAr: 'ما هو البحث الهجين (Hybrid Search) وما سبب تفوقه في نظم الاسترجاع المعزز الحديثة؟',
                qEn: 'What is Hybrid Search and why does it outperform pure vector search in modern RAG systems?',
                optionsAr: ['الدمج بين البحث الدلالي بالمتجهات الكثيفة (Dense Vectors) والبحث اللفظي بالكلمات المفتاحية (Sparse BM25)', 'البحث في ملفات PDF وملفات Word معاً', 'تشغيل نموذجين لغويين في نفس اللحظة', 'استخدام نوعين مختلفين من بطاقات الرسوميات'],
                optionsEn: ['Combining dense semantic vector search with sparse keyword search (BM25)', 'Searching PDFs and Word docs simultaneously', 'Running two LLMs at once', 'Using two different GPUs'],
                correct: 0,
                explanationAr: 'البحث الدلالي يفهم المعنى العام، بينما BM25 يتفوق في رصد الأكواد والأسماء والمصطلحات الدقيقة، ودمجهما يوفر دقة استرجاع مثالية.',
                explanationEn: 'Dense vector search captures conceptual semantics, while sparse BM25 hits exact keywords, names, and error codes.'
              }
            ]
          }
        }
      }
    ]
  })
};

// -------------------------------------------------------------
// DYNAMIC TOPIC WEAKNESS SYNTHESIZER FOR ARBITRARY / CUSTOM TOPICS
// -------------------------------------------------------------
function buildDynamicTopicPlan(topic: CourseTopic): RescuePlan {
  const cleanTitleAr = topic.titleAr || topic.titleEn;
  const cleanTitleEn = topic.titleEn || topic.titleAr;

  // Extract core keywords
  const titleText = `${cleanTitleAr} ${cleanTitleEn}`.toLowerCase();
  
  let keyConceptAr = cleanTitleAr;
  let keyConceptEn = cleanTitleEn;
  let mastery = 42;
  let slideNum = 5;

  if (titleText.includes('search') || titleText.includes('بحث') || titleText.includes('norvig')) {
    keyConceptAr = 'خوارزميات البحث الذكي ودوال التقدير (Heuristic Search & A*)';
    keyConceptEn = 'Intelligent Search & Admissible Heuristics (A*)';
    mastery = 45;
    slideNum = 6;
  } else if (titleText.includes('math') || titleText.includes('رياض') || titleText.includes('مصفوف')) {
    keyConceptAr = 'جبر المصفوفات والعمليات الخطية في الذكاء الاصطناعي';
    keyConceptEn = 'Matrix Algebra & Linear Transformations for AI';
    mastery = 48;
    slideNum = 4;
  } else if (titleText.includes('ml') || titleText.includes('تعلم الآلة') || titleText.includes('بيانات')) {
    keyConceptAr = 'أساسيات تعلم الآلة والتعميم مقابل فرط التخصيص (Overfitting)';
    keyConceptEn = 'Machine Learning Generalization vs Overfitting';
    mastery = 41;
    slideNum = 7;
  } else if (titleText.includes('vision') || titleText.includes('رؤية') || titleText.includes('صور')) {
    keyConceptAr = 'معالجة الصور الرقمية واستخراج المعالم البصرية';
    keyConceptEn = 'Digital Image Processing & Visual Feature Extraction';
    mastery = 38;
    slideNum = 9;
  } else {
    keyConceptAr = `المفاهيم الجوهرية والأسس التطبيقية في (${cleanTitleAr})`;
    keyConceptEn = `Core Theoretical & Practical Foundations in (${cleanTitleEn})`;
    mastery = 43;
    slideNum = 5;
  }

  return {
    id: `rescue_dynamic_${topic.id}`,
    topicId: topic.id,
    conceptId: `concept_${topic.id}`,
    conceptNameAr: keyConceptAr,
    conceptNameEn: keyConceptEn,
    masteryScore: mastery,
    detectedWeaknessReasonAr: `رصد الوكيل الذكي حاجة لتثبيت المفاهيم الجوهرية وتحسين دقة الحل في موضوع (${cleanTitleAr}) (نسبة الإتقان المرصودة: ${mastery}%).`,
    detectedWeaknessReasonEn: `The proactive agent detected an opportunity to master core foundational concepts in (${cleanTitleEn}) (Mastery: ${mastery}%).`,
    proactiveMessageAr: `أهلاً يا يوسف! 👋 حلل الوكيل الذكي أداءك في موضوع (${cleanTitleAr}) ورصد صعوبة في استيعاب (${keyConceptAr}). قمت بتجهيز خطة إنقاذ سريعة من 3 خطوات لمدة 10 دقائق لترسيخ المفاهيم تماماً.. هل نبدأ معاً؟ 🚀`,
    proactiveMessageEn: `Hey Yusuf! 👋 The proactive agent analyzed your progress in (${cleanTitleEn}) and spotted a knowledge gap in (${keyConceptEn}). I prepared a 3-step, 10-minute rescue plan to master it.. Shall we begin? 🚀`,
    rewardXP: 60,
    status: 'pending',
    steps: [
      {
        stepNumber: 1,
        titleAr: 'الخطوة 1: الفهم الحدسي عبر النمط البصري',
        titleEn: 'Step 1: Visual Intuition Breakdown',
        descAr: `تحويل نمط العرض تلقائياً للنمط البصري لتجسيد مفهوم (${keyConceptAr}) في مخطط توضيحي مبسط.`,
        descEn: `Automatically switching to Visual modality to render intuitive diagrams for (${keyConceptEn}).`,
        duration: '3 دقائق',
        completed: false,
        action: {
          id: `act_dyn_${topic.id}_1`,
          type: 'SWITCH_MODALITY',
          labelAr: 'الانتقال للنمط البصري التفاعلي',
          labelEn: 'Switch to Visual Modality',
          icon: 'Eye',
          payload: { modality: 'visual' }
        }
      },
      {
        stepNumber: 2,
        titleAr: `الخطوة 2: فحص الشريحة المستهدفة (Slide ${slideNum})`,
        titleEn: `Step 2: Targeted Slide ${slideNum} Spotlight`,
        descAr: `استخراج وتثبيت الشريحة رقم ${slideNum} التي تحتوي على الشرح الأكاديمي والعملي لـ (${keyConceptAr}).`,
        descEn: `Spotlighting slide #${slideNum} containing rigorous breakdown of (${keyConceptEn}).`,
        duration: '4 دقائق',
        completed: false,
        action: {
          id: `act_dyn_${topic.id}_2`,
          type: 'OPEN_SLIDE',
          labelAr: `عرض شريحة المحاضرة (Slide ${slideNum})`,
          labelEn: `Open Slide ${slideNum}`,
          icon: 'FileText',
          payload: {
            slideNumber: slideNum,
            slideTitleAr: `الشريحة ${slideNum}: القواعد والأسس النظرية لـ ${keyConceptAr}`,
            slideTitleEn: `Slide ${slideNum}: Theoretical Foundations of ${keyConceptEn}`,
            slideContentAr: `الملخص التحليلي المستخرج:
- الموضوع: ${cleanTitleAr}
- المفهوم المستهدف: ${keyConceptAr}
- النقاط الجوهرية: ${topic.descriptionAr || 'استعراض المفاهيم والقواعد البرمجية والرياضية الخاصة بالمحاضرة لتثبيت استيعاب الطالب.'}`,
            slideContentEn: `Key takeaways:
- Topic: ${cleanTitleEn}
- Target Concept: ${keyConceptEn}
- Core Principles: ${topic.descriptionEn || 'Core analytical breakdown of topic foundations.'}`
          }
        }
      },
      {
        stepNumber: 3,
        titleAr: 'الخطوة 3: كويز التحقق التشخيصي وحصد الـ XP',
        titleEn: 'Step 3: Verification Micro-Quiz & XP',
        descAr: 'كويز تفاعلي من 3 أسئلة لتأكيد استيعاب المفهوم بالكامل وحصد +60 XP.',
        descEn: '3 diagnostic verification questions to solidify concept retention and claim +60 XP.',
        duration: '3 دقائق',
        completed: false,
        action: {
          id: `act_dyn_${topic.id}_3`,
          type: 'LAUNCH_MICRO_QUIZ',
          labelAr: 'بدء كويز التحقق التشخيصي',
          labelEn: 'Launch Diagnostic Quiz',
          icon: 'Zap',
          payload: {
            quizQuestions: [
              {
                qAr: `ما هو الهدف الأساسي من دراسة وتطبيق (${keyConceptAr})؟`,
                qEn: `What is the primary goal of studying and applying (${keyConceptEn})?`,
                optionsAr: [
                  `بناء فهم علمي متين يربط النظرية بالتطبيق العملي في (${cleanTitleAr})`,
                  'حفظ التعريفات دون تطبيقها في الكود',
                  'إلغاء الحاجة للتحقق من أداء النموذج',
                  'تكرار العمليات دون فهم الغرض منها'
                ],
                optionsEn: [
                  `Establishing rigorous scientific foundation bridging theory and practical implementation in (${cleanTitleEn})`,
                  'Memorizing definitions without code execution',
                  'Eliminating verification steps',
                  'Repeating tasks without objective'
                ],
                correct: 0,
                explanationAr: `يهدف استيعاب (${keyConceptAr}) إلى تمكين الطالب من تطبيق الأدوات وفهم مخرجاتها بدقة واحترافية.`,
                explanationEn: `Mastering (${keyConceptEn}) enables precise, professional practical implementation and result interpretation.`
              },
              {
                qAr: 'ما هي أفضل ممارسة هندسية عند تطبيق هذا المفهوم على مشاريع واقعية؟',
                qEn: 'What is the recommended engineering best practice when applying this concept to real-world projects?',
                optionsAr: [
                  'التأكد من سلامة البيانات واختيار المقاييس المناسبة والتحقق التدريجي من النتائج',
                  'الاعتماد على التخمين وتخطي مراحل الفحص',
                  'تطبيق الكود دون مراجعة الشروط والمحددات',
                  'تجاهل رسائل التحذير والأخطاء'
                ],
                optionsEn: [
                  'Ensuring data integrity, selecting appropriate benchmark metrics, and stepwise verification',
                  'Relying on guesswork and skipping validation',
                  'Executing code without reviewing constraints',
                  'Ignoring warnings and runtime errors'
                ],
                correct: 0,
                explanationAr: 'التثبت المنهجي من البيانات والمقاييس يضمن الحصول على نتائج دقيقة وتفادي الأخطاء الصامتة.',
                explanationEn: 'Systematic validation of data and metrics guarantees reliable results and avoids silent bugs.'
              },
              {
                qAr: 'كيف نتأكد من إتقان هذا المفهوم واستيعابه بصورة كاملة؟',
                qEn: 'How do we confirm complete mastery and intuitive grasp of this concept?',
                optionsAr: [
                  'القدرة على شرح الفكرة بأسلوب فاينمان المبسط وحل التمارين وتطبيقها برمجياً',
                  'قراءة العنوان فقط دون تفاصيل',
                  'تجنب الأسئلة التقييمية',
                  'تأجيل التطبيق العملي دائماً'
                ],
                optionsEn: [
                  'Ability to explain via Feynman technique, solve diagnostic challenges, and implement practically',
                  'Reading titles only without depth',
                  'Avoiding evaluation questions',
                  'Indefinitely deferring practical implementation'
                ],
                correct: 0,
                explanationAr: 'أسلوب فاينمان والتطبيق البرمجي الفعلي هما المقياس الحقيقي للتمكن من أي مفهوم تقني متقدم.',
                explanationEn: 'The Feynman technique and hands-on coding are the gold standard of true technical mastery.'
              }
            ]
          }
        }
      }
    ]
  };
}

// -------------------------------------------------------------
// PROACTIVE AGENT SERVICE IMPLEMENTATION
// -------------------------------------------------------------
export class ProactiveAgentService {
  /**
   * Retrieves or computes the active rescue plan dynamically for ANY topic.
   * Checks dedicated topic ID registry first, then falls back to dynamic synthesizer.
   * ACCEPTS actual userMastery percentage (if any). If user never touched this topic,
   * it intelligently offers a preview tour (0% complete) rather than claiming a false weakness!
   */
  static getRescuePlanForTopic(topic: CourseTopic | undefined, userMastery?: number): RescuePlan {
    let basePlan: any;
    if (!topic) {
      const fallbackTopic: CourseTopic = {
        id: 'su26_session1',
        moduleCode: 'Session 1',
        titleAr: 'Session 1: معالجة النصوص وحسابات الانتباه (Text Preprocessing & Attention)',
        titleEn: 'Session 1: Text Preprocessing Code & Attention Is All You Need Paper',
        descriptionAr: 'تحليل Encoder-Decoder، أكواد التجهيز text preprocessing code، والمهام Task 1.1 & 1.2 وبناء الـ Embedding Models.',
        descriptionEn: 'Encoder-Decoder paper report, text preprocessing codeFolder, and 3 embedding models assignment.',
        totalSteps: 5,
        icon: 'BookOpen',
        badge: 'TR333 - G2'
      };
      basePlan = DEDICATED_PLANS.su26_session1(fallbackTopic);
    } else if (DEDICATED_PLANS[topic.id]) {
      basePlan = DEDICATED_PLANS[topic.id](topic);
    } else {
      const lower = `${topic.id} ${topic.titleAr} ${topic.titleEn}`.toLowerCase();
      if (lower.includes('lora') || lower.includes('qlora') || lower.includes('streamlit') || topic.id.includes('session5')) {
        basePlan = DEDICATED_PLANS.su26_session5(topic);
      } else if (lower.includes('concurrency') || lower.includes('gil') || lower.includes('sync') || topic.id.includes('session2')) {
        basePlan = DEDICATED_PLANS.su26_session2(topic);
      } else if (lower.includes('lstm') || lower.includes('rnn') || lower.includes('gru') || lower.includes('polarity') || topic.id.includes('session3')) {
        basePlan = DEDICATED_PLANS.su26_session3(topic);
      } else if (lower.includes('rag') || lower.includes('vector') || lower.includes('faiss') || lower.includes('weaviate') || topic.id.includes('session8')) {
        basePlan = DEDICATED_PLANS.su26_session8(topic);
      } else if (lower.includes('project') || lower.includes('capstone') || lower.includes('مشروع') || topic.id.includes('session7')) {
        basePlan = DEDICATED_PLANS.su26_session7(topic);
      } else if (lower.includes('attention') || lower.includes('preprocessing') || lower.includes('bpe') || topic.id.includes('session1')) {
        basePlan = DEDICATED_PLANS.su26_session1(topic);
      } else {
        basePlan = buildDynamicTopicPlan(topic);
      }
    }

    const currentTopicTitleAr = topic ? topic.titleAr : basePlan.conceptNameAr;
    const currentTopicTitleEn = topic ? topic.titleEn : basePlan.conceptNameEn;

    // 1. BRAND NEW TOPIC (User has not played games or taken quizzes in this topic yet)
    if (userMastery === undefined) {
      return {
        ...basePlan,
        isNewTopic: true,
        masteryScore: 0,
        badgeType: 'new',
        badgeAr: '✨ موضوع جديد - استكشاف تمهيدي (0% مكتمل)',
        badgeEn: '✨ New Topic - Preview Tour (0% Complete)',
        ctaLabelAr: 'ابدأ الاستكشاف التمهيدي (10 دقائق) 🚀',
        ctaLabelEn: 'Start Preview Tour (10 mins) 🚀',
        detectedWeaknessReasonAr: `أنت تفتح موضوع (${currentTopicTitleAr}) للمرة الأولى ولم تسجل أي إجابات فيه بعد! جهز لك الوكيل جولة تمهيدية لاستكشاف أهم المفاهيم والشريحة التفاعلية قبل أن تبدأ المحاضرة.`,
        detectedWeaknessReasonEn: `You are opening (${currentTopicTitleEn}) for the first time with zero quiz attempts so far. The agent generated a preview tour before you begin.`,
        proactiveMessageAr: `أهلاً يا يوسف! 👋 لاحظت أنك تبدأ دراسة موضوع (${currentTopicTitleAr}) للمرة الأولى! جهزت لك جولة تمهيدية سريعة من 3 خطوات لمدة 10 دقائق لتأسيس المفاهيم المفتاحية والشريحة الأساسية قبل البدء.. هل نبدأ الاستكشاف؟ 🚀`,
        proactiveMessageEn: `Hey Yusuf! 👋 Noticed you are starting (${currentTopicTitleEn}) for the first time! I prepared a 3-step preview tour (10 mins) to explore key concepts and lecture slides before diving in.. Shall we explore? 🚀`
      };
    }

    // 2. REAL WEAKNESS DETECTED (< 70% based on user's actual attempts)
    if (userMastery < 70) {
      return {
        ...basePlan,
        isNewTopic: false,
        masteryScore: userMastery,
        badgeType: 'weakness',
        badgeAr: `ثغرة تم رصدها من كويزاتك (${userMastery}% إتقان)`,
        badgeEn: `Quiz Knowledge Gap Detected (${userMastery}%)`,
        ctaLabelAr: 'ابدأ خطة الإنقاذ (10 دقائق) 🚀',
        ctaLabelEn: 'Start 3-Step Rescue Plan 🚀',
        detectedWeaknessReasonAr: `بناءً على إجاباتك السابقة في اختبارات وألعاب هذا الموضوع، واجهت صعوبة في فهم (${basePlan.conceptNameAr}) بنسبة إتقان فعلية بلغت ${userMastery}%.`,
        detectedWeaknessReasonEn: `Based on your previous quiz performance on this topic, difficulty was spotted in (${basePlan.conceptNameEn}) with an actual mastery of ${userMastery}%.`,
        proactiveMessageAr: `أهلاً يا يوسف! 👋 حللت إجاباتك الأخيرة في كويزات موضوع (${currentTopicTitleAr}) ولاحظت أن نسبة إتقانك حالياً ${userMastery}%، وتواجه صعوبة في فهم (${basePlan.conceptNameAr}). جهزت لك خطة إنقاذ من 3 خطوات لمدة 10 دقائق لرفع إتقانك تماماً.. هل نبدأ؟ 🚀`,
        proactiveMessageEn: `Hey Yusuf! 👋 I analyzed your recent quiz performance in (${currentTopicTitleEn}) and noticed your mastery is ${userMastery}%, with difficulty in (${basePlan.conceptNameEn}). I synthesized a 3-step rescue plan (10 mins).. Ready? 🚀`
      };
    }

    // 3. MASTERED TOPIC (>= 70%)
    return {
      ...basePlan,
      isNewTopic: false,
      masteryScore: userMastery,
      badgeType: 'mastered',
      badgeAr: `🌟 مستوى متفوق (${userMastery}% إتقان)`,
      badgeEn: `🌟 Mastered Level (${userMastery}%)`,
      ctaLabelAr: 'بدء التحدي المتقدم (+60 XP) 🚀',
      ctaLabelEn: 'Start Advanced Challenge 🚀',
      detectedWeaknessReasonAr: `أداؤك ممتاز في هذا الموضوع بنسبة استيعاب ${userMastery}%! جهز لك الوكيل تحدياً تعزيزياً لترسيخ الفهم وحصد نقاط XP إضافية.`,
      detectedWeaknessReasonEn: `Superb mastery at ${userMastery}%! The agent prepared an enrichment challenge to lock in skills and award extra XP.`,
      proactiveMessageAr: `أهلاً يا يوسف! 👋 ما شاء الله! مستواك ممتاز في موضوع (${currentTopicTitleAr}) بنسبة إتقان ${userMastery}%! جهزت لك تحدياً تشخيصياً متقدماً لتثبيت إتقانك وحصد +60 XP إضافية.. هل تقبل التحدي؟ 🚀`,
      proactiveMessageEn: `Hey Yusuf! 👋 Outstanding performance in (${currentTopicTitleEn}) with ${userMastery}% mastery! I prepared an advanced mastery challenge to claim +60 XP.. Accept the challenge? 🚀`
    };
  }

  /**
   * Evaluates if a proactive initiative banner should be displayed.
   */
  static shouldTriggerProactivePrompt(plan: RescuePlan, dismissed: boolean): boolean {
    if (dismissed) return false;
    return plan.status !== 'completed';
  }
}
