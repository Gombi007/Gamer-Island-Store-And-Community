import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { GlobalService } from 'src/app/config/global.service';
import { AdminService } from '../config/admin.service';
import { UserModifyByAdminDto } from '../config/user-modify-by-admin.model';

@Component({
  selector: 'app-admin-handle-roles',
  templateUrl: './admin-handle-roles.component.html',
  styleUrls: ['./admin-handle-roles.component.scss']
})
export class AdminHandleRolesComponent implements OnInit {
  manageRoles: FormGroup = this.createManageForm();
  users: UserModifyByAdminDto[] = [];
  roles: string[] = [];
  operations: string[] = ['Add', 'Remove'];

  constructor(private adminService: AdminService, private globalService: GlobalService) { }

  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
  }

  createManageForm() {
    return new FormGroup({
      'username': new FormControl(''),
      'role': new FormControl(''),
      'operation': new FormControl('Add'),
    });
  }

  //convenience getter for easy access to form fields
  get formControl(): { [key: string]: AbstractControl; } {
    return this.manageRoles.controls;
  }

  getRoles() {
    this.adminService.getRoles().subscribe({
      next: (roles) => { roles.forEach(role => this.roles.push(role.roleName)) },
      error: (response) => {
        this.globalService.isExpiredToken(response);
      }
    });
  }

  getUsers() {
    this.adminService.getUsers().subscribe({
      next: (users) => { this.users = users },
      error: (response) => {
        this.globalService.isExpiredToken(response);
      }
    });
  }

}
