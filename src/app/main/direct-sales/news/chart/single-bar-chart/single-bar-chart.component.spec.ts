import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleBarChartComponent } from './single-bar-chart.component';

describe('SingleBarChartComponent', () => {
  let component: SingleBarChartComponent;
  let fixture: ComponentFixture<SingleBarChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleBarChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
