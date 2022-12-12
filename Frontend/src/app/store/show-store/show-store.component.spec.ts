import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowStoreComponent } from './show-store.component';

describe('ShowStoreComponent', () => {
  let component: ShowStoreComponent;
  let fixture: ComponentFixture<ShowStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
