import { NotificationService } from 'src/app/_services/notification.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  resetPasswordForm!: FormGroup;
  currentResetEmail = '';
  currentPage = 'login';
  hidePassword = true;
  codeRequested = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationSerivce: NotificationService) {
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

    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      code: ['', Validators.required],
    });

    this.codeRequested = false;
  }

  getPageTitle() {
    switch (this.currentPage) {
      case "login":
        return "Inicio de sesión";
      case "register":
        return "Nueva cuenta";
      case "resetpassword":
        return "Reestablecimiento de contraseña";
      default:
        return "PracticeJob";
    }
  }

  toggleCurrentPage(nextPage: string) {
    if (this.currentPage == 'resetpassword' && nextPage == 'login') {
      this.resetPasswordForm.reset();
      this.codeRequested = false;
    }
    this.currentPage = nextPage;
  }

  resetPasswordPressed() {
    this.router.navigate(['resetpassword']);
  }

  get f() { return (this.currentPage == "login") ? this.loginForm.controls : (this.currentPage == "register") ? this.signupForm.controls : this.resetPasswordForm.controls }

  onLoginPressed() {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    // Try login
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['home']);
        },
        error: () => {
          this.notificationSerivce.showError("Datos introducidos no válidos", "Error");
        }
      });
  }

  onRegisterPressed() {
    if (this.signupForm.invalid) {
      return;
    }

    if (this.f.password.value === this.f.passwordConfirmation.value) {
      // Try create account
      this.authenticationService.create(this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe({
          next: () => {
            this.router.navigate(['home']);
          },
          error: () => {
            this.notificationSerivce.showGenericError();
          }
        });
    } else {
      this.notificationSerivce.showError("Las contraseñas no coinciden", "Error");
    }
  }

  requestResetPasswordCode() {
    const email = this.f.email.value;
    this.authenticationService.sendResetPasswordCode(email).pipe(first())
      .subscribe({
        next: (result) => {
          if (result == true) {
            this.notificationSerivce.showInfo("Código de reestablecimiento de contraseña envíado", "Código envíado");
            this.codeRequested = !this.codeRequested;
          } else {
            this.notificationSerivce.showError("Este correo electrónico no esta asociado a ninguna cuenta registrada", "Error");
          }
        },
        error: () => {
          this.notificationSerivce.showGenericError();
        }
      });

  }

  onResetPassword() {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    // Try restore paswword
    this.authenticationService.updatePassword(this.f.email.value, this.f.password.value, this.f.code.value).pipe(first())
      .subscribe({
        next: (result) => {
          if (result == true) {
            this.toggleCurrentPage('login');
            this.notificationSerivce.showSuccess("Nueva contraseña establecida con éxito", "Contraseña reestablecida");
          } else {
            this.notificationSerivce.showError("Código inválido", "Error");
          }
          this.codeRequested = !this.codeRequested;
        },
        error: () => {
          this.notificationSerivce.showGenericError();
        }
      });
  }
}
