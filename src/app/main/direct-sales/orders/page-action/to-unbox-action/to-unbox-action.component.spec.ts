import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToUnboxActionComponent } from './to-unbox-action.component';

describe('ToUnboxActionComponent', () => {
  let component: ToUnboxActionComponent;
  let fixture: ComponentFixture<ToUnboxActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToUnboxActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToUnboxActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
