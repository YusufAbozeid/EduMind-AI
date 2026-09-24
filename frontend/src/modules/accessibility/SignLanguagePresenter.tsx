import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useStore } from '../../store/useStore';
import { 
  X, Play, Pause, RotateCcw, SkipForward, SkipBack, Hand, 
  Sparkles, Send, RefreshCw
} from 'lucide-react';
import { 
  SignLanguageService, 
  type BodyPoseFrame, 
  type SignTranslationResponse 
} from '../../services/signLanguageService';

/* ═══════════════════════════════════════════════════════════════
   KINEMATIC CONSTANTS & TYPES
   ═══════════════════════════════════════════════════════════════ */

const DEG = Math.PI / 180;

const NEUTRAL_POSE: BodyPoseFrame = {
  headTilt: 0,
  headNod: 0,
  leftUpperArm: 10,
  leftForearm: -15,
  rightUpperArm: 10,
  rightForearm: -15,
  leftWrist: 0,
  rightWrist: 0,
  torsoTwist: 0,
  leftHandShape: 'neutral',
  rightHandShape: 'neutral',
  facialExpression: 'neutral',
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpPose(cur: BodyPoseFrame, tgt: BodyPoseFrame, t: number): BodyPoseFrame {
  return {
    headTilt: lerp(cur.headTilt, tgt.headTilt, t),
    headNod: lerp(cur.headNod, tgt.headNod, t),
    leftUpperArm: lerp(cur.leftUpperArm, tgt.leftUpperArm, t),
    leftForearm: lerp(cur.leftForearm, tgt.leftForearm, t),
    rightUpperArm: lerp(cur.rightUpperArm, tgt.rightUpperArm, t),
    rightForearm: lerp(cur.rightForearm, tgt.rightForearm, t),
    leftWrist: lerp(cur.leftWrist, tgt.leftWrist, t),
    rightWrist: lerp(cur.rightWrist, tgt.rightWrist, t),
    torsoTwist: lerp(cur.torsoTwist, tgt.torsoTwist, t),
    leftHandShape: tgt.leftHandShape,
    rightHandShape: tgt.rightHandShape,
    facialExpression: tgt.facialExpression,
  };
}

/* ═══════════════════════════════════════════════════════════════
   THREE.JS ADVANCED HUMANOID RIG
   ═══════════════════════════════════════════════════════════════ */

interface HumanoidRig {
  root: THREE.Group;
  head: THREE.Group;
  torso: THREE.Mesh;
  leftUpperArm: THREE.Group;
  leftForearm: THREE.Group;
  leftHandGroup: THREE.Group;
  leftFingers: THREE.Mesh[];
  leftThumb: THREE.Mesh;
  rightUpperArm: THREE.Group;
  rightForearm: THREE.Group;
  rightHandGroup: THREE.Group;
  rightFingers: THREE.Mesh[];
  rightThumb: THREE.Mesh;
  leftEyebrow: THREE.Mesh;
  rightEyebrow: THREE.Mesh;
}

function createHumanoidRig(scene: THREE.Scene): HumanoidRig {
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xefd3b5, roughness: 0.55, metalness: 0.05 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x0f3460, roughness: 0.65, metalness: 0.1 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.9 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x16213e, roughness: 0.2 });
  const browMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.8 });
  const lipMat = new THREE.MeshStandardMaterial({ color: 0xb56576, roughness: 0.5 });

  const root = new THREE.Group();
  scene.add(root);

  // ── Torso ──
  const torsoGeo = new THREE.CapsuleGeometry(0.38, 0.72, 8, 16);
  const torso = new THREE.Mesh(torsoGeo, shirtMat);
  torso.position.set(0, 0.3, 0);
  torso.castShadow = true;
  root.add(torso);

  // ── Neck ──
  const neckGeo = new THREE.CylinderGeometry(0.1, 0.12, 0.18, 12);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 0.86, 0);
  root.add(neck);

  // ── Head Group ──
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.12, 0);
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

  // Eyes & Eyebrows
  const eyeGeo = new THREE.SphereGeometry(0.04, 12, 12);
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.1, 0.02, 0.24);
  headGroup.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.1, 0.02, 0.24);
  headGroup.add(rightEye);

  const browGeo = new THREE.BoxGeometry(0.08, 0.015, 0.02);
  const leftEyebrow = new THREE.Mesh(browGeo, browMat);
  leftEyebrow.position.set(-0.1, 0.08, 0.25);
  headGroup.add(leftEyebrow);

  const rightEyebrow = new THREE.Mesh(browGeo, browMat);
  rightEyebrow.position.set(0.1, 0.08, 0.25);
  headGroup.add(rightEyebrow);

  // Mouth
  const mouthGeo = new THREE.TorusGeometry(0.05, 0.012, 8, 16, Math.PI);
  const mouth = new THREE.Mesh(mouthGeo, lipMat);
  mouth.position.set(0, -0.12, 0.23);
  mouth.rotation.set(0, 0, Math.PI);
  headGroup.add(mouth);

  // ── LEFT ARM & ARTICULATED HAND ──
  const leftUpperArm = new THREE.Group();
  leftUpperArm.position.set(-0.48, 0.62, 0);
  root.add(leftUpperArm);

  const shoulderGeo = new THREE.SphereGeometry(0.1, 12, 12);
  const leftShoulder = new THREE.Mesh(shoulderGeo, shirtMat);
  leftUpperArm.add(leftShoulder);

  const upperArmGeo = new THREE.CapsuleGeometry(0.07, 0.35, 6, 12);
  const leftUpperArmMesh = new THREE.Mesh(upperArmGeo, shirtMat);
  leftUpperArmMesh.position.set(0, -0.25, 0);
  leftUpperArmMesh.castShadow = true;
  leftUpperArm.add(leftUpperArmMesh);

  const leftForearm = new THREE.Group();
  leftForearm.position.set(0, -0.48, 0);
  leftUpperArm.add(leftForearm);

  const forearmGeo = new THREE.CapsuleGeometry(0.055, 0.32, 6, 12);
  const leftForearmMesh = new THREE.Mesh(forearmGeo, skinMat);
  leftForearmMesh.position.set(0, -0.22, 0);
  leftForearm.add(leftForearmMesh);

  // Left Hand Group
  const leftHandGroup = new THREE.Group();
  leftHandGroup.position.set(0, -0.42, 0);
  leftForearm.add(leftHandGroup);

  const palmGeo = new THREE.BoxGeometry(0.09, 0.1, 0.035);
  const leftPalm = new THREE.Mesh(palmGeo, skinMat);
  leftHandGroup.add(leftPalm);

  // 4 Articulated Fingers + Thumb
  const fingerGeo = new THREE.CapsuleGeometry(0.012, 0.065, 4, 8);
  const leftFingers: THREE.Mesh[] = [];
  for (let f = 0; f < 4; f++) {
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(-0.036 + f * 0.024, -0.08, 0);
    leftHandGroup.add(finger);
    leftFingers.push(finger);
  }

  const thumbGeo = new THREE.CapsuleGeometry(0.015, 0.055, 4, 8);
  const leftThumb = new THREE.Mesh(thumbGeo, skinMat);
  leftThumb.position.set(-0.055, -0.02, 0.015);
  leftThumb.rotation.z = 0.6;
  leftHandGroup.add(leftThumb);

  // ── RIGHT ARM & ARTICULATED HAND ──
  const rightUpperArm = new THREE.Group();
  rightUpperArm.position.set(0.48, 0.62, 0);
  root.add(rightUpperArm);

  const rightShoulder = new THREE.Mesh(shoulderGeo, shirtMat);
  rightUpperArm.add(rightShoulder);

  const rightUpperArmMesh = new THREE.Mesh(upperArmGeo, shirtMat);
  rightUpperArmMesh.position.set(0, -0.25, 0);
  rightUpperArmMesh.castShadow = true;
  rightUpperArm.add(rightUpperArmMesh);

  const rightForearm = new THREE.Group();
  rightForearm.position.set(0, -0.48, 0);
  rightUpperArm.add(rightForearm);

  const rightForearmMesh = new THREE.Mesh(forearmGeo, skinMat);
  rightForearmMesh.position.set(0, -0.22, 0);
  rightForearm.add(rightForearmMesh);

  // Right Hand Group
  const rightHandGroup = new THREE.Group();
  rightHandGroup.position.set(0, -0.42, 0);
  rightForearm.add(rightHandGroup);

  const rightPalm = new THREE.Mesh(palmGeo, skinMat);
  rightHandGroup.add(rightPalm);

  const rightFingers: THREE.Mesh[] = [];
  for (let f = 0; f < 4; f++) {
    const finger = new THREE.Mesh(fingerGeo, skinMat);
    finger.position.set(-0.036 + f * 0.024, -0.08, 0);
    rightHandGroup.add(finger);
    rightFingers.push(finger);
  }

  const rightThumb = new THREE.Mesh(thumbGeo, skinMat);
  rightThumb.position.set(0.055, -0.02, 0.015);
  rightThumb.rotation.z = -0.6;
  rightHandGroup.add(rightThumb);

  return {
    root,
    head: headGroup,
    torso,
    leftUpperArm,
    leftForearm,
    leftHandGroup,
    leftFingers,
    leftThumb,
    rightUpperArm,
    rightForearm,
    rightHandGroup,
    rightFingers,
    rightThumb,
    leftEyebrow,
    rightEyebrow,
  };
}

function applyPoseToRig(rig: HumanoidRig, pose: BodyPoseFrame) {
  // Head & Torso
  rig.head.rotation.z = pose.headTilt * DEG;
  rig.head.rotation.x = pose.headNod * DEG;
  rig.torso.rotation.y = pose.torsoTwist * DEG;

  // Facial Expression (Eyebrow height & tilt)
  if (pose.facialExpression === 'questioning') {
    rig.leftEyebrow.position.y = 0.11;
    rig.rightEyebrow.position.y = 0.11;
    rig.head.rotation.x = -6 * DEG;
  } else if (pose.facialExpression === 'negation') {
    rig.leftEyebrow.position.y = 0.07;
    rig.rightEyebrow.position.y = 0.07;
  } else {
    rig.leftEyebrow.position.y = 0.08;
    rig.rightEyebrow.position.y = 0.08;
  }

  // Upper arms (0 = hanging down, 90 = horizontal, 140 = raised)
  rig.leftUpperArm.rotation.z = (pose.leftUpperArm - 10) * DEG;
  rig.rightUpperArm.rotation.z = -(pose.rightUpperArm - 10) * DEG;

  // Forearms
  rig.leftForearm.rotation.x = pose.leftForearm * DEG;
  rig.rightForearm.rotation.x = pose.rightForearm * DEG;

  // Wrists
  rig.leftHandGroup.rotation.z = pose.leftWrist * DEG;
  rig.rightHandGroup.rotation.z = pose.rightWrist * DEG;

  // Hand Shapes (Finger articulation)
  adjustHandShape(rig.rightFingers, rig.rightThumb, pose.rightHandShape, false);
  adjustHandShape(rig.leftFingers, rig.leftThumb, pose.leftHandShape, true);
}

function adjustHandShape(
  fingers: THREE.Mesh[],
  thumb: THREE.Mesh,
  shape: BodyPoseFrame['rightHandShape'],
  isLeft: boolean
) {
  const sign = isLeft ? 1 : -1;

  if (shape === 'fist') {
    // All fingers curled
    fingers.forEach(f => { f.rotation.x = Math.PI * 0.45; f.position.z = 0.03; });
    thumb.rotation.z = sign * 0.2;
    thumb.position.z = 0.04;
  } else if (shape === 'point_index') {
    // Only index finger extended (index is finger 0 or 3 depending on hand)
    const indexIdx = isLeft ? 3 : 0;
    fingers.forEach((f, idx) => {
      if (idx === indexIdx) {
        f.rotation.x = 0;
        f.position.z = 0;
      } else {
        f.rotation.x = Math.PI * 0.45;
        f.position.z = 0.03;
      }
    });
    thumb.rotation.z = sign * 0.3;
  } else if (shape === 'v_shape') {
    // Index and Middle extended
    fingers.forEach((f, idx) => {
      if (idx <= 1) {
        f.rotation.x = 0;
        f.rotation.z = (idx === 0 ? -0.2 : 0.2) * sign;
        f.position.z = 0;
      } else {
        f.rotation.x = Math.PI * 0.45;
        f.position.z = 0.03;
      }
    });
  } else if (shape === 'thumbs_up') {
    fingers.forEach(f => { f.rotation.x = Math.PI * 0.45; f.position.z = 0.03; });
    thumb.rotation.z = sign * 1.2;
    thumb.position.y = 0.03;
  } else if (shape === 'pinch' || shape === 'flat_o') {
    fingers.forEach(f => { f.rotation.x = 0.3; f.position.z = 0.02; });
    thumb.rotation.z = sign * 0.4;
    thumb.position.z = 0.03;
  } else {
    // Open palm / neutral
    fingers.forEach(f => { f.rotation.x = 0; f.rotation.z = 0; f.position.z = 0; });
    thumb.rotation.z = sign * 0.6;
    thumb.position.set(sign * 0.055, -0.02, 0.015);
  }
}

/* ═══════════════════════════════════════════════════════════════
   MAIN SIGN LANGUAGE PRESENTER COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export const SignLanguagePresenter: React.FC = () => {
  const { signLanguageModalOpen, signLanguageTerm, setSignLanguageModalOpen, language } = useStore();
  const isAr = language === 'ar';

  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rigRef = useRef<HumanoidRig | null>(null);
  const frameIdRef = useRef<number>(0);

  const currentPoseRef = useRef<BodyPoseFrame>({ ...NEUTRAL_POSE });
  const targetPoseRef = useRef<BodyPoseFrame>({ ...NEUTRAL_POSE });

  // State
  const [inputText, setInputText] = useState('');
  const [translationResult, setTranslationResult] = useState<SignTranslationResponse | null>(null);
  const [currentSignIdx, setCurrentSignIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1.0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [cameraView, setCameraView] = useState<'standard' | 'hands' | 'orbit'>('standard');

  // Load and translate text into ArSL sequences
  const performTranslation = useCallback(async (textToTranslate: string) => {
    if (!textToTranslate.trim()) return;
    setIsTranslating(true);

    try {
      const res = await SignLanguageService.translateTextToSigns(textToTranslate, speed);
      setTranslationResult(res);
      setCurrentSignIdx(0);
      setIsPlaying(true);
    } catch (err) {
      console.error('[SignLanguagePresenter] Error translating to signs:', err);
    } finally {
      setIsTranslating(false);
    }
  }, [speed]);

  // Trigger translation when modal opens or signLanguageTerm changes
  useEffect(() => {
    if (signLanguageModalOpen) {
      const initialText = signLanguageTerm || (isAr ? 'الذكاء الاصطناعي والشبكات العصبية خطوة بخطوة' : 'Artificial Intelligence and Neural Networks step by step');
      setInputText(initialText);
      performTranslation(initialText);
    }
  }, [signLanguageModalOpen, signLanguageTerm, isAr, performTranslation]);

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

  // Initialize Three.js WebGL Scene
  useEffect(() => {
    if (!signLanguageModalOpen || !containerRef.current) return;

    const container = containerRef.current;
    const w = container.clientWidth || 640;
    const h = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070d19);
    scene.fog = new THREE.Fog(0x070d19, 3.5, 9);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 20);
    camera.position.set(0, 0.75, 3.1);
    camera.lookAt(0, 0.45, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x94a3b8, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff8ee, 1.8);
    keyLight.position.set(2, 4, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x00d9c0, 0.5);
    fillLight.position.set(-2.5, 2, 1);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 0.9, 8);
    rimLight.position.set(0, 1.8, -2.5);
    scene.add(rimLight);

    // Floor platform
    const floorGeo = new THREE.CircleGeometry(1.8, 32);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.4;
    scene.add(floor);

    // Build Rig
    const rig = createHumanoidRig(scene);
    rigRef.current = rig;

    // Smooth Animation Loop
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const cur = currentPoseRef.current;
      const tgt = targetPoseRef.current;
      currentPoseRef.current = lerpPose(cur, tgt, 0.08);

      if (rigRef.current) {
        applyPoseToRig(rigRef.current, currentPoseRef.current);

        // Natural micro-breathing motion
        const time = Date.now() * 0.0015;
        rigRef.current.torso.position.y = 0.3 + Math.sin(time) * 0.006;
        rigRef.current.head.position.y = 1.12 + Math.sin(time) * 0.004;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameIdRef.current);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [signLanguageModalOpen]);

  // Camera preset handler
  const setCameraPreset = (mode: 'standard' | 'hands' | 'orbit') => {
    setCameraView(mode);
    const camera = cameraRef.current;
    if (!camera) return;

    if (mode === 'hands') {
      camera.position.set(0, 0.45, 1.8);
      camera.lookAt(0, 0.35, 0);
    } else if (mode === 'orbit') {
      camera.position.set(1.2, 0.8, 2.5);
      camera.lookAt(0, 0.45, 0);
    } else {
      camera.position.set(0, 0.75, 3.1);
      camera.lookAt(0, 0.45, 0);
    }
  };

  // Playback Sequencer Engine
  useEffect(() => {
    if (!isPlaying || !translationResult || translationResult.signs.length === 0) {
      if (!isPlaying) targetPoseRef.current = { ...NEUTRAL_POSE };
      return;
    }

    const currentSign = translationResult.signs[currentSignIdx];
    if (!currentSign || currentSign.poses.length === 0) return;

    const poses = currentSign.poses;
    const signDur = currentSign.durationMs;
    const poseInterval = Math.max(100, Math.floor(signDur / poses.length));
    let frameIdx = 0;

    targetPoseRef.current = poses[0];

    const frameInterval = setInterval(() => {
      frameIdx++;
      if (frameIdx < poses.length) {
        targetPoseRef.current = poses[frameIdx];
      }
    }, poseInterval);

    const signTimer = setTimeout(() => {
      clearInterval(frameInterval);
      if (currentSignIdx < translationResult.signs.length - 1) {
        setCurrentSignIdx(prev => prev + 1);
      } else {
        setIsPlaying(false);
        targetPoseRef.current = { ...NEUTRAL_POSE };
      }
    }, signDur + 80);

    return () => {
      clearInterval(frameInterval);
      clearTimeout(signTimer);
    };
  }, [currentSignIdx, isPlaying, translationResult]);

  if (!signLanguageModalOpen) return null;

  const currentSign = translationResult?.signs[currentSignIdx];
  const totalSigns = translationResult?.signs.length || 0;
  const progressPct = totalSigns > 0 ? ((currentSignIdx + 1) / totalSigns) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 backdrop-blur-md bg-black/85 animate-fade-in"
      dir={isAr ? 'rtl' : 'ltr'}
      onClick={(e) => { if (e.target === e.currentTarget) setSignLanguageModalOpen(false); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl overflow-hidden flex flex-col bg-gradient-to-br from-slate-900 via-slate-900 to-[#0a1628] border border-teal-500/30 shadow-2xl shadow-teal-950/40">
        
        {/* ── Top Header ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/25 shrink-0">
              <Hand className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">
                  {isAr ? 'المترجم الإشاري الذكي 3D (ArSL Generation)' : 'Autonomous 3D Sign Language Presenter'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{isAr ? 'عصبي-رمزي هجين' : 'Neuro-Symbolic'}</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                {isAr ? 'توليد لغة الإشارة العربية وفق القاموس الموحد والأبجدية اليدوية' : 'Unified Arab Sign Language standard with authentic fingerspelling'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Camera View Selector */}
            <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 text-xs text-slate-400">
              <button
                onClick={() => setCameraPreset('standard')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${cameraView === 'standard' ? 'bg-teal-500 text-white shadow-xs' : 'hover:text-white'}`}
                title="منظر قياسي"
              >
                {isAr ? 'عام' : 'Full'}
              </button>
              <button
                onClick={() => setCameraPreset('hands')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${cameraView === 'hands' ? 'bg-teal-500 text-white shadow-xs' : 'hover:text-white'}`}
                title="تقريب على الأيدي والأصابع"
              >
                {isAr ? 'اليدين' : 'Hands'}
              </button>
              <button
                onClick={() => setCameraPreset('orbit')}
                className={`px-2.5 py-1 rounded-lg font-bold transition ${cameraView === 'orbit' ? 'bg-teal-500 text-white shadow-xs' : 'hover:text-white'}`}
                title="منظر مائل 45 درجة"
              >
                {isAr ? 'مائل' : 'Angle'}
              </button>
            </div>

            <button
              onClick={() => setSignLanguageModalOpen(false)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Main Workspace ── */}
        <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden">
          
          {/* 3D Stage (Left / Main Area) */}
          <div ref={containerRef} className="flex-1 relative min-h-[380px] lg:min-h-[440px]">
            {/* Live Translating Indicator */}
            {isTranslating && (
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-300 text-xs font-bold animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{isAr ? 'الذكاء الاصطناعي يحلل قواعد لغة الإشارة...' : 'AI Synthesizing Sign Kinematics...'}</span>
              </div>
            )}

            {/* Subtitle HUD Card */}
            {currentSign && (
              <div className="absolute bottom-4 inset-x-0 flex justify-center z-20 pointer-events-none px-4">
                <div className="px-5 py-2.5 rounded-2xl backdrop-blur-md bg-slate-950/85 border border-teal-500/30 max-w-lg w-full text-center shadow-xl space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-teal-400">
                    <span className="uppercase tracking-wider">
                      {currentSign.isFingerspelled 
                        ? (isAr ? '🔤 تهجئة إشارية بالحروف' : '🔤 Fingerspelling')
                        : (isAr ? '✨ إشارة دلالية معتمدة' : '✨ ArSL Core Gloss')
                      }
                    </span>
                    <span className="text-slate-400 text-[10px]">
                      {currentSignIdx + 1} / {totalSigns}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-amber-400">
                    {currentSign.arabicText}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {currentSign.englishTranslation}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Controller & Gloss Panel (Right Side) */}
          <div className="w-full lg:w-[340px] flex flex-col border-t lg:border-t-0 lg:border-r border-slate-800 bg-slate-900/70 p-4 space-y-4">
            
            {/* Live Custom Text Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block">
                {isAr ? '✍️ اكتب أي جملة لتوليد لغة الإشارة فوراً:' : '✍️ Type any text to generate sign language:'}
              </label>
              <form 
                onSubmit={(e) => { e.preventDefault(); performTranslation(inputText); }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isAr ? 'اكتب كلمة أو سؤال هنا...' : 'Type words or questions...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-teal-500 transition font-medium"
                />
                <button
                  type="submit"
                  disabled={isTranslating}
                  className="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white font-bold text-xs transition flex items-center justify-center shrink-0 shadow-md shadow-teal-500/20"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

            {/* Gloss Sequence Stream */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[140px] max-h-[220px]">
              <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 border-b border-slate-800 pb-1">
                <span>{isAr ? 'سلسلة المقاطع الإشارية (Glosses):' : 'ArSL Sign Stream:'}</span>
                <span className="text-teal-400 text-[10px]">{totalSigns} {isAr ? 'إشارة' : 'signs'}</span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {translationResult?.signs.map((sign, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setCurrentSignIdx(idx); setIsPlaying(true); }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 border ${
                      idx === currentSignIdx
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                        : idx < currentSignIdx
                        ? 'bg-slate-950/60 text-slate-500 border-slate-800'
                        : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:border-teal-500/40'
                    }`}
                  >
                    <span>{sign.arabicText}</span>
                    {sign.isFingerspelled && <span className="text-[9px] text-teal-400">🔤</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Player Navigation & Speed Controls */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              {/* Progress bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                  <span>{isAr ? `إشارة ${currentSignIdx + 1} من ${totalSigns}` : `Sign ${currentSignIdx + 1} of ${totalSigns}`}</span>
                  <span>{Math.round(progressPct)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300 bg-gradient-to-r from-teal-400 to-emerald-400"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => { setCurrentSignIdx(0); setIsPlaying(true); }}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
                  title="إعادة من البداية"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => { if (currentSignIdx > 0) { setCurrentSignIdx(c => c - 1); setIsPlaying(true); } }}
                  disabled={currentSignIdx === 0}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl disabled:opacity-30 transition"
                  title="الإشارة السابقة"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    if (!isPlaying && currentSignIdx >= totalSigns - 1) setCurrentSignIdx(0);
                    setIsPlaying(!isPlaying);
                  }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-white flex items-center justify-center shadow-lg shadow-teal-500/30 hover:scale-105 active:scale-95 transition"
                  title={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                <button
                  onClick={() => { if (currentSignIdx < totalSigns - 1) { setCurrentSignIdx(c => c + 1); setIsPlaying(true); } }}
                  disabled={currentSignIdx >= totalSigns - 1}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl disabled:opacity-30 transition"
                  title="الإشارة التالية"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Speed toggle */}
                <button
                  onClick={() => setSpeed(s => s === 1.0 ? 0.75 : s === 0.75 ? 0.5 : s === 0.5 ? 1.25 : 1.0)}
                  className="px-2.5 py-1.5 text-xs font-black rounded-xl bg-slate-800 text-teal-300 border border-slate-700 hover:border-teal-500/50 transition"
                  title="سرعة العرض"
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
