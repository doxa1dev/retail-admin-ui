import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { OrcComponent} from './ocr.component';

const routes = [
    {
        path: 'modules/orc',
        component: OrcComponent
    }
];

@NgModule({
    declarations: [
        OrcComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule
    ],
    exports: [
        OrcComponent,
    ]
})

export class OrcModule
{
}
