import { NgModule } from '@angular/core';
import { TimelineComponent } from './timeline.component';
import { MaterialModule} from '../../angular-material/material.module'
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
@NgModule({
    declarations:[
        TimelineComponent
    ],
    imports: [
        MaterialModule,
        TranslateModule,
        FuseSharedModule,
    ],
    exports: [
        TimelineComponent
    ]
})
export class TimeLineModule
{

}