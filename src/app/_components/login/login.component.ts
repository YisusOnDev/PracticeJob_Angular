import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: User = {
    email: "",
    password: ""
  }
  constructor() { }

  ngOnInit() {
  }

  loginAttemp() {
    console.log(this.user);
  }
}
