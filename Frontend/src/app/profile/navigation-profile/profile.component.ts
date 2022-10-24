import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../config/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  username = '';
  avatar = 'Username';
  isPending = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getProfileData();
  }

  getProfileData() {
    this.isPending = true;
    this.profileService.getProfileData().subscribe({
      next: (data) => {
        this.username = data.username;
        this.avatar = data.avatar;
        this.isPending = false
      },
      error: () => {
        this.isPending = false
      }
    });

  }

}
