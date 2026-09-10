/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Components/ReflectiveCard/ReflectiveCard.tsx
 * Page: https://reactbits.dev/components/reflective-card
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. Removed unused `User` import.
 * 3. Unique filter id via useId so two cards can mount.
 * 4. `fallbackSrc` photograph when getUserMedia fails or is refused.
 * 5. `name`, `role`, `badge`, `idLabel`, `idValue` replace hardcoded copy.
 * 6. `paused` pauses the webcam video.
 * 7. `onWebcam` reports `ready` or `unavailable`.
 * Everything else is unchanged.
 */
import React, { useEffect, useId, useRef, useState } from 'react';
import './ReflectiveCard.css';
import { Fingerprint, Activity, Lock } from 'lucide-react';

interface ReflectiveCardProps {
  blurStrength?: number;
  color?: string;
  metalness?: number;
  roughness?: number;
  overlayColor?: string;
  displacementStrength?: number;
  noiseScale?: number;
  specularConstant?: number;
  grayscale?: number;
  glassDistortion?: number;
  className?: string;
  style?: React.CSSProperties;
  fallbackSrc?: string;
  fallbackAlt?: string;
  name?: string;
  role?: string;
  badge?: string;
  idLabel?: string;
  idValue?: string;
  paused?: boolean;
  onWebcam?: (state: 'ready' | 'unavailable') => void;
}

const ReflectiveCard: React.FC<ReflectiveCardProps> = ({
  blurStrength = 12,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(255, 255, 255, 0.1)',
  displacementStrength = 20,
  noiseScale = 1,
  specularConstant = 1.2,
  grayscale = 1,
  glassDistortion = 0,
  className = '',
  style = {},
  fallbackSrc,
  fallbackAlt = '',
  name = 'ALEXANDER DOE',
  role = 'SENIOR DEVELOPER',
  badge = 'SECURE ACCESS',
  idLabel = 'ID NUMBER',
  idValue = '8901-2345-6789',
  paused = false,
  onWebcam
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onWebcamRef = useRef(onWebcam);
  onWebcamRef.current = onWebcam;
  const [streamActive, setStreamActive] = useState(false);
  const filterId = useId().replace(/:/g, '');

  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    const timeout = window.setTimeout(() => {
      if (!cancelled && !stream) onWebcamRef.current?.('unavailable');
    }, 1500);

    const startWebcam = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          }
        });

        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
          onWebcamRef.current?.('ready');
        }
      } catch {
        if (!cancelled) {
          setStreamActive(false);
          onWebcamRef.current?.('unavailable');
        }
      }
    };

    startWebcam();

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !streamActive) return;
    if (paused) video.pause();
    else void video.play();
  }, [paused, streamActive]);

  const baseFrequency = 0.03 / Math.max(0.1, noiseScale);
  const saturation = 1 - Math.max(0, Math.min(1, grayscale));

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation,
    '--reflective-filter': `url(#${filterId})`
  } as React.CSSProperties;

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      <svg className="reflective-svg-filters" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="turbulence" baseFrequency={baseFrequency} numOctaves="2" result="noise" />
            <feColorMatrix in="noise" type="luminanceToAlpha" result="noiseAlpha" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementStrength}
              xChannelSelector="R"
              yChannelSelector="G"
              result="rippled"
            />
            <feSpecularLighting
              in="noiseAlpha"
              surfaceScale={displacementStrength}
              specularConstant={specularConstant}
              specularExponent="20"
              lightingColor="#ffffff"
              result="light"
            >
              <fePointLight x="0" y="0" z="300" />
            </feSpecularLighting>
            <feComposite in="light" in2="rippled" operator="in" result="light-effect" />
            <feBlend in="light-effect" in2="rippled" mode="screen" result="metallic-result" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="solidAlpha"
            />
            <feMorphology in="solidAlpha" operator="erode" radius="45" result="erodedAlpha" />
            <feGaussianBlur in="erodedAlpha" stdDeviation="10" result="blurredMap" />
            <feComponentTransfer in="blurredMap" result="glassMap">
              <feFuncA type="linear" slope="0.5" intercept="0" />
            </feComponentTransfer>
            <feDisplacementMap
              in="metallic-result"
              in2="glassMap"
              scale={glassDistortion}
              xChannelSelector="A"
              yChannelSelector="A"
              result="final"
            />
          </filter>
        </defs>
      </svg>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="reflective-video"
        hidden={!streamActive}
      />
      {!streamActive && fallbackSrc ? (
        <img src={fallbackSrc} alt={fallbackAlt} className="reflective-video" />
      ) : null}

      <div className="reflective-noise" />
      <div className="reflective-sheen" />
      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            <Lock size={14} className="security-icon" />
            <span>{badge}</span>
          </div>
          <Activity className="status-icon" size={20} />
        </div>

        <div className="card-body">
          <div className="user-info">
            <p className="user-name">{name}</p>
            <p className="user-role">{role}</p>
          </div>
        </div>

        <div className="card-footer">
          <div className="id-section">
            <span className="label">{idLabel}</span>
            <span className="value">{idValue}</span>
          </div>
          <div className="fingerprint-section">
            <Fingerprint size={32} className="fingerprint-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReflectiveCard;
