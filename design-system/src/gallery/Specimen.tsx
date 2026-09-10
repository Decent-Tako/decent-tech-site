import type { ReactNode } from 'react';

export function Specimen({
  children,
  themed = false,
  note,
}: {
  children: ReactNode;
  themed?: boolean;
  note: string;
}) {
  return (
    <div className={themed ? 'gallery-root gallery-themed' : 'gallery-root'}>
      <p className="gallery-note">{note}</p>
      {children}
    </div>
  );
}
