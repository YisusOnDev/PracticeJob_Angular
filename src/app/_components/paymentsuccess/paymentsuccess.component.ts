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
    this.activatedRoute.queryParams.subscribe(params => {
      let session_id = params['session_id'];
      if (session_id == undefined) {
        console.log("Payment Success session_id is undefined, error. returnin home.")
        this.router.navigate(['home']);
        return;
      }

      console.log("Trying to change plan status to premium status..." + ' ' + JSON.stringify(this.authService.currentCompanyValue));
      this.premiumService.hasPremiumPlan(this.authService.currentCompanyValue)
        .pipe(first())
        .subscribe({
          next: (result) => {
            if (result == true) {
              this.premiumService.setCurrentPlanValue('premium')
              console.log("Premium status setted succesfully");
            } else {
              
              console.log("Premium status setted free cause no preimum found");
              this.premiumService.setCurrentPlanValue('free')
            }
          },
          error: () => {
            
            console.log("An errro has occured whle trying to search premium status");
            this.premiumService.setCurrentPlanValue('free')
          }
        });
    });
  }
}
