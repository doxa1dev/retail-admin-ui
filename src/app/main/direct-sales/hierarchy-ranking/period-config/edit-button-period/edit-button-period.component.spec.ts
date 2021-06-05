import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditButtonPeriodComponent } from './edit-button-period.component';

describe('EditButtonPeriodComponent', () => {
  let component: EditButtonPeriodComponent;
  let fixture: ComponentFixture<EditButtonPeriodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditButtonPeriodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditButtonPeriodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
