import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsComponent } from './contacts.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsComponent],
      providers:[
      {  provide:MatDialogRef, useValue:{}},
      {  provide:MAT_DIALOG_DATA, useValue:{}}

      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return greeting with name', () => {
    const result = component.sayhello('Alice');
    expect(result).toBe('hello Alice');
  });
});
