import React, { useState, useEffect, useRef } from "react";
import { useWindow } from "../contexts/WindowContext";

interface Column {
  key: string;
  header: string;
  width?: number;
  render?: (
    row: Record<string, React.ReactNode>,
    index?: number,
  ) => React.ReactNode;
}

interface TableViewProps {
  columns: Column[];
  data: Record<string, React.ReactNode>[];
  style?: React.CSSProperties;
  onRowSelect?: (row: Record<string, React.ReactNode>, index: number) => void;
  initialSelectedIndex?: number;
}

export const TableView: React.FC<TableViewProps> = ({
  columns,
  data,
  onRowSelect,
  style,
  initialSelectedIndex,
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(
    initialSelectedIndex ?? null,
  );
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
  const [resizing, setResizing] = useState<{ key: string; startX: number; initialWidth: number; cursorOffset: number } | null>(null);
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
      case "ArrowDown":
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
      case "ArrowUp":
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
      case "Enter":
        if (selectedRowIndex !== null) {
          // Toggle selection on Enter
          handleRowClick(selectedRowIndex);
        }
        break;
      case "Escape":
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
    currentWindow.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      currentWindow.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedRowIndex, data, onRowSelect]);

  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    const resizeHandle = e.currentTarget as HTMLElement;
    const handleRect = resizeHandle.getBoundingClientRect();
    const cursorOffset = e.clientX - handleRect.left;
    
    setResizing({ 
      key: columnKey, 
      startX: e.clientX,
      initialWidth: columnWidths[columnKey] || 50,
      cursorOffset
    });
  };

  const handleResizeMove = (e: MouseEvent) => {
    if (!resizing) return;

    const deltaX = (e.clientX - resizing.cursorOffset) - (resizing.startX - resizing.cursorOffset);
    const newWidth = Math.max(50, resizing.initialWidth + deltaX);

    setColumnWidths(prev => ({
      ...prev,
      [resizing.key]: newWidth
    }));
  };

  const handleResizeEnd = () => {
    setResizing(null);
  };

  useEffect(() => {
    if (resizing) {
      currentWindow.document.addEventListener('mousemove', handleResizeMove);
      currentWindow.document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        currentWindow.document.removeEventListener('mousemove', handleResizeMove);
        currentWindow.document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [resizing]);

  const getColumnWidth = (column: Column, index: number) => {
    if (columnWidths[column.key]) {
      return { width: `${columnWidths[column.key]}px` };
    }
    if (column.width !== undefined) {
      return { width: `${column.width}px` };
    }
    return { width: 'auto' };
  };

  return (
    <div
      className="sunken-panel"
      style={{ ...style, outline: "none" }}
      ref={tableRef}
      tabIndex={0}
    >
      <table
        className="interactive"
        style={{ width: "100%", tableLayout: "fixed" }}
      >
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={column.key} 
                style={{
                  ...getColumnWidth(column, index),
                  position: 'relative',
                  userSelect: 'none'
                }}
              >
                {column.header}
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    cursor: 'col-resize',
                    backgroundColor: resizing?.key === column.key ? '#666' : 'transparent'
                  }}
                  onMouseDown={(e) => handleResizeStart(e, column.key)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={selectedRowIndex === rowIndex ? "highlighted" : ""}
              onClick={() => handleRowClick(rowIndex)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={`${rowIndex}-${column.key}`}
                  style={getColumnWidth(column, colIndex)}
                >
                  {column.render
                    ? column.render(row, rowIndex)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
