import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output
} from '@angular/core';

import {
  Subject,
  debounceTime
} from 'rxjs';

import {
  CommonModule
} from '@angular/common';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  MatOptionModule
} from '@angular/material/core';

import {
  MatSelectModule
} from '@angular/material/select';

import {
  MatIconModule
} from '@angular/material/icon';

import {
  MatButtonModule
} from '@angular/material/button';
import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-global-search',

  standalone: true,

  imports: [

    CommonModule,

    MatFormFieldModule,

    MatInputModule,

    MatOptionModule,

    MatSelectModule,

    MatIconModule,

    MatButtonModule
  ],

  templateUrl:
    './global-search.component.html',

  styleUrl:
    './global-search.component.scss'
})

export class GlobalSearchComponent {

private destroyRef =
  inject(DestroyRef);
  /* =========================================
     SEARCH
  ========================================= */

  @Input()
  enableSearch = true;

  @Input()
  placeholder = 'Search';

  @Output()
  onSearch =
    new EventEmitter<string>();


  /* =========================================
     FILTER ENABLE
  ========================================= */

  @Input()
  enableStatusFilter = false;

  @Input()
  enableCurrencyFilter = false;

  @Input()
  enablePaymentModeFilter = false;

  @Input()
  enableSourceFilter = false;


  /* =========================================
     FILTER OPTIONS
  ========================================= */

  @Input()
  status: string[] = [];

  @Input()
  currencies: string[] = [];

  @Input()
  paymentModes: string[] = [];

  @Input()
  sources: string[] = [];


  /* =========================================
     FILTER OUTPUT
  ========================================= */

  @Output()
  filtersChanged =
    new EventEmitter<any>();


  /* =========================================
     SEARCH
  ========================================= */

  searchValue = '';

  searchSubject =
    new Subject<string>();


  /* =========================================
     FILTER VALUES
  ========================================= */

  filters: any = {

    status: [],

    currency: [],

    paymentMode: [],

    source: []
  };


  constructor() {

    this.searchSubject

  .pipe(

    debounceTime(300),

    takeUntilDestroyed(
      this.destroyRef
    )
  )

  .subscribe((value:any) => {

    this.onSearch.emit(value);
  });
  }


  /* =========================================
     INPUT CHANGE
  ========================================= */

  onInputChange(
    value: string
  ): void {

    this.searchValue = value;

    this.searchSubject.next(value);
  }


  /* =========================================
     ENTER SEARCH
  ========================================= */

  searchNow(): void { 
    this.onSearch.emit(
      this.searchValue
    );
  }


  /* =========================================
     CLEAR SEARCH
  ========================================= */

  clearSearch(): void {

    this.searchValue = '';

    this.onSearch.emit('');
  }


  /* =========================================
     FILTER CHANGE
  ========================================= */

  onSelectionChange(
    value: any,
    key: string
  ): void {

    this.filters[key] = value;

    this.filtersChanged.emit(
      this.filters
    );
  }
}
 
