import { NotificationService } from './../../_services/notification.service';
import { Company } from './../../_models/company';
import { AppService } from './../../_services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Province } from './../../_models/province';
import { AuthenticationService } from './../../_services/auth.service';
import { ProvinceService } from './../../_services/province.service';
import { getCurrentProvinceIndex, getProfileImage } from './../../_helpers/utils';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  currentCompany!: Company;
  provinces!: Province[];

  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private router: Router,
    private provinceService: ProvinceService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) {
    this.authenticationService.currentCompany.subscribe(x => this.currentCompany = x);
    if (this.authenticationService.currentCompanyValue == null || this.authenticationService.currentCompanyValue.name == undefined || this.authenticationService.currentCompanyValue.name == null) {
      this.router.navigate(['completeprofile']);
    }
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.currentCompany.name, Validators.required],
      address: [this.currentCompany.address, Validators.required],
      province: ['', Validators.required]
    });
    this.provinceService.getAll().pipe(first()).subscribe(provinces => {
      this.provinces = provinces;

      this.form.controls.province.setValue(this.provinces[getCurrentProvinceIndex(this.provinces, this.currentCompany.provinceId)])
    });

    setTimeout(() => {
      this.appService.setTitle('Perfil');
    });

  }

  get f() { return this.form.controls }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    var updCompany = this.authenticationService.currentCompanyValue
    updCompany.name = this.f.name.value;
    updCompany.address = this.f.address.value;
    updCompany.provinceId = this.f.province.value.id;
    updCompany.province = this.f.province.value;


    this.authenticationService.update(updCompany)
      .pipe(first())
      .subscribe({
        next: () => {
          this.notificationService.showSuccess("Has cambiado tu perfil con éxito", "Cambios guardados");
          this.router.navigate(['profile']);
        }
      });
  }

  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      let image = event.target.files[0];
      const formData = new FormData();
      formData.append('file', image, image.name);

      this.authenticationService.uploadProfileImage(formData)
        .pipe(first())
        .subscribe({
          next: (result) => {
            this.notificationService.showSuccess('Imagen de perfil cambiada con éxito', "Perfil modificado");
            this.currentCompany.profileImage = result.profileImage;
            this.router.navigate(['profile']);
          }
        });
    }
  }

  getProfileImage(image: string, type: string) {
    return getProfileImage(image, type);
  }

}
