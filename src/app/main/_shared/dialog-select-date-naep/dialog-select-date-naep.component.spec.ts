import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSelectDateNaepComponent } from './dialog-select-date-naep.component';

describe('DialogSelectDateNaepComponent', () => {
  let component: DialogSelectDateNaepComponent;
  let fixture: ComponentFixture<DialogSelectDateNaepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogSelectDateNaepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSelectDateNaepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
