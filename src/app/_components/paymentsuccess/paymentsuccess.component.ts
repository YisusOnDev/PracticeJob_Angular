import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { NotificationService } from 'src/app/_services/notification.service';
import { PremiumService } from '../../_services/premium.service';

@Component({
  selector: 'app-paymentsuccess',
  templateUrl: './paymentsuccess.component.html',
  styleUrls: ['./paymentsuccess.component.css']
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authService: AuthenticationService, private premiumService: PremiumService, private notificationService: NotificationService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {
      let session_id = params['session_id'];
      if (session_id == undefined) {
        /// If not session_id defined then return home (invalid request or manual entered url)
        this.router.navigate(['home']);
        return;
      }
      /// Check premium status (Waiting 2000 ms) and set it in memory
      await new Promise(f => setTimeout(f, 2000));
      this.premiumService.hasPremiumPlan(this.authService.currentCompanyValue)
        .pipe(first())
        .subscribe({
          next: (result) => {
            if (result == true) {
              this.premiumService.setCurrentPlanValue('premium')
            } else {
              this.premiumService.setCurrentPlanValue('free')
            }
          },
          error: () => {
            this.premiumService.setCurrentPlanValue('free')
          }
        });
    });
  }
}
