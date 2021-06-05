import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSingleComponent } from './chart-single.component';

describe('ChartSingleComponent', () => {
  let component: ChartSingleComponent;
  let fixture: ComponentFixture<ChartSingleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
