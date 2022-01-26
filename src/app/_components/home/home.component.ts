import { Student } from './../../_models/student';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { FP } from 'src/app/_models/fp';
import { JobOffer } from 'src/app/_models/joboffer';
import { AppService } from 'src/app/_services/app.service';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { FPService } from 'src/app/_services/fp.service';
import { JobApplicationService } from 'src/app/_services/job-application.service';
import { JobOfferService } from 'src/app/_services/job-offer.service';
import { JobApplication } from './../../_models/joboffer';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('250ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),

  ]
})

export class HomeComponent implements OnInit {
  @ViewChild('newOfferDialogForm') newOfferDialogForm!: TemplateRef<any>;
  @ViewChild('editOfferDialogForm') editOfferDialogForm!: TemplateRef<any>;
  @ViewChild('contactStudentDialogForm') contactStudentDialogForm!: TemplateRef<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  fpList!: FP[];
  newOfferForm!: FormGroup;
  editOfferForm!: FormGroup;
  contactStudentForm!: FormGroup;
  minDate = new Date().toISOString();
  displayedColumns: string[] = ['seemore', 'id', 'name', 'startDate', 'endDate', 'actions'];
  companyOffersTable: JobOffer[] = [];
  tableDataSource: any;
  contactStudentMail!: string;

  jobApplicationsModes = [
    { value: 0, viewValue: 'Pendiente' },
    { value: 1, viewValue: 'Aceptado' },
    { value: 2, viewValue: 'Denegado' }
  ];

  constructor(
    private fb: FormBuilder, private authenticationService: AuthenticationService, private router: Router, private fpService: FPService, private jobOfferService: JobOfferService, private appService: AppService, private jobApplicationService: JobApplicationService, public dialog: MatDialog) {
    const toGo = this.authenticationService.getFirstRoute()
    if (toGo != null && toGo != 'home') {
      this.router.navigate([toGo]);
    }
  }

  ngOnInit(): void {
    this.fpService.getAll().pipe(first()).subscribe(fpList => {
      this.fpList = fpList;
    });

    this.refreshOffersTable();

    this.newOfferForm = this.fb.group({
      name: ['', [Validators.required, Validators.max(65)]],
      description: ['', Validators.required],
      remuneration: [0, Validators.required],
      schedule: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fps: ['', Validators.required],
    });

    this.contactStudentForm = this.fb.group({
      message: ['Mensaje para el el alumno', [Validators.required]]
    });

    setTimeout(() => {
      this.appService.setTitle('Inicio');
    });
  }

  // Open New Form Dialog
  addButtonPressed() {
    this.dialog.open(this.newOfferDialogForm);
  }

  // On New Form Dialog Submit
  newOfferSubmit() {

    // stop here if form is invalid
    if (this.newOfferForm.invalid) {
      return;
    }

    const f = this.newOfferForm.controls;
    var company = this.authenticationService.currentCompanyValue;
    var emptyJobApplications: JobApplication[] = [];

    var newOffer = new JobOffer(f.name.value, company.id, company, f.description.value, f.remuneration.value, f.startDate.value, f.endDate.value, f.fps.value, emptyJobApplications, f.schedule.value);
    this.jobOfferService.create(newOffer)
      .pipe(first())
      .subscribe({
        next: () => {
          this.refreshOffersTable();
          alert("¡Oferta publicada con éxito!");
        },
        error: () => {
          alert("Ha ocurrido un error, por favor, intentelo más tarde");
        }
      });
    this.dialog.closeAll();
  }

  // Open Delete Confirm Dialog
  deleteSelectedPrompt(id: number) {
    if (confirm("¿Estás seguro de que quieres eliminar esta oferta? (" + id + ")")) {
      this.jobOfferService.deleteById(id).pipe(first()).subscribe(result => {
        if (result == true) {
          alert("Has borrado la oferta");
        } else {
          alert("Ha ocurrido un error, vuelve a intentarlo mas tarde");
        }
        this.refreshOffersTable();
      });
    }
  }

  // Open Edit Offer Dialog Form
  editSelectedOffer(offer: JobOffer) {
    var pickedFps: FP[] = []

    var currentJobApplications = offer.jobApplications;

    this.fpList.forEach(element => {
      offer.fPs.forEach(selected => {
        if (element.id == selected.id) {
          pickedFps.push(this.fpList[this.fpList.indexOf(element)]);
        }
      })
    });

    this.editOfferForm = this.fb.group({
      id: [offer.id],
      name: [offer.name, [Validators.required]],
      description: [offer.description, Validators.required],
      remuneration: [offer.remuneration, Validators.required],
      schedule: [offer.schedule],
      startDate: [offer.startDate, Validators.required],
      endDate: [offer.endDate, Validators.required],
      fps: [pickedFps, [Validators.required]],
      jobApplications: [currentJobApplications],
    });
    this.dialog.open(this.editOfferDialogForm);
  }

  // On Edit Offer Dialog Form Submit
  editOfferSubmit() {

    // stop here if form is invalid
    if (this.editOfferForm.invalid) {
      return;
    }

    const f = this.editOfferForm.controls;
    var company = this.authenticationService.currentCompanyValue;
    var newOffer = new JobOffer(f.name.value, company.id, company, f.description.value, f.remuneration.value, f.startDate.value, f.endDate.value, f.fps.value, f.jobApplications.value, f.schedule.value, f.id.value);
    this.jobOfferService.update(newOffer)
      .pipe(first())
      .subscribe({
        next: () => {
          this.refreshOffersTable();
          alert("¡Oferta modificada con éxito!");
        },
        error: (error) => {
          alert("Ha ocurrido un error, por favor, intentelo más tarde");
        }
      });
    this.dialog.closeAll();
  }

  // Refresh offers table data
  refreshOffersTable() {
    this.jobOfferService.getAllFromCompanyId(this.authenticationService.currentCompanyValue.id).pipe(first()).subscribe(offers => {
      this.companyOffersTable = offers;
      this.tableDataSource = new MatTableDataSource<JobOffer>(this.companyOffersTable);
      this.tableDataSource.paginator = this.paginator;
    });
  }

  // Convert user date to Age (int)
  getAgeFromDate(birthdate: Date) {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Method that handle when user change a jobApplication change and try to save it
   * @param selectedAppStatus selected new application status
   * @param jobApplicationId selected application id
   * @param jobOffer the job offer referenced in student application
   */
  onJobApplicationModeChange(selectedAppStatus: number, jobApplicationId: number, jobOffer: JobOffer) {
    this.jobApplicationService.updateStatus(jobApplicationId, selectedAppStatus).pipe(first()).subscribe(done => {
      if (done == true) {
        jobOffer.jobApplications!.forEach(element => {
          if (element.id == jobApplicationId) {
            element.applicationStatus = selectedAppStatus;
          }
        });
        alert("Estado de la inscripción modificado con éxito.");
      } else {
        alert("No se ha podido modificar el estado de la inscripción.");
      }
    });
  }

  contactStudentPrompt(student: Student) {
    if (student != null) {
      this.contactStudentMail = student.email;
      this.dialog.open(this.contactStudentDialogForm);
    } else {
      alert("Error: El usuario seleccionado no tiene correo electrónico asociado");
    }
  }

  onContactStudent() {
    // stop here if form is invalid
    if (this.contactStudentForm.invalid) {
      return;
    }

    const f = this.contactStudentForm.controls;
    var message = f.message.value;
    var companyName = this.authenticationService.currentCompanyValue.name;
    this.jobApplicationService.contactStudent(this.contactStudentMail, companyName, message)
      .pipe(first())
      .subscribe({
        next: () => {
          alert("¡Email envíado al estudiante con éxito!");
        },
        error: (error) => {
          alert("Ha ocurrido un error, por favor, intentelo más tarde");
        }
      });
    this.dialog.closeAll();
  }

}
