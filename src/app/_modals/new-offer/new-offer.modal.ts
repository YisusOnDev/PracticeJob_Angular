import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FP } from 'src/app/_models/fp';

@Component({
  selector: 'app-new-offer-modal',
  templateUrl: './new-offer.modal.html',
  styleUrls: ['./new-offer.modal.css']
})
export class NewOfferModal implements OnInit {
  minDate = new Date().toISOString();

  constructor(
    public dialogRef: MatDialogRef<NewOfferModal>,
    @Inject(MAT_DIALOG_DATA) public data: NewOfferData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

export interface NewOfferData {
  newOfferForm: FormGroup,
  fpList: FP[]
}
