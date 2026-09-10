import { ContrastPairSample } from '../brand/ContrastPairSample';
import {
  contrastRatio,
  formatRatio,
  wcagAaLarge,
  wcagAaNormal,
} from '../brand/contrast';
import { PROSE_CONTRAST_PAIRS } from './pairs';

export function ContrastReport() {
  return (
    <div className="brand-doc">
      <p>
        Prose uses issue 231 tokens only. Body and headings are Brand Sans. Links
        rest on blue <code>#0035B1</code>. Hover and <code>:focus-visible</code>{' '}
        put white type on blue. Press <code>:active</code> puts ink on yellow{' '}
        <code>#DEF54F</code>. Quiet <code>#A6A6A6</code> is not a prose text
        color.
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
          {PROSE_CONTRAST_PAIRS.map((pair) => {
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
    </div>
  );
}
