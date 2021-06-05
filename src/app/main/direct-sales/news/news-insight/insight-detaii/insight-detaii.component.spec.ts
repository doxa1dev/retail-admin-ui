import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsightDetaiiComponent } from './insight-detaii.component';

describe('InsightDetaiiComponent', () => {
  let component: InsightDetaiiComponent;
  let fixture: ComponentFixture<InsightDetaiiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsightDetaiiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsightDetaiiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
