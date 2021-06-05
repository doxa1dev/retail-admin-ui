import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCardDetailComponent } from './stock-card-detail.component';

describe('StockCardDetailComponent', () => {
  let component: StockCardDetailComponent;
  let fixture: ComponentFixture<StockCardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockCardDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
