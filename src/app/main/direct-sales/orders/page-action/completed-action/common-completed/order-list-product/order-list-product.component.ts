import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'app/core/models/product.model';

@Component({
  selector: 'app-order-list-product',
  templateUrl: './order-list-product.component.html',
  styleUrls: ['./order-list-product.component.scss']
})
export class OrderListProductComponent implements OnInit {

  constructor() { }

  @Input() listProduct: Array<Product>;
  totalProduct: number;
  totalSum: number = 0;

  ngOnInit(): void {
    this.totalProduct = this.listProduct.length;
    this.listProduct.forEach(product => {
      this.totalSum = this.totalSum + product.quantity * Number(product.promotionalPrice);
    });
  }
}
