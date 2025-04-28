import React, { useState } from 'react';

interface Column {
  key: string;
  header: string;
}

interface TableViewProps {
  columns: Column[];
  data: Record<string, React.ReactNode>[];
  style?: React.CSSProperties;
  onRowSelect?: (row: Record<string, React.ReactNode>, index: number) => void;
}

export const TableView: React.FC<TableViewProps> = ({
  columns,
  data,
  onRowSelect,
  style,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
    if (onRowSelect) {
      onRowSelect(data[index], index);
    }
  };

  return (
    <div className="sunken-panel" style={style}>
      <table className="interactive" style={{ width: '100%', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} style={{ width: `${100 / columns.length}%` }}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={selectedRowIndex === rowIndex ? 'highlighted' : ''}
              onClick={() => handleRowClick(rowIndex)}
            >
              {columns.map((column) => (
                <td key={`${rowIndex}-${column.key}`}>{row[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
