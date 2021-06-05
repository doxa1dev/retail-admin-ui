import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyReachesComponent } from './weekly-reaches.component';

describe('WeeklyReachesComponent', () => {
  let component: WeeklyReachesComponent;
  let fixture: ComponentFixture<WeeklyReachesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyReachesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyReachesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
