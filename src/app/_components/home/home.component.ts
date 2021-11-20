import { AuthenticationService } from 'src/app/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { Province } from 'src/app/_models/province';
import { ProvinceService } from 'src/app/_services/province.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']

})

export class HomeComponent implements OnInit {
  province!: Province;
  enteredId?: number;
  displayedColumns = ["Id", "Name"];

  constructor(private provinceService: ProvinceService, private authenticationService: AuthenticationService, private router: Router) {
    if (this.authenticationService.currentCompanyValue.name == null) {
      this.router.navigate(['/completeprofile']);
    }
  }

  ngOnInit() { }

  onSearch() {
    // Check if enteredId (number) is valid
    if (this.enteredId != undefined && this.enteredId > 0 && this.enteredId < 53) {
      this.provinceService.getFromId(this.enteredId).pipe(first()).subscribe(province => {
        this.province = province;
      });
    } else {
      alert("Invalid number");
      return;
    }
  }

}
