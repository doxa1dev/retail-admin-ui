import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { SpecialProductsComponent} from './special-products.component'
import { AgGridModule } from '@ag-grid-community/angular';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import { MatChipsModule } from '@angular/material/chips';
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';

const routes = [
    {
        path: 'direct-sales/products/special-products',
        component: SpecialProductsComponent
    }
];

@NgModule({
    declarations: [
      SpecialProductsComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AgGridModule,
        EditorModule,
        DropdownModule,
        CalendarModule,
        InputTextModule,
        MatChipsModule,
        TimeLineModule,
        MultiSelectModule,
        ToastModule
    ],
    exports: [
      SpecialProductsComponent,
    ]
})

export class SpecialProductsModule
{
}
