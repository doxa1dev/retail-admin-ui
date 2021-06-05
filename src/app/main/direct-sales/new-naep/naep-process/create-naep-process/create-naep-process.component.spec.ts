import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNaepProcessComponent } from './create-naep-process.component';

describe('CreateNaepProcessComponent', () => {
  let component: CreateNaepProcessComponent;
  let fixture: ComponentFixture<CreateNaepProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNaepProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNaepProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
