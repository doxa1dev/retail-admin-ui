import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../../angular-material/material.module';
import { BarChartComponent } from './bar-chart.component';
import { CalendarModule } from 'primeng/calendar';


@NgModule({
    declarations: [
        BarChartComponent
    ],
    imports: [
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule
    ],
    exports: [
        BarChartComponent,
    ]
})

export class BarChartModule
{
}
