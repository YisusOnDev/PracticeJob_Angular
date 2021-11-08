import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login!: FormGroup;
  hidePassword = true;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.login = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });
  }

  onLoginPressed() {
    const email = this.login.get('email')?.value;
    const password = this.login.get('password')?.value;
    console.log(email + ' ' + password);
  }

}
