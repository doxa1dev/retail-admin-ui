import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { PtpRequestComponent } from './ptpRequest.component';

const routes = [
    {
        path: 'modules/purchasetopayment/request',
        component: PtpRequestComponent
    }
];

@NgModule({
    declarations: [
        PtpRequestComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        PtpRequestComponent,
    ]
})

export class PtpRequestModule
{
}
