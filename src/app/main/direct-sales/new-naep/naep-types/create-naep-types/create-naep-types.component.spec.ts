import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNaepTypesComponent } from './create-naep-types.component';

describe('CreateNaepTypesComponent', () => {
  let component: CreateNaepTypesComponent;
  let fixture: ComponentFixture<CreateNaepTypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNaepTypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNaepTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
