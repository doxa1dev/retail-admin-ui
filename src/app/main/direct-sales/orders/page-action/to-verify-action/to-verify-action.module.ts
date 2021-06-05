
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../../../angular-material/material.module'

import { FuseSharedModule } from '@fuse/shared.module';

import { ToVerifyActionComponent } from './to-verify-action.component';
import { TimeLineModule } from '../to-pay-action/common-pay/timeline/timeline.module';

import { ButtonVerifyComponent } from './common-verify/button-verify/button-verify.component';
import { DeliveryAddressModule } from '../to-pay-action/common-pay/delivery-address/delivery-address.module';
import { OrderListProductComponent } from './common-verify/order-list-product/order-list-product.component';
import { ProductComponent } from './common-verify/product/product.component'
import { AgGridModule } from '@ag-grid-community/angular';
import { ActiveCellCustomComponent } from './common-verify/active-cell/active-cell.component'
import { ViewPaymentDocComponent } from './common-verify/view-payment-doc/view-payment-doc.component';
import { ButtonLoadingModule } from 'app/main/_shared/button-loading/button-loading.module'
import { NumberDirective } from './../to-verify-action/serial-number.directive';
import { DropdownModule } from 'primeng/dropdown';
import { EditPaymentComponent } from './common-verify/edit-payment/edit-payment.component';
import {DialCodeModule} from 'app/main/pages/authentication/dial-code/dial-code.module';
const routes = [
    {
        path: 'direct-sales/orders/to-verify',
        component: ToVerifyActionComponent
    }
];

@NgModule({
    declarations: [
      ToVerifyActionComponent,
        ButtonVerifyComponent,
        OrderListProductComponent, ProductComponent,
        ActiveCellCustomComponent,
        ViewPaymentDocComponent,
        NumberDirective,
        EditPaymentComponent
    ],
    entryComponents:[ActiveCellCustomComponent],
    imports: [
        RouterModule.forChild(routes),

        TranslateModule,
        MaterialModule,
        FuseSharedModule,
        AgGridModule,
        TimeLineModule,
        DeliveryAddressModule,
        ButtonLoadingModule,
        DropdownModule,
        DialCodeModule
    ],
    exports: [
      ToVerifyActionComponent
    ]
})

export class ToVerifyActionModule
{
}
