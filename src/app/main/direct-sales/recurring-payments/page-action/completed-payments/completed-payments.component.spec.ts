import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedPaymentsComponent } from './completed-payments.component';

describe('CompletedPaymentsComponent', () => {
  let component: CompletedPaymentsComponent;
  let fixture: ComponentFixture<CompletedPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
