import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { DialCodeComponent } from './dial-code.component';
import { AlertModule } from '../../../_shared/alert/alert.module';
import { DropdownModule } from 'primeng/dropdown';

const routes = [
    {
        path: 'ngprime',
        component: DialCodeComponent
    }
];

@NgModule({
    declarations: [
        DialCodeComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        DropdownModule
    ],
    exports: [
        DialCodeComponent,
    ]
})

export class DialCodeModule
{
}
