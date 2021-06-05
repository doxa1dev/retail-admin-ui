import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { BranchComponent } from './branch.component'

const routes = [
    {
        path: 'direct-sales/sales-team/branch',
        component: BranchComponent
    }
];

@NgModule({
    declarations: [
        BranchComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        BranchComponent,
    ]
})

export class BranchModule
{
}
