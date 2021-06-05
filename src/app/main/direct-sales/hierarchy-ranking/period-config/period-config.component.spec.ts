import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodConfigComponent } from './period-config.component';

describe('PeriodConfigComponent', () => {
  let component: PeriodConfigComponent;
  let fixture: ComponentFixture<PeriodConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeriodConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeriodConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
