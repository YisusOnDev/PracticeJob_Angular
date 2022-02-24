import { PrivateMessage } from './../../_models/privatemessage';
import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { getProfileImage } from 'src/app/_helpers/utils';
import { FP } from 'src/app/_models/fp';
import { Province } from 'src/app/_models/province';
import { Student } from 'src/app/_models/student';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { FPService } from 'src/app/_services/fp.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { ProvinceService } from 'src/app/_services/province.service';
import { PremiumService } from './../../_services/premium.service';
import { ContactStudentModal } from 'src/app/_modals/contact-student/contact-student.modal';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {
  searchForm!: FormGroup;
  contactStudentForm!: FormGroup;
  fpList!: FP[];
  provinceList!: Province[];
  studentList: Student[] | undefined;

  constructor(private fb: FormBuilder, private authService: AuthenticationService, private premiumService: PremiumService, private router: Router, private fpService: FPService, private provinceService: ProvinceService, private notificationService: NotificationService, public dialog: MatDialog) { }


  ngOnInit() {
    this.searchForm = this.fb.group({
      province: [''],
      fp: ['']
    });

    this.premiumService.hasPremiumPlan(this.authService.currentCompanyValue)
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result == true) {
            this.premiumService.setCurrentPlanValue('premium');
            this.loadComponent();
          } else {
            this.router.navigate(['home']);
            this.premiumService.setCurrentPlanValue('free');
          }
        },
        error: () => {
          this.router.navigate(['home']);
          this.premiumService.setCurrentPlanValue('free');
        }
      });
  }

  loadComponent() {
    this.fpService.getAll().pipe(first()).subscribe(fpList => {
      this.fpList = fpList;
    });
    this.provinceService.getAll().pipe(first()).subscribe(provinceList => {
      this.provinceList = provinceList;
    });
  }

  get f() { return this.searchForm.controls }
  onSubmit() {

    var fp = this.f.fp.value;
    var province = this.f.province.value;

    if (!fp && !province) {
      this.notificationService.showError('Por favor aplica algún filtro', 'Error en la búsqueda');
      return;
    }

    var searchType = 'province'

    if (fp.id != undefined && province.id != undefined) {
      searchType = 'all'
    } else if (fp.id != undefined) {
      searchType = 'fp'
    }
    this.premiumService.searchStudents(this.authService.currentCompanyValue, searchType, fp.id, province.id)
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result == 'empty') {
            this.notificationService.showInfo('No se han encontrado resultados', 'Búsqueda de usuarios');
            return;
          }
          this.studentList = result;
        }
      });
  }

  contactStudentPrompt(student: Student) {
    if (student != null) {
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
          var company = this.authService.currentCompanyValue;
          var privateMessage = new PrivateMessage(message, student.id, student, company.id, company)

          this.premiumService.messageStudent(privateMessage)
            .pipe(first())
            .subscribe({
              next: (result) => {
                if (result == true) {
                  this.notificationService.showInfo("¡Mensaje privado envíado con éxito!", "Mensaje envíado");
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
    }
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

  getProfileImage(image: string, type: string) {
    return getProfileImage(image, type);
  }
}
