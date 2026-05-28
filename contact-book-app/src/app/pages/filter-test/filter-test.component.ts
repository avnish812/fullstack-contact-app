import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';

import {
  MatTableModule
} from '@angular/material/table';

import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';

import {
  MatFormFieldModule
} from '@angular/material/form-field';

import {
  MatInputModule
} from '@angular/material/input';

import {
  debounceTime,
} from 'rxjs/operators';
import { Component, computed, signal, ViewChild } from '@angular/core';
import { Transaction } from '../../core/Model/model';
import { MatSelectModule } from '@angular/material/select';
import { ScrollingModule } from "@angular/cdk/scrolling";
import { Subject } from 'rxjs';
import { ContactService } from '../../core/services/contact.service';
import { GlobalSearchComponent } from "../global-search/global-search.component";

type TransactionView = Transaction & {
  _searchText: string;
};

@Component({
  selector: 'app-filter-test',
  standalone: true,

  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule, CommonModule, FormsModule,
    ScrollingModule,
    GlobalSearchComponent,MatFormFieldModule
],
  templateUrl: './filter-test.component.html',
  styleUrl: './filter-test.component.scss'
})

export class FilterTestComponent {
  // SEARCH
 
  constructor(
    private contactService: ContactService
  ) {}


  /* =========================================
     TABLE COLUMNS
  ========================================= */

  displayedColumns = [

    'txnRefNo',

    'customerName',

    'beneficiaryName',

    'amount',

    'currency',

    'paymentMode',

    'status',

    'createdDate',

    'action'
  ];


  /* =========================================
     MASTER DATA
  ========================================= */

  allTxns =
    signal<any[]>([]);


  /* =========================================
     TABLE DATA
  ========================================= */

  tableData: any[] = [];


  /* =========================================
     PAGINATION
  ========================================= */

  totalRecords =
    signal(0);

  pageIndex =
    signal(0);

  pageSize =
    signal(10);


  /* =========================================
     SEARCH + FILTERS
  ========================================= */

  searchValue = '';

  currentFilters: any = {};


  /* =========================================
     DATE FILTERS
  ========================================= */

  fromDate =
    signal('');

  toDate =
    signal('');


  /* =========================================
     FILTER OPTIONS
  ========================================= */

  statuses = [

    'SUCCESS',

    'FAILED',

    'PENDING',

    'IN_PROGRESS',

    'REJECTED'
  ];

  currencies = [

    'INR',

    'USD',

    'EUR'
  ];

  paymentModes = [

    'SWIFT',

    'NEFT',

    'RTGS'
  ];


  /* =========================================
     INIT
  ========================================= */

  ngOnInit(): void {

    this.loadTransactions();
  }


  /* =========================================
     LOAD DATA
  ========================================= */

  loadTransactions(): void {

    const res =
      this.generateMockResponse();

    const content =
      res?.data?.pageData?.content ?? [];


    // PREPARE SEARCH TEXT
    const formattedData =
      content.map((item: any) => ({

        ...item,

        searchText: `

          ${item.txnRefNo ?? ''}

          ${item.customerName ?? ''}

          ${item.beneficiaryName ?? ''}

          ${item.amount ?? ''}

          ${item.currency ?? ''}

          ${item.paymentMode ?? ''}

          ${item.status ?? ''}

        `.toLowerCase()
      }));


    this.allTxns.set(
      formattedData
    );

    this.applyAllRules();
  }


  /* =========================================
     MAIN LOGIC
  ========================================= */

  applyAllRules(): void {

    let data =
      [...this.allTxns()];


    /* =========================
       SEARCH
    ========================= */

    if (
      this.searchValue.trim()
    ) {

      data =
        this.contactService.search(

          data,

          this.searchValue
        );
    }


    /* =========================
       FILTERS
    ========================= */

    data =
      this.contactService.applyFilters(

        data,

        this.currentFilters
      );


    /* =========================
       TOTAL COUNT
    ========================= */

    this.totalRecords.set(
      data.length
    );


    /* =========================
       PAGINATION
    ========================= */

    const start =
      this.pageIndex()
      * this.pageSize();

    const end =
      start + this.pageSize();

    this.tableData =
      data.slice(start, end);
  }


  /* =========================================
     SEARCH
  ========================================= */

  searchGlobal(
    value: string
  ): void {

    this.searchValue = value;

    this.pageIndex.set(0);

    this.applyAllRules();
  }


  /* =========================================
     FILTER CHANGE
  ========================================= */

  onFiltersChange(
    filters: any
  ): void {

    this.currentFilters = filters;

    this.pageIndex.set(0);

    this.applyAllRules();
  }


  /* =========================================
     PAGINATION
  ========================================= */

  onPageChange(
    event: PageEvent
  ): void {

    this.pageIndex.set(
      event.pageIndex
    );

    this.pageSize.set(
      event.pageSize
    );

    this.applyAllRules();
  }


  /* =========================================
     DATE FILTER
  ========================================= */

  applyDateFilter(): void {

    this.pageIndex.set(0);

    this.applyAllRules();
  }


  /* =========================================
     MOCK DATA
  ========================================= */

  generateMockResponse(): any {

    const content = [];

    for (
      let i = 1;
      i <= 5000;
      i++
    ) {

      content.push({

        txnRefNo:
          'TXN' + i,

        customerName:
          'Customer ' + i,

        beneficiaryName:
          'Beneficiary ' + i,

        amount:
          Math.floor(
            Math.random() * 100000
          ),

        currency:
          ['INR', 'USD', 'EUR']
          [i % 3],

        paymentMode:
          ['SWIFT', 'NEFT', 'RTGS']
          [i % 3],

        status:
          [

            'SUCCESS',

            'FAILED',

            'PENDING',

            'IN_PROGRESS'

          ][i % 4],

        createdDate:
          new Date(),

        isDownloadAllowed:
          i % 2 === 0
      });
    }

    return {

      data: {

        pageData: {

          content
        }
      }
    };
  }
}