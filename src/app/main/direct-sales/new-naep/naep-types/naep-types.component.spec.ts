import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepTypesComponent } from './naep-types.component';

describe('NaepTypesComponent', () => {
  let component: NaepTypesComponent;
  let fixture: ComponentFixture<NaepTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
