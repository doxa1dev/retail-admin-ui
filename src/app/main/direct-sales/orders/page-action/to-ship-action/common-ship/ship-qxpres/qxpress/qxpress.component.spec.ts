import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QxpressComponent } from './qxpress.component';

describe('QxpressComponent', () => {
  let component: QxpressComponent;
  let fixture: ComponentFixture<QxpressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QxpressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QxpressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
