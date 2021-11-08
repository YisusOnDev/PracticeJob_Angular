import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login!: FormGroup;
  hidePassword = true;
  constructor() { }

  ngOnInit() {
    this.login = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  onLoginPressed() {
    const email = this.login.get('email')?.value;
    const password = this.login.get('password')?.value;
    console.log(email + ' ' + password);
  }

}
