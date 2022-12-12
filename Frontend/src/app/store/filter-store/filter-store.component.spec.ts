import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterStoreComponent } from './filter-store.component';

describe('FilterStoreComponent', () => {
  let component: FilterStoreComponent;
  let fixture: ComponentFixture<FilterStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
