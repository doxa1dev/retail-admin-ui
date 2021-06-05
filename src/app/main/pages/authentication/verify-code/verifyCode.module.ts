import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { VerifyCodeComponent } from './verify-code.component'

const routes = [
    {
        path: 'auth/verify',
        component: VerifyCodeComponent
    }
];

@NgModule({
    declarations: [
        VerifyCodeComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        VerifyCodeComponent,
    ]
})

export class VerifyCodeModule
{
}
