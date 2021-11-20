import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  signupForm!: FormGroup;
  hidePassword = true;


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentCompanyValue != null) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }

  get f() { return this.signupForm.controls }

  onRegisterPressed() {
    if (this.signupForm.invalid) {
      return;
    }

    if (this.f.password.value === this.f.passwordConfirmation.value) {

      this.authenticationService.create(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['completeprofile']);
          },
          error: error => {
            alert(error);
          }
        });
    } else {
      alert("Passwords does not match");
      return;
    }
  }

}