import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { OtcAPInvoiceComponent } from './otcAPInvoice.component';

const routes = [
    {
        path: 'modules/ordertocash/apinvoice',
        component: OtcAPInvoiceComponent
    }
];

@NgModule({
    declarations: [
        OtcAPInvoiceComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        OtcAPInvoiceComponent,
    ]
})

export class OtcAPInvoiceModule
{
}
