import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonShippingComponent } from './button-shipping.component';

describe('ButtonShippingComponent', () => {
  let component: ButtonShippingComponent;
  let fixture: ComponentFixture<ButtonShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
