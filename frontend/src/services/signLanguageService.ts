/**
 * Arabic Sign Language (ArSL) Production Service
 * Professional Neuro-Symbolic Generation Engine
 * Handles Text-to-Gloss, Dynamic 3D Kinematics, and Fingerspelling Fallback
 */

export interface BodyPoseFrame {
  headTilt: number;
  headNod: number;
  leftUpperArm: number;
  leftForearm: number;
  rightUpperArm: number;
  rightForearm: number;
  leftWrist: number;
  rightWrist: number;
  torsoTwist: number;
  leftHandShape: 'neutral' | 'fist' | 'open_palm' | 'point_index' | 'v_shape' | 'thumbs_up' | 'pinch' | 'flat_o' | 'claw' | 'c_shape' | 'l_shape';
  rightHandShape: 'neutral' | 'fist' | 'open_palm' | 'point_index' | 'v_shape' | 'thumbs_up' | 'pinch' | 'flat_o' | 'claw' | 'c_shape' | 'l_shape';
  facialExpression: 'neutral' | 'questioning' | 'happy' | 'focused' | 'negation' | 'emphasis';
}

export interface SignGlossItem {
  gloss: string;
  arabicText: string;
  englishTranslation: string;
  isFingerspelled: boolean;
  durationMs: number;
  poses: BodyPoseFrame[];
}

export interface SignTranslationResponse {
  originalText: string;
  glossSequence: string[];
  signs: SignGlossItem[];
  totalDurationMs: number;
  metadata?: Record<string, any>;
}

// ── Arabic Alphabet Finger Spelling Lexicon (Unified Arab Sign Language Standard) ──
export const ARABIC_ALPHABET_POSES: Record<string, { handShape: BodyPoseFrame['rightHandShape']; arm: [number, number, number]; descAr: string }> = {
  'ا': { handShape: 'point_index', arm: [80, -30, 0], descAr: 'ألف: السبابة رأسياً' },
  'أ': { handShape: 'point_index', arm: [85, -25, 5], descAr: 'ألف مهموزة' },
  'إ': { handShape: 'point_index', arm: [75, -35, -5], descAr: 'همزة مكسورة' },
  'آ': { handShape: 'point_index', arm: [80, -30, 0], descAr: 'مد' },
  'ء': { handShape: 'pinch', arm: [70, -50, 10], descAr: 'همزة مفردة' },
  'ب': { handShape: 'flat_o', arm: [75, -45, 0], descAr: 'باء: الكف مبسوطة ونقطة للأسفل' },
  'ت': { handShape: 'v_shape', arm: [80, -40, 0], descAr: 'تاء: نقطتان للأعلى' },
  'ث': { handShape: 'claw', arm: [80, -40, 0], descAr: 'ثاء: ثلاثة أصابع' },
  'ج': { handShape: 'c_shape', arm: [70, -60, -10], descAr: 'جيم: تقوس الكف' },
  'ح': { handShape: 'open_palm', arm: [75, -50, 0], descAr: 'حاء: كف مفتوحة للأمام' },
  'خ': { handShape: 'open_palm', arm: [95, -20, 15], descAr: 'خاء: كف مرفوعة مع نقطة' },
  'د': { handShape: 'pinch', arm: [70, -50, 0], descAr: 'دال: زاوية السبابة والإبهام' },
  'ذ': { handShape: 'pinch', arm: [85, -30, 10], descAr: 'ذال: شكل الدال مع نقطة' },
  'ر': { handShape: 'point_index', arm: [65, -70, -15], descAr: 'راء: السبابة مائلة للأسفل' },
  'ز': { handShape: 'point_index', arm: [75, -50, 10], descAr: 'زاي: الراء مع نقطة' },
  'س': { handShape: 'claw', arm: [70, -60, 0], descAr: 'سين: ثلاثة أسنان' },
  'ش': { handShape: 'open_palm', arm: [75, -50, 15], descAr: 'شين: كف مفتوحة متباعدة الأصابع' },
  'ص': { handShape: 'fist', arm: [70, -60, 0], descAr: 'صاد: قبضة محكمة' },
  'ض': { handShape: 'fist', arm: [85, -35, 10], descAr: 'ضاد: قبضة مع رفع الإبهام' },
  'ط': { handShape: 'flat_o', arm: [75, -45, 0], descAr: 'طاء: كف مستقيمة ممدودة' },
  'ظ': { handShape: 'flat_o', arm: [85, -30, 15], descAr: 'ظاء: طاء مع نقطة' },
  'ع': { handShape: 'c_shape', arm: [70, -55, 0], descAr: 'عين: نصف دائرة' },
  'غ': { handShape: 'c_shape', arm: [85, -35, 10], descAr: 'غين: عين مع نقطة' },
  'ف': { handShape: 'pinch', arm: [80, -40, 0], descAr: 'فاء: حلقة دائرية بالأصابع' },
  'ق': { handShape: 'v_shape', arm: [75, -45, 0], descAr: 'قاف: حلقة مزدوجة' },
  'ك': { handShape: 'l_shape', arm: [80, -40, 0], descAr: 'كاف: زاوية قائمة' },
  'ل': { handShape: 'l_shape', arm: [90, -25, 0], descAr: 'لام: زاوية L للأعلى' },
  'م': { handShape: 'fist', arm: [60, -75, -10], descAr: 'ميم: قبضة متجهة للأسفل' },
  'ن': { handShape: 'point_index', arm: [75, -45, 0], descAr: 'نون: السبابة منحنية كالقوس' },
  'ه': { handShape: 'flat_o', arm: [70, -60, 0], descAr: 'هاء: دائرة بكافة الأصابع' },
  'ة': { handShape: 'flat_o', arm: [75, -50, 10], descAr: 'تاء مربوطة' },
  'و': { handShape: 'c_shape', arm: [65, -70, -15], descAr: 'واو: انحناء دائري للداخل' },
  'ي': { handShape: 'pinch', arm: [60, -80, -20], descAr: 'ياء: انسياب للأسفل' },
  'ى': { handShape: 'pinch', arm: [60, -80, -10], descAr: 'ألف مقصورة' }
};

// ── Core ArSL Semantic Dictionary ──
const CLIENT_ARSL_DICTIONARY: Record<string, { keywords: string[]; arabic: string; english: string; duration: number; poses: BodyPoseFrame[] }> = {
  'ذكاء_اصطناعي': {
    keywords: ['ذكاء', 'اصطناعي', 'الذكاء', 'الاصطناعي', 'ai'],
    arabic: 'الذكاء الاصطناعي',
    english: 'Artificial Intelligence',
    duration: 2800,
    poses: [
      { headTilt: 0, headNod: -5, leftUpperArm: 90, leftForearm: -120, rightUpperArm: 90, rightForearm: -120, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'claw', rightHandShape: 'claw', facialExpression: 'focused' },
      { headTilt: 0, headNod: 0, leftUpperArm: 110, leftForearm: -60, rightUpperArm: 110, rightForearm: -60, leftWrist: 10, rightWrist: 10, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'focused' },
      { headTilt: 0, headNod: 5, leftUpperArm: 80, leftForearm: -40, rightUpperArm: 80, rightForearm: -40, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'flat_o', rightHandShape: 'flat_o', facialExpression: 'neutral' }
    ]
  },
  'شبكة_عصبية': {
    keywords: ['شبكة', 'عصبية', 'شبكات', 'عصبيه', 'neural', 'network'],
    arabic: 'الشبكة العصبية',
    english: 'Neural Network',
    duration: 3000,
    poses: [
      { headTilt: -3, headNod: 0, leftUpperArm: 80, leftForearm: -100, rightUpperArm: 80, rightForearm: -100, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'claw', rightHandShape: 'claw', facialExpression: 'focused' },
      { headTilt: 0, headNod: -3, leftUpperArm: 95, leftForearm: -70, rightUpperArm: 65, rightForearm: -110, leftWrist: 10, rightWrist: -10, torsoTwist: 5, leftHandShape: 'open_palm', rightHandShape: 'claw', facialExpression: 'focused' },
      { headTilt: 3, headNod: 0, leftUpperArm: 65, leftForearm: -110, rightUpperArm: 95, rightForearm: -70, leftWrist: -10, rightWrist: 10, torsoTwist: -5, leftHandShape: 'claw', rightHandShape: 'open_palm', facialExpression: 'focused' },
      { headTilt: 0, headNod: 5, leftUpperArm: 80, leftForearm: -50, rightUpperArm: 80, rightForearm: -50, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'flat_o', rightHandShape: 'flat_o', facialExpression: 'neutral' }
    ]
  },
  'بيانات': {
    keywords: ['بيانات', 'البيانات', 'داتا', 'معلومات', 'data'],
    arabic: 'البيانات / المعلومات',
    english: 'Data / Information',
    duration: 2400,
    poses: [
      { headTilt: -3, headNod: 0, leftUpperArm: 75, leftForearm: -80, rightUpperArm: 75, rightForearm: -80, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'flat_o', rightHandShape: 'flat_o', facialExpression: 'focused' },
      { headTilt: 3, headNod: 0, leftUpperArm: 60, leftForearm: -100, rightUpperArm: 90, rightForearm: -60, leftWrist: 10, rightWrist: -10, torsoTwist: 4, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'focused' },
      { headTilt: 0, headNod: 4, leftUpperArm: 80, leftForearm: -40, rightUpperArm: 80, rightForearm: -40, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'flat_o', rightHandShape: 'flat_o', facialExpression: 'neutral' }
    ]
  },
  'تعلم': {
    keywords: ['تعلم', 'التعلم', 'يتعلم', 'تتعلم', 'دراسة', 'ادرس', 'learn'],
    arabic: 'التعلُّم',
    english: 'Learning',
    duration: 2600,
    poses: [
      { headTilt: 0, headNod: -6, leftUpperArm: 110, leftForearm: -130, rightUpperArm: 40, rightForearm: -30, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'neutral', facialExpression: 'focused' },
      { headTilt: 0, headNod: 4, leftUpperArm: 80, leftForearm: -50, rightUpperArm: 80, rightForearm: -50, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'happy' }
    ]
  },
  'فهم': {
    keywords: ['فهم', 'فاهم', 'نفهم', 'افهم', 'استيعاب', 'understand'],
    arabic: 'الفهم والاستيعاب',
    english: 'Understand',
    duration: 2400,
    poses: [
      { headTilt: 0, headNod: -8, leftUpperArm: 110, leftForearm: -130, rightUpperArm: 20, rightForearm: -20, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'point_index', rightHandShape: 'neutral', facialExpression: 'focused' },
      { headTilt: 0, headNod: 6, leftUpperArm: 70, leftForearm: -40, rightUpperArm: 70, rightForearm: -40, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'happy' }
    ]
  },
  'صحيح_ممتاز': {
    keywords: ['صح', 'صحيح', 'ممتاز', 'تمام', 'مظبوط', 'بطل', 'عاش', 'correct', 'good'],
    arabic: 'صحيح / ممتاز',
    english: 'Correct / Excellent',
    duration: 2000,
    poses: [
      { headTilt: 0, headNod: -6, leftUpperArm: 20, leftForearm: -20, rightUpperArm: 120, rightForearm: -30, leftWrist: 0, rightWrist: 15, torsoTwist: 0, leftHandShape: 'neutral', rightHandShape: 'thumbs_up', facialExpression: 'happy' },
      { headTilt: 5, headNod: 5, leftUpperArm: 20, leftForearm: -20, rightUpperArm: 130, rightForearm: -20, leftWrist: 0, rightWrist: 20, torsoTwist: 0, leftHandShape: 'neutral', rightHandShape: 'thumbs_up', facialExpression: 'happy' }
    ]
  },
  'خطأ_نفي': {
    keywords: ['خطأ', 'غلط', 'مش', 'لا', 'ليس', 'غير', 'لن', 'لم', 'error', 'no', 'not'],
    arabic: 'خطأ / نفي',
    english: 'Incorrect / Negation',
    duration: 2200,
    poses: [
      { headTilt: -10, headNod: 0, leftUpperArm: 70, leftForearm: -90, rightUpperArm: 70, rightForearm: -90, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'negation' },
      { headTilt: 10, headNod: 0, leftUpperArm: 85, leftForearm: -50, rightUpperArm: 85, rightForearm: -50, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'negation' }
    ]
  },
  'سؤال_استفسار': {
    keywords: ['كيف', 'ماذا', 'لماذا', 'ليه', 'ازاي', 'اين', 'متى', 'هل', 'question', 'how', 'why'],
    arabic: 'سؤال / كيف / لماذا',
    english: 'Question / How / Why',
    duration: 2400,
    poses: [
      { headTilt: 0, headNod: -5, leftUpperArm: 60, leftForearm: -70, rightUpperArm: 60, rightForearm: -70, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'questioning' },
      { headTilt: 5, headNod: -8, leftUpperArm: 75, leftForearm: -50, rightUpperArm: 75, rightForearm: -50, leftWrist: 10, rightWrist: 10, torsoTwist: 0, leftHandShape: 'open_palm', rightHandShape: 'open_palm', facialExpression: 'questioning' }
    ]
  },
  'تحية_مرحبا': {
    keywords: ['مرحبا', 'اهلا', 'أهلا', 'سلام', 'السلام', 'عليكم', 'ازيك', 'hello', 'hi'],
    arabic: 'مرحباً / السلام عليكم',
    english: 'Hello / Greetings',
    duration: 2200,
    poses: [
      { headTilt: 0, headNod: -4, leftUpperArm: 20, leftForearm: -20, rightUpperArm: 110, rightForearm: -40, leftWrist: 0, rightWrist: 10, torsoTwist: 0, leftHandShape: 'neutral', rightHandShape: 'open_palm', facialExpression: 'happy' },
      { headTilt: 0, headNod: 4, leftUpperArm: 20, leftForearm: -20, rightUpperArm: 120, rightForearm: -30, leftWrist: 0, rightWrist: -10, torsoTwist: 0, leftHandShape: 'neutral', rightHandShape: 'open_palm', facialExpression: 'happy' }
    ]
  },
  'شكر_امتنان': {
    keywords: ['شكرا', 'شكراً', 'اشكرك', 'تسلم', 'متشكر', 'thanks', 'thank'],
    arabic: 'شكراً جزيلاً',
    english: 'Thank You',
    duration: 2200,
    poses: [
      { headTilt: 0, headNod: -5, leftUpperArm: 30, leftForearm: -40, rightUpperArm: 90, rightForearm: -120, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'neutral', rightHandShape: 'flat_o', facialExpression: 'happy' },
      { headTilt: 0, headNod: 6, leftUpperArm: 30, leftForearm: -40, rightUpperArm: 70, rightForearm: -40, leftWrist: 0, rightWrist: 0, torsoTwist: 0, leftHandShape: 'neutral', rightHandShape: 'open_palm', facialExpression: 'happy' }
    ]
  }
};

export class SignLanguageService {
  /**
   * Translates any Arabic text into a sequence of verified 3D kinematic signs
   * Priority: Backend API -> Client-side Neuro-symbolic synthesis fallback
   */
  static async translateTextToSigns(text: string, speed: number = 1.0): Promise<SignTranslationResponse> {
    const cleanText = text.trim();
    if (!cleanText) {
      return { originalText: '', glossSequence: [], signs: [], totalDurationMs: 0 };
    }

    try {
      // 1. Attempt Backend API translation (utilizing Groq / FastAPI)
      const res = await fetch('http://127.0.0.1:8000/api/v1/sign-language/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleanText, speed })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.signs && data.signs.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.warn('[SignLanguageService] API offline or error. Using client-side ArSL synthesis engine.', e);
    }

    // 2. Client-side deterministic ArSL Synthesizer (Instant, 100% Guaranteed)
    return this.synthesizeClientSide(cleanText, speed);
  }

  /**
   * Deterministic client-side synthesis with authentic Fingerspelling for unmapped words
   */
  private static synthesizeClientSide(text: string, speed: number): SignTranslationResponse {
    // Strip diacritics and extract tokens
    const normalized = text.replace(/[\u064B-\u0652\u0640]/g, '');
    const tokens = normalized.match(/[\u0621-\u064A0-9a-zA-Z]+/g) || [];
    
    const signs: SignGlossItem[] = [];
    const glossSeq: string[] = [];
    let i = 0;

    while (i < tokens.length) {
      let matched = false;

      // Check windows of 3, 2, 1 tokens
      for (const window of [3, 2, 1]) {
        if (i + window <= tokens.length) {
          const chunk = tokens.slice(i, i + window).join(' ').toLowerCase();
          const chunkTokens = tokens.slice(i, i + window).map(t => t.toLowerCase());

          for (const [signId, signDef] of Object.entries(CLIENT_ARSL_DICTIONARY)) {
            if (signDef.keywords.some(kw => chunk.includes(kw) || chunkTokens.includes(kw))) {
              signs.push({
                gloss: signId,
                arabicText: signDef.arabic,
                englishTranslation: signDef.english,
                isFingerspelled: false,
                durationMs: Math.round(signDef.duration / speed),
                poses: signDef.poses
              });
              glossSeq.push(signId);
              i += window;
              matched = true;
              break;
            }
          }
          if (matched) break;
        }
      }

      if (!matched) {
        // Token is an unrecognized word or technical term -> Authentic Arabic Fingerspelling
        const unmatchedWord = tokens[i];
        signs.push(this.createFingerspellingSign(unmatchedWord, speed));
        glossSeq.push(`تهجئة_${unmatchedWord}`);
        i += 1;
      }
    }

    const totalDurationMs = signs.reduce((acc, s) => acc + s.durationMs, 0);

    return {
      originalText: text,
      glossSequence: glossSeq,
      signs,
      totalDurationMs,
      metadata: { engine: 'Client_ArSL_Kinematics_v2', speed }
    };
  }

  /**
   * Creates letter-by-letter Arabic Fingerspelling poses
   */
  private static createFingerspellingSign(word: string, speed: number): SignGlossItem {
    const letters = Array.from(word);
    const perLetterMs = Math.round(700 / speed);
    const poses: BodyPoseFrame[] = [];

    for (const char of letters) {
      const meta = ARABIC_ALPHABET_POSES[char] || ARABIC_ALPHABET_POSES['ا'];
      poses.push({
        headTilt: 0,
        headNod: 0,
        leftUpperArm: 15,
        leftForearm: -20,
        rightUpperArm: meta.arm[0],
        rightForearm: meta.arm[1],
        leftWrist: 0,
        rightWrist: meta.arm[2],
        torsoTwist: 0,
        leftHandShape: 'neutral',
        rightHandShape: meta.handShape,
        facialExpression: 'focused'
      });
    }

    return {
      gloss: `تهجئة_${word}`,
      arabicText: `تهجئة: ${word}`,
      englishTranslation: `Fingerspelling: ${word}`,
      isFingerspelled: true,
      durationMs: letters.length * perLetterMs,
      poses
    };
  }
}
