import { RUNTIME_ROWS } from './registry';

import './react-bits-docs.css';

// The React Bits/Runtime table. One row per package and version.
export function RuntimeTable() {
  if (RUNTIME_ROWS.length === 0) {
    return (
      <p className="rb-docs__summary">No built component needs a runtime package yet.</p>
    );
  }
  return (
    <div className="rb-docs">
      <table className="rb-docs__table">
        <thead>
          <tr>
            <th scope="col">Package</th>
            <th scope="col">Version</th>
            <th scope="col">Licence</th>
            <th scope="col">Unpacked size</th>
            <th scope="col">Components that need it</th>
            <th scope="col">Why</th>
          </tr>
        </thead>
        <tbody>
          {RUNTIME_ROWS.map((row) => (
            <tr key={`${row.package}@${row.version}`}>
              <td>
                <a href={row.repo}>
                  <code>{row.package}</code>
                </a>
              </td>
              <td>{row.version}</td>
              <td>{row.licence}</td>
              <td>{row.unpackedKb.toLocaleString('en-GB')} KB</td>
              <td>{row.components.join(', ')}</td>
              <td>{row.whys.join(' ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
