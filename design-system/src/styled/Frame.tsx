import type { ReactNode } from 'react';

export function Frame({
  note,
  children,
}: {
  note: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          margin: '0 0 1rem',
          fontSize: '0.8125rem',
          lineHeight: 1.4,
          maxWidth: '36rem',
        }}
      >
        {note}
      </p>
      {children}
    </div>
  );
}
