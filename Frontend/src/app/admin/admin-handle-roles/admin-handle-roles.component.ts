import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-handle-roles',
  templateUrl: './admin-handle-roles.component.html',
  styleUrls: ['./admin-handle-roles.component.scss']
})
export class AdminHandleRolesComponent {
  manageRoles: FormGroup = this.createManageForm();
  users: string[] = [];
  roles: string[] = [];
  operations: string[] = ['Add', 'Remove'];

  user = {
    id: 'KSD4353MFMK',
    username: 'János',
    email: 'test@gmail.com',
    avatar: 'https://pic.pic.com/1234',
    balance: 435,
    isDisabled: false,
    created: '2022-12-01',
    lastLogin: '2022-12-22',
    roles: [
      { roleName: 'ROLE_USER' },
      { roleName: 'ROLE_ADMIN' },
    ],
  }
  userss = [this.user, this.user];
  displayedColumns: string[] = ['id', 'username', 'email', 'avatar', 'balance', 'isDisabled', 'created', 'lastLogin'];
  //displayedColumns: string[] = ['id', 'username', 'email'];

  constructor() { }

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

}
