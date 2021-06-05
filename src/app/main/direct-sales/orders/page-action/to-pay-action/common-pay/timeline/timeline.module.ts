import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../../../angular-material/material.module';
import { TimelineComponent } from './timeline.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [
        TimelineComponent
    ],
    imports: [
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule
    ],
    exports: [
        TimelineComponent,
    ]
})

export class TimeLineModule
{
}
