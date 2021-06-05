import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepPackagesComponent } from './naep-packages.component';

describe('NaepPackagesComponent', () => {
  let component: NaepPackagesComponent;
  let fixture: ComponentFixture<NaepPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
