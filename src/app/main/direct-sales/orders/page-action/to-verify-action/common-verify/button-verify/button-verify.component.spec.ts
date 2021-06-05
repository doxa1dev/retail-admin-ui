import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonVerifyComponent } from './button-verify.component';

describe('ButtonVerifyComponent', () => {
  let component: ButtonVerifyComponent;
  let fixture: ComponentFixture<ButtonVerifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonVerifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
