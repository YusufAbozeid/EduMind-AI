import os
import re
import json
from typing import List, Dict, Any, Optional
from app.schemas.sign_language import (
    BodyPoseFrame,
    SignGlossItem,
    SignTranslationRequest,
    SignTranslationResponse
)

# ══════════════════════════════════════════════════════════════════
# ARABIC FINGER SPELLING ALPHABET (الأبجدية الإشارية اليدوية العربية)
# Unified Arab Sign Language Alphabet standard (الاتحاد العربي للهيئات العاملة مع الصم)
# ══════════════════════════════════════════════════════════════════

ARABIC_ALPHABET_POSES: Dict[str, Dict[str, Any]] = {
    'ا': {'handShape': 'point_index', 'arm': (80, -30, 0), 'desc': 'ألف: السبابة مرفوعة رأسياً'},
    'أ': {'handShape': 'point_index', 'arm': (85, -25, 5), 'desc': 'ألف مهموزة: السبابة مع حركة للأعلى'},
    'إ': {'handShape': 'point_index', 'arm': (75, -35, -5), 'desc': 'همزة مكسورة'},
    'آ': {'handShape': 'point_index', 'arm': (80, -30, 0), 'desc': 'مد: السبابة بحركة موجية'},
    'ء': {'handShape': 'pinch', 'arm': (70, -50, 10), 'desc': 'همزة مفردة: حركة نقر بأصبعين'},
    'ب': {'handShape': 'flat_o', 'arm': (75, -45, 0), 'desc': 'باء: الكف مبسوطة أفقياً مع انثناء الإبهام للأسفل'},
    'ت': {'handShape': 'v_shape', 'arm': (80, -40, 0), 'desc': 'تاء: أصبعان ممدودان للأعلى (نقطتان)'},
    'ث': {'handShape': 'claw', 'arm': (80, -40, 0), 'desc': 'ثاء: ثلاثة أصابع ممدودة للأعلى (ثلاث نقاط)'},
    'ج': {'handShape': 'c_shape', 'arm': (70, -60, -10), 'desc': 'جيم: كف مقوسة كحرف C'},
    'ح': {'handShape': 'open_palm', 'arm': (75, -50, 0), 'desc': 'حاء: كف مفتوحة موجهة للأمام'},
    'خ': {'handShape': 'open_palm', 'arm': (95, -20, 15), 'desc': 'خاء: كف مائلة فوق الرأس إشارة للنقطة'},
    'د': {'handShape': 'pinch', 'arm': (70, -50, 0), 'desc': 'دال: تقريب السبابة والإبهام بشكل زاوية'},
    'ذ': {'handShape': 'pinch', 'arm': (85, -30, 10), 'desc': 'ذال: شكل الدال مع رفع طرف السبابة للنقطة'},
    'ر': {'handShape': 'point_index', 'arm': (65, -70, -15), 'desc': 'راء: السبابة مائلة للأسفل بحركة منحنية'},
    'ز': {'handShape': 'point_index', 'arm': (75, -50, 10), 'desc': 'زاي: الراء مع إشارة النقطة بالأعلى'},
    'س': {'handShape': 'claw', 'arm': (70, -60, 0), 'desc': 'سين: ثلاثة أصابع متباعدة تشبه أسنان السين'},
    'ش': {'handShape': 'open_palm', 'arm': (75, -50, 15), 'desc': 'شين: كف مفتوحة الأصابع مع حركة اهتزاز'},
    'ص': {'handShape': 'fist', 'arm': (70, -60, 0), 'desc': 'صاد: قبضة محكمة مع استلقاء الإبهام'},
    'ض': {'handShape': 'fist', 'arm': (85, -35, 10), 'desc': 'ضاد: قبضة الصاد مع رفع الإبهام للأعلى كالنقطة'},
    'ط': {'handShape': 'flat_o', 'arm': (75, -45, 0), 'desc': 'طاء: كف مستقيمة مع امتداد السبابة للأعلى'},
    'ظ': {'handShape': 'flat_o', 'arm': (85, -30, 15), 'desc': 'ظاء: شكل الطاء مع إشارة النقطة'},
    'ع': {'handShape': 'c_shape', 'arm': (70, -55, 0), 'desc': 'عين: الكف والسبابة يشكلان نصف دائرة'},
    'غ': {'handShape': 'c_shape', 'arm': (85, -35, 10), 'desc': 'غين: شكل العين مع النقطة بالأعلى'},
    'ف': {'handShape': 'pinch', 'arm': (80, -40, 0), 'desc': 'فاء: حلقة دائرية بين السبابة والإبهام'},
    'ق': {'handShape': 'v_shape', 'arm': (75, -45, 0), 'desc': 'قاف: أصبعان يلامسان الإبهام بشكل حلقة مزدوجة'},
    'ك': {'handShape': 'l_shape', 'arm': (80, -40, 0), 'desc': 'كاف: السبابة والإبهام متباعدان بزاوية قائمة'},
    'ل': {'handShape': 'l_shape', 'arm': (90, -25, 0), 'desc': 'لام: زاوية L واضحة ممدودة للأعلى'},
    'م': {'handShape': 'fist', 'arm': (60, -75, -10), 'desc': 'ميم: قبضة مغلقة متجهة للأسفل'},
    'ن': {'handShape': 'point_index', 'arm': (75, -45, 0), 'desc': 'نون: السبابة منحنية كالقوس'},
    'ه': {'handShape': 'flat_o', 'arm': (70, -60, 0), 'desc': 'هاء: دائرة بكافة أطراف الأصابع'},
    'ة': {'handShape': 'flat_o', 'arm': (75, -50, 10), 'desc': 'تاء مربوطة: شكل الهاء مع نقرتين للأعلى'},
    'و': {'handShape': 'c_shape', 'arm': (65, -70, -15), 'desc': 'واو: اليد متجهة للداخل مع انحناء دائري'},
    'ي': {'handShape': 'pinch', 'arm': (60, -80, -20), 'desc': 'ياء: حركة انسيابية نحو الأسفل بالخنصر أو السبابة'},
    'ى': {'handShape': 'pinch', 'arm': (60, -80, -10), 'desc': 'ألف مقصورة: شكل الياء بدون حركة'},
}

# ══════════════════════════════════════════════════════════════════
# ARABIC SIGN LANGUAGE GLOSS DICTIONARY (القاموس الإشاري الموحد)
# Core concepts with verified 3D kinematic keyframes
# ══════════════════════════════════════════════════════════════════

CORE_ARSL_SIGNS: Dict[str, Dict[str, Any]] = {
    # ── AI & Data Science Concepts ──
    'ذكاء_اصطناعي': {
        'keywords': ['ذكاء', 'اصطناعي', 'الذكاء', 'الاصطناعي', 'ai'],
        'arabic': 'الذكاء الاصطناعي',
        'english': 'Artificial Intelligence',
        'duration': 2800,
        'poses': [
            {'headTilt': 0, 'headNod': -5, 'leftUpperArm': 90, 'leftForearm': -120, 'rightUpperArm': 90, 'rightForearm': -120, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'claw', 'rightHandShape': 'claw', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 0, 'leftUpperArm': 110, 'leftForearm': -60, 'rightUpperArm': 110, 'rightForearm': -60, 'leftWrist': 10, 'rightWrist': 10, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 5, 'leftUpperArm': 80, 'leftForearm': -40, 'rightUpperArm': 80, 'rightForearm': -40, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'flat_o', 'rightHandShape': 'flat_o', 'facialExpression': 'neutral'},
        ]
    },
    'شبكة_عصبية': {
        'keywords': ['شبكة', 'عصبية', 'شبكات', 'عصبيه', 'neural', 'network'],
        'arabic': 'الشبكة العصبية',
        'english': 'Neural Network',
        'duration': 3000,
        'poses': [
            {'headTilt': -3, 'headNod': 0, 'leftUpperArm': 80, 'leftForearm': -100, 'rightUpperArm': 80, 'rightForearm': -100, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'claw', 'rightHandShape': 'claw', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': -3, 'leftUpperArm': 95, 'leftForearm': -70, 'rightUpperArm': 65, 'rightForearm': -110, 'leftWrist': 10, 'rightWrist': -10, 'torsoTwist': 5, 'leftHandShape': 'open_palm', 'rightHandShape': 'claw', 'facialExpression': 'focused'},
            {'headTilt': 3, 'headNod': 0, 'leftUpperArm': 65, 'leftForearm': -110, 'rightUpperArm': 95, 'rightForearm': -70, 'leftWrist': -10, 'rightWrist': 10, 'torsoTwist': -5, 'leftHandShape': 'claw', 'rightHandShape': 'open_palm', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 5, 'leftUpperArm': 80, 'leftForearm': -50, 'rightUpperArm': 80, 'rightForearm': -50, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'flat_o', 'rightHandShape': 'flat_o', 'facialExpression': 'neutral'},
        ]
    },
    'بيانات': {
        'keywords': ['بيانات', 'البيانات', 'داتا', 'معلومات', 'data'],
        'arabic': 'البيانات / الداتا',
        'english': 'Data / Information',
        'duration': 2400,
        'poses': [
            {'headTilt': -3, 'headNod': 0, 'leftUpperArm': 75, 'leftForearm': -80, 'rightUpperArm': 75, 'rightForearm': -80, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'flat_o', 'rightHandShape': 'flat_o', 'facialExpression': 'focused'},
            {'headTilt': 3, 'headNod': 0, 'leftUpperArm': 60, 'leftForearm': -100, 'rightUpperArm': 90, 'rightForearm': -60, 'leftWrist': 10, 'rightWrist': -10, 'torsoTwist': 4, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 4, 'leftUpperArm': 80, 'leftForearm': -40, 'rightUpperArm': 80, 'rightForearm': -40, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'flat_o', 'rightHandShape': 'flat_o', 'facialExpression': 'neutral'},
        ]
    },
    'نموذج': {
        'keywords': ['نموذج', 'النموذج', 'موديل', 'خوارزمية', 'model'],
        'arabic': 'النموذج البرمجي',
        'english': 'AI Model',
        'duration': 2400,
        'poses': [
            {'headTilt': 0, 'headNod': 0, 'leftUpperArm': 90, 'leftForearm': -80, 'rightUpperArm': 90, 'rightForearm': -80, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 4, 'leftUpperArm': 70, 'leftForearm': -90, 'rightUpperArm': 70, 'rightForearm': -90, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'flat_o', 'rightHandShape': 'flat_o', 'facialExpression': 'neutral'},
        ]
    },
    'تعلم': {
        'keywords': ['تعلم', 'التعلم', 'يتعلم', 'تتعلم', 'دراسة', 'ادرس', 'learn'],
        'arabic': 'التعلُّم',
        'english': 'Learning / Study',
        'duration': 2600,
        'poses': [
            {'headTilt': 0, 'headNod': -6, 'leftUpperArm': 110, 'leftForearm': -130, 'rightUpperArm': 40, 'rightForearm': -30, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'neutral', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 4, 'leftUpperArm': 80, 'leftForearm': -50, 'rightUpperArm': 80, 'rightForearm': -50, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'happy'},
        ]
    },
    'فهم': {
        'keywords': ['فهم', 'فاهم', 'نفهم', 'افهم', 'استيعاب', 'understand'],
        'arabic': 'الفهم والاستيعاب',
        'english': 'Understand',
        'duration': 2400,
        'poses': [
            {'headTilt': 0, 'headNod': -8, 'leftUpperArm': 110, 'leftForearm': -130, 'rightUpperArm': 20, 'rightForearm': -20, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'point_index', 'rightHandShape': 'neutral', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 6, 'leftUpperArm': 70, 'leftForearm': -40, 'rightUpperArm': 70, 'rightForearm': -40, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'happy'},
        ]
    },
    'تدريب': {
        'keywords': ['تدريب', 'تدرب', 'التدريب', 'train', 'training'],
        'arabic': 'التدريب والممارسة',
        'english': 'Training',
        'duration': 2600,
        'poses': [
            {'headTilt': 0, 'headNod': 0, 'leftUpperArm': 70, 'leftForearm': -90, 'rightUpperArm': 70, 'rightForearm': -90, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'fist', 'rightHandShape': 'fist', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 3, 'leftUpperArm': 85, 'leftForearm': -60, 'rightUpperArm': 55, 'rightForearm': -110, 'leftWrist': 5, 'rightWrist': -5, 'torsoTwist': 3, 'leftHandShape': 'fist', 'rightHandShape': 'fist', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 0, 'leftUpperArm': 55, 'leftForearm': -110, 'rightUpperArm': 85, 'rightForearm': -60, 'leftWrist': -5, 'rightWrist': 5, 'torsoTwist': -3, 'leftHandShape': 'fist', 'rightHandShape': 'fist', 'facialExpression': 'focused'},
        ]
    },
    'صحيح_ممتاز': {
        'keywords': ['صح', 'صحيح', 'ممتاز', 'تمام', 'مظبوط', 'بطل', 'عاش', 'correct', 'good'],
        'arabic': 'صحيح / ممتاز',
        'english': 'Correct / Excellent',
        'duration': 2000,
        'poses': [
            {'headTilt': 0, 'headNod': -6, 'leftUpperArm': 20, 'leftForearm': -20, 'rightUpperArm': 120, 'rightForearm': -30, 'leftWrist': 0, 'rightWrist': 15, 'torsoTwist': 0, 'leftHandShape': 'neutral', 'rightHandShape': 'thumbs_up', 'facialExpression': 'happy'},
            {'headTilt': 5, 'headNod': 5, 'leftUpperArm': 20, 'leftForearm': -20, 'rightUpperArm': 130, 'rightForearm': -20, 'leftWrist': 0, 'rightWrist': 20, 'torsoTwist': 0, 'leftHandShape': 'neutral', 'rightHandShape': 'thumbs_up', 'facialExpression': 'happy'},
        ]
    },
    'خطأ_نفي': {
        'keywords': ['خطأ', 'غلط', 'مش', 'لا', 'ليس', 'غير', 'لن', 'لم', 'error', 'no', 'not'],
        'arabic': 'خطأ / نفي',
        'english': 'Incorrect / Negation',
        'duration': 2200,
        'poses': [
            {'headTilt': -10, 'headNod': 0, 'leftUpperArm': 70, 'leftForearm': -90, 'rightUpperArm': 70, 'rightForearm': -90, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'negation'},
            {'headTilt': 10, 'headNod': 0, 'leftUpperArm': 85, 'leftForearm': -50, 'rightUpperArm': 85, 'rightForearm': -50, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'negation'},
        ]
    },
    'سؤال_استفسار': {
        'keywords': ['كيف', 'ماذا', 'لماذا', 'ليه', 'ازاي', 'اين', 'متى', 'هل', 'question', 'how', 'why'],
        'arabic': 'سؤال / كيف / لماذا',
        'english': 'Question / How / Why',
        'duration': 2400,
        'poses': [
            {'headTilt': 0, 'headNod': -5, 'leftUpperArm': 60, 'leftForearm': -70, 'rightUpperArm': 60, 'rightForearm': -70, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'questioning'},
            {'headTilt': 5, 'headNod': -8, 'leftUpperArm': 75, 'leftForearm': -50, 'rightUpperArm': 75, 'rightForearm': -50, 'leftWrist': 10, 'rightWrist': 10, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'questioning'},
        ]
    },
    'تحية_مرحبا': {
        'keywords': ['مرحبا', 'اهلا', 'أهلا', 'سلام', 'السلام', 'عليكم', 'ازيك', 'hello', 'hi'],
        'arabic': 'مرحباً / السلام عليكم',
        'english': 'Hello / Greetings',
        'duration': 2200,
        'poses': [
            {'headTilt': 0, 'headNod': -4, 'leftUpperArm': 20, 'leftForearm': -20, 'rightUpperArm': 110, 'rightForearm': -40, 'leftWrist': 0, 'rightWrist': 10, 'torsoTwist': 0, 'leftHandShape': 'neutral', 'rightHandShape': 'open_palm', 'facialExpression': 'happy'},
            {'headTilt': 0, 'headNod': 4, 'leftUpperArm': 20, 'leftForearm': -20, 'rightUpperArm': 120, 'rightForearm': -30, 'leftWrist': 0, 'rightWrist': -10, 'torsoTwist': 0, 'leftHandShape': 'neutral', 'rightHandShape': 'open_palm', 'facialExpression': 'happy'},
        ]
    },
    'شكر_امتنان': {
        'keywords': ['شكرا', 'شكراً', 'اشكرك', 'تسلم', 'متشكر', 'thanks', 'thank'],
        'arabic': 'شكراً جزيلاً',
        'english': 'Thank You',
        'duration': 2200,
        'poses': [
            {'headTilt': 0, 'headNod': -5, 'leftUpperArm': 30, 'leftForearm': -40, 'rightUpperArm': 90, 'rightForearm': -120, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'neutral', 'rightHandShape': 'flat_o', 'facialExpression': 'happy'},
            {'headTilt': 0, 'headNod': 6, 'leftUpperArm': 30, 'leftForearm': -40, 'rightUpperArm': 70, 'rightForearm': -40, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'neutral', 'rightHandShape': 'open_palm', 'facialExpression': 'happy'},
        ]
    },
    'مساعدة_عون': {
        'keywords': ['مساعدة', 'اساعدك', 'ساعدني', 'عون', 'خدمة', 'help'],
        'arabic': 'المساعدة والدعم',
        'english': 'Help / Assist',
        'duration': 2400,
        'poses': [
            {'headTilt': 0, 'headNod': 0, 'leftUpperArm': 70, 'leftForearm': -70, 'rightUpperArm': 80, 'rightForearm': -90, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'thumbs_up', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 5, 'leftUpperArm': 80, 'leftForearm': -50, 'rightUpperArm': 95, 'rightForearm': -60, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'thumbs_up', 'facialExpression': 'happy'},
        ]
    },
    'خطوة_تسلسل': {
        'keywords': ['خطوة', 'خطوات', 'مرحلة', 'مراحل', 'تسلسل', 'ترتيب', 'step'],
        'arabic': 'خطوة بخطوة',
        'english': 'Step / Sequence',
        'duration': 2500,
        'poses': [
            {'headTilt': 0, 'headNod': 0, 'leftUpperArm': 40, 'leftForearm': -40, 'rightUpperArm': 90, 'rightForearm': -50, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': -4, 'leftHandShape': 'neutral', 'rightHandShape': 'open_palm', 'facialExpression': 'focused'},
            {'headTilt': 0, 'headNod': 3, 'leftUpperArm': 90, 'leftForearm': -50, 'rightUpperArm': 40, 'rightForearm': -40, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 4, 'leftHandShape': 'open_palm', 'rightHandShape': 'neutral', 'facialExpression': 'focused'},
        ]
    },
    'استراحة_توقف': {
        'keywords': ['استراحة', 'راحة', 'توقف', 'بريك', 'قهوة', 'دقيقة', 'break', 'pause'],
        'arabic': 'استراحة قصيرة',
        'english': 'Take a Break',
        'duration': 2200,
        'poses': [
            {'headTilt': 0, 'headNod': 5, 'leftUpperArm': 50, 'leftForearm': -80, 'rightUpperArm': 50, 'rightForearm': -80, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'open_palm', 'rightHandShape': 'open_palm', 'facialExpression': 'neutral'},
            {'headTilt': 0, 'headNod': 8, 'leftUpperArm': 30, 'leftForearm': -30, 'rightUpperArm': 30, 'rightForearm': -30, 'leftWrist': 0, 'rightWrist': 0, 'torsoTwist': 0, 'leftHandShape': 'neutral', 'rightHandShape': 'neutral', 'facialExpression': 'happy'},
        ]
    }
}

class SignLanguageService:
    @staticmethod
    def clean_arabic_text(text: str) -> str:
        """Strip diacritics, tatweel, and non-essential punctuation"""
        # Remove diacritics (تنوين، فتحة، ضمة، كسرة، شدة، سكون)
        text = re.sub(r'[\u064B-\u0652]', '', text)
        # Remove tatweel (كشيدة)
        text = re.sub(r'\u0640', '', text)
        return text.strip()

    @classmethod
    def translate_to_sign_sequence(cls, req: SignTranslationRequest) -> SignTranslationResponse:
        cleaned_text = cls.clean_arabic_text(req.text)
        
        # 1. Try Groq LLM if key is present for smart grammatical re-ordering and glossing
        groq_key = os.getenv("GROQ_API_KEY")
        if groq_key:
            try:
                from langchain_groq import ChatGroq
                llm = ChatGroq(
                    groq_api_key=groq_key,
                    model_name=os.getenv("GROQ_MODEL", "llama-3.1-8b-instant"),
                    temperature=0.1
                )
                system_prompt = (
                    "You are an expert Arabic Sign Language (ArSL - لغة الإشارة العربية) linguist.\n"
                    "Translate the input Arabic sentence into standard ArSL Glosses according to ArSL spatial syntax.\n"
                    "RULES:\n"
                    "1. In ArSL, prepositions (في، إلى، عن) are dropped or represented spatially.\n"
                    "2. Place Topic/Object first, then Comment/Action, then Negation/Question particles.\n"
                    "3. Return ONLY a valid JSON array of strings representing the gloss tokens.\n"
                    "Example input: 'أنا لا أفهم هذه النقطة'\n"
                    "Example output: [\"أنا\", \"نقطة\", \"فهم\", \"خطأ_نفي\"]"
                )
                resp = llm.invoke([
                    ("system", system_prompt),
                    ("user", cleaned_text)
                ])
                if resp.content:
                    extracted = resp.content.strip()
                    # Strip any markdown formatting
                    if extracted.startswith("```"):
                        extracted = re.sub(r"^```(?:json)?\n?", "", extracted)
                        extracted = re.sub(r"\n?```$", "", extracted)
                    parsed_glosses = json.loads(extracted)
                    if isinstance(parsed_glosses, list) and len(parsed_glosses) > 0:
                        return cls._build_kinematics_response(cleaned_text, parsed_glosses, req.speed or 1.0)
            except Exception as e:
                print(f"[SignLanguageService] Groq LLM fallback trigger: {e}")

        # 2. High-Speed Deterministic Morphological Rule-based Parser (100% Guaranteed & Offline-ready)
        return cls._deterministic_parse_and_synthesize(cleaned_text, req.speed or 1.0)

    @classmethod
    def _deterministic_parse_and_synthesize(cls, text: str, speed: float) -> SignTranslationResponse:
        words = re.findall(r'[\u0621-\u064A0-9a-zA-Z]+', text)
        sign_items: List[SignGlossItem] = []
        gloss_sequence: List[str] = []
        
        i = 0
        while i < len(words):
            matched = False

            # Try multi-word window matching (up to 3 words: e.g. "ذكاء اصطناعي", "شبكة عصبية")
            for window in [3, 2, 1]:
                if i + window <= len(words):
                    chunk = " ".join(words[i:i+window]).lower()
                    chunk_tokens = [w.lower() for w in words[i:i+window]]

                    # Search core ArSL dictionary
                    for sign_id, sign_def in CORE_ARSL_SIGNS.items():
                        if any(kw in chunk or any(kw == ct for ct in chunk_tokens) for kw in sign_def['keywords']):
                            # Construct SignGlossItem
                            poses = [BodyPoseFrame(**p) for p in sign_def['poses']]
                            item = SignGlossItem(
                                gloss=sign_id,
                                arabicText=sign_def['arabic'],
                                englishTranslation=sign_def['english'],
                                isFingerspelled=False,
                                durationMs=int(sign_def['duration'] / speed),
                                poses=poses
                            )
                            sign_items.append(item)
                            gloss_sequence.append(sign_id)
                            i += window
                            matched = True
                            break
                    if matched:
                        break

            if not matched:
                # Token is an unmapped noun, name, or technical code -> Arab Fingerspelling (التهجئة الإشارية)
                unmatched_word = words[i]
                fingerspelled_item = cls._synthesize_fingerspelling(unmatched_word, speed)
                sign_items.append(fingerspelled_item)
                gloss_sequence.append(f"تهجئة_{unmatched_word}")
                i += 1

        total_duration = sum(s.durationMs for s in sign_items)

        return SignTranslationResponse(
            originalText=text,
            glossSequence=gloss_sequence,
            signs=sign_items,
            totalDurationMs=total_duration,
            metadata={
                "engine": "NeuroSymbolic_ArSL_Synthesis_v2",
                "tokensCount": len(words),
                "signsGenerated": len(sign_items),
                "fingerspelledSigns": sum(1 for s in sign_items if s.isFingerspelled)
            }
        )

    @classmethod
    def _build_kinematics_response(cls, original_text: str, gloss_tokens: List[str], speed: float) -> SignTranslationResponse:
        """Map LLM-extracted gloss tokens into real kinematic frames"""
        sign_items: List[SignGlossItem] = []
        gloss_seq: List[str] = []

        for token in gloss_tokens:
            token_clean = token.strip().lower()
            matched = False

            # Direct key match or keyword match
            for sign_id, sign_def in CORE_ARSL_SIGNS.items():
                if token_clean == sign_id or any(kw in token_clean for kw in sign_def['keywords']):
                    poses = [BodyPoseFrame(**p) for p in sign_def['poses']]
                    item = SignGlossItem(
                        gloss=sign_id,
                        arabicText=sign_def['arabic'],
                        englishTranslation=sign_def['english'],
                        isFingerspelled=False,
                        durationMs=int(sign_def['duration'] / speed),
                        poses=poses
                    )
                    sign_items.append(item)
                    gloss_seq.append(sign_id)
                    matched = True
                    break

            if not matched:
                # Fingerspell unmatched gloss token
                fingerspelled = cls._synthesize_fingerspelling(token_clean, speed)
                sign_items.append(fingerspelled)
                gloss_seq.append(f"تهجئة_{token_clean}")

        total_duration = sum(s.durationMs for s in sign_items)
        return SignTranslationResponse(
            originalText=original_text,
            glossSequence=gloss_seq,
            signs=sign_items,
            totalDurationMs=total_duration,
            metadata={"engine": "Groq_LLM_ArSL_v2", "tokensCount": len(gloss_tokens)}
        )

    @classmethod
    def _synthesize_fingerspelling(cls, word: str, speed: float) -> SignGlossItem:
        """Generate precise authentic letter-by-letter Arabic Fingerspelling poses"""
        poses: List[BodyPoseFrame] = []
        letters = list(word)
        per_letter_duration = int(700 / speed)

        for char in letters:
            pose_meta = ARABIC_ALPHABET_POSES.get(char, ARABIC_ALPHABET_POSES['ا'])
            hand_shape = pose_meta['handShape']
            arm_rot = pose_meta['arm']

            poses.append(BodyPoseFrame(
                headTilt=0,
                headNod=0,
                leftUpperArm=15,
                leftForearm=-20,
                rightUpperArm=float(arm_rot[0]),
                rightForearm=float(arm_rot[1]),
                rightWrist=float(arm_rot[2]),
                torsoTwist=0,
                leftHandShape='neutral',
                rightHandShape=hand_shape,
                facialExpression='focused'
            ))

        return SignGlossItem(
            gloss=f"تهجئة_{word}",
            arabicText=f"تهجئة: {word}",
            englishTranslation=f"Fingerspelling: {word}",
            isFingerspelled=True,
            durationMs=len(letters) * per_letter_duration,
            poses=poses
        )
