import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../config/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  isPending = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getProfileData();
  }

  get profileData() {
    return this.profileService.userProfileDataGetter;
  }


  getProfileData() {
    this.isPending = true;
    this.profileService.getProfileData().subscribe({
      next: (data) => {
        this.profileService.userProfileDataSetter = data;
        this.isPending = false
      },
      error: () => {
        this.isPending = false
      }
    });

  }

}
