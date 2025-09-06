import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  signal,
  computed,
  OnInit,
  OnChanges,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { TableColumn } from '../../../models/table-column.model';

interface ColumnWithVisibility extends TableColumn {
  visible: boolean;
}

@Component({
  selector: 'app-column-picker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    // PrimeNG modules
    DialogModule,
    ButtonModule,
    InputTextModule,
    TooltipModule,
    CheckboxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './column-picker.component.html',
  styleUrls: ['./column-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnPickerComponent implements OnInit, OnChanges {
  @Input() visible: boolean = false;
  @Input() columns: TableColumn[] = [];

  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() columnsChange = new EventEmitter<TableColumn[]>();

  searchTerm = signal('');
  localColumns = signal<ColumnWithVisibility[]>([]);

  filteredColumns = computed(() => {
    const search = this.searchTerm().toLowerCase();
    if (!search) return this.localColumns();
    
    return this.localColumns().filter(col => 
      col.header.toLowerCase().includes(search) ||
      col.key.toLowerCase().includes(search)
    );
  });

  ngOnInit(): void {
    this.initializeColumns();
  }

  ngOnChanges(): void {
    this.initializeColumns();
  }

  private initializeColumns(): void {
    this.localColumns.set(
      this.columns.map(col => ({ ...col, visible: !col.hidden }))
    );
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  toggleColumn(column: ColumnWithVisibility): void {
    const updatedColumns = this.localColumns().map(col => 
      col.key === column.key ? { ...col, visible: !col.visible } : col
    );
    this.localColumns.set(updatedColumns);
  }

  selectAll(): void {
    const updatedColumns = this.localColumns().map(col => ({ ...col, visible: true }));
    this.localColumns.set(updatedColumns);
  }

  resetColumns(): void {
    this.initializeColumns();
  }

  applyChanges(): void {
    const updatedColumns = this.localColumns().map(col => ({
      ...col,
      hidden: !col.visible
    }));
    this.columnsChange.emit(updatedColumns);
    this.visibleChange.emit(false);
  }

  trackByColumnKey(index: number, column: ColumnWithVisibility): string {
    return column.key;
  }
}