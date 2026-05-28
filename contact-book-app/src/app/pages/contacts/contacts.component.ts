import { Component, ViewChild } from '@angular/core';
import { ContactService } from '../../core/services/contact.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditContactsComponent } from '../edit-contacts/edit-contacts.component';
import { ViewContactsComponent } from '../view-contacts/view-contacts.component';
import { ExcelService } from '../../core/services/excel.service';
import { MaterialModule } from '../../material/material.module';
import { ExportFileComponent } from '../export-file/export-file.component';
import { ToastrService } from 'ngx-toastr';
import { AddContactsComponent } from '../add-contacts/add-contacts.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  showText: boolean = true
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'address', 'select', 'actions'];
  dataSource = new MatTableDataSource();
  selectedContacts: any[] = [];
  totalContacts: number = 0;
  searchQuery: string = '';
  pageSize: number = 5;
  page: number = 1;
  limit: number = 10;
  search: string = '';
  sortBy: string = 'name';
  sortOrder: string = 'asc';
  currentPage: number = 1;
  pageSizeOptions: number[] = [5, 10, 20];
  nameFilter: string = '';
  emailFilter: string = '';
  phoneFilter: string = '';
  filteredData: any[] = []
  originalData: any[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private contactService: ContactService,
    private router: Router,
    private dialog: MatDialog,
    private excelService: ExcelService,
    private toaster: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadContacts();
  }

  sayhello(name:string){
    return `hello ${name}!`
  }

  loadContacts(): void {
    this.contactService.getContacts(this.page, this.limit, this.search, this.sortBy, this.sortOrder).subscribe(response => {
      this.originalData = response.contacts;
      this.filteredData = [...this.originalData]
      this.dataSource.data = this.filteredData
      this.dataSource.paginator = this.paginator;
      this.totalContacts = response.total;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // Handle pagination changes
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadContacts();
  }

  onSearchChange(search: string) {
    this.search = search;
    this.loadContacts();
  }



  toggleSelection(): void {
    const allSelected = this.selectedContacts.length === this.dataSource.data.length;
    console.log(allSelected)
    if (allSelected) {
      this.selectedContacts = [];
      this.dataSource.data.forEach((contact: any) => {
        contact.select = false;
      });
    } else {
      this.dataSource.data.forEach((contact: any) => {
        console.log(contact)
        contact.select = true;
      });
      this.selectedContacts = [...this.dataSource.data];
    }
  };

  onFilterChange(field: string, event: any): void {
    const value = event.target.value.trim().toLowerCase();
    if (value) {
      this.filteredData = this.originalData.filter(contact =>
        contact[field].toLowerCase().includes(value)
      );
    } else {
      this.filteredData = [...this.originalData];  // Reset to original data if the filter is empty
    }
    this.dataSource.data = this.filteredData;  // Update the dataSource with filtered data
  }


  onRowSelectionChange(contact: any): void {
    if (this.selectedContacts.includes(contact)) {
      this.selectedContacts = this.selectedContacts.filter(item => item !== contact);
    } else {
      this.selectedContacts.push(contact);
    }
  }

  addContacts() {
    this.dialog.open(AddContactsComponent, {
      width: '80%',
      height: 'auto'
    }),
      this.dialog.afterAllClosed.subscribe((data) => {
        this.loadContacts()
      })
  }

  exportSelected(): void {
    if (this.selectedContacts.length > 0) {
      this.dialog.open(ExportFileComponent, {
        width: '50%',
        height: 'auto',
        data: { contactIndex: this.selectedContacts }
      })
    } else {
      this.toaster.error('Please Select any index')
    }
  };

  exportContact(contacts:any){
    if(contacts){
      console.log(contacts)
      this.excelService.exportToExcel([contacts],'contacts_export');
    }
  }

  deleteSelected(): void {
    console.log(this.selectedContacts)
    const selectedContacts = this.selectedContacts.map((contact: any) => contact.id);
    if (selectedContacts.length > 0) {
      this.contactService.deleteContacts(selectedContacts).subscribe({
        next: (res) => {
          this.toaster.success(res)
          this.loadContacts()
        },
        error: (err) => {
          this.toaster.error(err.error.message)
          console.log(err.message)
        }
      })
    } else {
      this.toaster.error('Please Select any index')
    }
  }

  viewContact(contact: any): void {
    this.dialog.open(ViewContactsComponent, {
      width: '80%',
      minHeight: '50%',
      height: 'auto',
      data: { contact }
    }),
      this.dialog.afterAllClosed.subscribe(data => {
        this.loadContacts()
      })
  }

  editContact(contact: any): void {
    this.dialog.open(EditContactsComponent, {
      width: '80%',
      minHeight: '50%',
      height: 'auto',
      data: { contact }
    })

    this.dialog.afterAllClosed.subscribe(data => {
      this.loadContacts()
    })
  }

  deleteContact(contact: any): void {
    const ids = Array.isArray(contact) ? contact.map(c => c.id) : [contact.id];
    this.contactService.deleteContacts(ids).subscribe({
      next: (res) => {
        this.toaster.success('Data deleted successfully')
        this.loadContacts()
      },
      error: (error) => {
        console.log(error.message)
      }
    })
  };

  grandchild(){
    this.router.navigate(['contacts/child/grandchild'])
  }

}
