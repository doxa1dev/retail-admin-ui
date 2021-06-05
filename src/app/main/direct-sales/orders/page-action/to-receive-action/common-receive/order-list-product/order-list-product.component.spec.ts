import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListProductComponent } from './order-list-product.component';

describe('OrderListProductComponent', () => {
  let component: OrderListProductComponent;
  let fixture: ComponentFixture<OrderListProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderListProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
