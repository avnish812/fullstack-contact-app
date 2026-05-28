
import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { ContactService } from '../../core/services/contact.service';
import { ContactsComponent } from "../contacts/contacts.component";
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../material/material.module';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
MaterialModule
@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [MaterialModule, ContactsComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent {
  invalidRows: any[] = [];
  errorMessage: string = '';
  isUploading: boolean = false;
  selectedFile: File | undefined;
  errorReportUrl: string = ''
  constructor(
    private contactService: ContactService,
    private toaster: ToastrService,
    private fb: FormBuilder
  ) { }


  onFileChange(event: any): void {
    this.errorMessage=''
    this.selectedFile = event.target.files[0];
    const isValidFile = this.validateFileExtension(this.selectedFile)
    if (!isValidFile) {
      return;
    }
    this.onSubmit()
    
  };

  validateData(data: any[]): void {
    if (data.length === 0) {
      this.toaster.error('The uploaded file contains no data.');
      this.isUploading = false;
      return;
    }

    this.invalidRows = [];
    data.forEach(row => {
      const errors: string[] = [];
      this.validateField(row.name, 'name', errors, true, false);
      this.validateField(row.phone, 'phone', errors, false, true);
      this.validateField(row.email, 'email', errors, true, false);

      if (errors.length > 0) {
        this.invalidRows.push({ ...row, errors });
      }
    });

    this.isUploading = false;
    if(this.invalidRows.length > 0){
      this.toaster.error('Some rows are invalid. Please review and fix them.')
      return
    }else{
       this.uploadContactsToBackend();
    }
  }


  validateField(fieldValue: string, fieldName: string, errors: string[], trim: boolean, isPhone: boolean): void {
    let fieldNameLower = fieldName.toLocaleLowerCase()
    const value = trim ? fieldValue?.trim() : fieldValue;
    if (!value) {
      this.toaster.error(`${fieldNameLower} is required`);
      errors.push(`${fieldNameLower} is required`);
      return;
    }

    if (fieldNameLower === 'email' && !this.validateEmail(value)) {
      this.toaster.error(`Invalid ${fieldNameLower} format`);
      errors.push('Invalid email format');
    } else if (fieldNameLower === 'phone' && !this.validatePhoneNumber(value)) {
      this.toaster.error(`Invalid ${fieldNameLower} format`);
      errors.push('Invalid phone number');
    } else if (fieldNameLower === 'name' && !this.validateName(value)) {
      this.toaster.error(`Invalid ${fieldNameLower} format`);
      errors.push('Invalid name format');
    }
  }

  validateEmail(email: string): boolean {
    return /^[^\s].+@[^\s].+\.[^\s]+$/.test(email);
  };

  validatePhoneNumber(phone: string): boolean {
    return /^\d{10}$/.test(phone);
  };

  validateName(name: string): boolean {
    return /^[^\s][A-Za-z\s]+[^\s]$/.test(name);
  };


  validateFileExtension(fileExt: any): boolean {
    let allowFiles = ['xlsx', 'xls'];
    if (fileExt && fileExt.name) {
      let fileExtention = fileExt.name.split('.').pop().toLowerCase();
      if (allowFiles.includes(fileExtention)) {
        return true
      } else {
        this.toaster.error('Please upload an .xlsx file.')
        this.errorMessage = 'Please upload an .xlsx file.';
        return false
      }
    }
    return false
  };


  onSubmit() {
    if (this.selectedFile) {
      this.isUploading = true;
      const reader = new FileReader();
      reader.readAsArrayBuffer(this.selectedFile);
      reader.onload = () => {
        const wb = XLSX.read(reader.result, { type: 'binary' });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(ws);
        this.validateData(data);
      };
    } else {
      this.toaster.error('Please upload an .xlsx file.')
      this.errorMessage = 'Please upload an .xlsx file.';
    }
  };

  uploadContactsToBackend(): void {
    this.contactService.uploadContacts(this.selectedFile).subscribe({
      next: (res: any) => {
        console.log(res)
        this.toaster.success('Contacts uploaded successfully!', 'succes')
        if (res.errorReport) {
          this.errorReportUrl = `http://localhost:3000/${res.errorReport}`;
          console.log(this.errorReportUrl)
        }
      },
      error: (error) => {
        console.log(error.error.message)
        this.toaster.error(error.error.message);
        if (error.error.errorReport) {
          this.toaster.error('Error Report is available. Click to download.');
          this.errorReportUrl = error.error.errorReport; // Show the error report URL
        }
      }
    })
  };

  downloadErrorReport() {
    window.open(this.errorReportUrl, '_blank');
  }

}
