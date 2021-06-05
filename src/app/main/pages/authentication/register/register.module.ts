import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { RegisterComponent } from './register.component';
import { AlertModule } from '../../../_shared/alert/alert.module';
import { DialCodeModule } from '../dial-code/dial-code.module';
import { DropdownModule } from 'primeng/dropdown';
const routes = [
    {
        path: 'auth/register',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AlertModule,
        DialCodeModule,
        DropdownModule
    ],
    exports: [
        RegisterComponent,
    ]
})

export class RegisterModule
{
}
