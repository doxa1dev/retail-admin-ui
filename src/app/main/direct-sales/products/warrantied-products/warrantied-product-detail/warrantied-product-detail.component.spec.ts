import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantiedProductDetailComponent } from './warrantied-product-detail.component';

describe('WarrantiedProductDetailComponent', () => {
  let component: WarrantiedProductDetailComponent;
  let fixture: ComponentFixture<WarrantiedProductDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WarrantiedProductDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarrantiedProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
