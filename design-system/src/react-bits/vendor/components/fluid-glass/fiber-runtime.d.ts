import type { ReactNode } from 'react';

export const Canvas: (props: Record<string, unknown>) => ReactNode;
export const createPortal: (children: ReactNode, container: unknown) => ReactNode;
export const useFrame: (callback: (...args: never[]) => void, renderPriority?: number) => void;
export const useThree: (selector?: (state: Record<string, unknown>) => unknown) => unknown;
export type ThreeElements = Record<string, unknown>;
