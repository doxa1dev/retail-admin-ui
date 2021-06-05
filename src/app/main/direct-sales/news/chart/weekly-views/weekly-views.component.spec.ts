import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyViewsComponent } from './weekly-views.component';

describe('WeeklyViewsComponent', () => {
  let component: WeeklyViewsComponent;
  let fixture: ComponentFixture<WeeklyViewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyViewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyViewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
