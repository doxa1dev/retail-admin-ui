import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { ReportsComponent} from './reports.component'
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AgGridModule } from '@ag-grid-community/angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonLoadingModule } from 'app/main/_shared/button-loading/button-loading.module';
const routes = [
    {
        path: 'direct-sales/reports',
        component: ReportsComponent
    }
];

@NgModule({
    declarations: [
        ReportsComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        DropdownModule,
        CalendarModule,
        AgGridModule,
        MultiSelectModule,
        ButtonLoadingModule
    ],
    exports: [
        ReportsComponent,
    ]
})

export class ReportsModule
{
}
