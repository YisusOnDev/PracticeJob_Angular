import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Province } from 'src/app/_models/province';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { ProvinceService } from 'src/app/_services/province.service';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.css']
})

export class CompleteProfileComponent implements OnInit {
  form!: FormGroup;
  hidePassword = true;
  
  provinces!: Province[];

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private provinceService: ProvinceService,
    private authenticationService: AuthenticationService) {
      alert(JSON.stringify(this.authenticationService.currentCompanyValue));
      if (this.authenticationService.currentCompanyValue != null) {
        if(this.authenticationService.currentCompanyValue.name != undefined || this.authenticationService.currentCompanyValue.name != null){
          this.router.navigate(['/home']);
        }
      } else {
        this.router.navigate(['/']);
      }
  }

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      province: ['', Validators.required]
    });
    this.provinceService.getAll().pipe(first()).subscribe(provinces => {
      this.provinces = provinces;
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