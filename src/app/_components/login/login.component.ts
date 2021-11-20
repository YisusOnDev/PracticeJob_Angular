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
  hidePassword = true;

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
  }

  get f() { return this.loginForm.controls }

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
            this.router.navigate(['/completeprofile']);
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

}
