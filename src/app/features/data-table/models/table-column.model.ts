export interface TableColumn {
  key: string;
  header: string;
  type?: 'text' | 'number' | 'date' | 'badge' | 'template';
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  frozen?: 'left' | 'right';
  hidden?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  options?: Array<{ label: string; value: any }>;
  badgeColorFn?: (row: any) => string;
  template?: string;
}

export interface TableQuery {
  page: number;
  size: number;
  sorts: Array<{ field: string; dir: 'asc' | 'desc' }>;
  global?: string;
  filters?: Record<string, string | number | { op: string; value: any }>;
}

export interface TableResult<T> {
  data: T[];
  total: number;
  page?: number;
  size?: number;
  totalPages?: number;
}

export interface Row {
  id: string;
  [key: string]: any;
}

export interface TableState {
  query: TableQuery;
  loading: boolean;
  error: string | null;
  rows: Row[];
  total: number;
  selection: string[];
  columns: TableColumn[];
}

export interface TableConfig {
  endpoint: string;
  pageSizeOptions?: number[];
  enableVirtualScroll?: boolean;
  enableSelection?: boolean;
  enableInlineEdit?: boolean;
  enableColumnPicker?: boolean;
  enableGlobalSearch?: boolean;
  enableExport?: boolean;
}
