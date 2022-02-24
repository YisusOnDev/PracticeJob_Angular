import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { PremiumService } from './../../_services/premium.service';

@Component({
  selector: 'app-buypremium',
  templateUrl: './buypremium.component.html',
  styleUrls: ['./buypremium.component.css']
})
export class BuyPremiumComponent implements OnInit {

  constructor(private router: Router, private authService: AuthenticationService, private premiumService: PremiumService, private notificationService: NotificationService) { }

  ngOnInit() {
    /**
     * Check if already has premium
     */
    this.premiumService.hasPremiumPlan(this.authService.currentCompanyValue)
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result != false) {
            this.router.navigate(['home']);
            return;
          }
        }
      });
  }

  /**
   * Contract premium button pressed
   */
  buyPremium() {
    this.premiumService.generatePayLink(this.authService.currentCompanyValue)
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result == null) {
            this.notificationService.showError("Ha ocurrido un error al intentar generar el enlace de pago.", "Error");
            return;
          }
          window.location.href = result;
        },
        error: () => {
          this.notificationService.showError("Ha ocurrido un error al intentar generar el enlace de pago.", "Error");
        }
      });
  }

}
