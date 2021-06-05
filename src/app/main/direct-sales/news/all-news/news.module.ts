import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { NewsComponent } from './news.component'
import { AgGridModule } from '@ag-grid-community/angular';
import { AddNewComponent } from './add-new/add-new.component';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import {InputTextModule} from 'primeng/inputtext';
import { MatChipsModule } from '@angular/material/chips';
import { CurrencyPipe} from '@angular/common';
import { DndDirective } from './add-new/dnd.directive';
import { ProgressComponent } from './add-new/progress/progress.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TimeLineModule} from 'app/main/_shared/timeline/timeline.module'
import { NewsDetailComponent } from './add-new/news-detail.component';


const routes = [
    {
        path: 'direct-sales/news/all',
        component: NewsComponent
    },
    {
        path: 'direct-sales/news/add-new',
        component: AddNewComponent
    },
    {
        path: 'direct-sales/news/news-detail',
        component: NewsDetailComponent
    },
    
];

@NgModule({
    declarations: [
        NewsComponent,
        AddNewComponent,
        NewsDetailComponent,
        ProgressComponent,
        DndDirective,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AgGridModule.withComponents([]),
        EditorModule,
        DropdownModule,
        CalendarModule,
        InputTextModule,
        MatChipsModule,
        DragDropModule,
        MultiSelectModule,
        TimeLineModule, 
        
    ],
    exports: [
        NewsComponent,
    ]
})

export class NewsModule
{
}
