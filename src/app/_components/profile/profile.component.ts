import { Company } from './../../_models/company';
import { AppService } from 'src/app/_services/app.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Province } from 'src/app/_models/province';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { ProvinceService } from 'src/app/_services/province.service';

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
    private authenticationService: AuthenticationService) {
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
      console.log("Provinces setted");
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
          this.router.navigate(['home']);
        },
        error: error => {
          alert(error);
        }
      });
  }

}
