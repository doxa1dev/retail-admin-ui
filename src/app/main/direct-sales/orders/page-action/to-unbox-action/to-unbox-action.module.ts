import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module'
import { BrowserModule } from '@angular/platform-browser';
;
import { AgGridModule } from '@ag-grid-community/angular';

import { FuseSharedModule } from '@fuse/shared.module';

import { ToUnboxActionComponent } from './to-unbox-action.component';
import { TimeLineModule } from '../to-pay-action/common-pay/timeline/timeline.module';

import { DeliveryAddressModule } from '../to-pay-action/common-pay/delivery-address/delivery-address.module';
import { OrderListProductComponent } from './common-unbox/order-list-product/order-list-product.component';
import { ProductComponent } from './common-unbox/product/product.component';
import { ShippingStatusComponent } from './common-unbox/shipping-status/shipping-status.component';
import { InvoiceModule } from '../invoice/invoice.module'
const routes = [
  {
    path: 'direct-sales/orders/to-unbox',
    component: ToUnboxActionComponent
  }
];

@NgModule({
    declarations: [
        ToUnboxActionComponent,
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
        BrowserModule,
        AgGridModule,
        InvoiceModule

    ],
    exports: [
      ToUnboxActionComponent
    ]
})

export class ToUnboxActionModule {
}
