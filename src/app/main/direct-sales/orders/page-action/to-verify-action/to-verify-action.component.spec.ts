import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToVerifyActionComponent } from './to-verify-action.component';

describe('ToVerifyActionComponent', () => {
  let component: ToVerifyActionComponent;
  let fixture: ComponentFixture<ToVerifyActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToVerifyActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToVerifyActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
