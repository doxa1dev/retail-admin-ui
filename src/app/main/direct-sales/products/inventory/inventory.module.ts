import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { InventoryComponent} from './Inventory.component';

import { AgGridModule } from '@ag-grid-community/angular';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'primeng/calendar';
import { ActiveCellCustomComponent } from './active-cell/active-cell.component';
import { CreateStockComponent } from './create-stock/create-stock.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component'; //Yes or No
import { MultiSelectModule } from 'primeng/multiselect';
const routes = [
    {
        path: 'direct-sales/products/inventory',
        component: InventoryComponent
    },
    {
      path: 'direct-sales/products/inventory/create-stock',
      component: CreateStockComponent
    },
    {
      path: 'direct-sales/products/inventory/detail',
      component: InventoryDetailComponent
    }

];

@NgModule({
    declarations: [
        InventoryComponent,
        ActiveCellCustomComponent,
        CreateStockComponent,
        InventoryDetailComponent, //Yes or No
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        CalendarModule,
        HttpClientModule,
        AgGridModule.withComponents([]),
        MultiSelectModule,
        DropdownModule
    ],
    providers:[],
    entryComponents:[ActiveCellCustomComponent], //Yes or No
    exports: [
        InventoryComponent,
    ]
})

export class InventorysModule
{
}
