import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { PtpPurchaseOrderComponent } from './ptpPurchaseOrder.component';

const routes = [
    {
        path: 'modules/purchasetopayment/purchase',
        component: PtpPurchaseOrderComponent
    }
];

@NgModule({
    declarations: [
        PtpPurchaseOrderComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        PtpPurchaseOrderComponent,
    ]
})

export class PtpPurchaseOrderModule
{
}
