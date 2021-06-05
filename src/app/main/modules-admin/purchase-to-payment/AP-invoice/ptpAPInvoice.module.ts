import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { PtpAPInvoiceComponent } from './ptpAPInvoice.component';

const routes = [
    {
        path: 'modules/purchasetopayment/apinvoice',
        component: PtpAPInvoiceComponent
    }
];

@NgModule({
    declarations: [
        PtpAPInvoiceComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        PtpAPInvoiceComponent,
    ]
})

export class PtpAPInvoiceModule
{
}
