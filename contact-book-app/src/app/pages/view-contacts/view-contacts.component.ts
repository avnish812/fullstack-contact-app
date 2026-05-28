import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '../../core/services/contact.service';
import { EditContactsComponent } from '../edit-contacts/edit-contacts.component';
import { MaterialModule } from '../../material/material.module';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-contacts',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './view-contacts.component.html',
  styleUrl: './view-contacts.component.scss'
})
export class ViewContactsComponent {
  viewEditContactForm!: FormGroup
  constructor(private dialogRef: MatDialogRef<EditContactsComponent>,
    @Inject(MAT_DIALOG_DATA) public editDetails: any,
    private fb: FormBuilder,
    private contactService: ContactService,
    private route: ActivatedRoute,
    private toaster:ToastrService
  ) {
    
    this.viewEditContactForm = this.fb.group({
      id: [this.editDetails.contact.id, Validators.required, ],
      name: [this.editDetails.contact.name, [Validators.required, Validators.minLength(3)]],
      email: [this.editDetails.contact.email, [Validators.required, Validators.email]],
      phone: [this.editDetails.contact.phone, [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: [this.editDetails.contact.address, [Validators.required]]
    });
    this.viewEditContactForm.disable()
  }


  editContact(){
    event?.preventDefault()
    this.viewEditContactForm.enable()
  }
  updateEditContact(){
    const updatedContactData = this.viewEditContactForm.value;
    const contactId = updatedContactData.id;
    if (this.viewEditContactForm.valid) {
      this.contactService.updateContact(contactId, updatedContactData).subscribe({
        next: (res) => {
          this.toaster.success(`${res.message}`,'succes')
          this.dialogRef.close()
        },
        error: (er) => {
          this.toaster.success(`${er.error.message}`,'succes')

          alert(er.message)
        }
      })
    } else {
      alert('Please fill in all the required fields.');
    }
  }

  deleteContact(){
    event?.preventDefault()
    let contactId =this.editDetails.contact.id;
    this.contactService.deleteContacts([contactId]).subscribe({
      next:(res)=>{
        this.toaster.success(`${res.message}`,'succes')
        this.dialogRef.close()
      },
      error:(error)=>{
        this.toaster.success(`${error.error.message}`,'succes')
        console.log(error.message)
      }
    })
  }
}
