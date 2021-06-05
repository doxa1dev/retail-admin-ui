import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { TransactionManagementComponent } from './transactionManagement.component';

const routes = [
    {
        path: 'modules/setting/transaction',
        component: TransactionManagementComponent
    }
];

@NgModule({
    declarations: [
        TransactionManagementComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        TransactionManagementComponent,
    ]
})

export class TransactionManagementModule
{
}
