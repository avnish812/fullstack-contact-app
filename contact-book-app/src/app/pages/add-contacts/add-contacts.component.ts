import { Component } from '@angular/core';
import { MaterialModule } from '../../material/material.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../../core/services/contact.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-add-contacts',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './add-contacts.component.html',
  styleUrl: './add-contacts.component.scss'
})
export class AddContactsComponent {
  addContacts!:FormGroup;
  constructor(
    private fb:FormBuilder,
    private contactService:ContactService,
    private toaster:ToastrService,
    private dialogRef: MatDialogRef<AddContactsComponent>
  ){}

  ngOnInit(){
    this.addContacts = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_-]+(?: [a-zA-Z0-9_-]+)*$/)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]]
    })
  }

  onSubmit(){
    if(this.addContacts.valid){
    this.contactService.addContacts(this.addContacts.value).subscribe({
      next:(res)=>{
        this.toaster.success(res)
        this.dialogRef.close()
      },
      error:(err)=>{
        this.toaster.error(err.error.message)
      }
    })
  }
  }
}
