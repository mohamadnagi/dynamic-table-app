import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  TemplateRef, 
  OnInit, 
  OnDestroy,
  ChangeDetectionStrategy,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

import { TableColumn, TableQuery, Row, TableConfig } from '../../../models/table-column.model';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { ColumnPickerComponent } from '../column-picker/column-picker.component';

@Component({
  selector: 'app-dynamic-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ToolbarComponent,
    ColumnPickerComponent,
    // PrimeNG modules
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    MultiSelectModule,
    CheckboxModule,
    TooltipModule,
    TagModule,
    DialogModule,
    ToastModule,
    ConfirmDialogModule
  ],
  providers: [MessageService, ConfirmationService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicTableComponent implements OnInit, OnDestroy {
  // Data inputs - parent component provides all data
  @Input() data: Row[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() loading: boolean = false;
  @Input() total: number = 0;
  @Input() error: string | null = null;
  @Input() selectedRows: Row[] = [];
  @Input() currentPage: number = 0;
  @Input() pageSize: number = 10;
  
  // Configuration inputs
  @Input() title: string = 'Data Table';
  @Input() config: TableConfig = {
    endpoint: '',
    pageSizeOptions: [10, 25, 50, 100],
    enableVirtualScroll: false,
    enableSelection: true,
    enableInlineEdit: false,
    enableColumnPicker: true,
    enableGlobalSearch: true,
    enableExport: true
  };
  @Input() rowTemplate?: TemplateRef<any>;
  @Input() toolbarTemplate?: TemplateRef<any>;

  // Event outputs - parent component handles all logic
  @Output() queryChange = new EventEmitter<TableQuery>();
  @Output() rowClick = new EventEmitter<Row>();
  @Output() selectionChange = new EventEmitter<string[]>();
  @Output() editSave = new EventEmitter<{ row: Row; changes: Partial<Row> }>();
  @Output() editCancel = new EventEmitter<Row>();
  @Output() actionTriggered = new EventEmitter<{ action: string; data: any }>();
  @Output() search = new EventEmitter<string>();
  @Output() filter = new EventEmitter<{ column: string; value: any }>();
  @Output() sort = new EventEmitter<{ field: string; direction: 'asc' | 'desc' }>();
  @Output() pageChange = new EventEmitter<{ page: number; size: number }>();
  @Output() columnsChange = new EventEmitter<TableColumn[]>();
  @Output() export = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() bulkDelete = new EventEmitter<string[]>();

  showColumnPicker = false;
  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  get pageSizeOptions(): number[] {
    return this.config.pageSizeOptions || [10, 25, 50, 100];
  }

  ngOnInit(): void {
    // Setup search debouncing
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(searchTerm => {
        this.search.emit(searchTerm);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSort(event: any): void {
    const { field, order } = event;
    if (field && order) {
      this.sort.emit({ field, direction: order === 1 ? 'asc' : 'desc' });
    }
  }

  onPageChange(event: any): void {
    const { first, rows } = event;
    const page = Math.floor(first / rows);
    this.pageChange.emit({ page, size: rows });
  }

  onFilter(columnKey: string, event: any): void {
    const value = event.target?.value || event.value;
    this.filter.emit({ column: columnKey, value });
  }

  onFilterInput(columnKey: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim();
    this.filter.emit({ column: columnKey, value: value || null });
  }

  onFilterDropdown(columnKey: string, event: any): void {
    this.filter.emit({ column: columnKey, value: event.value || null });
  }

  onSearch(searchTerm: string): void {
    this.searchSubject.next(searchTerm);
  }

  onSelectionChange(event: any): void {
    const selectedIds = event.map((row: Row) => row.id);
    this.selectionChange.emit(selectedIds);
  }

  onRowSelect(event: any): void {
    this.rowClick.emit(event.data);
  }

  onRowUnselect(event: any): void {
    // Handle row unselect if needed
  }

  onRowSelectionChange(rowId: string, event: Event): void {
    // This will be handled by the parent component
  }

  onSelectAll(event: Event): void {
    const target = event.target as HTMLInputElement;
    // This will be handled by the parent component
  }

  onColumnsChange(columns: TableColumn[]): void {
    this.columnsChange.emit(columns);
  }

  onExport(): void {
    this.export.emit();
  }

  onReset(): void {
    this.reset.emit();
  }

  onBulkDelete(): void {
    const selectedIds = this.selectedRows.map(row => row.id);
    this.bulkDelete.emit(selectedIds);
  }

  isRowSelected(rowId: string): boolean {
    return this.selectedRows.some(row => row.id === rowId);
  }

  isAllSelected(): boolean {
    return this.selectedRows.length > 0 && this.selectedRows.length === this.data.length;
  }

  isIndeterminate(): boolean {
    return this.selectedRows.length > 0 && this.selectedRows.length < this.data.length;
  }

  getVisibleColumns(): TableColumn[] {
    return this.columns.filter(col => !col.hidden);
  }

  getBadgeSeverity(row: Row, column: TableColumn): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
    if (column.badgeColorFn) {
      const color = column.badgeColorFn(row);
      // Map custom colors to PrimeNG severity values
      switch (color) {
        case 'success': return 'success';
        case 'danger': return 'danger';
        case 'warning': return 'warn';
        case 'info': return 'info';
        case 'secondary': return 'secondary';
        case 'contrast': return 'contrast';
        default: return 'info';
      }
    }
    return 'info';
  }

  getColspan(): number {
    let colspan = this.getVisibleColumns().length;
    if (this.config.enableSelection) colspan++;
    colspan++; // Add 1 for actions column
    return colspan;
  }

  trackByRowId(index: number, row: Row): string {
    return row.id;
  }

  trackByColumnKey(index: number, column: TableColumn): string {
    return column.key;
  }

}
