import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleMonitorDetailComponent } from './sale-monitor-detail.component';

describe('SaleMonitorDetailComponent', () => {
  let component: SaleMonitorDetailComponent;
  let fixture: ComponentFixture<SaleMonitorDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleMonitorDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleMonitorDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
