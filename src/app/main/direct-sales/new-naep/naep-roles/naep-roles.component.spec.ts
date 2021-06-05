import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepRolesComponent } from './naep-roles.component';

describe('NaepRolesComponent', () => {
  let component: NaepRolesComponent;
  let fixture: ComponentFixture<NaepRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepRolesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
