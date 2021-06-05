import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { Product } from 'app/core/models/product.model';

@Component({
  selector: 'app-order-list-product',
  templateUrl: './order-list-product.component.html',
  styleUrls: ['./order-list-product.component.scss']
})
export class OrderListProductComponent implements OnInit {

  constructor() { }

  @Input() listProduct: Array<Product>;
  @Input() checkOrderLock : boolean;
  @Input() checkLock : number;
  @Input() paid;
  @Input() orderId
  totalProduct: number;
  totalSum: number = 0;
  @Output() onChangePriceProduct = new EventEmitter<boolean>();

  // ngOnChanges(changes: SimpleChanges) {
  //   this.listProduct = changes.listOrder.currentValue;
  // }
  ngOnInit(): void {
    this.totalProduct = this.listProduct.length;
    this.listProduct.forEach(product => {
    this.totalSum = this.totalSum + product.quantity * Number(product.promotionalPrice);
    });
  }

  onChangePrice() {
    this.onChangePriceProduct.emit(true);
  }

}
