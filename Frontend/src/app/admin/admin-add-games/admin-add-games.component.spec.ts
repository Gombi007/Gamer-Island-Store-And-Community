import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAddGamesComponent } from './admin-add-games.component';

describe('AdminAddGamesComponent', () => {
  let component: AdminAddGamesComponent;
  let fixture: ComponentFixture<AdminAddGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminAddGamesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAddGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
