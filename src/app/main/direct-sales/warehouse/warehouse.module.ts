import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../angular-material/material.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { AgGridModule } from '@ag-grid-community/angular';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonLoadingModule } from 'app/main/_shared/button-loading/button-loading.module';
import { WarehouseComponent } from './warehouse.component';

const routes = [
    {
        path: 'direct-sales/warehouse',
        component: WarehouseComponent
    }
];

@NgModule({
    declarations: [
        WarehouseComponent
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
        WarehouseComponent
    ]
})

export class WarehouseModule
{
}
