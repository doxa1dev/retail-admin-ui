import { NumberDirectiveA } from './../to-ship-action/serial-number.directive';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module';
import { AgGridModule } from '@ag-grid-community/angular';

import { FuseSharedModule } from '@fuse/shared.module';

import { ToShipActionComponent } from './to-ship-action.component';
import { TimeLineModule } from '../to-pay-action/common-pay/timeline/timeline.module';

import { ButtonShippingComponent } from './common-ship/button-shipping/button-shipping.component';
import { DeliveryAddressModule } from '../to-pay-action/common-pay/delivery-address/delivery-address.module';
import { OrderListProductComponent } from './common-ship/order-list-product/order-list-product.component';
// import { ProductComponent } from './common-ship/product/product.component';
import { ShippingStatusComponent } from './common-ship/shipping-status/shipping-status.component';
import { ProductModule} from './common-ship/product/product.module';
import { QxpressComponent } from './common-ship/ship-qxpres/qxpress/qxpress.component'
import { NgxBarcodeModule } from 'ngx-barcode';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { InvoiceModule } from '../invoice/invoice.module';
import {DialCodeModule} from 'app/main/pages/authentication/dial-code/dial-code.module';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonLoadingModule } from 'app/main/_shared/button-loading/button-loading.module';
import { CalendarModule } from 'primeng/calendar';


const routes = [
  {
    path: 'direct-sales/orders/to-ship',
    component: ToShipActionComponent
  },
  {
    path: 'direct-sales/orders/to-ship/qxpress',
    component: QxpressComponent
  }
];

@NgModule({
  declarations: [
    ToShipActionComponent,
    ButtonShippingComponent,
    OrderListProductComponent,
    ShippingStatusComponent,
    QxpressComponent,
    NumberDirectiveA
  ],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    TimeLineModule,
    DeliveryAddressModule,
    AgGridModule,
    ProductModule,
    NgxBarcodeModule,
    NgxQRCodeModule,
    InvoiceModule,
    DialCodeModule,
    DropdownModule,
    ButtonLoadingModule,
    CalendarModule
  ],
  exports: [
    ToShipActionComponent
  ]
})
export class ToShipActionModule {
}
