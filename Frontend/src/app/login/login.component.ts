import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registrationForm: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegistrationForm();
  }

  createLoginForm() {
    return this.loginForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
    });
  }

  createRegistrationForm() {
    return this.registrationForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, [Validators.required]),
      'email': new FormControl(null,),
      'avatar': new FormControl(null,),
    });
  }
}
