import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartStoreComponent } from './cart-store.component';

describe('CartStoreComponent', () => {
  let component: CartStoreComponent;
  let fixture: ComponentFixture<CartStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
