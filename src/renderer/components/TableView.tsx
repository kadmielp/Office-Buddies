import React, { useState, useEffect, useRef } from 'react';
import { useWindow } from '../contexts/WindowContext';

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
  const tableRef = useRef<HTMLDivElement>(null);
  const { currentWindow } = useWindow();

  const handleRowClick = (index: number) => {
    setSelectedRowIndex(selectedRowIndex === index ? null : index);
    if (onRowSelect) {
      onRowSelect(data[index], index);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!data.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (selectedRowIndex === null) {
          // Select first row if nothing is selected
          setSelectedRowIndex(0);
          if (onRowSelect) onRowSelect(data[0], 0);
        } else if (selectedRowIndex < data.length - 1) {
          // Move to next row
          const newIndex = selectedRowIndex + 1;
          setSelectedRowIndex(newIndex);
          if (onRowSelect) onRowSelect(data[newIndex], newIndex);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (selectedRowIndex === null) {
          // Select last row if nothing is selected
          const lastIndex = data.length - 1;
          setSelectedRowIndex(lastIndex);
          if (onRowSelect) onRowSelect(data[lastIndex], lastIndex);
        } else if (selectedRowIndex > 0) {
          // Move to previous row
          const newIndex = selectedRowIndex - 1;
          setSelectedRowIndex(newIndex);
          if (onRowSelect) onRowSelect(data[newIndex], newIndex);
        }
        break;
      case 'Enter':
        if (selectedRowIndex !== null) {
          // Toggle selection on Enter
          handleRowClick(selectedRowIndex);
        }
        break;
      case 'Escape':
        // Clear selection
        setSelectedRowIndex(null);
        break;
    }
  };

  useEffect(() => {
    // Focus the table container to enable keyboard navigation
    if (tableRef.current) {
      tableRef.current.focus();
    }

    // Add event listener for keyboard navigation
    currentWindow.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      currentWindow.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedRowIndex, data, onRowSelect]);

  return (
    <div
      className="sunken-panel"
      style={{ ...style, outline: 'none' }}
      ref={tableRef}
      tabIndex={0}
    >
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
