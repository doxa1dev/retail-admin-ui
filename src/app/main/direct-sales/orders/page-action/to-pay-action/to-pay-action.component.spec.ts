import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToPayActionComponent } from './to-pay-action.component';

describe('ToPayActionComponent', () => {
  let component: ToPayActionComponent;
  let fixture: ComponentFixture<ToPayActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToPayActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToPayActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
