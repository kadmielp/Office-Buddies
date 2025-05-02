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

  // Calculate column widths
  const calculateColumnWidths = () => {
    const flexibleColumnsCount = columns.filter(
      (col) => col.width === undefined,
    ).length;

    return columns.map((column) => {
      if (column.width !== undefined) {
        // Fixed width columns use their specified width
        return { width: `${column.width}px` };
      } else if (flexibleColumnsCount > 0) {
        // Flexible columns share the remaining space equally
        return { width: flexibleColumnsCount > 0 ? "auto" : "100%" };
      }
      return {};
    });
  };

  const columnWidths = calculateColumnWidths();

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
              <th key={column.key} style={columnWidths[index]}>
                {column.header}
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
                  style={columnWidths[colIndex]}
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
