import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module';
import { AgGridModule } from '@ag-grid-community/angular';

import { FuseSharedModule } from '@fuse/shared.module';

import { CancelledActionComponent } from './cancelled-action.component';
import { TimeLineModule } from '../to-pay-action/common-pay/timeline/timeline.module';

import { DeliveryAddressModule } from '../to-pay-action/common-pay/delivery-address/delivery-address.module';
import { OrderListProductComponent } from './common-cancelled/order-list-product/order-list-product.component';
import { ProductComponent } from './common-cancelled/product/product.component';
import { ShippingStatusComponent } from './common-cancelled/shipping-status/shipping-status.component';

const routes = [
  {
    path: 'direct-sales/orders/cancelled',
    component: CancelledActionComponent
  }
];

@NgModule({
  declarations: [
    CancelledActionComponent,
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
    AgGridModule

  ],
  exports: [
    CancelledActionComponent
  ]
})

export class CancelledActionModule {
}
