/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Noise/Noise.tsx
 * Page: https://reactbits.dev/animations/noise
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. paused stops the refresh loop and keeps the last grain.
 * 2. onReady fires after the first draw. onUnavailable fires when 2D canvas is missing.
 * 3. data-testid on the canvas.
 * 4. Fill the host instead of 100vw/100vh. ResizeObserver on the canvas host.
 */
import type React from 'react';
import { useRef, useEffect } from 'react';
import './Noise.css';

interface NoiseProps {
  patternSize?: number;
  patternScaleX?: number;
  patternScaleY?: number;
  patternRefreshInterval?: number;
  patternAlpha?: number;
  paused?: boolean;
  onReady?: () => void;
  onUnavailable?: () => void;
}

const Noise: React.FC<NoiseProps> = ({
  patternSize = 250,
  patternScaleX = 1,
  patternScaleY = 1,
  patternRefreshInterval = 2,
  patternAlpha = 15,
  paused = false,
  onReady,
  onUnavailable,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);
  const pausedRef = useRef(paused);
  const onReadyRef = useRef(onReady);
  pausedRef.current = paused;
  onReadyRef.current = onReady;

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      onUnavailable?.();
      return;
    }

    canvas.setAttribute('data-testid', 'noise-canvas');

    let frame = 0;
    let animationId: number;
    let notifiedReady = false;
    const canvasSize = 1024;

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvasSize;
      canvas.height = canvasSize;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
    };

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }

      ctx.putImageData(imageData, 0, 0);
      if (!notifiedReady) {
        notifiedReady = true;
        onReadyRef.current?.();
      }
    };

    const loop = () => {
      if (!pausedRef.current && frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame++;
      animationId = window.requestAnimationFrame(loop);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();
    drawGrain();
    loop();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationId);
    };
  }, [patternSize, patternScaleX, patternScaleY, patternRefreshInterval, patternAlpha, onUnavailable]);

  return <canvas className="noise-overlay" ref={grainRef} style={{ imageRendering: 'pixelated' }} />;
};

export default Noise;
