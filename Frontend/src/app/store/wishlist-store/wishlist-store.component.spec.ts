import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WishlistStoreComponent } from './wishlist-store.component';

describe('WishlistStoreComponent', () => {
  let component: WishlistStoreComponent;
  let fixture: ComponentFixture<WishlistStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WishlistStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WishlistStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
