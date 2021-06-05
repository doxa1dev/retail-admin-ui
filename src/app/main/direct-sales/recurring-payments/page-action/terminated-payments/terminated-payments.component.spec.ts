import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminatedPaymentsComponent } from './terminated-payments.component';

describe('TerminatedPaymentsComponent', () => {
  let component: TerminatedPaymentsComponent;
  let fixture: ComponentFixture<TerminatedPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminatedPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminatedPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
