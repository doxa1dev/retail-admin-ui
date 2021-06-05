import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantiedProductsComponent } from './warrantied-products.component';

describe('WarrantiedProductsComponent', () => {
  let component: WarrantiedProductsComponent;
  let fixture: ComponentFixture<WarrantiedProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantiedProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantiedProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
