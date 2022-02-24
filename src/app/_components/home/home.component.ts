import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { ContactStudentModal } from 'src/app/_modals/contact-student/contact-student.modal';
import { EditOfferData, EditOfferModal } from 'src/app/_modals/edit-offer/edit-offer.modal';
import { NewOfferData, NewOfferModal } from 'src/app/_modals/new-offer/new-offer.modal';
import { FP } from 'src/app/_models/fp';
import { JobOffer } from 'src/app/_models/joboffer';
import { AppService } from 'src/app/_services/app.service';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { FPService } from 'src/app/_services/fp.service';
import { JobApplicationService } from 'src/app/_services/job-application.service';
import { JobOfferService } from 'src/app/_services/job-offer.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { JobApplication } from './../../_models/joboffer';
import { Student } from './../../_models/student';
import { getProfileImage } from 'src/app/_helpers/utils';

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
    private fb: FormBuilder, private notificationService: NotificationService, private authenticationService: AuthenticationService, private router: Router, private fpService: FPService, private jobOfferService: JobOfferService, private appService: AppService, private jobApplicationService: JobApplicationService, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    const toGo = this.authenticationService.getFirstRoute()
    if (toGo != null && toGo != 'home') {
      this.router.navigate([toGo]);
    } else {
      this.fpService.getAll().pipe(first()).subscribe(fpList => {
        this.fpList = fpList;
      });

      this.refreshOffersTable();

      setTimeout(() => {
        this.appService.setTitle('Inicio');
      });
    }
  }

  // Open New Form Dialog
  addButtonPressed() {

    this.newOfferForm = this.fb.group({
      name: ['', [Validators.required, Validators.max(65)]],
      description: ['', Validators.required],
      remuneration: [0, Validators.required],
      schedule: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      fps: ['', Validators.required],
    });

    let newOfferData: NewOfferData = { newOfferForm: this.newOfferForm, fpList: this.fpList }
    const dialogRef = this.dialog.open(NewOfferModal, {
      width: '600px',
      data: newOfferData,
    });

    dialogRef.afterClosed().subscribe((res: FormGroup) => {
      if (res != undefined) {
        this.newOfferForm = res;

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
              this.notificationService.showSuccess("¡Oferta publicada con éxito!", "Oferta publicada");
            },
            error: () => {
              this.notificationService.showGenericError();
            }
          });
      }
    });
  }

  // Open Delete Confirm Dialog
  deleteSelectedPrompt(id: number) {
    if (confirm("¿Estás seguro de que quieres eliminar esta oferta? (" + id + ")")) {
      this.jobOfferService.deleteById(id).pipe(first()).subscribe(result => {
        if (result == true) {
          this.notificationService.showSuccess("Has aliminado la oferta correctamente", "Oferta eliminada");
        } else {
          this.notificationService.showGenericError();
        }
        this.refreshOffersTable();
      });
    }
  }

  // Edit Offer Dialog Form Modal
  editSelectedOffer(offer: JobOffer) {
    let pickedFps: FP[] = []

    let currentJobApplications = offer.jobApplications;

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

    let editOfferData: EditOfferData = { editOfferForm: this.editOfferForm, fpList: this.fpList }
    const dialogRef = this.dialog.open(EditOfferModal, {
      width: '600px',
      data: editOfferData,
    });

    dialogRef.afterClosed().subscribe((res: FormGroup) => {
      if (res != undefined) {
        this.editOfferForm = res;
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
              this.notificationService.showSuccess("¡Oferta modificada con éxito!", "Oferta modificada");
            },
            error: (error) => {
              this.notificationService.showGenericError();
            }
          });
      }
    });
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
        let statusString: string = this.jobApplicationsModes[selectedAppStatus].viewValue
        this.notificationService.showSuccess("Has modificado la inscripción su nuevo estado es: " + statusString, "Estado de inscripción");
      } else {
        this.notificationService.showError("No se ha podido modificar el estado de la inscripción", "Error al modificar inscripción");
      }
    });
  }

  contactStudentPrompt(student: Student) {
    alert(student.profileImage);
    if (student != null) {
      this.contactStudentMail = student.email;

      this.contactStudentForm = this.fb.group({
        message: ['', [Validators.required]]
      });

      const dialogRef = this.dialog.open(ContactStudentModal, {
        width: '600px',
        data: this.contactStudentForm,
      });

      dialogRef.afterClosed().subscribe((res: FormGroup) => {
        if (res != undefined) {
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
              next: (result) => {
                if (result == true) {
                  this.notificationService.showInfo("¡Email de contacto envíado con éxito!", "Email envíado");
                } else {
                  this.notificationService.showError("¡No hemos podido contactar con el estudiante!", "Error");
                }
              },
              error: () => {
                this.notificationService.showGenericError();
              }
            });
        }
      });
    } else {
      this.notificationService.showError("El estudiante no tiene ningún email asociado a su cuenta", "Error");
    }
  }

  getProfileImage(image: string, type: string) {
    return getProfileImage(image, type);
  }
}