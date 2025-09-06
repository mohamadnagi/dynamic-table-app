import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { DynamicTableComponent } from '../../shared/dynamic-table/dynamic-table.component';
import { TableColumn, TableConfig, Row } from '../../../models/table-column.model';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './users-management.component.html',
  styles: [`
    .users-management {
      padding: 2rem;
    }
    
    .page-header {
      margin-bottom: 2rem;
    }
    
    .page-header h1 {
      margin: 0 0 0.5rem 0;
      color: var(--primary-color);
    }
    
    .page-header p {
      margin: 0;
      color: var(--text-color-secondary);
    }
  `]
})
export class UsersManagementComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);

  // Signals for reactive state
  data = signal<Row[]>([]);
  loading = signal<boolean>(false);
  total = signal<number>(0);
  error = signal<string | null>(null);
  selectedRows = signal<Row[]>([]);
  
  // Pagination state
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
  columns = signal<TableColumn[]>([
    {
      key: 'id',
      header: 'ID',
      type: 'text',
      width: '60px',
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
      key: 'username',
      header: 'Username',
      type: 'text',
      width: '120px',
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
      key: 'phone',
      header: 'Phone',
      type: 'text',
      width: '150px',
      sortable: true,
      filterable: true
    },
    {
      key: 'website',
      header: 'Website',
      type: 'text',
      width: '150px',
      sortable: true,
      filterable: true
    },
    {
      key: 'company.name',
      header: 'Company',
      type: 'text',
      width: '150px',
      sortable: true,
      filterable: true
    }
  ]);

  tableConfig: TableConfig = {
    endpoint: 'https://jsonplaceholder.typicode.com/users',
    pageSizeOptions: [5, 10, 20],
    enableVirtualScroll: false,
    enableSelection: true,
    enableInlineEdit: false,
    enableColumnPicker: true,
    enableGlobalSearch: true,
    enableExport: true
  };

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').pipe(
      catchError(error => {
        this.error.set('Failed to load users');
        this.loading.set(false);
        return of([]);
      })
    ).subscribe(users => {
      this.data.set(users.map((user, index) => ({
        id: user.id.toString(),
        ...user
      })));
      this.total.set(users.length);
      this.loading.set(false);
    });
  }

  onRowClick(row: Row): void {
    console.log('User clicked:', row);
    // Show user details or navigate to profile
  }

  onSelectionChange(selectedIds: string[]): void {
    const selected = this.data().filter(row => selectedIds.includes(row.id));
    this.selectedRows.set(selected);
    console.log('Selected users:', selectedIds);
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
