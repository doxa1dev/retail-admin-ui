import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionalCheckboxComponent } from './optional-checkbox.component';

describe('OptionalCheckboxComponent', () => {
  let component: OptionalCheckboxComponent;
  let fixture: ComponentFixture<OptionalCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OptionalCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionalCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
