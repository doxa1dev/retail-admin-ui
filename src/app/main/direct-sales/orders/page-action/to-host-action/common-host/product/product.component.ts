import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'app/core/models/product.model';
import { environment } from 'environments/environment';

import * as ProductGiftHelper from './product-gift-helper';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  SINGLE_FULL_PAYMENT_GIFT = ProductGiftHelper.SINGLE_FULL_PAYMENT_GIFT;
  ONLINE_BANK_TRANSFER_PAYMENT_GIFT = ProductGiftHelper.ONLINE_BANK_TRANSFER_PAYMENT_GIFT;
  storageUrl = environment.storageUrl;

  @Input() product: Product;

  single_full_paymt_gifts: ProductGiftHelper.GiftDisplay[];
  online_bank_transfer_gifts: ProductGiftHelper.GiftDisplay[];
  checkProduct: boolean = false;

  constructor() { }

  ngOnInit(): void {
    if (this.product.id != undefined) {
      this.checkProduct = false;

      if (this.product.order_line_single_paymt_gifts.length > 0) {
        this.single_full_paymt_gifts = ProductGiftHelper.aggregateGifts(this.product.order_line_single_paymt_gifts);
        this.online_bank_transfer_gifts = ProductGiftHelper.aggregateGifts(this.product.order_line_online_bank_transfer_gifts);
      }
    } else {
      this.checkProduct = true;
    }

  }
}
