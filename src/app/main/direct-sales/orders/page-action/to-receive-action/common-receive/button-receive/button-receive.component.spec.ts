import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonReceiveComponent } from './button-receive.component';

describe('ButtonReceiveComponent', () => {
  let component: ButtonReceiveComponent;
  let fixture: ComponentFixture<ButtonReceiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtonReceiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonReceiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
