import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Province } from 'src/app/_models/province';
import { ProvinceService } from 'src/app/_services/province.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  provinces!: Province[];

    constructor(private provinceService: ProvinceService) { }

    ngOnInit() {
      
        this.provinceService.getAll().pipe(first()).subscribe(provinces => {
            this.provinces = provinces;
        });
    }

}
