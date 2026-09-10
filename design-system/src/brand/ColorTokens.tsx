import { BRAND_COLORS, CONTRAST_PAIRS, REJECTED_COLORS } from './colors';
import { ContrastPairSample } from './ContrastPairSample';
import { contrastRatio, formatRatio, wcagAaLarge, wcagAaNormal } from './contrast';

export function ColorTokens() {
  return (
    <div className="brand-doc">
      <p>
        Neutrals at rest. Blue <code>#0035B1</code> on hover and{' '}
        <code>:focus-visible</code>, with white type. Yellow <code>#DEF54F</code> on
        press <code>:active</code> and confirmed success, with ink type.
      </p>
      <div className="brand-swatches">
        {BRAND_COLORS.map((token) => (
          <article className="brand-swatch" key={token.name}>
            <div
              className="brand-swatch__chip"
              data-token={token.name}
              style={{ background: `var(${token.name})` }}
            />
            <div className="brand-swatch__meta">
              <strong>{token.role}</strong>
              <code>{token.hex}</code>
              <code>{token.name}</code>
              <p>{token.usage}</p>
            </div>
          </article>
        ))}
      </div>
      <h2>Contrast pairs</h2>
      <p>
        Ratios use WCAG 2.2 relative luminance. Level AA needs 4.5:1 for normal
        text and 3:1 for large text.
      </p>
      <table className="brand-table">
        <thead>
          <tr>
            <th>Pair</th>
            <th>Role</th>
            <th>Ratio</th>
            <th>AA normal</th>
            <th>AA large</th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((pair) => {
            const ratio = contrastRatio(pair.foregroundHex, pair.backgroundHex);
            const aaNormal = wcagAaNormal(ratio);
            const aaLarge = wcagAaLarge(ratio);
            return (
              <tr key={`${pair.foreground}-${pair.background}-${pair.role}`}>
                <td>
                  <ContrastPairSample
                    foreground={pair.foreground}
                    foregroundHex={pair.foregroundHex}
                    background={pair.background}
                    backgroundHex={pair.backgroundHex}
                    bodyText={pair.bodyText}
                    ratio={ratio}
                  />
                </td>
                <td>{pair.role}</td>
                <td>{formatRatio(ratio)}</td>
                <td>
                  {pair.bodyText
                    ? aaNormal
                      ? 'Pass'
                      : 'Fail'
                    : aaNormal
                      ? 'Pass, not body text'
                      : 'Fail as text. Not body text.'}
                </td>
                <td>{aaLarge ? 'Pass' : 'Fail'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <h2>Rejected lookalikes</h2>
      <p>Do not select these again. They are not the locked accent pair.</p>
      <table className="brand-table">
        <thead>
          <tr>
            <th>Hex</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {REJECTED_COLORS.map((color) => (
            <tr key={color.hex}>
              <td>
                <code>{color.hex}</code>
              </td>
              <td>{color.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Photographs</h2>
      <p>
        Photographs stay in full color. Use <code>filter: none</code> and{' '}
        <code>mix-blend-mode: normal</code>. Never grayscale.
      </p>
    </div>
  );
}
