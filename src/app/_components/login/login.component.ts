import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  hidePassword = true;
  currentPage = 'login';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    if (this.authenticationService.currentCompanyValue != null) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required],
    });
  }

  getPageTitle() {
    return (this.currentPage == "login") ? 'Inicio de sesión' : (this.currentPage == "register") ? 'Nueva cuenta' : 'Inicio de sesión'
  }

  toggleCurrentPage() {
    if (this.currentPage == 'login'){
      this.currentPage = 'register'
    } else {
      this.currentPage = 'login'
    }
  }

  get f() { return (this.currentPage == "login") ? this.loginForm.controls : (this.currentPage == "register") ? this.signupForm.controls : this.loginForm.controls }

  onLoginPressed() {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // Check if user/company profile is completed in order to prompt completeProfile page 
          if (this.authenticationService.currentCompanyValue.name == null) {
            this.router.navigate(['completeprofile']);
          } else {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'home';
            this.router.navigate([returnUrl]);
          }
        },
        error: () => {
          alert("Invalid credentials");
        }
      });
  }

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
