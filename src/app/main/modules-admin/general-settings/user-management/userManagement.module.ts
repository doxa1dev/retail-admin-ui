import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { UserManagementComponent } from './userManagement.component';

const routes = [
    {
        path: 'modules/setting/users',
        component: UserManagementComponent
    }
];

@NgModule({
    declarations: [
        UserManagementComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        UserManagementComponent,
    ]
})

export class UserManagementModule
{
}
