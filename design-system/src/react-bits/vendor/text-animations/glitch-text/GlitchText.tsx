/*
 * Vendored from React Bits.
 * Source: https://github.com/DavidHDev/react-bits/blob/625f25025fed1c28e2de7d3ac5f12ee83542844d/src/ts-default/TextAnimations/GlitchText/GlitchText.tsx
 * Page: https://reactbits.dev/text-animations/glitch-text
 * Commit: 625f25025fed1c28e2de7d3ac5f12ee83542844d
 * Date: 2026-09-10
 * Licence: MIT + Commons Clause (see ../../LICENSE.md). The Commons Clause forbids
 * selling, sublicensing, or redistributing the components themselves.
 *
 * Local changes:
 * 1. This header.
 * 2. `paused` sets data-paused so CSS can hold the keyframes.
 * 3. `reduced` turns the animation off.
 * 4. The host carries data-testid="glitch-text-copy".
 * 5. `FC` became a plain function.
 */
import { type CSSProperties } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  children: string;
  speed?: number;
  enableShadows?: boolean;
  enableOnHover?: boolean;
  className?: string;
  paused?: boolean;
  reduced?: boolean;
}

interface CustomCSSProperties extends CSSProperties {
  '--after-duration': string;
  '--before-duration': string;
  '--after-shadow': string;
  '--before-shadow': string;
}

const GlitchText = ({
  children,
  speed = 0.5,
  enableShadows = true,
  enableOnHover = false,
  className = '',
  paused = false,
  reduced = false,
}: GlitchTextProps) => {
  const inlineStyles: CustomCSSProperties = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 red' : 'none',
    '--before-shadow': enableShadows ? '5px 0 cyan' : 'none',
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';
  const reducedClass = reduced ? 'glitch--reduced' : '';

  return (
    <div
      className={`glitch ${hoverClass} ${reducedClass} ${className}`.trim()}
      style={inlineStyles}
      data-text={children}
      data-paused={paused ? 'true' : 'false'}
      data-testid="glitch-text-copy"
    >
      {children}
    </div>
  );
};

export default GlitchText;
