import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { OtcRequestComponent } from './otcRequest.component';

const routes = [
    {
        path: 'modules/ordertocash/request',
        component: OtcRequestComponent
    }
];

@NgModule({
    declarations: [
        OtcRequestComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        OtcRequestComponent,
    ]
})

export class OtcRequestModule
{
}
