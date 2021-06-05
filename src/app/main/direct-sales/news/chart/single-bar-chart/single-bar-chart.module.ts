import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module';
import { SingleBarChartComponent } from './single-bar-chart.component';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
    declarations: [
      SingleBarChartComponent
    ],
    imports: [
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule
    ],
    exports: [
      SingleBarChartComponent,
    ]
})

export class SingleBarChartModule
{
}
