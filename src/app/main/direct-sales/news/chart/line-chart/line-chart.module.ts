import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module';
import { LineChartComponent } from './line-chart.component';
import { CalendarModule } from 'primeng/calendar';

@NgModule({
    declarations: [
        LineChartComponent
    ],
    imports: [
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule
    ],
    exports: [
        LineChartComponent,
    ]
})

export class LineChartModule
{
}
