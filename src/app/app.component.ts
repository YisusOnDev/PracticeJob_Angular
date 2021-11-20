import { Component } from '@angular/core';
import { Company } from './_models/company';
import { AuthenticationService } from './_services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentCompany!: Company;
  title = 'PracticeJob';

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentCompany.subscribe(x => this.currentCompany = x);

    if (this.loggedIn() == true) {
      this.router.navigate(['/home']);
    }
  }

  loggedIn() {
    if (this.currentCompany == null) {
      return false
    } else {
      return true
    }
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}