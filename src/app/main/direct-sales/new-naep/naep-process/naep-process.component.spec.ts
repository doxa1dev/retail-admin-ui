import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NaepProcessComponent } from './naep-process.component';

describe('NaepProcessComponent', () => {
  let component: NaepProcessComponent;
  let fixture: ComponentFixture<NaepProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NaepProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NaepProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
