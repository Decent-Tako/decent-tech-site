import { useState } from 'react';

import { DESTINATIONS, HERO } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamCurvedInput from '../../vendor/components/curved-input/CurvedInput';
import { CURVED_INPUT_DEFAULTS, REACT_BITS_SOURCE } from './source';

import './curved-input.css';

export type CurvedInputProps = {
  defaultValue?: string;
  placeholder?: string;
  buttonText?: string;
  type?: string;
  theme?: (typeof CURVED_INPUT_DEFAULTS)['theme'];
  width?: number | string;
  bend?: number;
  height?: number;
  cornerRadius?: number;
  borderWidth?: number;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  placeholderColor?: string;
  borderColor?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  iconColor?: string;
  shadowSize?: (typeof CURVED_INPUT_DEFAULTS)['shadowSize'];
  shadowColor?: string;
  showButton?: boolean;
  showIcon?: boolean;
  reducedMotion?: ReducedMotionMode;
};

const START = DESTINATIONS[0];

export function CurvedInput({
  defaultValue = CURVED_INPUT_DEFAULTS.defaultValue,
  placeholder = CURVED_INPUT_DEFAULTS.placeholder,
  buttonText = CURVED_INPUT_DEFAULTS.buttonText,
  type = CURVED_INPUT_DEFAULTS.type,
  theme = CURVED_INPUT_DEFAULTS.theme,
  width = CURVED_INPUT_DEFAULTS.width,
  bend = CURVED_INPUT_DEFAULTS.bend,
  height = CURVED_INPUT_DEFAULTS.height,
  cornerRadius = CURVED_INPUT_DEFAULTS.cornerRadius,
  borderWidth = CURVED_INPUT_DEFAULTS.borderWidth,
  fontSize = CURVED_INPUT_DEFAULTS.fontSize,
  backgroundColor = CURVED_INPUT_DEFAULTS.backgroundColor,
  textColor = CURVED_INPUT_DEFAULTS.textColor,
  placeholderColor = CURVED_INPUT_DEFAULTS.placeholderColor,
  borderColor = CURVED_INPUT_DEFAULTS.borderColor,
  buttonColor = CURVED_INPUT_DEFAULTS.buttonColor,
  buttonTextColor = CURVED_INPUT_DEFAULTS.buttonTextColor,
  iconColor = CURVED_INPUT_DEFAULTS.iconColor,
  shadowSize = CURVED_INPUT_DEFAULTS.shadowSize,
  shadowColor = CURVED_INPUT_DEFAULTS.shadowColor,
  showButton = CURVED_INPUT_DEFAULTS.showButton,
  showIcon = CURVED_INPUT_DEFAULTS.showIcon,
  reducedMotion = CURVED_INPUT_DEFAULTS.reducedMotion,
}: CurvedInputProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [field, setField] = useState(defaultValue);
  const [submitted, setSubmitted] = useState('');
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Curved Input"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              An SVG path bends the field, the caret, and the submit chip along
              a circular arc of <code>{reduce ? 0 : bend}</code> px. Text follows
              the path.
            </>
          }
          controls="Pause hides the blinking caret. Replay remounts the field."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="value, onChange, onSubmit, name, ariaLabel, icon, className, style, and paused are not controls. Placeholder and button text are from DESTINATIONS Start in src/pages/content.ts. Colour defaults are brand tokens: background ink #212121 (upstream theme #1B1722), button accent-blue #0035B1 (upstream #A855F7), icon accent-yellow #DEF54F."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((current) => !current)}
      replay
      onReplay={() => {
        setRun((current) => current + 1);
        setField(defaultValue);
        setSubmitted('');
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageClassName="rb-frame__stage--ink"
      stageTestId="curved-input-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-value': field,
        'data-submitted': submitted,
        'data-theme': theme,
      }}
    >
      <UpstreamCurvedInput
        key={run}
        value={field}
        onChange={setField}
        onSubmit={setSubmitted}
        placeholder={placeholder}
        buttonText={buttonText}
        type={type}
        theme={theme}
        width={width}
        bend={reduce ? 0 : bend}
        height={height}
        cornerRadius={cornerRadius}
        borderWidth={borderWidth}
        fontSize={fontSize}
        backgroundColor={backgroundColor}
        textColor={textColor}
        placeholderColor={placeholderColor}
        borderColor={borderColor}
        buttonColor={buttonColor}
        buttonTextColor={buttonTextColor}
        iconColor={iconColor}
        shadowSize={shadowSize}
        shadowColor={shadowColor}
        showButton={showButton}
        showIcon={showIcon}
        paused={paused}
      />
      <p className="curved-input__caption">
        {START.kicker}. {HERO.facts[0].label} {HERO.facts[0].value}.
      </p>
    </ReactBitsFrame>
  );
}
