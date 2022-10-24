import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup
  passChangeForm: FormGroup

  constructor() { }

  ngOnInit(): void {
    this.createProfileForm();
    this.createPassChangeForm();
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



  updateProfile() {

  }

  changePass() { }

}
