import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToShipActionComponent } from './to-ship-action.component';

describe('ToShipActionComponent', () => {
  let component: ToShipActionComponent;
  let fixture: ComponentFixture<ToShipActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToShipActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToShipActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
