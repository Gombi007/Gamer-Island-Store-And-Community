import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHandleRolesComponent } from './admin-handle-roles.component';

describe('AdminHandleRolesComponent', () => {
  let component: AdminHandleRolesComponent;
  let fixture: ComponentFixture<AdminHandleRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHandleRolesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminHandleRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
