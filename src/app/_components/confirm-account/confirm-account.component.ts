import { PremiumService } from './../../_services/premium.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
  requestingPremium: boolean = false;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private premiumService: PremiumService,
    private notificationService: NotificationService) {
    this.activatedRoute.paramMap.subscribe(params => {
      var urlParam = params.get('premium');
      if (urlParam) {
        this.emailSent = true;
        if (urlParam == 'premium') {
          this.requestingPremium = true;
        }
      }
    });
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
    if (this.emailSent == false) {
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
    } else {
      this.notificationService.showInfo("Hemos envíado un código de confirmación a tu correo electrónico", "Verificación de Email");
    }
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
            if (this.requestingPremium) {
              this.premiumService.generatePayLink(this.authenticationService.currentCompanyValue)
                .pipe(first())
                .subscribe({
                  next: (result) => {
                    if (result == null) {
                      this.router.navigate(['home']);
                      this.notificationService.showError("Ha ocurrido un error al intentar generar el enlace de pago de su suscripción.", "Error");
                      return;
                    }
                    window.location.href = result;
                  },
                  error: () => {
                    this.router.navigate(['home']);
                    this.notificationService.showError("Ha ocurrido un error al intentar generar el enlace de pago de su suscripción.", "Error");
                  }
                });
            } else {
              this.router.navigate(['home']);
            }
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