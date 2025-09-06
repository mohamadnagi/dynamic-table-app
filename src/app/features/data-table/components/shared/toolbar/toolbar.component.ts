import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  ChangeDetectionStrategy,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {
  @Input() title: string = 'Data Table';
  @Input() total: number = 0;
  @Input() hasSelection: boolean = false;
  @Input() selectedCount: number = 0;
  @Input() enableGlobalSearch: boolean = true;
  @Input() enableColumnPicker: boolean = true;
  @Input() enableExport: boolean = true;

  @Output() search = new EventEmitter<string>();
  @Output() toggleColumnPicker = new EventEmitter<void>();
  @Output() export = new EventEmitter<void>();
  @Output() reset = new EventEmitter<void>();
  @Output() bulkDelete = new EventEmitter<void>();

  searchTerm = signal('');

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.search.emit(target.value);
  }
}
