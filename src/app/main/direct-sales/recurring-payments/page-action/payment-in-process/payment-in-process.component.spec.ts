import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInProcessComponent } from './payment-in-process.component';

describe('PaymentInProcessComponent', () => {
  let component: PaymentInProcessComponent;
  let fixture: ComponentFixture<PaymentInProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentInProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentInProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
