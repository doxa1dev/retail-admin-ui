import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePeriodConfigComponent } from './create-period-config.component';

describe('CreatePeriodConfigComponent', () => {
  let component: CreatePeriodConfigComponent;
  let fixture: ComponentFixture<CreatePeriodConfigComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePeriodConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePeriodConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
