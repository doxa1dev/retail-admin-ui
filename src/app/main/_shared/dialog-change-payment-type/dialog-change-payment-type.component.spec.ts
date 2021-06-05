import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogChangePaymentTypeComponent } from './dialog-change-payment-type.component';

describe('DialogChangePaymentTypeComponent', () => {
  let component: DialogChangePaymentTypeComponent;
  let fixture: ComponentFixture<DialogChangePaymentTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogChangePaymentTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogChangePaymentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
