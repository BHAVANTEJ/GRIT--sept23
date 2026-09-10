import React from 'react';

export interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  emptyMessage: string;
  getKey: (row: T) => string;
}

/**
 * Small shared table for the admin tabs.
 * Wrapped in its own horizontal scroll container so a wide table never makes
 * the page itself scroll sideways on mobile.
 */
export function AdminTable<T>({ rows, columns, emptyMessage, getKey }: AdminTableProps<T>) {
  if (rows.length === 0) {
    return (
      <div
        style={{
          border: '1px dashed var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 1.5rem',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '0.95rem',
          backgroundColor: 'var(--color-bg-alt)',
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.header}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={getKey(row)}>
              {columns.map((col) => (
                <td key={col.header}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
