import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
          this.router.navigate(['']);
        }
      });

    }


  }
}
