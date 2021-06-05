import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module';
import { AgGridModule } from '@ag-grid-community/angular';

import { FuseSharedModule } from '@fuse/shared.module';

import { ToReceiveActionComponent } from './to-receive-action.component';
import { TimeLineModule } from '../to-pay-action/common-pay/timeline/timeline.module';

import { ButtonReceiveComponent } from './common-receive/button-receive/button-receive.component';

import { DeliveryAddressModule } from '../to-pay-action/common-pay/delivery-address/delivery-address.module';
import { OrderListProductComponent } from './common-receive/order-list-product/order-list-product.component';
import { ProductComponent } from './common-receive/product/product.component';
import { ShippingStatusComponent } from './common-receive/shipping-status/shipping-status.component';
import { InvoiceModule } from '../invoice/invoice.module'

const routes = [
  {
    path: 'direct-sales/orders/to-receive',
    component: ToReceiveActionComponent
  }
];

@NgModule({
  declarations: [
    ToReceiveActionComponent,
    ButtonReceiveComponent,
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
    ToReceiveActionComponent
  ]
})

export class ToReceiveActionModule {
}
