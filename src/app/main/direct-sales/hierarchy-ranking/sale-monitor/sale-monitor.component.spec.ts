import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleMonitorComponent } from './sale-monitor.component';

describe('SaleMonitorComponent', () => {
  let component: SaleMonitorComponent;
  let fixture: ComponentFixture<SaleMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaleMonitorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleMonitorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
