import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthenticateService } from '../config/authenticate.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registrationForm: FormGroup;
  showLoginForm = true;
  errorResponse = '';
  registrationOk = '';

  constructor(private authService: AuthenticateService, private router: Router) {
    localStorage.clear();
  }

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

  changeBetweenLoginAndRegisterForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  stratLogin() {
    if (this.loginForm.valid) {

      this.authService.loginViaBackend(this.loginForm.value).subscribe({
        next: (data: any) => {
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('token', data.token);
          this.loginForm.reset();
          this.router.navigate(['']);
        },
        error: (response) => {
          this.errorResponse = response.error;
          timer(3000).subscribe(
            () => this.errorResponse = ''
          );
        }
      });
    }
  }
  startRegistration() {
    if (this.registrationForm.valid) {
      this.authService.registerViaBackend(this.registrationForm.value).subscribe({
        next: () => {
          this.showLoginForm = true;
          this.registrationOk = 'Registration OK, Please Login'
          this.registrationForm.reset();
          timer(3000).subscribe(
            () => this.registrationOk = ''
          );
        },
        error: (response) => {
          this.errorResponse = response.error;
          timer(3000).subscribe(
            () => this.errorResponse = ''
          );
        }
      });
    }
  }
}
