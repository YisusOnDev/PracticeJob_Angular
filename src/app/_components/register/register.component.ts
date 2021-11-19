import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  signup!: FormGroup;
  hidePassword = true;
  authenticationService: any;
  
  constructor(private fb: FormBuilder,
    private router: Router,) {
    if (this.authenticationService.currentCompany) {
      this.router.navigate(['home']);
    }
  }

  ngOnInit() {
    this.signup = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    });
  }

  onRegisterPressed() {
    const email = this.signup.get('email')?.value;
    const password = this.signup.get('password')?.value;
    const passwordConfirmation = this.signup.get('passwordConfirmation')?.value;
    if (password === passwordConfirmation) {
      console.log(email + ' ' + password);
    } else {
      console.log('password mismatch');
    }
  }

}