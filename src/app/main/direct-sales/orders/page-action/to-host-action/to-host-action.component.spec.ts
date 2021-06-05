import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToHostActionComponent } from './to-host-action.component';

describe('ToHostActionComponent', () => {
  let component: ToHostActionComponent;
  let fixture: ComponentFixture<ToHostActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToHostActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToHostActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
