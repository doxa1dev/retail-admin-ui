import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeightBasedShippingComponent } from './weight-based-shipping.component';

describe('WeightBasedShippingComponent', () => {
  let component: WeightBasedShippingComponent;
  let fixture: ComponentFixture<WeightBasedShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeightBasedShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeightBasedShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
