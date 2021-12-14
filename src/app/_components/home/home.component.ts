import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/_services/app.service';
import { AuthenticationService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})

export class HomeComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService, private router: Router, private appService: AppService) {
    if (this.authenticationService.currentCompanyValue.name == null) {
      this.router.navigate(['/completeprofile']);

    }
  }
  ngOnInit(): void {
    setTimeout(() => {
      this.appService.setTitle('Inicio');
    });
  }
}
