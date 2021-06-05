import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNaepPackagesComponent } from './create-naep-packages.component';

describe('CreateNaepPackagesComponent', () => {
  let component: CreateNaepPackagesComponent;
  let fixture: ComponentFixture<CreateNaepPackagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNaepPackagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNaepPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
