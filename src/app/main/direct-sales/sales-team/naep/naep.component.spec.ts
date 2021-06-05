import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NAEPComponent } from './naep.component';

describe('NAEPComponent', () => {
  let component: NAEPComponent;
  let fixture: ComponentFixture<NAEPComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NAEPComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NAEPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
