import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMobileNotesComponent } from './navigation-mobile-notes.component';

describe('NavigationMobileNotesComponent', () => {
  let component: NavigationMobileNotesComponent;
  let fixture: ComponentFixture<NavigationMobileNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationMobileNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationMobileNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
