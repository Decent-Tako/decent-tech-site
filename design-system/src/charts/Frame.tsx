import type { ReactNode } from 'react';
import { useId } from 'react';

export function ChartFrame({
  title,
  caption,
  note,
  table,
  children,
}: {
  title: string;
  caption: string;
  note: string;
  table?: ReactNode;
  children: ReactNode;
}) {
  const titleId = useId();

  return (
    <div className="chart-root">
      <p className="chart-note">{note}</p>
      <figure className="chart-figure" aria-labelledby={titleId}>
        <figcaption className="chart-caption">
          <strong id={titleId}>{title}</strong>
          <span>{caption}</span>
        </figcaption>
        {children}
        {table}
      </figure>
    </div>
  );
}

export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: { key: string; header: string }[];
  rows: Array<Record<string, string | number | boolean>>;
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <table className="chart-table">
      <caption>{caption}</caption>
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column.key} scope="col">
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row[columns[0].key])}>
            {columns.map((column) => (
              <td key={column.key}>{String(row[column.key])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
