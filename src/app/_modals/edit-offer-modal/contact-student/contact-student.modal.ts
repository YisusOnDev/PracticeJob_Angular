import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-contact-student-modal',
  templateUrl: './contact-student.modal.html',
  styleUrls: ['./contact-student.modal.css']
})
export class ContactStudentModal implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ContactStudentModal>,
    @Inject(MAT_DIALOG_DATA) public data: FormGroup) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}