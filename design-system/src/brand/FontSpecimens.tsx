const SANS = '"Brand Sans", sans-serif';
const SCRIPT = '"Brand Script", cursive';

const SANS_REGULAR_SIZES = ['14px', '16px', '20px'] as const;
const SANS_BOLD_SIZES = ['12px', '24px', '32px', '48px', '88px', '176px'] as const;
const SCRIPT_SIZES = ['16px', '20px', '24px', '72px'] as const;

function SpecimenLines({
  sizes,
  text,
  face,
}: {
  sizes: readonly string[];
  text: string;
  face: string;
}) {
  return (
    <>
      {sizes.map((size) => (
        <p key={size} data-specimen-line={face} data-specimen-size={size} style={{ fontSize: size }}>
          {size} {text}
        </p>
      ))}
    </>
  );
}

export function FontSpecimens() {
  return (
    <div className="brand-doc">
      <p>
        Brand Sans is the interface typeface at 400 and 700. Brand Script 400
        appears only in the wordmark script. Both are aliases bound in
        tokens.css; REBRAND.md explains how to rebind them.
      </p>
      <table className="brand-table">
        <thead>
          <tr>
            <th>Face</th>
            <th>Shipped as</th>
            <th>Weight</th>
            <th>File</th>
            <th>Licence</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Brand Sans Regular</td>
            <td>Uncomfortable Sans Regular</td>
            <td>400</td>
            <td>
              <code>/fonts/brand-sans-400.woff2</code>
            </td>
            <td>
              SIL Open Font License 1.1. Full text:{' '}
              <a href="/fonts/brand-sans-OFL.txt">/fonts/brand-sans-OFL.txt</a>
            </td>
          </tr>
          <tr>
            <td>Brand Sans Bold</td>
            <td>Uncomfortable Sans Bold</td>
            <td>700</td>
            <td>
              <code>/fonts/brand-sans-700.woff2</code>
            </td>
            <td>
              SIL Open Font License 1.1. Full text:{' '}
              <a href="/fonts/brand-sans-OFL.txt">/fonts/brand-sans-OFL.txt</a>
            </td>
          </tr>
          <tr>
            <td>Brand Script Regular</td>
            <td>Nothing You Could Do</td>
            <td>400</td>
            <td>
              <code>/fonts/brand-script-400.woff2</code>
            </td>
            <td>
              SIL Open Font License 1.1. Copyright (c) 2010, Kimberly Geswein.
              Full text:{' '}
              <a href="/fonts/brand-script-OFL.txt">/fonts/brand-script-OFL.txt</a>
            </td>
          </tr>
        </tbody>
      </table>
      <h2>Brand Sans Regular 400</h2>
      <p className="brand-font-face">Alias: Brand Sans 400</p>
      <div className="brand-font-sample" style={{ fontFamily: SANS, fontWeight: 400 }}>
        <SpecimenLines
          sizes={SANS_REGULAR_SIZES}
          text="Complete the current week before the next lesson opens."
          face="sans-regular"
        />
      </div>
      <h2>Brand Sans Bold 700</h2>
      <p className="brand-font-face">Alias: Brand Sans 700</p>
      <div className="brand-font-sample" style={{ fontFamily: SANS, fontWeight: 700 }}>
        <SpecimenLines sizes={SANS_BOLD_SIZES} text="Find the edge." face="sans-bold" />
      </div>
      <h2>Brand Script Regular 400</h2>
      <p className="brand-font-face">Alias: Brand Script 400</p>
      <div className="brand-font-sample" style={{ fontFamily: SCRIPT, fontWeight: 400 }}>
        <SpecimenLines sizes={SCRIPT_SIZES} text="Academy" face="script" />
      </div>
    </div>
  );
}
