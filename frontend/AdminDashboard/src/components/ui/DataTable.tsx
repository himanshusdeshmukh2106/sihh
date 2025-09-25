import React, { useState, useMemo } from 'react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';
import { Button, Input } from './';
import { cn } from '../../utils/cn';

export interface Column<T = any> {
  key: string;
  title: string;
  dataIndex?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  fixed?: 'left' | 'right';
}

export interface DataTableProps<T = any> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    showSizeChanger?: boolean;
    pageSizeOptions?: number[];
    onChange?: (page: number, pageSize: number) => void;
  };
  rowSelection?: {
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean };
  };
  onRow?: (record: T, index: number) => {
    onClick?: (event: React.MouseEvent) => void;
    onDoubleClick?: (event: React.MouseEvent) => void;
    className?: string;
  };
  scroll?: { x?: number | string; y?: number | string };
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  showHeader?: boolean;
  title?: () => React.ReactNode;
  footer?: () => React.ReactNode;
  expandable?: {
    expandedRowRender?: (record: T, index: number) => React.ReactNode;
    expandedRowKeys?: React.Key[];
    onExpand?: (expanded: boolean, record: T) => void;
  };
  className?: string;
  rowKey?: string | ((record: T) => React.Key);
  locale?: {
    emptyText?: React.ReactNode;
  };
}

interface SortState {
  key: string;
  direction: 'asc' | 'desc' | null;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  pagination,
  rowSelection,
  onRow,
  scroll,
  size = 'middle',
  bordered = false,
  showHeader = true,
  title,
  footer,
  expandable,
  className,
  rowKey = 'id',
  locale = { emptyText: 'No data' }
}: DataTableProps<T>) {
  const [sortState, setSortState] = useState<SortState>({ key: '', direction: null });
  const [searchText, setSearchText] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(
    expandable?.expandedRowKeys || []
  );

  // Get row key
  const getRowKey = (record: T, index: number): React.Key => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  // Handle sorting
  const handleSort = (key: string) => {
    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortState.key === key) {
      if (sortState.direction === 'asc') {
        direction = 'desc';
      } else if (sortState.direction === 'desc') {
        direction = null;
      }
    }

    setSortState({ key: direction ? key : '', direction });
  };

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.direction) return data;

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = column.dataIndex ? a[column.dataIndex] : a[sortState.key];
      const bValue = column.dataIndex ? b[column.dataIndex] : b[sortState.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const result = aValue.localeCompare(bValue);
        return sortState.direction === 'asc' ? result : -result;
      }

      if (aValue < bValue) return sortState.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortState.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortState, columns]);

  // Filter data by search
  const filteredData = useMemo(() => {
    if (!searchText) return sortedData;

    return sortedData.filter(record =>
      columns.some(column => {
        if (!column.filterable) return false;
        const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
        return String(value || '').toLowerCase().includes(searchText.toLowerCase());
      })
    );
  }, [sortedData, searchText, columns]);

  // Handle row selection
  const handleSelectAll = (checked: boolean) => {
    if (!rowSelection?.onChange) return;

    if (checked) {
      const allKeys = filteredData.map((record, index) => getRowKey(record, index));
      rowSelection.onChange(allKeys, filteredData);
    } else {
      rowSelection.onChange([], []);
    }
  };

  const handleSelectRow = (record: T, index: number, checked: boolean) => {
    if (!rowSelection?.onChange) return;

    const key = getRowKey(record, index);
    const selectedKeys = rowSelection.selectedRowKeys || [];

    let newSelectedKeys: React.Key[];
    let newSelectedRows: T[];

    if (checked) {
      newSelectedKeys = [...selectedKeys, key];
      newSelectedRows = filteredData.filter((item, idx) =>
        newSelectedKeys.includes(getRowKey(item, idx))
      );
    } else {
      newSelectedKeys = selectedKeys.filter(k => k !== key);
      newSelectedRows = filteredData.filter((item, idx) =>
        newSelectedKeys.includes(getRowKey(item, idx))
      );
    }

    rowSelection.onChange(newSelectedKeys, newSelectedRows);
  };

  // Handle row expansion
  const handleExpand = (record: T, index: number) => {
    if (!expandable?.onExpand) return;

    const key = getRowKey(record, index);
    const expanded = expandedKeys.includes(key);
    
    if (expanded) {
      setExpandedKeys(expandedKeys.filter(k => k !== key));
    } else {
      setExpandedKeys([...expandedKeys, key]);
    }

    expandable.onExpand(!expanded, record);
  };

  // Pagination
  const paginatedData = useMemo(() => {
    if (!pagination) return filteredData;

    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, pagination]);

  const sizeClasses = {
    small: 'text-xs',
    middle: 'text-sm',
    large: 'text-base'
  };

  const hasSelection = rowSelection && rowSelection.selectedRowKeys;
  const selectedCount = hasSelection ? rowSelection.selectedRowKeys!.length : 0;
  const isAllSelected = hasSelection && selectedCount === filteredData.length && filteredData.length > 0;
  const isIndeterminate = hasSelection && selectedCount > 0 && selectedCount < filteredData.length;

  return (
    <div className={cn('bg-white rounded-lg border border-neutral-200', className)}>
      {/* Header */}
      {(title || hasSelection || columns.some(col => col.filterable)) && (
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {title && <div>{title()}</div>}
              {hasSelection && selectedCount > 0 && (
                <div className="text-sm text-neutral-600">
                  {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                </div>
              )}
            </div>
            
            {columns.some(col => col.filterable) && (
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Search..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
                  className="w-64"
                />
                <Button variant="ghost" size="sm">
                  <AdjustmentsHorizontalIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table */}
      <div className={cn('overflow-auto', scroll?.x && 'min-w-full')}>
        <table className="w-full">
          {showHeader && (
            <thead className="bg-neutral-50">
              <tr>
                {rowSelection && (
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isIndeterminate || false;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                  </th>
                )}
                {expandable && (
                  <th className="w-12 px-4 py-3"></th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      'px-4 py-3 font-medium text-neutral-900',
                      sizeClasses[size],
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      column.sortable && 'cursor-pointer hover:bg-neutral-100',
                      bordered && 'border-r border-neutral-200 last:border-r-0'
                    )}
                    style={{ width: column.width }}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.title}</span>
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUpIcon
                            className={cn(
                              'w-3 h-3',
                              sortState.key === column.key && sortState.direction === 'asc'
                                ? 'text-primary-600'
                                : 'text-neutral-400'
                            )}
                          />
                          <ChevronDownIcon
                            className={cn(
                              'w-3 h-3 -mt-1',
                              sortState.key === column.key && sortState.direction === 'desc'
                                ? 'text-primary-600'
                                : 'text-neutral-400'
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (rowSelection ? 1 : 0) +
                    (expandable ? 1 : 0)
                  }
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  Loading...
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (rowSelection ? 1 : 0) +
                    (expandable ? 1 : 0)
                  }
                  className="px-4 py-8 text-center text-neutral-500"
                >
                  {locale.emptyText}
                </td>
              </tr>
            ) : (
              paginatedData.map((record, index) => {
                const key = getRowKey(record, index);
                const isSelected = hasSelection && rowSelection.selectedRowKeys!.includes(key);
                const isExpanded = expandedKeys.includes(key);
                const rowProps = onRow?.(record, index) || {};

                return (
                  <React.Fragment key={key}>
                    <tr
                      className={cn(
                        'hover:bg-neutral-50 transition-colors',
                        isSelected && 'bg-primary-50',
                        bordered && 'border-b border-neutral-200',
                        rowProps.className
                      )}
                      onClick={rowProps.onClick}
                      onDoubleClick={rowProps.onDoubleClick}
                    >
                      {rowSelection && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => handleSelectRow(record, index, e.target.checked)}
                            disabled={rowSelection.getCheckboxProps?.(record)?.disabled}
                            className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                      )}
                      {expandable && (
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExpand(record, index)}
                          >
                            {isExpanded ? (
                              <ChevronDownIcon className="w-4 h-4" />
                            ) : (
                              <ChevronRightIcon className="w-4 h-4" />
                            )}
                          </Button>
                        </td>
                      )}
                      {columns.map((column) => {
                        const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
                        const content = column.render ? column.render(value, record, index) : value;

                        return (
                          <td
                            key={column.key}
                            className={cn(
                              'px-4 py-3',
                              sizeClasses[size],
                              column.align === 'center' && 'text-center',
                              column.align === 'right' && 'text-right',
                              bordered && 'border-r border-neutral-200 last:border-r-0'
                            )}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                    {expandable && isExpanded && expandable.expandedRowRender && (
                      <tr>
                        <td
                          colSpan={
                            columns.length +
                            (rowSelection ? 1 : 0) +
                            (expandable ? 1 : 0)
                          }
                          className="px-4 py-3 bg-neutral-50"
                        >
                          {expandable.expandedRowRender(record, index)}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            Showing {Math.min((pagination.current - 1) * pagination.pageSize + 1, pagination.total)} to{' '}
            {Math.min(pagination.current * pagination.pageSize, pagination.total)} of {pagination.total} results
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.current <= 1}
              onClick={() => pagination.onChange?.(pagination.current - 1, pagination.pageSize)}
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            
            <span className="text-sm text-neutral-600">
              Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              onClick={() => pagination.onChange?.(pagination.current + 1, pagination.pageSize)}
            >
              <ChevronRightIcon className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Footer */}
      {footer && (
        <div className="p-4 border-t border-neutral-200">
          {footer()}
        </div>
      )}
    </div>
  );
}