import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from '../../shared/dynamic-table/dynamic-table.component';
import { TableColumn, Row } from '../../../models/table-column.model';

@Component({
  selector: 'app-data-table-page',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './data-table-page.component.html',
  styleUrls: ['./data-table-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataTablePageComponent implements OnInit {
  // Signals for reactive state
  data = signal<Row[]>([]);
  loading = signal<boolean>(false);
  total = signal<number>(0);
  error = signal<string | null>(null);
  selectedRows = signal<Row[]>([]);
  
  // Pagination state
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  columns: TableColumn[] = [
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
      key: 'email',
      header: 'Email',
      type: 'text',
      width: '200px',
      sortable: true,
      filterable: true
    },
    {
      key: 'age',
      header: 'Age',
      type: 'number',
      width: '80px',
      sortable: true,
      filterable: true
    },
    {
      key: 'salary',
      header: 'Salary',
      type: 'number',
      width: '120px',
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
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Completed', value: 'Completed' }
      ],
      badgeColorFn: (row) => {
        switch (row.status) {
          case 'Active': return 'success';
          case 'Inactive': return 'danger';
          case 'Pending': return 'warning';
          case 'Completed': return 'info';
          default: return 'secondary';
        }
      }
    },
    {
      key: 'priority',
      header: 'Priority',
      type: 'badge',
      width: '100px',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Low', value: 'Low' },
        { label: 'Medium', value: 'Medium' },
        { label: 'High', value: 'High' },
        { label: 'Critical', value: 'Critical' }
      ],
      badgeColorFn: (row) => {
        switch (row.priority) {
          case 'Low': return 'info';
          case 'Medium': return 'warning';
          case 'High': return 'orange';
          case 'Critical': return 'danger';
          default: return 'secondary';
        }
      }
    },
    {
      key: 'department',
      header: 'Department',
      type: 'text',
      width: '120px',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Engineering', value: 'Engineering' },
        { label: 'Marketing', value: 'Marketing' },
        { label: 'Sales', value: 'Sales' },
        { label: 'HR', value: 'HR' },
        { label: 'Finance', value: 'Finance' }
      ]
    },
    {
      key: 'joinDate',
      header: 'Join Date',
      type: 'date',
      width: '120px',
      sortable: true,
      filterable: true
    },
    {
      key: 'isActive',
      header: 'Active',
      type: 'badge',
      width: '80px',
      sortable: true,
      filterable: true,
      badgeColorFn: (row) => row.isActive ? 'success' : 'danger'
    },
    {
      key: 'score',
      header: 'Score',
      type: 'number',
      width: '80px',
      sortable: true,
      filterable: true
    },
    {
      key: 'description',
      header: 'Description',
      type: 'text',
      width: '200px',
      sortable: false,
      filterable: true
    }
  ];

  tableConfig = {
    endpoint: '/rows',
    pageSizeOptions: [10, 25, 50, 100],
    enableVirtualScroll: false,
    enableSelection: true,
    enableInlineEdit: false,
    enableColumnPicker: true,
    enableGlobalSearch: true,
    enableExport: true
  };

  ngOnInit(): void {
    // Load mock data for demo
    this.loadMockData();
  }

  private loadMockData(): void {
    this.loading.set(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockData: Row[] = [
        { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active', lastLogin: '2024-01-15' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive', lastLogin: '2024-01-10' },
        { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'Active', lastLogin: '2024-01-14' },
        { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'User', status: 'Active', lastLogin: '2024-01-13' },
        { id: '5', name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin', status: 'Inactive', lastLogin: '2024-01-08' }
      ];
      
      this.data.set(mockData);
      this.total.set(mockData.length);
      this.loading.set(false);
    }, 1000);
  }

  onRowClick(row: any): void {
    console.log('Row clicked:', row);
  }

  onSelectionChange(selection: string[]): void {
    const selected = this.data().filter(row => selection.includes(row.id));
    this.selectedRows.set(selected);
    console.log('Selection changed:', selection);
  }

  onEditSave(event: { row: any; changes: Partial<any> }): void {
    console.log('Edit saved:', event);
  }

  onEditCancel(row: any): void {
    console.log('Edit cancelled:', row);
  }

  onActionTriggered(event: { action: string; data: any }): void {
    console.log('Action triggered:', event);
  }

  onSearch(searchTerm: string): void {
    // Implement search logic if needed
    console.log('Search:', searchTerm);
  }

  onFilter(event: { column: string; value: any }): void {
    // Implement filter logic if needed
    console.log('Filter:', event);
  }

  onSort(event: { field: string; direction: 'asc' | 'desc' }): void {
    // Implement sort logic if needed
    console.log('Sort:', event);
  }

  onPageChange(event: { page: number; size: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    console.log('Page change:', event);
  }

  onExport(): void {
    // Implement export logic if needed
    console.log('Export');
  }

  onReset(): void {
    // Implement reset logic if needed
    console.log('Reset');
  }

  onBulkDelete(selectedIds: string[]): void {
    // Implement bulk delete logic if needed
    console.log('Bulk delete:', selectedIds);
  }
}
