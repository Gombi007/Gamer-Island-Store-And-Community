import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationDesktopStoreComponent } from './navigation-desktop-store.component';

describe('NavigationDesktopStoreComponent', () => {
  let component: NavigationDesktopStoreComponent;
  let fixture: ComponentFixture<NavigationDesktopStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationDesktopStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationDesktopStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
