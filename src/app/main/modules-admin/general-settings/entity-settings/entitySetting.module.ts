import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { EntitySettingComponent} from './entitySetting.component';

const routes = [
    {
        path: 'modules/setting/entity',
        component: EntitySettingComponent
    }
];

@NgModule({
    declarations: [
        EntitySettingComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        EntitySettingComponent,
    ]
})

export class EntitySettingModule
{
}
