import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

import { useWindow } from "../contexts/WindowContext";

export interface Column {
  key: string;
  header: string;
  width?: number;
  render?: (
    row: Record<string, React.ReactNode>,
    index?: number,
  ) => React.ReactNode;
}

export type Row = Record<string, React.ReactNode>;

interface TableViewProps {
  columns: Column[];
  data: Row[];
  style?: React.CSSProperties;
  onRowSelect?: (index: number) => void;
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
  const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>(
    {},
  );
  const [resizing, setResizing] = useState<{
    key: string;
    startX: number;
    initialWidth: number;
    cursorOffset: number;
  } | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  } | null>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const { currentWindow } = useWindow();

  const sortedData = useMemo(() => {
    const dataCopy = [...data];

    if (sortConfig !== null) {
      dataCopy.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }

        return 0;
      });
    }

    return dataCopy;
  }, [data, sortConfig]);

  const indexMap = useMemo(() => {
    return new Map<Row, number>(data.map((row, index) => [row, index]));
  }, [data]);

  const handleRowSelect = useCallback(
    (sortedDataIndex: number) => {
      const originalIndex = indexMap.get(sortedData[sortedDataIndex]);

      if (onRowSelect && typeof originalIndex === "number") {
        onRowSelect(originalIndex);
      }

      setSelectedRowIndex(sortedDataIndex);
    },
    [indexMap, onRowSelect, sortedData],
  );

  const handleSort = (columnKey: string) => {
    setSortConfig((currentSort) => ({
      key: columnKey,
      direction:
        currentSort?.key === columnKey && currentSort?.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!sortedData.length) {
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (selectedRowIndex === null) {
            handleRowSelect(0);
          } else if (selectedRowIndex < sortedData.length - 1) {
            handleRowSelect(selectedRowIndex + 1);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (selectedRowIndex === null) {
            handleRowSelect(sortedData.length - 1);
          } else if (selectedRowIndex > 0) {
            handleRowSelect(selectedRowIndex - 1);
          }
          break;
        case "Escape":
          setSelectedRowIndex(null);
          break;
      }
    },
    [handleRowSelect, selectedRowIndex, sortedData],
  );

  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.focus();
    }

    currentWindow.addEventListener("keydown", handleKeyDown);

    return () => {
      currentWindow.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentWindow, handleKeyDown]);

  useEffect(() => {
    if (typeof initialSelectedIndex !== "number") {
      return;
    }

    const initialRow = data[initialSelectedIndex];

    if (!initialRow) {
      setSelectedRowIndex(null);
      return;
    }

    const sortedIndex = sortedData.findIndex((row) => row === initialRow);
    setSelectedRowIndex(sortedIndex >= 0 ? sortedIndex : null);
  }, [data, initialSelectedIndex, sortedData]);

  const handleResizeStart = (e: React.MouseEvent, columnKey: string) => {
    e.preventDefault();
    const resizeHandle = e.currentTarget as HTMLElement;
    const handleRect = resizeHandle.getBoundingClientRect();
    const cursorOffset = e.clientX - handleRect.left;

    setResizing({
      key: columnKey,
      startX: e.clientX,
      initialWidth: columnWidths[columnKey] || 50,
      cursorOffset,
    });
  };

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!resizing) {
        return;
      }

      const deltaX =
        e.clientX -
        resizing.cursorOffset -
        (resizing.startX - resizing.cursorOffset);
      const newWidth = Math.max(50, resizing.initialWidth + deltaX);

      setColumnWidths((prev) => ({
        ...prev,
        [resizing.key]: newWidth,
      }));
    },
    [resizing],
  );

  const handleResizeEnd = useCallback(() => {
    setResizing(null);
  }, []);

  useEffect(() => {
    if (!resizing) {
      return;
    }

    currentWindow.document.addEventListener("mousemove", handleResizeMove);
    currentWindow.document.addEventListener("mouseup", handleResizeEnd);

    return () => {
      currentWindow.document.removeEventListener("mousemove", handleResizeMove);
      currentWindow.document.removeEventListener("mouseup", handleResizeEnd);
    };
  }, [currentWindow, handleResizeEnd, handleResizeMove, resizing]);

  const getColumnWidth = (column: Column) => {
    if (columnWidths[column.key]) {
      return { width: `${columnWidths[column.key]}px` };
    }

    if (column.width !== undefined) {
      return { width: `${column.width}px` };
    }

    return { width: "auto" };
  };

  return (
    <div
      className="sunken-panel app-table-frame"
      style={{ ...style, outline: "none" }}
      ref={tableRef}
      tabIndex={0}
    >
      <table className="interactive app-table" role="grid">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="app-table-header-cell"
                aria-sort={
                  sortConfig?.key === column.key
                    ? sortConfig.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
                style={{
                  ...getColumnWidth(column),
                  position: "relative",
                }}
                onClick={() => handleSort(column.key)}
              >
                <span className="app-table-header-content">
                  <span>{column.header}</span>
                  {sortConfig?.key === column.key && (
                    <span className="app-table-sort-indicator" aria-hidden="true">
                      {sortConfig.direction === "asc" ? "^" : "v"}
                    </span>
                  )}
                </span>
                <div
                  className="app-table-resize-handle"
                  style={{
                    backgroundColor:
                      resizing?.key === column.key ? "#666" : "transparent",
                  }}
                  onMouseDown={(e) => handleResizeStart(e, column.key)}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={selectedRowIndex === rowIndex ? "highlighted" : ""}
              aria-selected={selectedRowIndex === rowIndex}
              onClick={() => handleRowSelect(rowIndex)}
            >
              {columns.map((column) => (
                <td
                  className="app-table-cell"
                  key={`${rowIndex}-${column.key}`}
                  style={getColumnWidth(column)}
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
