import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ask-premium-signup',
  templateUrl: './ask-premium-signup.modal.html',
  styleUrls: ['./ask-premium-signup.modal.css']
})
export class AskPremiumModal implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AskPremiumModal>,
    @Inject(MAT_DIALOG_DATA) public data: boolean) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}