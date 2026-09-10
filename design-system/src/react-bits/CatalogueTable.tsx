import {
  CATALOGUE_TOTAL,
  REACT_BITS_SHA,
  SECTIONS,
} from './catalogue';
import {
  BUILT_TOTAL,
  CATALOGUE_ROWS,
  PLANNED_TOTAL,
  storyHref,
} from './registry';

import './react-bits-docs.css';

// The React Bits/Overview table. Built rows link to their Default story.
// Planned rows show the upstream page only.
export function CatalogueTable() {
  return (
    <div className="rb-docs">
      <p className="rb-docs__summary" data-testid="rb-catalogue-summary">
        Built {BUILT_TOTAL} of {CATALOGUE_TOTAL}. Planned {PLANNED_TOTAL}.
        Upstream commit <code>{REACT_BITS_SHA.slice(0, 7)}</code>.
      </p>
      {SECTIONS.map(({ section, label }) => {
        const rows = CATALOGUE_ROWS.filter((row) => row.section === section);
        const built = rows.filter((row) => row.built).length;
        return (
          <section key={section} className="rb-docs__section">
            <h2 className="rb-docs__heading">
              {label} <span className="rb-docs__count">{built} of {rows.length}</span>
            </h2>
            <table className="rb-docs__table">
              <thead>
                <tr>
                  <th scope="col">Component</th>
                  <th scope="col">Status</th>
                  <th scope="col">Licence</th>
                  <th scope="col">Runtime packages</th>
                  <th scope="col">Vendored commit</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.name} data-status={row.built ? 'built' : 'planned'}>
                    <td>
                      <a href={row.page}>{row.title}</a>
                    </td>
                    <td>
                      {row.built ? (
                        <a href={storyHref(row.storyId)} target="_top">
                          {row.storyTitle}
                        </a>
                      ) : (
                        'planned'
                      )}
                    </td>
                    <td>{row.built ? row.built.licence : ''}</td>
                    <td>
                      {row.built
                        ? row.built.runtime.length === 0
                          ? 'none'
                          : row.built.runtime
                              .map((r) => `${r.package} ${r.version}`)
                              .join(', ')
                        : ''}
                    </td>
                    <td>
                      {row.built ? (
                        <code title={row.built.sha}>
                          {row.built.sha.slice(0, 7)} on {row.built.vendoredOn}
                        </code>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}
