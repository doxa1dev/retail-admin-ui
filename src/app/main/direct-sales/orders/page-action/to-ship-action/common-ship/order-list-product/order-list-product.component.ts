import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from 'app/core/models/product.model';
import { SharedService } from 'app/core/service/shared.service';

@Component({
  selector: 'app-order-list-product',
  templateUrl: './order-list-product.component.html',
  styleUrls: ['./order-list-product.component.scss']
})
export class OrderListProductComponent implements OnInit {

  constructor(
    private sharedService: SharedService,
  ) { }

  @Input() listProduct: Array<Product>;
  @Output() notifyGrandParent= new EventEmitter();
  childEvent(event) {
    this.notifyGrandParent.emit(true)
  }
  totalProduct: number;
  totalSum: number = 0;

  ngOnInit(): void {
    this.totalProduct = this.listProduct.length;
    this.listProduct.forEach(product => {
      this.totalSum = this.totalSum + product.quantity * Number(product.promotionalPrice);
    });

    // this.sharedService.sharedMessage.subscribe(
    //   (message) => {(
    //     console.log)
    //   }
    // )
  }
  
}
