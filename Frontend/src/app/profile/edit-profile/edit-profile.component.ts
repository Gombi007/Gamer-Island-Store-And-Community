import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { GlobalService } from 'src/app/config/global.service';
import { ProfileService } from '../config/profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  avatar = '';
  username = '';
  profileForm: FormGroup
  passChangeForm: FormGroup
  errorResponse = '';
  updateSuccess = '';
  isPending = false;

  constructor(private profileService: ProfileService, private globalService: GlobalService) { }

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
      'avatar': new FormControl(null),
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
    this.isPending = true;
    this.profileService.getProfileData().subscribe({
      next: (data) => {
        this.avatar = data.avatar;
        this.username = data.username;
        this.profileForm.setValue(data);
        this.isPending = false;
      },
      error: (response) => {
        this.errorResponse = response.error;
        this.isPending = false;
        this.globalService.isExpiredToken(response);
      }
    });
  }

  updateProfile() {
    if (this.profileForm.valid) {
      this.isPending = true;
      this.profileService.updateProfileData(this.profileForm).subscribe({
        next: (data) => {
          this.avatar = data.avatar;
          this.username = data.username;
          this.profileForm.setValue(data);
          this.isPending = false;
          this.updateSuccess = "Profile was saved successfully"
        },
        error: (response) => {
          console.log(response);
          this.errorResponse = response.error;
          this.globalService.isExpiredToken(response);
          this.isPending = false;
        }
      });
    }
  }

  changePass() { }

}
