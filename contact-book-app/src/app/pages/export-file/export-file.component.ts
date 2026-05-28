import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactService } from '../../core/services/contact.service';
import { ExcelService } from '../../core/services/excel.service';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-export-file',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './export-file.component.html',
  styleUrls: ['./export-file.component.scss']
})
export class ExportFileComponent {
  exportForm!: FormGroup;
  originalData: any[] = []; 
  filteredContacts: any[] = [];
  availableContacts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    public dialogRef: MatDialogRef<ExportFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
    this.exportForm = this.fb.group({
      exportType: ['all', Validators.required],
      name: [false],
      email: [false],
      phone: [false],
      address: [false],
    });
    console.log(this.exportForm)
    console.log(this.data)
    this.originalData = [...this.data.contactIndex];
    this.availableContacts = [...this.originalData]; 
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onExport(): void {
    const formValue        = this.exportForm.value;
    let selectedFields: string[];
    if(formValue.exportType ==='all'){
      selectedFields =  ['name', 'email', 'phone', 'address']
    }else{
      selectedFields   = this.getSelectedFields(formValue);
    }
    const contactsToExport = this.formatContactsForExport(this.originalData, selectedFields);
    this.excelService.exportToExcel(contactsToExport, 'contacts_export');
    this.dialogRef.close();
  }
  
  private getSelectedFields(formValue: any): string[] {
    const fields = ['name', 'email', 'phone', 'address'];
    return fields.filter((field) => {
      if(formValue[field]===true){
        return formValue
      }
    });
  }

  private formatContactsForExport(contacts: any[], selectedFields: string[]): any[] {
    return contacts.map(contact => {
      const exportData: any = {};
      selectedFields.forEach(field => {
        exportData[field] = contact[field];
      });
      return exportData;
    });
  }
}
