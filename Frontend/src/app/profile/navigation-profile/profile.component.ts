import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, Subscription } from 'rxjs';
import { ProfileService } from '../config/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  isPending = false;
  profileData: { username: string, avatar: string };
  subs: Subscription;
  isShowAdminMenu: boolean = false;

  constructor(private profileService: ProfileService) { }

  ngOnInit(): void {
    this.getProfileData();
    this.subs = this.profileService.updateProfile.subscribe((data: any) => {
      this.profileData = data;
    })
  }

  getProfileData() {
    this.isPending = true;
    this.profileService.getProfileData().subscribe({
      next: (data) => {
        this.profileData = data;
        this.isPending = false
      },
      error: () => {
        this.isPending = false
      }
    });
  }

  hasAdminRole() {
    this.profileService.hasRoleAdmin().subscribe((data: boolean) => {
      this.isShowAdminMenu = data;
    });
  }

  ngOnDestroy(): void {
    if (this.subs !== null && this.subs !== undefined) {
      this.subs.unsubscribe();
    }
  }
}
