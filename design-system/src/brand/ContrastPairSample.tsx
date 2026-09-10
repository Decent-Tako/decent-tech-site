import { formatRatio } from './contrast';

export function ContrastPairSample({
  foreground,
  foregroundHex,
  background,
  backgroundHex,
  bodyText,
  ratio,
}: {
  foreground: string;
  foregroundHex: string;
  background: string;
  backgroundHex: string;
  bodyText: boolean;
  ratio: number;
}) {
  const sample = `${foregroundHex} on ${backgroundHex}`;
  const style = {
    color: `var(${foreground})`,
    background: `var(${background})`,
  };

  if (bodyText) {
    return (
      <span className="brand-pair" style={style}>
        {sample}
      </span>
    );
  }

  // Evidence swatch: these tokens fail as body text on purpose.
  // axe still checks role=img text, so preview excludes .brand-pair--evidence.
  return (
    <span
      className="brand-pair brand-pair--evidence"
      role="img"
      aria-label={`${sample}. Contrast ${formatRatio(ratio)}. Evidence swatch, not body text.`}
      style={style}
    >
      {sample}
    </span>
  );
}
