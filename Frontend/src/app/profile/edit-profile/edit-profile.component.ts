import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { ProfileService } from '../config/profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup
  passChangeForm: FormGroup
  errorResponse = '';
  updateSuccess = '';

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.createProfileForm();
    this.createPassChangeForm();

    this.getProfileData();
  }

  removeErrorMessageFromUI() {
    timer(3000).subscribe(
      () => this.errorResponse = ''
    );
  }


  createProfileForm() {
    return this.profileForm = new FormGroup({
      'username': new FormControl({ value: "Username", disabled: true }),
      'email': new FormControl(null, [Validators.email]),
      'avatar': new FormControl(null,),
    });
  }

  createPassChangeForm() {
    return this.passChangeForm = new FormGroup({
      'oldPassword': new FormControl(null, [Validators.required]),
      'newPassword': new FormControl(null, [Validators.required]),
      'reNewPassword': new FormControl(null, [Validators.required]),
    });
  }

  getProfileData() {
    this.profileService.getProfileData().subscribe({
      next: (data) => { this.profileForm = data; },
      error: (response) => { this.errorResponse = response.error }
    });

  }

  updateProfile() {

  }

  changePass() { }

}
