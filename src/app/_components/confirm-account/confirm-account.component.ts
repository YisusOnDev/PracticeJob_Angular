import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { NotificationService } from './../../_services/notification.service';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './confirm-account.component.html',
  styleUrls: ['./confirm-account.component.css']
})

export class ConfirmAccountComponent implements OnInit {
  form!: FormGroup;
  emailSent: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      code: ['', Validators.required],
    });
    if (this.authenticationService.currentCompanyValue.name == null) {
      this.sendEmailRequest();
    }
  }

  // Send email to user in order to get confirmation code
  sendEmailRequest() {
    this.authenticationService.sendEmailConfirm()
      .pipe(first())
      .subscribe({
        next: () => {
          this.notificationService.showInfo("Hemos envíado un código de confirmación a tu correo electrónico", "Verificación de Email");
          this.emailSent = false;
        },
        error: () => {
          this.notificationService.showError("Ha ocurrido un error al enviar el email de confirmación, por favor intentelo más tarde", "Error");
        }
      });


  }

  get f() { return this.form.controls }

  onSubmit() {
    if (!this.form.valid) {
      return;
    }

    // Validate entered pin
    this.authenticationService.valideEmail(this.f.code.value)
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result.validatedEmail == true) {
            this.notificationService.showSuccess("Has verificado tu cuenta correctamente", "Cuenta verificada");
            this.router.navigate(['home']);
          } else {
            this.notificationService.showError("El código introducido es incorrecto", "Código inválido");
          }
        },
        error: () => {
          this.notificationService.showGenericError();
        }
      });
  }

}