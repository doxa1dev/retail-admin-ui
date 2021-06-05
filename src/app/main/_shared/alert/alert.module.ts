import { NgModule } from '@angular/core';
import { AlertComponent} from './alert.component';
import { MaterialModule} from '../../angular-material/material.module'
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap'
@NgModule({
    declarations:[
        AlertComponent
    ],
    imports: [
        MaterialModule,
        TranslateModule,
        FuseSharedModule,
        NgbAlertModule
    ],
    exports: [
        AlertComponent
    ]
})
export class AlertModule
{

}
