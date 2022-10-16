import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationDesktopNotesComponent } from './navigation-desktop-notes.component';

describe('NavigationDesktopNotesComponent', () => {
  let component: NavigationDesktopNotesComponent;
  let fixture: ComponentFixture<NavigationDesktopNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationDesktopNotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationDesktopNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
