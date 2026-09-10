'use client';
import React, { useRef, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import useClickOutside from './useClickOutside';
import { ArrowLeft, Search, User } from 'lucide-react';

const DEFAULT_BOUNCE = 0.1;
const DEFAULT_DURATION = 0.2;
const DEFAULT_CLOSED_WIDTH = 98;
const DEFAULT_OPEN_WIDTH = 300;

export type ToolbarDynamicProps = {
  bounce?: number;
  duration?: number;
  closedWidth?: number;
  openWidth?: number;
  placeholder?: string;
  profileLabel?: string;
  searchLabel?: string;
};

function Button({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      className='relative flex h-9 w-9 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

export function ToolbarDynamic({
  bounce = DEFAULT_BOUNCE,
  duration = DEFAULT_DURATION,
  closedWidth = DEFAULT_CLOSED_WIDTH,
  openWidth = DEFAULT_OPEN_WIDTH,
  placeholder = 'Search notes',
  profileLabel = 'User profile',
  searchLabel = 'Search notes',
}: ToolbarDynamicProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null!);

  useClickOutside(containerRef, () => {
    setIsOpen(false);
  });

  return (
    <MotionConfig transition={{ type: 'spring', bounce, duration }}>
      <div className='absolute bottom-8' ref={containerRef} data-open={isOpen}>
        <div className='h-full w-full rounded-xl border border-zinc-950/10 bg-white'>
          <motion.div
            animate={{
              // @todo: here I want to remove the width
              width: isOpen ? `${openWidth}px` : `${closedWidth}px`,
            }}
            initial={false}
          >
            <div className='overflow-hidden p-2'>
              {!isOpen ? (
                <div className='flex space-x-2'>
                  <Button disabled ariaLabel={profileLabel}>
                    <User className='h-5 w-5' />
                  </Button>
                  <Button
                    onClick={() => setIsOpen(true)}
                    ariaLabel={searchLabel}
                  >
                    <Search className='h-5 w-5' />
                  </Button>
                </div>
              ) : (
                <div className='flex space-x-2'>
                  <Button onClick={() => setIsOpen(false)} ariaLabel='Back'>
                    <ArrowLeft className='h-5 w-5' />
                  </Button>
                  <div className='relative w-full'>
                    <input
                      className='h-9 w-full rounded-lg border border-zinc-950/10 bg-transparent p-2 text-zinc-900 placeholder-zinc-500 focus:outline-hidden'
                      autoFocus
                      placeholder={placeholder}
                    />
                    <div className='absolute right-1 top-0 flex h-full items-center justify-center'></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}

export default ToolbarDynamic;
