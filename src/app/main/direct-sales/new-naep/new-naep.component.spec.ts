import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewNaepComponent } from './new-naep.component';

describe('NewNaepComponent', () => {
  let component: NewNaepComponent;
  let fixture: ComponentFixture<NewNaepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewNaepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewNaepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
