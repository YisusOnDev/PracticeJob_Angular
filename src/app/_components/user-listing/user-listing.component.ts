import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/auth.service';
import { PremiumService } from './../../_services/premium.service';

@Component({
  selector: 'app-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {

  constructor(private authService: AuthenticationService, private premiumService: PremiumService, private router: Router) { }

  ngOnInit() {
    this.premiumService.hasPremiumPlan(this.authService.currentCompanyValue)
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result == true) {
            alert("premium!")
            this.premiumService.setCurrentPlanValue('premium');
            return true;
          } else {
            alert("no premium!")
            this.router.navigate(['home']);
            this.premiumService.setCurrentPlanValue('free');
            return false;
          }
        },
        error: () => {
          alert("no premium error!")
          this.router.navigate(['home']);
          this.premiumService.setCurrentPlanValue('free');
          return false;
        }
      });
  }

}
