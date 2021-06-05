import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { MaterialModule } from '../../../angular-material/material.module';
import { BannerComponent } from './banner.component';
import { AgGridModule } from '@ag-grid-community/angular';
import { MatCarouselModule } from '@ngmodule/material-carousel';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProgressComponent } from './progress/progress.component';
const routes = [
    {
        path: 'direct-sales/news/banner',
        component: BannerComponent
    },
];

@NgModule({
    declarations: [
        BannerComponent,
        ProgressComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        MaterialModule,
        AgGridModule,
        NgbModule,
        MatCarouselModule.forRoot(),
    ],
    exports: [
        BannerComponent,
    ]
})

export class BannerModule
{
}
