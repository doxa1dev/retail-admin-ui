import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepDetailComponent } from './naep-detail.component';

describe('NaepDetailComponent', () => {
  let component: NaepDetailComponent;
  let fixture: ComponentFixture<NaepDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
