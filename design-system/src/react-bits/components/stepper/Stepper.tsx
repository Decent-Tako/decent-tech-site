import { useState } from 'react';

import { FEATURES } from '../../../pages/content';
import { ReactBitsAttribution, ReactBitsRuntimeLine } from '../../frame/Attribution';
import { ReactBitsFrame } from '../../frame/ReactBitsFrame';
import { useReduce } from '../../frame/reduce';
import type { ReducedMotionMode } from '../../types';
import UpstreamStepper, { Step } from '../../vendor/components/stepper/Stepper';
import { REACT_BITS_SOURCE, STEPPER_DEFAULTS } from './source';

import './stepper.css';

export type StepperProps = {
  initialStep?: number;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
  reducedMotion?: ReducedMotionMode;
};

export function Stepper({
  initialStep = STEPPER_DEFAULTS.initialStep,
  backButtonText = STEPPER_DEFAULTS.backButtonText,
  nextButtonText = STEPPER_DEFAULTS.nextButtonText,
  disableStepIndicators = STEPPER_DEFAULTS.disableStepIndicators,
  reducedMotion = STEPPER_DEFAULTS.reducedMotion,
}: StepperProps) {
  const [paused, setPaused] = useState(false);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(initialStep);
  const [done, setDone] = useState(false);
  const reduce = useReduce(reducedMotion);

  return (
    <ReactBitsFrame
      title="Stepper"
      attribution={
        <ReactBitsAttribution
          source={REACT_BITS_SOURCE}
          mechanism={
            <>
              Continue slides the next step in from the left with a spring.
              The connector fills as each step completes. Back reverses the
              slide.
            </>
          }
          controls="Pause shows the current step with no spring. Replay remounts at the first step."
        />
      }
      extraRuntime={<ReactBitsRuntimeLine source={REACT_BITS_SOURCE} />}
      fixedNote="children, className props, button props, callbacks, and renderStepIndicator are not controls. The five steps are FEATURES from src/pages/content.ts. Photographs come from public/photos through publicAsset(). Indicator fill is accent blue. Upstream fill was #5227FF."
      pauseLabel={paused ? 'Resume' : 'Pause'}
      onPause={() => setPaused((value) => !value)}
      replay
      onReplay={() => {
        setRun((value) => value + 1);
        setStep(initialStep);
        setDone(false);
        setPaused(false);
      }}
      reducedMotion={reducedMotion}
      paused={paused}
      stageTestId="stepper-stage"
      stageData={{
        'data-reduced': reduce ? 'true' : 'false',
        'data-run': String(run),
        'data-step': String(step),
        'data-done': done ? 'true' : 'false',
        'data-indicators': disableStepIndicators ? 'false' : 'true',
      }}
    >
      <UpstreamStepper
        key={run}
        initialStep={initialStep}
        backButtonText={backButtonText}
        nextButtonText={nextButtonText}
        disableStepIndicators={disableStepIndicators}
        paused={paused}
        instant={reduce}
        onStepChange={(next) => {
          setStep(next);
          setDone(false);
        }}
        onFinalStepCompleted={() => {
          setDone(true);
          setStep(FEATURES.length + 1);
        }}
      >
        {FEATURES.map((feature) => (
          <Step key={feature.id}>
            <img
              className="stepper__photo"
              src={feature.photo.src}
              alt={feature.photo.alt}
              width={640}
              height={400}
            />
            <p className="stepper__kicker">{feature.kicker}</p>
            <p className="stepper__title">{feature.title}</p>
            <p className="stepper__copy">{feature.copy}</p>
          </Step>
        ))}
      </UpstreamStepper>
    </ReactBitsFrame>
  );
}
