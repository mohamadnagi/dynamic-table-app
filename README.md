# Dynamic Table App

A production-ready Angular 18 application featuring a PrimeNG-powered dynamic table with server-side data management, column customization, and advanced filtering capabilities.

## 🚀 Features

- **Dynamic Table Component** with configurable columns and behaviors
- **Server-side Data Management** with pagination, sorting, and filtering
- **Column Management** with show/hide, reorder, and resize capabilities
- **Global Search** with debounced input
- **Row Selection** (single and multi-select)
- **Export Functionality** (CSV export)
- **Responsive Design** with mobile-friendly interface
- **Accessibility** with proper ARIA labels and keyboard navigation
- **TypeScript Strict Mode** for type safety
- **Comprehensive Testing** with Jest
- **Code Quality** with ESLint, Prettier, and Husky pre-commit hooks

## 🏗️ Architecture

The application follows clean architecture principles with clear separation of concerns:

```
src/app/
├── core/                    # Singleton services and infrastructure
│   ├── services/           # Core services (config, logger)
│   ├── interceptors/       # HTTP interceptors
│   ├── guards/             # Route guards
│   └── tokens/             # Dependency injection tokens
├── shared/                 # Reusable UI components and utilities
│   ├── components/         # Shared UI components
│   ├── pipes/              # Custom pipes
│   ├── validators/         # Form validators
│   └── models/             # Shared models
└── features/
    └── data-table/         # Data table feature module
        ├── components/     # Feature-specific components
        ├── services/       # Business logic services
        ├── models/         # Feature-specific models
        ├── utils/          # Utility functions
        └── data/           # Mock data and API handlers
```

### Design Patterns

- **Facade Pattern**: `DataTableFacade` isolates UI from data logic
- **Strategy Pattern**: For server-side filtering/sorting building
- **Adapter Pattern**: For normalizing API payloads to internal models
- **Dependency Inversion**: UI depends on abstractions, not concretions

## 🛠️ Tech Stack

- **Angular 18** (Standalone components, control flow, deferrable views)
- **PrimeNG 18** (UI components)
- **RxJS 7+** (Reactive programming)
- **TypeScript 5.4** (Strict mode)
- **Jest** (Unit testing)
- **ESLint + Prettier** (Code quality)
- **Husky** (Git hooks)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dynamic-table-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install mock server dependencies**
   ```bash
   cd tools/mock-server
   npm install
   cd ../..
   ```

4. **Start the development server**
   ```bash
   npm run start:mock
   ```

   This will start both the Angular development server and the mock API server.

## 🚀 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Angular development server |
| `npm run start:mock` | Start with mock API server |
| `npm run build` | Build for production |
| `npm run build:analyze` | Build and analyze bundle size |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint issues |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |

## 🎯 Usage

### Basic Table Setup

```typescript
import { TableColumn } from './models/table-column.model';

const columns: TableColumn[] = [
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
    width: '150px',
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
      { label: 'Active', value: 'Active' },
      { label: 'Inactive', value: 'Inactive' }
    ],
    badgeColorFn: (row) => row.status === 'Active' ? 'success' : 'danger'
  }
];
```

### Component Usage

```html
<app-dynamic-table
  [columns]="columns"
  [endpoint]="'/api/rows'"
  [title]="'My Data Table'"
  [config]="tableConfig"
  (rowClick)="onRowClick($event)"
  (selectionChange)="onSelectionChange($event)"
/>
```

### Configuration Options

```typescript
const tableConfig = {
  endpoint: '/api/rows',
  pageSizeOptions: [10, 25, 50, 100],
  enableVirtualScroll: false,
  enableSelection: true,
  enableInlineEdit: false,
  enableColumnPicker: true,
  enableGlobalSearch: true,
  enableExport: true
};
```

## 🔧 API Integration

The table expects a REST API with the following endpoint:

### GET /api/rows

**Query Parameters:**
- `page`: Page number (0-based)
- `size`: Page size
- `sort`: Sort fields (e.g., `name:asc,date:desc`)
- `global`: Global search term
- `filter[field]`: Field-specific filters

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "Active"
    }
  ],
  "total": 100,
  "page": 0,
  "size": 10,
  "totalPages": 10
}
```

## 🎨 Theming

The application uses PrimeNG's Lara Light Blue theme with custom CSS variables:

```scss
:root {
  --table-row-height: 48px;
  --table-zebra-stripe: true;
  --table-header-sticky: true;
}
```

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Coverage Report
```bash
npm run test:coverage
```

### Test Structure
- Services: `*.service.spec.ts`
- Components: `*.component.spec.ts`
- Coverage target: ≥80% for features/data-table

## 📊 Performance

### Bundle Optimization
- Tree-shaking enabled for PrimeNG imports
- Lazy loading for feature modules
- OnPush change detection strategy
- Virtual scrolling for large datasets

### Bundle Analysis
```bash
npm run build:analyze
```

## 🔒 Code Quality

### Pre-commit Hooks
- ESLint checks and fixes
- Prettier formatting
- TypeScript compilation

### Code Standards
- Conventional Commits
- TypeScript strict mode
- SOLID principles
- Clean architecture

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Environment Configuration
- Development: `src/environments/environment.ts`
- Production: `src/environments/environment.prod.ts`

## 🤝 Contributing

1. Follow the established code style
2. Write tests for new features
3. Update documentation as needed
4. Use conventional commit messages

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Mock server not starting**
   - Ensure Node.js 18+ is installed
   - Run `cd tools/mock-server && npm install`

2. **Build errors**
   - Clear node_modules and reinstall
   - Check TypeScript version compatibility

3. **Test failures**
   - Ensure all dependencies are installed
   - Check Jest configuration

### Support

For issues and questions, please create an issue in the repository.