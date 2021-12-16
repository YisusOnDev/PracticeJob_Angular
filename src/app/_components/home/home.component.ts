import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FP } from 'src/app/_models/FP';
import { JobOffer } from 'src/app/_models/JobOffer';
import { AppService } from 'src/app/_services/app.service';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { FPService } from 'src/app/_services/fp.service';
import { JobOfferService } from 'src/app/_services/job-offer.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})

export class HomeComponent implements OnInit {
  @ViewChild('newOfferDialogForm') newOfferDialogForm!: TemplateRef<any>;
  fpList!: FP[];
  newOfferForm!: FormGroup;
  minDate = new Date().toISOString();


  constructor(
    private fb: FormBuilder, private authenticationService: AuthenticationService, private router: Router, private fpService: FPService, private jobOfferService: JobOfferService, private appService: AppService, public dialog: MatDialog) {
    if (this.authenticationService.currentCompanyValue.name == null) {
      this.router.navigate(['/completeprofile']);
    }
  }
  ngOnInit(): void {
    this.fpService.getAll().pipe(first()).subscribe(fpList => {
      this.fpList = fpList;
    });
    this.newOfferForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', Validators.required],
      remuneration: [0, Validators.required],
      schedule: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fps: ['', Validators.required],
    });

    setTimeout(() => {
      this.appService.setTitle('Inicio');
    });
  }

  addButtonPressed() {
    this.dialog.open(this.newOfferDialogForm);
  }

  newOfferSubmit() {
    console.log("PEPEGA");
    // stop here if form is invalid
    if (this.newOfferForm.invalid) {
      return;
    }
    console.log("KEKW");
    const f = this.newOfferForm.controls;
    var job = new JobOffer(f.name.value, f.description.value, f.remuneration.value, f.startDate.value, f.endDate.value, f.fps.value, f.schedule.value);
    this.jobOfferService.create(job)
      .pipe(first())
      .subscribe({
        next: () => {
          alert("OK");
        },
        error: () => {
          alert("BAD REQUEST");
        }
      });
    this.dialog.closeAll();
  }
}
