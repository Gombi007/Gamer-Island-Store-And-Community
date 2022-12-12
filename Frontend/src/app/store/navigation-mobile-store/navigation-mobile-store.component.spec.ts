import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationMobileStoreComponent } from './navigation-mobile-store.component';

describe('NavigationMobileStoreComponent', () => {
  let component: NavigationMobileStoreComponent;
  let fixture: ComponentFixture<NavigationMobileStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavigationMobileStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationMobileStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
