/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/Animations/Magnet/Magnet.tsx
 * Page: https://reactbits.dev/animations/magnet
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. Bind pointermove to the wrapper parent (the stage), not window.
 * 2. paused freezes the offset. onActive reports the pull.
 * 3. data-testid on the wrapper and the inner node.
 */
import React, { useState, useEffect, useRef, type ReactNode, type HTMLAttributes } from 'react';

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
  paused?: boolean;
  onActive?: (active: boolean, x: number, y: number) => void;
}

const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = 'transform 0.3s ease-out',
  inactiveTransition = 'transform 0.5s ease-in-out',
  wrapperClassName = '',
  innerClassName = '',
  paused = false,
  onActive,
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  useEffect(() => {
    if (disabled || paused) {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
      onActiveRef.current?.(false, 0, 0);
      return;
    }

    const handlePointerMove = (e: PointerEvent) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distX = Math.abs(centerX - e.clientX);
      const distY = Math.abs(centerY - e.clientY);

      if (distX < width / 2 + padding && distY < height / 2 + padding) {
        setIsActive(true);
        const offsetX = (e.clientX - centerX) / magnetStrength;
        const offsetY = (e.clientY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
        onActiveRef.current?.(true, offsetX, offsetY);
      } else {
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
        onActiveRef.current?.(false, 0, 0);
      }
    };

    const root = magnetRef.current?.parentElement ?? magnetRef.current;
    if (!root) return;
    root.addEventListener('pointermove', handlePointerMove);
    return () => {
      root.removeEventListener('pointermove', handlePointerMove);
    };
  }, [padding, disabled, magnetStrength, paused]);

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      data-testid="magnet-host"
      data-active={isActive ? 'true' : 'false'}
      style={{ position: 'relative', display: 'inline-block' }}
      {...props}
    >
      <div
        className={innerClassName}
        data-testid="magnet-inner"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
