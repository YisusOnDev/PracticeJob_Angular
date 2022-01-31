import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FP } from './../../_models/fp';
import { FPService } from './../../_services/fp.service';

@Component({
  selector: 'app-edit-offer-modal',
  templateUrl: './edit-offer.modal.html',
  styleUrls: ['./edit-offer.modal.css']
})
export class EditOfferModal implements OnInit {
  minDate = new Date().toISOString();

  constructor(
    public dialogRef: MatDialogRef<EditOfferModal>,
    @Inject(MAT_DIALOG_DATA) public data: EditOfferData) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}

export interface EditOfferData {
  editOfferForm: FormGroup,
  fpList: FP[]
}
