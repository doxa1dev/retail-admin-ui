import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module';
import { AgGridModule } from '@ag-grid-community/angular';

import { FuseSharedModule } from '@fuse/shared.module';

import { CompletedActionComponent } from './completed-action.component';
import { TimeLineModule } from '../to-pay-action/common-pay/timeline/timeline.module';

import { DeliveryAddressModule } from '../to-pay-action/common-pay/delivery-address/delivery-address.module';
import { OrderListProductComponent } from './common-completed/order-list-product/order-list-product.component';
import { ProductComponent } from './common-completed/product/product.component';
import { ShippingStatusComponent } from './common-completed/shipping-status/shipping-status.component';
import { InvoiceModule } from '../invoice/invoice.module'
const routes = [
  {
    path: 'direct-sales/orders/completed',
    component: CompletedActionComponent
  }
];

@NgModule({
  declarations: [
    CompletedActionComponent,
    OrderListProductComponent, ProductComponent,
    ShippingStatusComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    TimeLineModule,
    DeliveryAddressModule,
    AgGridModule,
    InvoiceModule

  ],
  exports: [
    CompletedActionComponent
  ]
})

export class CompletedActionModule {
}
