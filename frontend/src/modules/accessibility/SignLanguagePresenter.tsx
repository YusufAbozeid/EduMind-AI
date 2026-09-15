import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { X, Play, Pause, RotateCcw, SkipForward, SkipBack, Hand } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */

interface BodyPose {
  headTilt: number;       // Z-axis rotation (-15..15)
  headNod: number;        // X-axis rotation (-10..10)
  
  leftUpperArm: number;   // Z-axis (0=down, 90=horizontal, 140=up)
  leftForearm: number;    // X-axis (0=straight, -140=fully bent)
  rightUpperArm: number;
  rightForearm: number;

  leftWrist: number;      // Z rotation for hand orientation
  rightWrist: number;
  
  torsoTwist: number;     // Y-axis rotation (-10..10)
}

interface SignPhrase {
  keywords: string[];           // Words that trigger this phrase
  meaningAr: string;            // Arabic meaning label
  meaningEn: string;            // English meaning label
  poses: BodyPose[];            // Sequence of poses (animated in order)
  durationMs: number;           // Total duration for this phrase
}

/* ═══════════════════════════════════════════════════════════════
   NEUTRAL / REST POSE
   ═══════════════════════════════════════════════════════════════ */

const NEUTRAL: BodyPose = {
  headTilt: 0, headNod: 0,
  leftUpperArm: 10, leftForearm: -15,
  rightUpperArm: 10, rightForearm: -15,
  leftWrist: 0, rightWrist: 0,
  torsoTwist: 0,
};

/* ═══════════════════════════════════════════════════════════════
   PHRASE-BASED SIGN DICTIONARY
   Each entry represents a CONCEPT, not a word.
   The poses array creates a flowing multi-step gesture.
   ═══════════════════════════════════════════════════════════════ */

const PHRASE_SIGNS: SignPhrase[] = [
  // ── AI & Intelligence concepts ──
  {
    keywords: ['الذكاء', 'الاصطناعي', 'ذكاء', 'اصطناعي'],
    meaningAr: 'الذكاء الاصطناعي',
    meaningEn: 'Artificial Intelligence',
    durationMs: 3000,
    poses: [
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -120, rightUpperArm: 90, rightForearm: -120, headNod: -5 },
      { ...NEUTRAL, leftUpperArm: 120, leftForearm: -60, rightUpperArm: 120, rightForearm: -60, headTilt: 0 },
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -40, rightUpperArm: 80, rightForearm: -40 },
    ],
  },
  {
    keywords: ['شبكة', 'شبكات', 'عصبية', 'الشبكة', 'العصبية'],
    meaningAr: 'الشبكات العصبية',
    meaningEn: 'Neural Networks',
    durationMs: 3200,
    poses: [
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -100, rightUpperArm: 80, rightForearm: -100 },
      { ...NEUTRAL, leftUpperArm: 100, leftForearm: -90, rightUpperArm: 60, rightForearm: -110, headTilt: -5 },
      { ...NEUTRAL, leftUpperArm: 60, leftForearm: -110, rightUpperArm: 100, rightForearm: -90, headTilt: 5 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -80, rightUpperArm: 90, rightForearm: -80, headNod: -3 },
    ],
  },
  // ── Opportunity / Availability ──
  {
    keywords: ['يوفر', 'يقدم', 'يتيح', 'يمنح', 'توفر'],
    meaningAr: 'يُوفِّر / يُقدِّم',
    meaningEn: 'Provides / Offers',
    durationMs: 2400,
    poses: [
      { ...NEUTRAL, leftUpperArm: 60, leftForearm: -90, rightUpperArm: 60, rightForearm: -90 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -30, rightUpperArm: 90, rightForearm: -30, torsoTwist: 3 },
    ],
  },
  {
    keywords: ['كثير', 'الكثير', 'عديد', 'العديد', 'متعدد'],
    meaningAr: 'الكثير / العديد',
    meaningEn: 'Many / Numerous',
    durationMs: 2200,
    poses: [
      { ...NEUTRAL, leftUpperArm: 100, leftForearm: -20, rightUpperArm: 100, rightForearm: -20 },
      { ...NEUTRAL, leftUpperArm: 130, leftForearm: -10, rightUpperArm: 130, rightForearm: -10, headNod: -5 },
    ],
  },
  {
    keywords: ['فرص', 'الفرص', 'فرصة', 'إمكانيات', 'امكانيات'],
    meaningAr: 'الفرص / الإمكانيات',
    meaningEn: 'Opportunities',
    durationMs: 2800,
    poses: [
      { ...NEUTRAL, leftUpperArm: 70, leftForearm: -80, rightUpperArm: 70, rightForearm: -80 },
      { ...NEUTRAL, leftUpperArm: 130, leftForearm: -20, rightUpperArm: 130, rightForearm: -20, headNod: -8 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -40, rightUpperArm: 90, rightForearm: -40 },
    ],
  },
  // ── Learning concepts ──
  {
    keywords: ['تعلم', 'التعلم', 'يتعلم', 'تتعلم', 'بتتعلم'],
    meaningAr: 'التعلُّم',
    meaningEn: 'Learning',
    durationMs: 2600,
    poses: [
      { ...NEUTRAL, leftUpperArm: 120, leftForearm: -130, headNod: -5 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -50, rightUpperArm: 70, rightForearm: -60, headNod: 3 },
    ],
  },
  {
    keywords: ['تدريب', 'تدرب', 'تتدرب', 'بتتدرب', 'التدريب'],
    meaningAr: 'التدريب',
    meaningEn: 'Training',
    durationMs: 2800,
    poses: [
      { ...NEUTRAL, leftUpperArm: 70, leftForearm: -100, rightUpperArm: 70, rightForearm: -100 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -60, rightUpperArm: 50, rightForearm: -120 },
      { ...NEUTRAL, leftUpperArm: 50, leftForearm: -120, rightUpperArm: 90, rightForearm: -60 },
    ],
  },
  // ── Data ──
  {
    keywords: ['بيانات', 'البيانات', 'داتا', 'معلومات', 'المعلومات'],
    meaningAr: 'البيانات / المعلومات',
    meaningEn: 'Data / Information',
    durationMs: 2400,
    poses: [
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -90, rightUpperArm: 80, rightForearm: -90, headTilt: -3 },
      { ...NEUTRAL, leftUpperArm: 60, leftForearm: -100, rightUpperArm: 100, rightForearm: -80, torsoTwist: 5 },
    ],
  },
  // ── Model / Weights ──
  {
    keywords: ['نموذج', 'النموذج', 'موديل'],
    meaningAr: 'النموذج',
    meaningEn: 'Model',
    durationMs: 2400,
    poses: [
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -80, rightUpperArm: 90, rightForearm: -80 },
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -90, rightUpperArm: 80, rightForearm: -90, headNod: 3 },
    ],
  },
  {
    keywords: ['أوزان', 'الأوزان', 'وزن', 'أوزن'],
    meaningAr: 'الأوزان والمعاملات',
    meaningEn: 'Weights & Parameters',
    durationMs: 2600,
    poses: [
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -40, rightUpperArm: 80, rightForearm: -40 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -30, rightUpperArm: 70, rightForearm: -50, headTilt: 8 },
      { ...NEUTRAL, leftUpperArm: 70, leftForearm: -50, rightUpperArm: 90, rightForearm: -30, headTilt: -8 },
    ],
  },
  // ── Error / Correct ──
  {
    keywords: ['خطأ', 'خطا', 'أخطاء', 'غلط', 'مش', 'مضبوطة', 'مظبوطة'],
    meaningAr: 'خطأ / غير صحيح',
    meaningEn: 'Error / Incorrect',
    durationMs: 2200,
    poses: [
      { ...NEUTRAL, leftUpperArm: 70, leftForearm: -100, rightUpperArm: 70, rightForearm: -100, headTilt: -10 },
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -60, rightUpperArm: 80, rightForearm: -60, headTilt: 10 },
    ],
  },
  {
    keywords: ['صحيح', 'تمام', 'مظبوط', 'صح', 'ممتاز', 'بطل', 'عاش', 'أحسنت'],
    meaningAr: 'صحيح / ممتاز!',
    meaningEn: 'Correct / Excellent!',
    durationMs: 2000,
    poses: [
      { ...NEUTRAL, rightUpperArm: 130, rightForearm: -20, rightWrist: 10, headNod: -8 },
      { ...NEUTRAL, rightUpperArm: 140, rightForearm: -10, rightWrist: 15, headNod: -5, headTilt: 5 },
    ],
  },
  // ── Forward / Backward pass ──
  {
    keywords: ['تمرير', 'التمرير', 'الخلفي', 'الأمامي', 'بنرجع', 'بالراجع'],
    meaningAr: 'التمرير (الأمامي/الخلفي)',
    meaningEn: 'Forward / Backward Pass',
    durationMs: 3000,
    poses: [
      { ...NEUTRAL, leftUpperArm: 50, leftForearm: -30, rightUpperArm: 90, rightForearm: -40, torsoTwist: -5 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -40, rightUpperArm: 50, rightForearm: -30, torsoTwist: 5 },
      { ...NEUTRAL, leftUpperArm: 70, leftForearm: -60, rightUpperArm: 70, rightForearm: -60 },
    ],
  },
  // ── Explanation / Understanding ──
  {
    keywords: ['تخيل', 'فهم', 'نفهم', 'بص', 'افهم', 'اسمع', 'يعني'],
    meaningAr: 'تخيَّل / افهم',
    meaningEn: 'Imagine / Understand',
    durationMs: 2600,
    poses: [
      { ...NEUTRAL, leftUpperArm: 100, leftForearm: -130, headNod: -8 },
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -50, rightUpperArm: 80, rightForearm: -50, headNod: 3 },
    ],
  },
  // ── Fixing / Adjusting ──
  {
    keywords: ['نعدل', 'تعدل', 'بنعدل', 'ضبط', 'تظبط', 'بتظبط', 'تصحيح', 'تصلح'],
    meaningAr: 'ضبط / تعديل',
    meaningEn: 'Adjust / Fix',
    durationMs: 2600,
    poses: [
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -100, rightUpperArm: 60, rightForearm: -80 },
      { ...NEUTRAL, leftUpperArm: 60, leftForearm: -80, rightUpperArm: 80, rightForearm: -100, torsoTwist: 3 },
      { ...NEUTRAL, leftUpperArm: 70, leftForearm: -60, rightUpperArm: 70, rightForearm: -60 },
    ],
  },
  // ── Steps / Sequence ──
  {
    keywords: ['خطوة', 'خطوات', 'بخطوة', 'تتابع', 'الإشارات', 'بتمشي'],
    meaningAr: 'خطوة بخطوة',
    meaningEn: 'Step by Step',
    durationMs: 2800,
    poses: [
      { ...NEUTRAL, rightUpperArm: 90, rightForearm: -50, torsoTwist: -5 },
      { ...NEUTRAL, rightUpperArm: 90, rightForearm: -50, leftUpperArm: 90, leftForearm: -50, torsoTwist: 5 },
      { ...NEUTRAL, leftUpperArm: 90, leftForearm: -50, torsoTwist: 0 },
    ],
  },
  // ── Rest / Break ──
  {
    keywords: ['استراحة', 'راحة', 'استريح', 'نفس', 'بريك'],
    meaningAr: 'استراحة',
    meaningEn: 'Take a Break',
    durationMs: 2400,
    poses: [
      { ...NEUTRAL, leftUpperArm: 50, leftForearm: -90, rightUpperArm: 50, rightForearm: -90, headNod: 5 },
      { ...NEUTRAL, leftUpperArm: 30, leftForearm: -40, rightUpperArm: 30, rightForearm: -40, headNod: 8 },
    ],
  },
  // ── Layer / Level ──
  {
    keywords: ['طبقة', 'طبقات', 'مستوى'],
    meaningAr: 'طبقة / مستوى',
    meaningEn: 'Layer / Level',
    durationMs: 2200,
    poses: [
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -40, rightUpperArm: 80, rightForearm: -40, headTilt: 0 },
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -40, rightUpperArm: 80, rightForearm: -40, headTilt: 0, torsoTwist: -3 },
    ],
  },
  // ── Input / Output ──
  {
    keywords: ['مدخلات', 'الإدخال', 'إدخال'],
    meaningAr: 'المدخلات',
    meaningEn: 'Inputs',
    durationMs: 2200,
    poses: [
      { ...NEUTRAL, leftUpperArm: 60, leftForearm: -40, rightUpperArm: 60, rightForearm: -40, torsoTwist: 5 },
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -70, rightUpperArm: 80, rightForearm: -70, torsoTwist: 0 },
    ],
  },
  {
    keywords: ['مخرجات', 'الإخراج', 'إخراج', 'النتيجة', 'نتيجة'],
    meaningAr: 'المخرجات / النتيجة',
    meaningEn: 'Outputs / Result',
    durationMs: 2200,
    poses: [
      { ...NEUTRAL, leftUpperArm: 80, leftForearm: -70, rightUpperArm: 80, rightForearm: -70 },
      { ...NEUTRAL, leftUpperArm: 110, leftForearm: -20, rightUpperArm: 110, rightForearm: -20, headNod: -3 },
    ],
  },
];

// Fallback generic signing for unmatched text segments
const GENERIC_SIGN: SignPhrase = {
  keywords: [],
  meaningAr: 'عبارة عامة',
  meaningEn: 'General phrase',
  durationMs: 2400,
  poses: [
    { ...NEUTRAL, leftUpperArm: 70, leftForearm: -60, rightUpperArm: 50, rightForearm: -80, headTilt: -3 },
    { ...NEUTRAL, leftUpperArm: 50, leftForearm: -80, rightUpperArm: 70, rightForearm: -60, headTilt: 3 },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   PHRASE PARSER — groups text by meaning, not word-by-word
   ═══════════════════════════════════════════════════════════════ */

interface ParsedSegment {
  text: string;
  sign: SignPhrase;
}

function parseTextToPhrases(text: string): ParsedSegment[] {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const segments: ParsedSegment[] = [];
  let i = 0;

  while (i < words.length) {
    let matched = false;

    // Try to match longest phrase first (up to 4 words)
    for (let len = Math.min(4, words.length - i); len >= 1; len--) {
      const chunk = words.slice(i, i + len);
      const cleanChunk = chunk.map(w => w.replace(/[.,!?؛،:؟()"']/g, ''));

      const sign = PHRASE_SIGNS.find(s =>
        cleanChunk.some(cw => s.keywords.includes(cw))
      );

      if (sign) {
        // Absorb adjacent related words too
        let end = i + len;
        while (end < words.length && end < i + len + 2) {
          const nextClean = words[end].replace(/[.,!?؛،:؟()"']/g, '');
          if (sign.keywords.includes(nextClean)) {
            end++;
          } else {
            break;
          }
        }
        segments.push({ text: words.slice(i, end).join(' '), sign });
        i = end;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Group 2-3 unmatched words together as one generic phrase
      const groupSize = Math.min(3, words.length - i);
      const chunk = words.slice(i, i + groupSize).join(' ');
      // Generate varied generic pose based on text hash
      let h = 0;
      for (let c = 0; c < chunk.length; c++) h = (h * 31 + chunk.charCodeAt(c)) & 0x7fff;
      const varied: SignPhrase = {
        ...GENERIC_SIGN,
        meaningAr: chunk,
        meaningEn: chunk,
        poses: [
          { ...NEUTRAL, leftUpperArm: 50 + (h % 40), leftForearm: -(40 + (h % 50)), rightUpperArm: 40 + ((h >> 3) % 50), rightForearm: -(30 + ((h >> 5) % 60)), headTilt: (h % 10) - 5 },
          { ...NEUTRAL, leftUpperArm: 40 + ((h >> 2) % 50), leftForearm: -(30 + ((h >> 4) % 60)), rightUpperArm: 50 + ((h >> 1) % 40), rightForearm: -(40 + ((h >> 6) % 50)), headTilt: -(h % 8 - 4) },
        ],
      };
      segments.push({ text: chunk, sign: varied });
      i += groupSize;
    }
  }

  return segments;
}

/* ═══════════════════════════════════════════════════════════════
   THREE.JS HUMANOID BUILDER
   ═══════════════════════════════════════════════════════════════ */

function lerpPose(a: BodyPose, b: BodyPose, t: number): BodyPose {
  const l = (x: number, y: number) => x + (y - x) * t;
  return {
    headTilt: l(a.headTilt, b.headTilt),
    headNod: l(a.headNod, b.headNod),
    leftUpperArm: l(a.leftUpperArm, b.leftUpperArm),
    leftForearm: l(a.leftForearm, b.leftForearm),
    rightUpperArm: l(a.rightUpperArm, b.rightUpperArm),
    rightForearm: l(a.rightForearm, b.rightForearm),
    leftWrist: l(a.leftWrist, b.leftWrist),
    rightWrist: l(a.rightWrist, b.rightWrist),
    torsoTwist: l(a.torsoTwist, b.torsoTwist),
  };
}

const DEG = Math.PI / 180;

interface HumanoidParts {
  head: THREE.Group;
  torso: THREE.Mesh;
  leftUpperArm: THREE.Group;
  leftForearm: THREE.Group;
  leftHand: THREE.Mesh;
  rightUpperArm: THREE.Group;
  rightForearm: THREE.Group;
  rightHand: THREE.Mesh;
}

function createHumanoid(scene: THREE.Scene): HumanoidParts {
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe8c9a0, roughness: 0.6, metalness: 0.05 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f, roughness: 0.7, metalness: 0.1 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x2d1f14, roughness: 0.9, metalness: 0 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3 });
  const lipMat = new THREE.MeshStandardMaterial({ color: 0xc4826e, roughness: 0.5 });

  const root = new THREE.Group();
  scene.add(root);

  // ── Torso ──
  const torsoGeo = new THREE.CapsuleGeometry(0.38, 0.7, 8, 16);
  const torso = new THREE.Mesh(torsoGeo, shirtMat);
  torso.position.set(0, 0.3, 0);
  torso.castShadow = true;
  root.add(torso);

  // ── Neck ──
  const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.18, 12);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 0.85, 0);
  root.add(neck);

  // ── Head Group ──
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.1, 0);
  root.add(headGroup);

  const headGeo = new THREE.SphereGeometry(0.28, 24, 24);
  const headMesh = new THREE.Mesh(headGeo, skinMat);
  headMesh.scale.set(1, 1.15, 0.95);
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Hair
  const hairGeo = new THREE.SphereGeometry(0.29, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.02, 0);
  hair.scale.set(1, 1.15, 0.98);
  headGroup.add(hair);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.04, 12, 12);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.1, 0.02, 0.24);
  headGroup.add(leftEye);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.1, 0.02, 0.24);
  headGroup.add(rightEye);

  // Eye whites
  const eyeWhiteGeo = new THREE.SphereGeometry(0.055, 12, 12);
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const leftEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  leftEyeWhite.position.set(-0.1, 0.02, 0.22);
  headGroup.add(leftEyeWhite);
  const rightEyeWhite = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
  rightEyeWhite.position.set(0.1, 0.02, 0.22);
  headGroup.add(rightEyeWhite);

  // Nose
  const noseGeo = new THREE.SphereGeometry(0.035, 8, 8);
  const nose = new THREE.Mesh(noseGeo, skinMat);
  nose.position.set(0, -0.04, 0.26);
  nose.scale.set(0.7, 1, 0.6);
  headGroup.add(nose);

  // Mouth
  const mouthGeo = new THREE.TorusGeometry(0.05, 0.015, 8, 16, Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, lipMat);
  mouth.position.set(0, -0.12, 0.22);
  mouth.rotation.set(0, 0, Math.PI);
  headGroup.add(mouth);

  // ── LEFT ARM (viewer's right) ──
  const leftUpperArmGroup = new THREE.Group();
  leftUpperArmGroup.position.set(-0.48, 0.6, 0);
  root.add(leftUpperArmGroup);

  // Shoulder sphere
  const shoulderGeo = new THREE.SphereGeometry(0.1, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, shirtMat);
  leftUpperArmGroup.add(leftShoulder);

  const upperArmGeo = new THREE.CapsuleGeometry(0.07, 0.35, 6, 12);
  const leftUpperArmMesh = new THREE.Mesh(upperArmGeo, shirtMat);
  leftUpperArmMesh.position.set(0, -0.25, 0);
  leftUpperArmMesh.castShadow = true;
  leftUpperArmGroup.add(leftUpperArmMesh);

  // Left Forearm Group (attached at elbow)
  const leftForearmGroup = new THREE.Group();
  leftForearmGroup.position.set(0, -0.48, 0);
  leftUpperArmGroup.add(leftForearmGroup);

  // Elbow joint
  const elbowGeo = new THREE.SphereGeometry(0.065, 10, 10);
  const leftElbow = new THREE.Mesh(elbowGeo, skinMat);
  leftForearmGroup.add(leftElbow);

  const forearmGeo = new THREE.CapsuleGeometry(0.055, 0.32, 6, 12);
  const leftForearmMesh = new THREE.Mesh(forearmGeo, skinMat);
  leftForearmMesh.position.set(0, -0.22, 0);
  leftForearmMesh.castShadow = true;
  leftForearmGroup.add(leftForearmMesh);

  // Left Hand
  const handGeo = new THREE.SphereGeometry(0.07, 10, 10);
  const leftHand = new THREE.Mesh(handGeo, skinMat);
  leftHand.scale.set(0.9, 1.2, 0.6);
  leftHand.position.set(0, -0.42, 0);
  leftHand.castShadow = true;
  leftForearmGroup.add(leftHand);

  // Fingers for left hand
  const fingerGeo = new THREE.CapsuleGeometry(0.015, 0.06, 4, 8);
  for (let f = 0; f < 4; f++) {
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(-0.04 + f * 0.025, -0.5, 0);
    leftForearmGroup.add(finger);
  }
  // Thumb
  const thumbGeo = new THREE.CapsuleGeometry(0.018, 0.05, 4, 8);
  const leftThumb = new THREE.Mesh(thumbGeo, skinMat);
  leftThumb.position.set(-0.06, -0.44, 0.02);
  leftThumb.rotation.z = 0.5;
  leftForearmGroup.add(leftThumb);

  // ── RIGHT ARM (viewer's left) ──
  const rightUpperArmGroup = new THREE.Group();
  rightUpperArmGroup.position.set(0.48, 0.6, 0);
  root.add(rightUpperArmGroup);

  const rightShoulder = new THREE.Mesh(shoulderGeo, shirtMat);
  rightUpperArmGroup.add(rightShoulder);

  const rightUpperArmMesh = new THREE.Mesh(upperArmGeo, shirtMat);
  rightUpperArmMesh.position.set(0, -0.25, 0);
  rightUpperArmMesh.castShadow = true;
  rightUpperArmGroup.add(rightUpperArmMesh);

  const rightForearmGroup = new THREE.Group();
  rightForearmGroup.position.set(0, -0.48, 0);
  rightUpperArmGroup.add(rightForearmGroup);

  const rightElbow = new THREE.Mesh(elbowGeo, skinMat);
  rightForearmGroup.add(rightElbow);

  const rightForearmMesh = new THREE.Mesh(forearmGeo, skinMat);
  rightForearmMesh.position.set(0, -0.22, 0);
  rightForearmMesh.castShadow = true;
  rightForearmGroup.add(rightForearmMesh);

  const rightHand = new THREE.Mesh(handGeo, skinMat);
  rightHand.scale.set(0.9, 1.2, 0.6);
  rightHand.position.set(0, -0.42, 0);
  rightHand.castShadow = true;
  rightForearmGroup.add(rightHand);

  for (let f = 0; f < 4; f++) {
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(-0.04 + f * 0.025, -0.5, 0);
    rightForearmGroup.add(finger);
  }
  const rightThumb = new THREE.Mesh(thumbGeo, skinMat);
  rightThumb.position.set(0.06, -0.44, 0.02);
  rightThumb.rotation.z = -0.5;
  rightForearmGroup.add(rightThumb);

  return {
    head: headGroup,
    torso,
    leftUpperArm: leftUpperArmGroup,
    leftForearm: leftForearmGroup,
    leftHand,
    rightUpperArm: rightUpperArmGroup,
    rightForearm: rightForearmGroup,
    rightHand,
  };
}

function applyPose(parts: HumanoidParts, pose: BodyPose) {
  parts.head.rotation.z = pose.headTilt * DEG;
  parts.head.rotation.x = pose.headNod * DEG;
  parts.torso.rotation.y = pose.torsoTwist * DEG;

  // Arms: 0° = hanging down, 90° = horizontal, 140° = raised up
  parts.leftUpperArm.rotation.z = (pose.leftUpperArm - 10) * DEG;
  parts.rightUpperArm.rotation.z = -(pose.rightUpperArm - 10) * DEG;

  // Forearms bend (negative = bend inward toward body)
  parts.leftForearm.rotation.x = pose.leftForearm * DEG;
  parts.rightForearm.rotation.x = pose.rightForearm * DEG;
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export const SignLanguagePresenter: React.FC = () => {
  const { signLanguageModalOpen, signLanguageTerm, setSignLanguageModalOpen, language } = useStore();
  const isAr = language === 'ar';

  const canvasRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const partsRef = useRef<HumanoidParts | null>(null);
  const frameRef = useRef<number>(0);
  const currentPoseRef = useRef<BodyPose>({ ...NEUTRAL });
  const targetPoseRef = useRef<BodyPose>({ ...NEUTRAL });

  const [segments, setSegments] = useState<ParsedSegment[]>([]);
  const [segIdx, setSegIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [targetPose, setTargetPose] = useState<BodyPose>(NEUTRAL);

  // Sync targetPoseRef whenever targetPose updates
  useEffect(() => {
    targetPoseRef.current = targetPose;
  }, [targetPose]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && signLanguageModalOpen) {
        setSignLanguageModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [signLanguageModalOpen, setSignLanguageModalOpen]);

  // Parse text into phrase segments with default fallback
  useEffect(() => {
    const textToParse = signLanguageTerm || (isAr ? 'الذكاء الاصطناعي يوفر الكثير من الفرص' : 'Artificial Intelligence provides many opportunities');
    const parsed = parseTextToPhrases(textToParse);
    setSegments(parsed);
    setSegIdx(0);
    setIsPlaying(true);
  }, [signLanguageTerm, isAr]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!signLanguageModalOpen || !canvasRef.current) return;

    const container = canvasRef.current;
    const w = container.clientWidth || 600;
    const h = container.clientHeight || 400;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.Fog(0x0a1628, 4, 8);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 20);
    camera.position.set(0, 0.8, 3.2);
    camera.lookAt(0, 0.5, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x8899bb, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5e8, 1.8);
    mainLight.position.set(2, 4, 3);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.set(1024, 1024);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x88ccee, 0.4);
    fillLight.position.set(-2, 2, -1);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x14b8a6, 0.6, 6);
    rimLight.position.set(0, 1.5, -2);
    scene.add(rimLight);

    // Floor (subtle)
    const floorGeo = new THREE.CircleGeometry(2, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0d1f33, roughness: 0.95 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.35;
    floor.receiveShadow = true;
    scene.add(floor);

    // Build humanoid
    const parts = createHumanoid(scene);
    partsRef.current = parts;

    // Animation loop using targetPoseRef
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      
      const cur = currentPoseRef.current;
      const tgt = targetPoseRef.current;
      const lerpSpeed = 0.08;
      currentPoseRef.current = lerpPose(cur, tgt, lerpSpeed);
      
      if (parts) {
        applyPose(parts, currentPoseRef.current);
        
        // Subtle idle breathing
        const t = Date.now() * 0.001;
        parts.torso.position.y = 0.3 + Math.sin(t * 1.5) * 0.008;
        parts.head.position.y = 1.1 + Math.sin(t * 1.5) * 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();



    // Resize handler
    const onResize = () => {
      if (!container || !camera || !renderer) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [signLanguageModalOpen]);

  // Update target pose when it changes externally
  useEffect(() => {
    // The animation loop reads targetPose via closure
  }, [targetPose]);

  // Phrase playback engine
  useEffect(() => {
    if (!isPlaying || segments.length === 0) {
      if (!isPlaying) setTargetPose(NEUTRAL);
      return;
    }

    const seg = segments[segIdx];
    if (!seg) return;

    const poses = seg.sign.poses;
    const totalDur = seg.sign.durationMs / speed;
    const poseInterval = totalDur / poses.length;
    let poseIdx = 0;

    // Start first pose immediately
    setTargetPose(poses[0]);

    const intervalId = setInterval(() => {
      poseIdx++;
      if (poseIdx < poses.length) {
        setTargetPose(poses[poseIdx]);
      }
    }, poseInterval);

    // After full phrase duration, move to next segment
    const nextTimer = setTimeout(() => {
      clearInterval(intervalId);
      if (segIdx < segments.length - 1) {
        setSegIdx(prev => prev + 1);
      } else {
        setIsPlaying(false);
        setTargetPose(NEUTRAL);
      }
    }, totalDur + 200);

    return () => {
      clearInterval(intervalId);
      clearTimeout(nextTimer);
    };
  }, [segIdx, isPlaying, segments, speed]);

  if (!signLanguageModalOpen) return null;

  const currentSeg = segments[segIdx];
  const progress = segments.length > 0 ? ((segIdx + 1) / segments.length) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      style={{ background: 'rgba(2, 6, 23, 0.9)', backdropFilter: 'blur(10px)' }}
      dir={isAr ? 'rtl' : 'ltr'}
      onClick={(e) => { if (e.target === e.currentTarget) setSignLanguageModalOpen(false); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-presenter-title"
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #0d1b2a 0%, #0a1628 100%)',
          border: '1px solid rgba(20, 184, 166, 0.15)',
          boxShadow: '0 0 80px rgba(20, 184, 166, 0.06), 0 32px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800/60">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)', boxShadow: '0 4px 15px rgba(20,184,166,0.3)' }}
            >
              <Hand className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isAr ? 'مترجم لغة الإشارة العربية' : 'Arabic Sign Language Presenter'}
              </h2>
              <div className="flex items-center gap-2 text-[11px] font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-teal-400">
                  {isPlaying ? (isAr ? 'يترجم الآن بالمعنى...' : 'Translating by meaning...') : (isAr ? 'متوقف' : 'Paused')}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500 text-[10px]">3D ArSL • {isAr ? 'ترجمة بالعبارات' : 'Phrase-based'}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSignLanguageModalOpen(false)}
            className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Main Layout ── */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
          {/* 3D Canvas Stage */}
          <div
            ref={canvasRef}
            className="flex-1 relative"
            style={{ minHeight: 400 }}
          >
            {/* Current meaning subtitle */}
            {currentSeg && (
              <div className="absolute bottom-5 inset-x-0 flex justify-center z-20 pointer-events-none">
                <div
                  className="px-5 py-2 rounded-2xl backdrop-blur-md border max-w-[80%]"
                  style={{ background: 'rgba(10, 22, 40, 0.85)', borderColor: 'rgba(20, 184, 166, 0.2)' }}
                >
                  <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-0.5 text-center">
                    {isAr ? 'المعنى بالإشارة' : 'Sign Meaning'}
                  </div>
                  <div className="text-xl font-bold text-amber-400 text-center">
                    {isAr ? currentSeg.sign.meaningAr : currentSeg.sign.meaningEn}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="w-full lg:w-[320px] flex flex-col border-t lg:border-t-0 lg:border-r border-slate-800/50" style={{ background: 'rgba(10,18,30,0.7)' }}>
            {/* Original text */}
            <div className="flex-1 p-5 overflow-y-auto">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                {isAr ? '📝 النص الأصلي' : '📝 Original Text'}
              </h3>
              <div className="space-y-1.5">
                {segments.map((seg, i) => (
                  <span
                    key={i}
                    className={`inline text-sm leading-[2.2] transition-all duration-500 px-1.5 py-0.5 rounded-lg mx-0.5 ${
                      i === segIdx
                        ? 'bg-amber-500/20 text-amber-300 font-bold'
                        : i < segIdx
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    {seg.text}{' '}
                  </span>
                ))}
              </div>

              {/* Current phrase info */}
              {currentSeg && (
                <div className="mt-4 p-3 rounded-xl border" style={{ background: 'rgba(20,184,166,0.05)', borderColor: 'rgba(20,184,166,0.15)' }}>
                  <div className="text-[10px] text-teal-400 font-bold uppercase tracking-wider mb-1.5">
                    {isAr ? 'العبارة الحالية' : 'Current Phrase'}
                  </div>
                  <div className="text-sm text-white font-medium">"{currentSeg.text}"</div>
                  <div className="text-xs text-slate-400 mt-1">
                    → {isAr ? currentSeg.sign.meaningAr : currentSeg.sign.meaningEn}
                  </div>
                  <div className="text-[10px] text-slate-600 mt-1">
                    {currentSeg.sign.poses.length} {isAr ? 'حركات إشارية' : 'gesture motions'}
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-slate-800/50">
              {/* Progress */}
              <div className="mb-3">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-1.5">
                  <span>{isAr ? `عبارة ${segIdx + 1} من ${segments.length}` : `Phrase ${segIdx + 1} of ${segments.length}`}</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #14b8a6, #34d399)' }}
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => { setSegIdx(0); setIsPlaying(true); }}
                  className="p-2.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { if (segIdx > 0) { setSegIdx(segIdx - 1); setIsPlaying(true); } }}
                  disabled={segIdx === 0}
                  className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl disabled:opacity-25 transition-all"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (!isPlaying && segIdx >= segments.length - 1) setSegIdx(0);
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #14b8a6, #0d9488)', boxShadow: '0 0 24px rgba(20,184,166,0.3)' }}
                >
                  {isPlaying
                    ? <Pause className="w-6 h-6 text-white" style={{ fill: 'white' }} />
                    : <Play className="w-6 h-6 text-white" style={{ fill: 'white', marginLeft: 2 }} />
                  }
                </button>

                <button
                  onClick={() => { if (segIdx < segments.length - 1) { setSegIdx(segIdx + 1); setIsPlaying(true); } }}
                  disabled={segIdx >= segments.length - 1}
                  className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl disabled:opacity-25 transition-all"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 0.5 : 1)}
                  className="px-3 py-2 text-sm font-bold rounded-xl hover:bg-slate-800 transition-all"
                  style={{ color: speed !== 1 ? '#14b8a6' : '#64748b' }}
                >
                  {speed}x
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
