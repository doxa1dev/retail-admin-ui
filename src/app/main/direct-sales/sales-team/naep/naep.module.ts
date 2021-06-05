import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { NAEPComponent } from './naep.component'
import { AgGridModule } from '@ag-grid-community/angular';
import { EditorModule } from 'primeng/editor';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule} from 'primeng/inputtext';
import { MatChipsModule } from '@angular/material/chips';
import { TimeLineModule } from 'app/main/_shared/timeline/timeline.module';
import { NaepDetailComponent } from './naep-detail/naep-detail.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
const routes = [
    {
        path: 'direct-sales/sales-team/naep',
        component: NAEPComponent
    },
    {
        path: 'direct-sales/sales-team/naep/detail',
        component: NaepDetailComponent
    }
];

@NgModule({
    declarations: [
      NAEPComponent,
      NaepDetailComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        EditorModule,
        DropdownModule,
        CalendarModule,
        InputTextModule,
        MatChipsModule,
        TimeLineModule,
        BrowserAnimationsModule,
        AgGridModule.withComponents([]),
    ],
    exports: [
      NAEPComponent,
    ],
    entryComponents: []
})

export class NAEPModule
{
}
