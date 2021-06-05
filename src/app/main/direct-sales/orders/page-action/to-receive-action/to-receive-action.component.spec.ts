import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToReceiveActionComponent } from './to-receive-action.component';

describe('ToReceiveActionComponent', () => {
  let component: ToReceiveActionComponent;
  let fixture: ComponentFixture<ToReceiveActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToReceiveActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToReceiveActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
