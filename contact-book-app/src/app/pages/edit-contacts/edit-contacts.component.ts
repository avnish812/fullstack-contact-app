import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-edit-contacts',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './edit-contacts.component.html',
  styleUrl: './edit-contacts.component.scss'
})
export class EditContactsComponent {
  editContactForm!: FormGroup
  originalContactData: any[] = []
  constructor(private dialogRef: MatDialogRef<EditContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public editDetails: any,
    private fb: FormBuilder,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private toaster: ToastrService
  ) {
    this.originalContactData = { ...editDetails.contact };
    this.editContactForm = this.fb.group({
      id: [this.editDetails.contact.id, Validators.required],
      name: [this.editDetails.contact.name, [Validators.required, Validators.minLength(3),Validators.pattern(/^[^\s][A-Za-z\s]+[^\s]$/)]],
      email: [this.editDetails.contact.email, [Validators.required, Validators.email]],
      phone: [this.editDetails.contact.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [this.editDetails.contact.address, [Validators.required]]
    });
  }

  // ngOninIt() {
  //   console.log(this.route)
  //   this.route.queryParamMap.subscribe(data => {
  //     console.log(data)
  //   })
  // };

  private getChanges(originalData: any, updatedData: any) {
    let changes: any = {};
    for (let key in originalData) {
      if (originalData.hasOwnProperty(key) && originalData[key] !== updatedData[key]) {
        changes[key] = {
          oldValue: originalData[key],
          newValue: updatedData[key]
        };
      }
    }
    // console.log(changes)
    return changes;
  };

  UpdateContact() {
    const updatedContactData = this.editContactForm.value;
    const contactId = updatedContactData.id;
    const changes = this.getChanges(this.originalContactData, updatedContactData);
    console.log(changes)
    if (this.editContactForm.valid) {
      if (Object.keys(changes).length > 0) {
        this.contactService.updateContact(contactId, updatedContactData).subscribe({
          next: (res) => {
            this.toaster.success(`${res.message}`, 'succes')
            this.dialogRef.close()
          },
          error: (er) => {
            this.toaster.success(`${er.error.message}`, 'failed')
            alert(er.message)
          }
        })
      } else {
        alert('Please fill in all the required fields.');
      }
    }
  };

}

