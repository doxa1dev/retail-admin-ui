import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { PtpPurchaseRequisitionComponent } from './ptpPurchaseRequisition.component';

const routes = [
    {
        path: 'modules/purchasetopayment/requisition',
        component: PtpPurchaseRequisitionComponent
    }
];

@NgModule({
    declarations: [
        PtpPurchaseRequisitionComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        PtpPurchaseRequisitionComponent,
    ]
})

export class PtpPurchaseRequisitionModule
{
}
