import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module';
import { ChartSingleComponent } from './chart-single.component';
import { CalendarModule } from 'primeng/calendar';
import { SingleBarChartModule } from '../single-bar-chart/single-bar-chart.module';

@NgModule({
    declarations: [
        ChartSingleComponent
    ],
    imports: [
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule,
        SingleBarChartModule
    ],
    exports: [
        ChartSingleComponent,
    ]
})

export class ChartSingleModule
{
}
