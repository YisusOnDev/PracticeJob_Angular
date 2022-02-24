import { LoaderService } from './_services/loader.service';
import { Component } from '@angular/core';
import { Company } from './_models/company';
import { AuthenticationService } from './_services/auth.service';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentCompany!: Company;
  title = 'PracticeJob';

  constructor(
    public loaderService: LoaderService,
    private router: Router,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentCompany.subscribe(x => this.currentCompany = x);

    if (this.loggedIn() == false) {
      this.router.navigate(['login']);
    }

    this.router.events.subscribe((event: any) => {
      this.navigationInterceptor(event);
    });
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
    this.router.navigate(['login']);
  }

  // Handle route changes to show progress spinner
  private navigationInterceptor(event: any): void {
    if (event instanceof NavigationStart) {
      console.log("Nav start");
      this.loaderService.isBarLoading.next(true);
    }
    if (event instanceof NavigationEnd) {
      
      console.log("Nav end");
      this.loaderService.isBarLoading.next(false);
    }
    if (event instanceof NavigationCancel) {
      console.log("Nav cancel");
      this.loaderService.isBarLoading.next(false);
    }
    if (event instanceof NavigationError) {
      
      console.log("Nav error");
      this.loaderService.isBarLoading.next(false);
    }
  }

}