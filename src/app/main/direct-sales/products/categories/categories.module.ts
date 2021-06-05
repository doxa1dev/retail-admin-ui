import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { CategoriesComponent} from './categories.component'
import { AgGridModule } from '@ag-grid-community/angular';
import { AddCategoryComponent } from './add-category/add-category.component';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import { MatChipsModule } from '@angular/material/chips';
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { DndDirective } from './add-category/dnd.directive';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes = [
    {
        path: 'direct-sales/products/categories',
        component: CategoriesComponent
    },
    {
        path: 'direct-sales/products/categories/add-category',
        component: AddCategoryComponent
    }
];

@NgModule({
    declarations: [
        CategoriesComponent,
        AddCategoryComponent,
        DndDirective
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
        DragDropModule,
    ],
    exports: [
        CategoriesComponent,
    ]
})

export class CategoriesModule
{
}
