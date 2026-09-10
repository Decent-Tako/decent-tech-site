import type { ReactNode } from 'react';

import { REACT_BITS_LICENCE_URL, displayName } from '../catalogue';
import type { ReactBitsSource } from '../types';

// The attribution paragraph every React Bits story shows. It names the
// upstream page, commit, copy date, licence, source files, and the
// mechanism the worker describes.
export function ReactBitsAttribution({
  source,
  mechanism,
  controls,
}: {
  source: ReactBitsSource;
  // What moves and how. One or two sentences.
  mechanism: ReactNode;
  // What Pause and Replay do.
  controls: ReactNode;
}) {
  return (
    <>
      Vendored from React Bits {displayName(source.name)}{' '}
      <a href={source.page}>{source.page}</a>, commit{' '}
      <code>{source.sha.slice(0, 7)}</code>, vendored {source.vendoredOn}. Licence{' '}
      {source.licence} <a href={REACT_BITS_LICENCE_URL}>{REACT_BITS_LICENCE_URL}</a>.
      Mechanism: {mechanism} Source{' '}
      {source.files.map((file, index) => (
        <span key={file}>
          {index > 0 ? ', ' : ''}
          <a href={file}>{file.slice(file.lastIndexOf('/') + 1)}</a>
        </span>
      ))}
      . {controls}
    </>
  );
}

// The extra runtime line. Empty when the component needs no package.
export function ReactBitsRuntimeLine({ source }: { source: ReactBitsSource }) {
  if (source.runtime.length === 0) return null;
  return (
    <>
      Extra runtime{' '}
      {source.runtime.map((runtime, index) => (
        <span key={`${runtime.package}@${runtime.version}`}>
          {index > 0 ? '; ' : ''}
          <code>{runtime.package}</code> {runtime.version}, licence {runtime.licence},{' '}
          <a href={runtime.repo}>{runtime.repo}</a>. {runtime.why}
        </span>
      ))}
    </>
  );
}
