import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Company } from 'src/app/_models/company';
import { AppService } from '../../_services/app.service';
import { AuthenticationService } from '../../_services/auth.service';
import { LoaderService } from './../../_services/loader.service';
import { PremiumService } from './../../_services/premium.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  title!: String;
  currentCompany!: Company;
  isExpanded = false;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router, private authenticationService: AuthenticationService, private appService: AppService, public premiumService: PremiumService, public loaderService: LoaderService) {
    this.appService.getTitle().subscribe(appTitle => this.title = appTitle);
    this.authenticationService.currentCompany.subscribe(x => this.currentCompany = x);
  }

  ngOnInit() {
    if (this.loggedIn() == false) {
      this.router.navigate(['login']);
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
    this.router.navigate(['login']);
  }

}
