import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  expiredSession: null | string = null;
  isPending = false;

  constructor(private authService: AuthenticateService, private router: Router, private route: ActivatedRoute) {
    localStorage.clear();
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.createRegistrationForm();
    this.expiredSession = this.route.snapshot.paramMap.get('expiredTokenMessage');
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
      'rePassword': new FormControl(null, [Validators.required]),
      'email': new FormControl(null, [Validators.email]),
      'avatar': new FormControl(null,),
    });
  }

  changeBetweenLoginAndRegisterForm() {
    this.showLoginForm = !this.showLoginForm;
  }

  removeErrorMessageFromUI() {
    timer(3000).subscribe(
      () => this.errorResponse = ''
    );
  }

  isTwoPasswordFieldSame() {
    if (this.registrationForm.get('password')?.value === this.registrationForm.get('rePassword')?.value) {
      return true;
    }
    this.errorResponse = "The passwords are different";
    this.removeErrorMessageFromUI();
    return false;
  }


  startLogin() {
    if (this.loginForm.valid) {
      this.isPending = true;
      this.authService.loginViaBackend(this.loginForm.value).subscribe({
        next: (data: any) => {
          localStorage.setItem('user_id', data.user_id);
          localStorage.setItem('token', data.token);
          this.loginForm.reset();
          this.isPending = false;
          this.router.navigate(['']);
        },
        error: (response) => {

          this.errorResponse = response.error;
          this.isPending = false;
          this.removeErrorMessageFromUI();
        }
      });
    }
  }

  startRegistration() {
    if (this.registrationForm.valid && this.isTwoPasswordFieldSame()) {
      this.isPending = true;
      this.authService.registerViaBackend(this.registrationForm.value).subscribe({
        next: () => {
          this.showLoginForm = true;
          this.registrationOk = 'Registration OK, Please Login'
          this.registrationForm.reset();
          this.isPending = false;
          this.removeErrorMessageFromUI();
        },
        error: (response) => {
          this.errorResponse = response.error;
          this.isPending = false;
          this.removeErrorMessageFromUI();
        }
      });
    }
  }
}

