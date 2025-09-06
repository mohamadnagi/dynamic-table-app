import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, combineLatest, debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';
import { DynamicTableComponent } from '../../shared/dynamic-table/dynamic-table.component';
import { TableColumn, TableConfig, Row, TableQuery } from '../../../models/table-column.model';

@Component({
  selector: 'app-posts-management',
  standalone: true,
  imports: [CommonModule, DynamicTableComponent],
  templateUrl: './posts-management.component.html',
  styleUrls: ['./posts-management.component.scss']
})
export class PostsManagementComponent implements OnInit, OnDestroy {
  private readonly http = inject(HttpClient);
  private readonly querySubject = new BehaviorSubject<TableQuery>({
    page: 0,
    size: 10,
    sorts: [],
    global: '',
    filters: {}
  });

  // Signals for reactive state
  data = signal<Row[]>([]);
  loading = signal<boolean>(false);
  total = signal<number>(0);
  error = signal<string | null>(null);
  selectedRows = signal<Row[]>([]);
  allData = signal<Row[]>([]);
  
  // Pagination state
  currentPage = signal<number>(0);
  pageSize = signal<number>(10);
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
      key: 'userId',
      header: 'User ID',
      type: 'number',
      width: '100px',
      sortable: true,
      filterable: true,
      options: [
        { label: 'User 1', value: 1 },
        { label: 'User 2', value: 2 },
        { label: 'User 3', value: 3 },
        { label: 'User 4', value: 4 },
        { label: 'User 5', value: 5 },
        { label: 'User 6', value: 6 },
        { label: 'User 7', value: 7 },
        { label: 'User 8', value: 8 },
        { label: 'User 9', value: 9 },
        { label: 'User 10', value: 10 }
      ]
    },
    {
      key: 'title',
      header: 'Title',
      type: 'text',
      width: '300px',
      sortable: true,
      filterable: true
    },
    {
      key: 'body',
      header: 'Content',
      type: 'text',
      width: '400px',
      sortable: false,
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
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
        { label: 'Archived', value: 'archived' }
      ],
      badgeColorFn: (row) => {
        // Simulate status based on post ID
        const status = row.id % 3 === 0 ? 'published' : row.id % 3 === 1 ? 'draft' : 'archived';
        switch (status) {
          case 'published': return 'success';
          case 'draft': return 'warning';
          case 'archived': return 'secondary';
          default: return 'info';
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
        { label: 'Low', value: 'low' },
        { label: 'Medium', value: 'medium' },
        { label: 'High', value: 'high' }
      ],
      badgeColorFn: (row) => {
        // Simulate priority based on post ID
        const priority = row.id % 3 === 0 ? 'high' : row.id % 3 === 1 ? 'medium' : 'low';
        switch (priority) {
          case 'high': return 'danger';
          case 'medium': return 'warning';
          case 'low': return 'info';
          default: return 'secondary';
        }
      }
    },
    {
      key: 'createdAt',
      header: 'Created',
      type: 'date',
      width: '120px',
      sortable: true,
      filterable: true
    },
    {
      key: 'views',
      header: 'Views',
      type: 'number',
      width: '100px',
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
    }
  ]);

  tableConfig: TableConfig = {
    endpoint: 'https://jsonplaceholder.typicode.com/posts',
    pageSizeOptions: [10, 25, 50, 100],
    enableVirtualScroll: false,
    enableSelection: true,
    enableInlineEdit: true,
    enableColumnPicker: true,
    enableGlobalSearch: true,
    enableExport: true
  };

  ngOnInit(): void {
    // Load initial data
    this.loadData();
  }

  ngOnDestroy(): void {
    this.querySubject.complete();
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/posts').pipe(
      catchError(error => {
        this.error.set('Failed to load posts');
        this.loading.set(false);
        return of([]);
      })
    ).subscribe(posts => {
      this.allData.set(posts.map((post, index) => ({
        id: post.id.toString(),
        ...post,
        // Add simulated additional fields for demonstration
        status: post.id % 3 === 0 ? 'published' : post.id % 3 === 1 ? 'draft' : 'archived',
        priority: post.id % 3 === 0 ? 'high' : post.id % 3 === 1 ? 'medium' : 'low',
        createdAt: new Date(2024, 0, post.id).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 1000) + 100,
        isActive: post.id % 4 !== 0
      })));
      this.applyQuery();
      this.loading.set(false);
    });
  }

  private applyQuery(): void {
    const query = this.querySubject.value;
    let filteredData = [...this.allData()];

    // Apply global search
    if (query.global) {
      const searchTerm = query.global.toLowerCase();
      filteredData = filteredData.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(searchTerm)
        )
      );
    }

    // Apply column filters
    if (query.filters) {
      Object.entries(query.filters).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          const filterValue = value.toString().trim();
          filteredData = filteredData.filter(item => {
            const itemValue = item[key];
            if (itemValue === null || itemValue === undefined) return false;
            
            // Handle date filtering
            if (key.includes('date') || key.includes('Date')) {
              const itemDate = new Date(itemValue).toDateString();
              const filterDate = new Date(filterValue).toDateString();
              return itemDate === filterDate;
            }
            
            // Handle other types with case-insensitive search
            return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
          });
        }
      });
    }

    // Apply sorting
    if (query.sorts.length > 0) {
      filteredData.sort((a, b) => {
        for (const sort of query.sorts) {
          const aVal = a[sort.field];
          const bVal = b[sort.field];
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          if (comparison !== 0) {
            return sort.dir === 'asc' ? comparison : -comparison;
          }
        }
        return 0;
      });
    }

    // Update total count before pagination
    this.total.set(filteredData.length);

    // Apply pagination
    const startIndex = query.page * query.size;
    const endIndex = startIndex + query.size;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    this.data.set(paginatedData);
  }

  onQueryChange(query: TableQuery): void {
    this.querySubject.next(query);
    this.applyQuery();
  }

  onSearch(searchTerm: string): void {
    const currentQuery = this.querySubject.value;
    this.querySubject.next({ ...currentQuery, global: searchTerm, page: 0 });
    this.applyQuery();
  }

  onFilter(event: { column: string; value: any }): void {
    const currentQuery = this.querySubject.value;
    const filters = { ...currentQuery.filters };
    
    if (event.value && event.value.toString().trim() !== '') {
      filters[event.column] = event.value.toString().trim();
    } else {
      delete filters[event.column];
    }
    
    this.querySubject.next({ ...currentQuery, filters, page: 0 });
    this.applyQuery();
  }

  onSort(event: { field: string; direction: 'asc' | 'desc' }): void {
    const currentQuery = this.querySubject.value;
    const sorts = currentQuery.sorts.filter(s => s.field !== event.field);
    sorts.push({ field: event.field, dir: event.direction });
    this.querySubject.next({ ...currentQuery, sorts, page: 0 });
    this.applyQuery();
  }

  onPageChange(event: { page: number; size: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.size);
    const currentQuery = this.querySubject.value;
    this.querySubject.next({ ...currentQuery, page: event.page, size: event.size });
    this.applyQuery();
  }

  onRowClick(row: Row): void {
    console.log('Post clicked:', row);
    // Open post detail in new tab
    window.open(`https://jsonplaceholder.typicode.com/posts/${row.id}`, '_blank');
  }

  onSelectionChange(selectedIds: string[]): void {
    const selected = this.data().filter(row => selectedIds.includes(row.id));
    this.selectedRows.set(selected);
    console.log('Selected posts:', selectedIds);
  }

  onExport(): void {
    const csv = this.convertToCSV(this.data());
    this.downloadCSV(csv, 'posts-export.csv');
  }

  onReset(): void {
    this.querySubject.next({
      page: 0,
      size: 10,
      sorts: [],
      global: '',
      filters: {}
    });
    this.applyQuery();
  }

  onBulkDelete(selectedIds: string[]): void {
    console.log('Bulk delete:', selectedIds);
    // In a real app, this would call the API
    alert(`Would delete ${selectedIds.length} posts`);
  }

  onEditSave(event: { row: Row; changes: Partial<Row> }): void {
    console.log('Edit saved:', event);
    // Update the data with changes
    const updatedData = this.allData().map(item => 
      item.id === event.row.id ? { ...item, ...event.changes } : item
    );
    this.allData.set(updatedData);
    this.applyQuery();
  }

  onEditCancel(row: Row): void {
    console.log('Edit cancelled:', row);
  }

  onActionTriggered(event: { action: string; data: any }): void {
    console.log('Action triggered:', event);
    switch (event.action) {
      case 'delete':
        this.deletePost(event.data);
        break;
      case 'view':
        this.viewPost(event.data);
        break;
      case 'edit':
        this.editPost(event.data);
        break;
      default:
        console.log('Unknown action:', event.action);
    }
  }

  onColumnsChange(columns: TableColumn[]): void {
    console.log('Columns changed:', columns);
    this.columns.set(columns);
  }

  private deletePost(post: Row): void {
    if (confirm(`Are you sure you want to delete post "${post['title']}"?`)) {
      const updatedData = this.allData().filter(item => item.id !== post.id);
      this.allData.set(updatedData);
      this.applyQuery();
      console.log('Post deleted:', post.id);
    }
  }

  private viewPost(post: Row): void {
    window.open(`https://jsonplaceholder.typicode.com/posts/${post.id}`, '_blank');
  }

  private editPost(post: Row): void {
    console.log('Edit post:', post);
    // In a real app, this would open an edit dialog or enable inline editing
  }

  private convertToCSV(data: Row[]): string {
    if (data.length === 0) return '';
    
    const columns = this.columns();
    const headers = columns.map(col => col.header).join(',');
    const rows = data.map(row => 
      columns.map(col => `"${row[col.key] || ''}"`).join(',')
    );
    
    return [headers, ...rows].join('\n');
  }

  private downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
