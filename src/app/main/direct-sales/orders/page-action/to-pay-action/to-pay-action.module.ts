import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module';

import { FuseSharedModule } from '@fuse/shared.module';

import { ToPayActionComponent } from './to-pay-action.component';
import { TimeLineModule } from './common-pay/timeline/timeline.module';

import { ButtonComponent } from './common-pay/button-pay/button.component';

import { MglTimelineModule } from 'angular-mgl-timeline';

import { DeliveryAddressModule } from './common-pay/delivery-address/delivery-address.module';
import { OrderListProductComponent } from './common-pay/order-list-product/order-list-product.component';
import { ProductComponent } from './common-pay/product/product.component';

import { AgGridModule } from '@ag-grid-community/angular';
import { ActiveCellCustomComponent } from './common-pay/active-cell/active-cell.component';
import { NumberDirective } from './../to-pay-action/serial-number.directive';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {DialCodeModule} from 'app/main/pages/authentication/dial-code/dial-code.module';


const routes = [
  {
    path: 'direct-sales/orders/to-pay',
    component: ToPayActionComponent
  }
];

@NgModule({
  declarations: [
    ToPayActionComponent,
    ButtonComponent,
    OrderListProductComponent, ProductComponent,
    ActiveCellCustomComponent,
    NumberDirective
  ],
  entryComponents: [ActiveCellCustomComponent],
  imports: [
    RouterModule.forChild(routes),

    TranslateModule,
    MaterialModule,
    FuseSharedModule,
    MglTimelineModule,
    AgGridModule,
    TimeLineModule,
    DeliveryAddressModule,
    DropdownModule,
    CalendarModule,
    DialCodeModule,

  ],
  exports: [
    ToPayActionComponent
  ]
})

export class ToPayActionModule {
}
