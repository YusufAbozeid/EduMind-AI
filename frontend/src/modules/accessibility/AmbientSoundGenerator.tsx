import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store/useStore';

export const AmbientSoundGenerator: React.FC = () => {
  const { whiteNoiseType } = useStore();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Cleanup previous sound generator
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {
        console.warn('AudioContext close error:', e);
      }
      audioCtxRef.current = null;
    }

    if (whiteNoiseType === 'off') return;

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2; // 2 seconds buffer
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // Generate base noise data
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        if (whiteNoiseType === 'rain') {
          // Pink/Brown noise formula for rain drops simulation
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; 
        } else if (whiteNoiseType === 'coffee') {
          // Soft ambient coffee rumble noise
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.01 * white) / 1.01;
          lastOut = data[i];
          data[i] *= 2.0;
        } else {
          // Pure white noise
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }
      }

      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;

      // Filter Node for realistic acoustic warmth
      const filter = ctx.createBiquadFilter();
      if (whiteNoiseType === 'rain') {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);
      } else if (whiteNoiseType === 'coffee') {
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(500, ctx.currentTime);
        filter.Q.setValueAtTime(1.0, ctx.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(3000, ctx.currentTime);
      }

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime); // Gentle comfortable volume

      noiseSource.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noiseSource.start();
      noiseNodeRef.current = noiseSource;
      gainNodeRef.current = gain;
    } catch (err) {
      console.warn('Web Audio API Ambient Sound error:', err);
    }

    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {
          // ignore
        }
        audioCtxRef.current = null;
      }
    };
  }, [whiteNoiseType]);

  return null; // Silent background audio component
};
