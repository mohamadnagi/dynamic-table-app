# Dynamic Table App

A production-ready Angular 18 application featuring a PrimeNG-powered dynamic table component. Built with standalone components, TypeScript strict mode, and optimized for maintainability, performance, and developer experience.

## �� Current Features

### ✅ **Implemented Features**

- **Dynamic Table Component** - Configuration-driven table with multiple column types
- **Column Management** - Show/hide columns with localStorage persistence
- **Data Operations** - Client-side pagination, sorting, and filtering
- **Row Selection** - Single and multi-row selection with bulk actions
- **Export Functionality** - CSV export with customizable data
- **Responsive Design** - Mobile-friendly with PrimeNG theming
- **Real API Integration** - Examples with JSONPlaceholder and REST Countries APIs
- **TypeScript Strict Mode** - Full type safety and strict compilation
- **Modern Architecture** - Standalone components with clean separation of concerns
- **Code Quality** - ESLint, Prettier, and Jest testing setup

### 🔧 **Technical Stack**

- **Angular 18** - Latest version with standalone components
- **PrimeNG 18** - UI component library with custom theming
- **TypeScript 5.4** - Strict mode with advanced type checking
- **RxJS 7+** - Reactive programming with signals
- **Jest** - Unit testing framework
- **ESLint + Prettier** - Code quality and formatting
- **Husky** - Git hooks for pre-commit validation

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Angular CLI 18+

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-table-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   pnpm start
   # or
   npm start
   ```

4. **Open in browser**
   ```
   http://localhost:4200
   ```

## 🎯 Usage

### Basic Implementation

```typescript
import { DynamicTableComponent } from './shared/dynamic-table/dynamic-table.component';
import { TableColumn, TableConfig, Row } from './models/table-column.model';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [DynamicTableComponent],
  template: `
    <app-dynamic-table
      [data]="data()"
      [columns]="columns()"
      [loading]="loading()"
      [total]="total()"
      [config]="tableConfig"
      (rowClick)="onRowClick($event)"
      (selectionChange)="onSelectionChange($event)"
      (search)="onSearch($event)"
      (filter)="onFilter($event)"
      (sort)="onSort($event)"
      (pageChange)="onPageChange($event)"
      (export)="onExport()"
      (reset)="onReset()"
    />
  `
})
export class ExampleComponent {
  data = signal<Row[]>([]);
  loading = signal<boolean>(false);
  total = signal<number>(0);
  
  columns = signal<TableColumn[]>([
    {
      key: 'id',
      header: 'ID',
      type: 'text',
      width: '80px',
      sortable: true,
      filterable: true,
      frozen: 'left'
    },
    {
      key: 'name',
      header: 'Name',
      type: 'text',
      width: '200px',
      sortable: true,
      filterable: true
    },
    {
      key: 'status',
      header: 'Status',
      type: 'badge',
      width: '120px',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' }
      ],
      badgeColorFn: (row) => row.status === 'active' ? 'success' : 'danger'
    }
  ]);

  tableConfig: TableConfig = {
    pageSizeOptions: [10, 25, 50, 100],
    enableSelection: true,
    enableColumnPicker: true,
    enableGlobalSearch: true,
    enableExport: true
  };

  // Event handlers
  onRowClick(row: Row) { /* Handle row click */ }
  onSelectionChange(selectedIds: string[]) { /* Handle selection */ }
  onSearch(searchTerm: string) { /* Handle search */ }
  onFilter(event: { column: string; value: any }) { /* Handle filter */ }
  onSort(event: { field: string; direction: 'asc' | 'desc' }) { /* Handle sort */ }
  onPageChange(event: { page: number; size: number }) { /* Handle pagination */ }
  onExport() { /* Handle export */ }
  onReset() { /* Handle reset */ }
}
```

### Column Types

#### 1. **Text Column**
```typescript
{
  key: 'title',
  header: 'Title',
  type: 'text',
  width: '300px',
  sortable: true,
  filterable: true
}
```

#### 2. **Number Column**
```typescript
{
  key: 'age',
  header: 'Age',
  type: 'number',
  width: '80px',
  sortable: true,
  filterable: true
}
```

#### 3. **Date Column**
```typescript
{
  key: 'createdAt',
  header: 'Created',
  type: 'date',
  width: '120px',
  sortable: true,
  filterable: true
}
```

#### 4. **Badge Column**
```typescript
{
  key: 'status',
  header: 'Status',
  type: 'badge',
  width: '120px',
  sortable: true,
  filterable: true,
  options: [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ],
  badgeColorFn: (row) => row.status === 'active' ? 'success' : 'danger'
}
```

#### 5. **Dropdown Filter Column**
```typescript
{
  key: 'category',
  header: 'Category',
  type: 'text',
  width: '150px',
  sortable: true,
  filterable: true,
  options: [
    { label: 'Technology', value: 'tech' },
    { label: 'Business', value: 'business' },
    { label: 'Design', value: 'design' }
  ]
}
```

### Table Configuration

```typescript
interface TableConfig {
  pageSizeOptions: number[];           // [10, 25, 50, 100]
  enableVirtualScroll?: boolean;       // Virtual scroll for large datasets
  enableSelection?: boolean;           // Row selection
  enableInlineEdit?: boolean;          // Inline editing
  enableColumnPicker?: boolean;        // Show/hide columns
  enableGlobalSearch?: boolean;        // Global search
  enableExport?: boolean;              // Export functionality
}
```

## 🎨 Examples

### 1. **Posts Management** (`/posts`)
- Real API integration with JSONPlaceholder
- Client-side filtering and pagination
- Multiple column types with badges
- Export functionality
- Row actions (View, Edit, Delete)

### 2. **Countries List** (`/countries`)
- REST Countries API integration
- Badge columns with color functions
- Search and filter capabilities
- Responsive design

### 3. **Users Management** (`/users`)
- Mock data implementation
- Selection and bulk actions
- Column picker demonstration

### 4. **Data Table Page** (`/`)
- Comprehensive demo page
- All features showcased
- Multiple column types

## ��️ Architecture

### Project Structure
